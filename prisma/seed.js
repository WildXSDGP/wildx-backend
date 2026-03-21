const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

const parks = [
  {
    id: 'park_yala',
    name: 'Yala National Park',
    description: 'Sri Lanka\'s most famous national park, known for having one of the highest leopard densities in the world.',
  },
  {
    id: 'park_wilpattu',
    name: 'Wilpattu National Park',
    description: 'The largest national park in Sri Lanka, featuring unique natural lakes called "villus".',
  },
  {
    id: 'park_udawalawe',
    name: 'Udawalawe National Park',
    description: 'Home to a large population of elephants and the Elephant Transit Home sanctuary.',
  },
];

const accommodations = [
  {
    id: 'acc_001',
    name: 'Green Valley Eco-Lodge',
    parkId: 'park_yala',
    pricePerNight: 9500,
    distanceFromGate: 4.0,
    travelTime: '20 mins',
    fuelStops: 1,
    rating: 4.9,
    isEcoFriendly: true,
    isFamilyFriendly: true,
    hasJeepHire: true,
    description: 'A serene eco-lodge nestled in the heart of Yala, offering sustainable luxury with panoramic views of the surrounding wilderness.',
    images: [
      'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800',
      'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=800',
      'https://images.unsplash.com/photo-1587061949409-02df41d5e562?w=800',
    ],
  },
  {
    id: 'acc_002',
    name: 'Yala Safari Lodge',
    parkId: 'park_yala',
    pricePerNight: 8500,
    distanceFromGate: 2.5,
    travelTime: '12 mins',
    fuelStops: 1,
    rating: 4.7,
    isEcoFriendly: true,
    isFamilyFriendly: false,
    hasJeepHire: false,
    description: 'An intimate safari camp just minutes from the main gate, perfect for early morning game drives and spotting leopards.',
    images: [
      'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=800',
      'https://images.unsplash.com/photo-1544550581-5f7ceaf7f992?w=800',
      'https://images.unsplash.com/photo-1551918120-9739cb430c6d?w=800',
    ],
  },
  {
    id: 'acc_003',
    name: 'Wilpattu Forest Camp',
    parkId: 'park_wilpattu',
    pricePerNight: 6200,
    distanceFromGate: 1.2,
    travelTime: '10 mins',
    fuelStops: 0,
    rating: 4.5,
    isEcoFriendly: false,
    isFamilyFriendly: false,
    hasJeepHire: false,
    description: 'A rustic tented camp on the edge of Wilpattu, offering an authentic bush experience among ancient forest lakes.',
    images: [
      'https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?w=800',
      'https://images.unsplash.com/photo-1478131143081-80f7f84ca84d?w=800',
      'https://images.unsplash.com/photo-1532339142463-fd0a8979791a?w=800',
    ],
  },
  {
    id: 'acc_004',
    name: 'Udawalawe Family Resort',
    parkId: 'park_udawalawe',
    pricePerNight: 12000,
    distanceFromGate: 7.8,
    travelTime: '25 mins',
    fuelStops: 2,
    rating: 4.6,
    isEcoFriendly: false,
    isFamilyFriendly: true,
    hasJeepHire: true,
    description: 'A spacious family resort near Udawalawe, renowned for elephant sightings and child-friendly amenities.',
    images: [
      'https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=800',
      'https://images.unsplash.com/photo-1563911302283-d2bc129e7570?w=800',
      'https://images.unsplash.com/photo-1611892440504-42a792e24d32?w=800',
    ],
  },
];

async function main() {
  console.log('🌱 Starting database seed...\n');

  // Clear existing data
  console.log('🗑️  Clearing existing data...');
  await prisma.booking.deleteMany();
  await prisma.refreshToken.deleteMany();
  await prisma.user.deleteMany();
  await prisma.accommodationImage.deleteMany();
  await prisma.accommodation.deleteMany();
  await prisma.park.deleteMany();

  // Seed parks
  console.log('🏞️  Seeding parks...');
  for (const park of parks) {
    await prisma.park.create({ data: park });
    console.log(`   ✓ ${park.name}`);
  }

  // Seed accommodations with images
  console.log('\n🏨 Seeding accommodations...');
  for (const acc of accommodations) {
    const { images, ...accommodationData } = acc;
    
    await prisma.accommodation.create({
      data: {
        ...accommodationData,
        images: {
          create: images.map((url, index) => ({
            imageUrl: url,
            sortOrder: index,
          })),
        },
      },
    });
    console.log(`   ✓ ${acc.name}`);
  }

  console.log('\n✅ Seed completed successfully!');
  console.log(`   - ${parks.length} parks created`);
  console.log(`   - ${accommodations.length} accommodations created`);
  console.log(`   - ${accommodations.reduce((sum, a) => sum + a.images.length, 0)} images created`);
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
