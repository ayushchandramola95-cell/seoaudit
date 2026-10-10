const { Client } = require("pg");

async function checkDatabase() {
  const connStr = process.env.DATABASE_URL || process.argv[2];
  if (!connStr) {
    console.error("Usage: node check_tables.js <connection_string> or set DATABASE_URL");
    process.exit(1);
  }

  const client = new Client({
    connectionString: connStr,
    ssl: { rejectUnauthorized: false },
    connectionTimeoutMillis: 5000,
  });

  try {
    await client.connect();
    console.log("Successfully connected to database!");

    const res = await client.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public'
      ORDER BY table_name;
    `);

    console.log("Tables in database:", res.rows.map(r => r.table_name));
    await client.end();
  } catch (err) {
    console.error("Connection failed:", err.message);
    try { await client.end(); } catch (_) {}
    process.exit(1);
  }
}

checkDatabase();
