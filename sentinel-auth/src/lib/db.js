import Database from 'better-sqlite3';
import path from 'path';

const dbPath = path.join(process.cwd(), 'sentinel.db');

const db = global.db || new Database(dbPath);
db.pragma('journal_mode = WAL');

if (process.env.NODE_ENV !== 'production') {
    global.db = db;
}

export default db;
