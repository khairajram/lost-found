import bcrypt from 'bcryptjs';
import { prisma } from '../config/prisma.js';

async function seed() {
  console.log('🌱 Seeding PostgreSQL database for Find & Lost...');

  // 1. Create or update User A (Alex Rivera - Owner)
  const salt = await bcrypt.genSalt(10);
  const passwordHash = await bcrypt.hash('password123', salt);

  const alex = await prisma.user.upsert({
    where: { email: 'alex@example.com' },
    update: {
      passwordHash,
      name: 'Alex Rivera',
      phone: '+1 (555) 019-2834',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400',
      isVerified: true,
    },
    create: {
      id: 'user-a-123',
      email: 'alex@example.com',
      name: 'Alex Rivera',
      passwordHash,
      phone: '+1 (555) 019-2834',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400',
      isVerified: true,
    },
  });

  // 2. Create or update User B (Sarah Chen - Finder)
  const sarah = await prisma.user.upsert({
    where: { email: 'sarah@example.com' },
    update: {
      passwordHash,
      name: 'Sarah Chen',
      phone: '+1 (555) 018-9942',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400',
      isVerified: true,
    },
    create: {
      id: 'user-b-456',
      email: 'sarah@example.com',
      name: 'Sarah Chen',
      passwordHash,
      phone: '+1 (555) 018-9942',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400',
      isVerified: true,
    },
  });

  console.log(`✅ Users seeded: Alex (${alex.id}) & Sarah (${sarah.id})`);

  // 3. Create Alex's Lost Item
  const lostItem = await prisma.lostItem.upsert({
    where: { id: 'lost-101' },
    update: {},
    create: {
      id: 'lost-101',
      userId: alex.id,
      title: 'Samsung Galaxy S23 Ultra (Black)',
      description: 'Lost my black Galaxy S23 Ultra near the University Library. It has a transparent case and small scratch near bottom bezel.',
      category: 'Mobile Phone',
      brand: 'Samsung',
      model: 'Galaxy S23 Ultra',
      color: 'Phantom Black',
      distinctiveFeatures: ['Clear bumper case', 'Small scratch near bottom bezel', 'Camera lens ring'],
      lostDate: new Date(Date.now() - 3 * 3600 * 1000), // 3 hours ago
      latitude: 37.7749,
      longitude: -122.4194,
      city: 'San Francisco',
      state: 'CA',
      country: 'USA',
      approximateArea: 'University Library Campus Center',
      images: [
        'https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?w=800',
        'https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=800',
      ],
      status: 'ACTIVE',
      privateVerificationDetails: 'Lockscreen has a watercolor cat picture',
      aiDescription: 'Black Samsung Galaxy smartphone in clear shock-absorbent bumper case.',
      aiAnalysis: {
        category: 'Mobile Phone',
        brand: 'Samsung',
        model: 'Galaxy S23 Ultra',
        primaryColor: 'Phantom Black',
        secondaryColors: ['Clear', 'Silver'],
        visibleText: ['SAMSUNG'],
        distinctiveFeatures: ['Triple camera island', 'Clear case', 'Lower bezel mark'],
        objectDescription: 'Flagship black smartphone with distinct multi-lens rear array.',
        confidence: 0.94,
      },
    },
  });

  // 4. Create Sarah's Found Item
  const foundItem = await prisma.foundItem.upsert({
    where: { id: 'found-201' },
    update: {},
    create: {
      id: 'found-201',
      userId: sarah.id,
      title: 'Found Black Samsung Phone on Campus Bench',
      description: 'Found on a wooden bench outside the Library main building. Black phone in clear cover with some scratch near bottom edge.',
      category: 'Mobile Phone',
      brand: 'Samsung',
      model: 'Galaxy S23',
      color: 'Black',
      distinctiveFeatures: ['Transparent silicone case', 'Scratch near charging port/bezel', 'Triple camera'],
      foundDate: new Date(Date.now() - 1.5 * 3600 * 1000), // 1.5 hours ago
      latitude: 37.7752,
      longitude: -122.419,
      city: 'San Francisco',
      state: 'CA',
      country: 'USA',
      approximateArea: 'Library Plaza Green Bench',
      images: [
        'https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=800',
        'https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?w=800',
      ],
      status: 'ACTIVE',
      aiDescription: 'Found black smartphone matching Samsung Galaxy design with clear protective case.',
      aiAnalysis: {
        category: 'Mobile Phone',
        brand: 'Samsung',
        model: 'Galaxy S23',
        primaryColor: 'Black',
        secondaryColors: ['Transparent'],
        visibleText: ['SAMSUNG'],
        distinctiveFeatures: ['Transparent silicone case', 'Bottom bezel scratch mark'],
        objectDescription: 'Black Android smartphone with triple camera cutouts.',
        confidence: 0.92,
      },
    },
  });

  console.log(`✅ Items seeded: Lost Item (${lostItem.id}) & Found Item (${foundItem.id})`);

  // 5. Create AI Match
  const match = await prisma.match.upsert({
    where: { id: 'match-301' },
    update: {},
    create: {
      id: 'match-301',
      lostItemId: lostItem.id,
      foundItemId: foundItem.id,
      lostUserId: alex.id,
      foundUserId: sarah.id,
      matchScore: 91,
      visualSimilarity: 88,
      categorySimilarity: 100,
      colorSimilarity: 95,
      brandSimilarity: 92,
      locationSimilarity: 86,
      dateSimilarity: 94,
      descriptionSimilarity: 85,
      aiReasoning: [
        'Multimodal Gemini vision analysis: Both photos depict identical triple camera geometry and matte black finish.',
        'Both items feature a clear shock-absorbent silicone bumper case with matching corner protectors.',
        'Distinctive bezel micro-scratch observed in both lost description and found photo.',
        'Location proximity: Found within 120 meters of the reported lost location at University Library.',
        'Temporal match: Found 1.5 hours after reported loss time.',
      ],
      status: 'POTENTIAL',
      verificationStatus: 'NONE',
    },
  });

  console.log(`✅ Match seeded: Match ID ${match.id} (Score: 91%)`);

  // 6. Create Conversation and initial messages
  const conversation = await prisma.conversation.upsert({
    where: { matchId: match.id },
    update: {},
    create: {
      id: 'conv-301',
      matchId: match.id,
      participantAId: alex.id,
      participantBId: sarah.id,
    },
  });

  // Messages
  await prisma.message.deleteMany({ where: { conversationId: conversation.id } });

  await prisma.message.createMany({
    data: [
      {
        conversationId: conversation.id,
        senderId: sarah.id,
        text: 'Hi! I found a black Samsung Galaxy phone on the campus bench near the Library entrance. Is this yours?',
        read: true,
        createdAt: new Date(Date.now() - 45 * 60 * 1000),
      },
      {
        conversationId: conversation.id,
        senderId: alex.id,
        text: 'Hello Sarah! Yes, I think so! Does it have a small scratch near the bottom right bezel?',
        read: true,
        createdAt: new Date(Date.now() - 35 * 60 * 1000),
      },
      {
        conversationId: conversation.id,
        senderId: sarah.id,
        text: 'Yes it does! To verify ownership, what is the lockscreen wallpaper picture?',
        read: true,
        createdAt: new Date(Date.now() - 25 * 60 * 1000),
      },
      {
        conversationId: conversation.id,
        senderId: alex.id,
        text: 'It is a watercolor cat picture! I also submitted it through the app verification button.',
        read: true,
        createdAt: new Date(Date.now() - 15 * 60 * 1000),
      },
    ],
  });

  console.log(`✅ Chat messages seeded for conversation ${conversation.id}`);
  console.log('🎉 Seeding successfully completed!');
}

seed()
  .catch((e) => {
    console.error('❌ Seeding failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
