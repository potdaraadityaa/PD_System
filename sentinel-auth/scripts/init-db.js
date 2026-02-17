const Database = require('better-sqlite3');
const path = require('path');
const bcrypt = require('bcryptjs');

const dbPath = path.join(process.cwd(), 'sentinel.db');
const db = new Database(dbPath);

try {
  console.log('Initializing database at:', dbPath);

  db.exec(`
    DROP TABLE IF EXISTS users;
    CREATE TABLE users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      username TEXT UNIQUE NOT NULL,
      role TEXT NOT NULL,
      password_hash TEXT NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS policies (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      description TEXT,
      effect TEXT CHECK(effect IN ('ALLOW', 'DENY')) NOT NULL,
      action_pattern TEXT,
      resource_pattern TEXT,
      conditions TEXT,
      is_active BOOLEAN DEFAULT 1,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS audit_logs (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
      subject TEXT,
      action TEXT,
      resource TEXT,
      decision TEXT,
      reason TEXT,
      policy_id_matched INTEGER,
      FOREIGN KEY(policy_id_matched) REFERENCES policies(id)
    );
  `);

  // Seed initial data
  const insertUser = db.prepare('INSERT OR IGNORE INTO users (username, role, password_hash) VALUES (?, ?, ?)');

  const adminHash = bcrypt.hashSync('admin123', 10);
  const guestHash = bcrypt.hashSync('guest123', 10);

  insertUser.run('admin', 'admin', adminHash);
  insertUser.run('guest', 'guest', guestHash);

  // Seed a default policy (Admin can do everything)
  const insertPolicy = db.prepare(`
    INSERT OR IGNORE INTO policies (name, description, effect, action_pattern, resource_pattern, conditions, is_active)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `);

  // Admin Policy: Allow everything
  const adminPolicyId = insertPolicy.run(
    'Admin Full Access',
    'Grants full access to users with admin role',
    'ALLOW',
    '*',
    '*',
    JSON.stringify({
      field: 'user.role',
      operator: 'source_equals',
      value: 'admin'
    }),
    1
  );

  console.log('Database initialized and seeded successfully.');
} catch (error) {
  console.error('Failed to initialize database:', error);
  process.exit(1);
}

