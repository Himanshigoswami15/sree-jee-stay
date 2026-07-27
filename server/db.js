import fs from 'node:fs';
import path from 'node:path';
import bcrypt from 'bcryptjs';

const DATA_DIR = path.resolve(process.cwd(), 'data');
const DB_FILE = path.join(DATA_DIR, 'passwords.json');

// Ensure data directory exists
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

const DEFAULT_PIN_HASH = bcrypt.hashSync('1234', 10);

function readDb() {
  try {
    if (fs.existsSync(DB_FILE)) {
      const raw = fs.readFileSync(DB_FILE, 'utf-8');
      return JSON.parse(raw);
    }
  } catch (err) {
    console.error('[DB] Error reading database file:', err);
  }

  const defaultDb = {
    'demo': { passwordHash: DEFAULT_PIN_HASH, updatedAt: new Date().toISOString() },
    'sree-jee-stay': { passwordHash: DEFAULT_PIN_HASH, updatedAt: new Date().toISOString() }
  };
  saveDb(defaultDb);
  return defaultDb;
}

function saveDb(data) {
  try {
    const tempFile = `${DB_FILE}.tmp`;
    fs.writeFileSync(tempFile, JSON.stringify(data, null, 2), 'utf-8');
    fs.renameSync(tempFile, DB_FILE);
  } catch (err) {
    console.error('[DB] Error saving database file:', err);
  }
}

export function getTenantPasswordHash(tenantId = 'demo') {
  const db = readDb();
  if (!db[tenantId] || !db[tenantId].passwordHash) {
    db[tenantId] = { passwordHash: DEFAULT_PIN_HASH, updatedAt: new Date().toISOString() };
    saveDb(db);
  }
  return db[tenantId].passwordHash;
}

export function updateTenantPasswordHash(tenantId = 'demo', newHash) {
  const db = readDb();
  db[tenantId] = {
    passwordHash: newHash,
    updatedAt: new Date().toISOString()
  };
  saveDb(db);
  return true;
}
