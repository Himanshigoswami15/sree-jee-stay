import dotenv from 'dotenv';
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import { connectDB, disconnectDB } from '../server/config/db.js';
import { User } from '../server/models/index.js';

dotenv.config();

async function run() {
  console.log('[UpdatePasswords] Connecting to MongoDB Atlas...');
  await connectDB();

  const newPin = '9008';
  const saltRounds = 10;
  const newHash = bcrypt.hashSync(newPin, saltRounds);

  console.log(`[UpdatePasswords] Updating all User accounts to Security PIN "${newPin}"...`);

  const result = await User.updateMany(
    {},
    {
      $set: {
        passwordHash: newHash,
        failedAttempts: 0,
        lockedUntil: null,
      },
    }
  );

  console.log(`[UpdatePasswords] Successfully updated ${result.modifiedCount || result.nModified || 0} user accounts in MongoDB Atlas!`);
  await disconnectDB();
  process.exit(0);
}

run().catch((err) => {
  console.error('[UpdatePasswords Error]', err);
  process.exit(1);
});
