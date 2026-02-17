const db = require('better-sqlite3')('sentinel.db');

console.log('--- Database Health Check ---');
try {
    const userCount = db.prepare('SELECT count(*) as c FROM users').get().c;
    console.log(`Users: ${userCount} (OK)`);

    const policyCount = db.prepare('SELECT count(*) as c FROM policies').get().c;
    console.log(`Policies: ${policyCount} (OK)`);

    const logsCount = db.prepare('SELECT count(*) as c FROM audit_logs').get().c;
    console.log(`Audit Logs: ${logsCount} (OK)`);
} catch (e) {
    console.error('Database Error:', e.message);
}
