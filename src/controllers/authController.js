const admin = require('firebase-admin');
const {
  findByFirebaseUid,
  createUser,
  updateLastLogin,
} = require('../models/userModel');

// ═══════════════════════════════════════════════════════════
// Auth Controller
// ═══════════════════════════════════════════════════════════

// ── Format user for response ───────────────────────────────
const formatUser = (user) => ({
  id:           user.id,
  firebaseUid:  user.firebase_uid,
  email:        user.email,
  phoneNumber:  user.phone_number,
  displayName:  user.display_name,
  photoUrl:     user.photo_url,
  authProvider: user.auth_provider,
  isActive:     user.is_active,
  createdAt:    user.created_at,
  lastLoginAt:  user.last_login_at,
});

// ── Detect auth provider from Firebase token ───────────────
const detectProvider = (decodedToken, email, phone) => {
  const signInProvider = decodedToken.firebase?.sign_in_provider;
  if (signInProvider === 'google.com') return 'google';
  if (phone) return 'phone';
  return 'email';
};

// ── Verify Firebase token helper ───────────────────────────
const verifyFirebaseToken = async (firebaseToken) => {
  return await admin.auth().verifyIdToken(firebaseToken);
};

// ════════════════════════════════════════════════════════════
// POST /api/auth/register
// Flutter Sign Up → Firebase create → Backend save new user
// ════════════════════════════════════════════════════════════
const register = async (req, res) => {
  try {
    const { firebaseToken } = req.body;

    if (!firebaseToken) {
      return res.status(400).json({ success: false, message: 'Firebase token is required' });
    }

    // 1. Verify Firebase token
    let decodedToken;
    try {
      decodedToken = await verifyFirebaseToken(firebaseToken);
    } catch (err) {
      return res.status(401).json({ success: false, message: 'Invalid Firebase token', error: err.message });
    }

    const uid         = decodedToken.uid;
    const email       = decodedToken.email       || null;
    const phone       = decodedToken.phone_number || null;
    const displayName = decodedToken.name         || null;
    const photoUrl    = decodedToken.picture      || null;
    const provider    = detectProvider(decodedToken, email, phone);

    // 2. Check if already registered
    const existing = await findByFirebaseUid(uid);
    if (existing) {
      return res.status(409).json({
        success: false,
        message: 'User already registered. Please login.',
        user: formatUser(existing),
      });
    }

    // 3. INSERT new user → Neon DB
    const user = await createUser({
      firebaseUid: uid,
      email,
      phoneNumber: phone,
      displayName,
      photoUrl,
      authProvider: provider,
    });

    console.log(`✅ Registered: ${email || phone} (${provider})`);

    return res.status(201).json({
      success: true,
      message: 'Registration successful! Welcome to WildX 🦁',
      user: formatUser(user),
    });

  } catch (err) {
    console.error('Register error:', err.message);
    return res.status(500).json({ success: false, message: 'Registration failed', error: err.message });
  }
};

// ════════════════════════════════════════════════════════════
// POST /api/auth/login
// Flutter Login → Firebase verify → Backend UPDATE last_login
// ════════════════════════════════════════════════════════════
const login = async (req, res) => {
  try {
    const { firebaseToken } = req.body;

    if (!firebaseToken) {
      return res.status(400).json({ success: false, message: 'Firebase token is required' });
    }

    // 1. Verify Firebase token
    let decodedToken;
    try {
      decodedToken = await verifyFirebaseToken(firebaseToken);
    } catch (err) {
      return res.status(401).json({ success: false, message: 'Invalid Firebase token', error: err.message });
    }

    const uid         = decodedToken.uid;
    const email       = decodedToken.email       || null;
    const phone       = decodedToken.phone_number || null;
    const displayName = decodedToken.name         || null;
    const photoUrl    = decodedToken.picture      || null;
    const provider    = detectProvider(decodedToken, email, phone);

    // 2. Find or auto-create user
    let user = await findByFirebaseUid(uid);

    if (!user) {
      // First time — auto register
      user = await createUser({
        firebaseUid: uid,
        email,
        phoneNumber: phone,
        displayName,
        photoUrl,
        authProvider: provider,
      });
      console.log(`✅ Auto-registered on login: ${email || phone} (${provider})`);
    } else {
      // UPDATE last_login_at → Neon DB
      user = await updateLastLogin(uid, displayName, photoUrl);
      console.log(`✅ Login: ${email || phone} (${provider})`);
    }

    return res.status(200).json({
      success: true,
      message: 'Login successful! Welcome back 🦁',
      user: formatUser(user),
    });

  } catch (err) {
    console.error('Login error:', err.message);
    return res.status(500).json({ success: false, message: 'Login failed', error: err.message });
  }
};

// ════════════════════════════════════════════════════════════
// GET /api/auth/health
// ════════════════════════════════════════════════════════════
const health = (req, res) => {
  res.json({ success: true, message: 'WildX Auth API is running! 🦁' });
};

module.exports = { register, login, health };
