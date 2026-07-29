import dotenv from 'dotenv';
import { connectDB, disconnectDB, mongoose } from '../server/config/db.js';

dotenv.config();

async function resetDB() {
  await connectDB();
  console.log('🧹 Clearing legacy collection indexes...');

  const db = mongoose.connection.db;
  const collections = await db.listCollections().toArray();

  for (const col of collections) {
    console.log(`  Dropping collection: ${col.name}...`);
    await db.collection(col.name).drop().catch(() => {});
  }

  console.log('✅ Legacy collections and indexes cleared successfully!');
  await disconnectDB();
  process.exit(0);
}

resetDB().catch((err) => {
  console.error('Error clearing DB:', err);
  process.exit(1);
});
