import dotenv from 'dotenv';
import { connectDB, disconnectDB } from '../server/config/db.js';
import { Feedback } from '../server/models/index.js';

dotenv.config();

async function runSeeder() {
  console.log('\n🌱 --- JJ REVIEW SYSTEM DEMO DATA SEEDER ---');
  await connectDB();

  const hotelId = 'sree-jee-stay';

  const sampleFeedbacks = [
    {
      hotelId,
      rating: 5,
      tags: ['clean', 'wifi', 'staff', 'breakfast'],
      reviewText: 'Had a fantastic experience during our stay at Sree Jee Stay! The room was impeccably clean, fresh, and spotless. The Wi-Fi was super fast and reliable for work and video streaming. Will definitely come back and recommend to friends!',
      guestContact: '+91 98765 11111',
      postedPublic: true,
      alertSent: false,
      managerResolved: false,
      status: 'Public Posted',
      createdAt: new Date(Date.now() - 2 * 3600 * 1000),
    },
    {
      hotelId,
      rating: 2,
      tags: ['ac_issue', 'noise'],
      reviewText: 'Disappointed with our stay. Specifically, the air conditioning in the room was not cooling properly, and there was considerable ambient noise disrupting our sleep. Hope management can look into these issues promptly.',
      guestContact: '+91 98765 22222',
      postedPublic: false,
      alertSent: true,
      managerResolved: false,
      status: 'Manager Alerted',
      createdAt: new Date(Date.now() - 1 * 3600 * 1000),
    },
    {
      hotelId,
      rating: 5,
      tags: ['bed', 'location', 'quick_checkin'],
      reviewText: 'Wonderful stay overall! Cozy mattress and plush pillows ensured a deeply restful stay. Check-in was quick, organized, and completely seamless. Looking forward to staying here again on our next visit.',
      guestContact: '+91 98765 33333',
      postedPublic: true,
      alertSent: false,
      managerResolved: false,
      status: 'Public Posted',
      createdAt: new Date(Date.now() - 30 * 60 * 1000),
    },
  ];

  await Feedback.deleteMany({ hotelId });
  await Feedback.insertMany(sampleFeedbacks);
  console.log(`✅ Seeded ${sampleFeedbacks.length} sample feedback submissions for hotel "${hotelId}".`);

  console.log('\n🎉 --- JJ REVIEW SYSTEM SEEDING COMPLETED --- \n');
  await disconnectDB();
  process.exit(0);
}

runSeeder().catch((err) => {
  console.error('❌ Seeding failed:', err);
  process.exit(1);
});
