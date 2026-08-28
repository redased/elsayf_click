const sqlite3 = require('better-sqlite3');
const { Client } = require('pg');

async function migrate() {
  console.log('🚀 Migration SQLite → PostgreSQL\n');

  // Open SQLite
  const sqliteDb = new sqlite3('prisma/dev.db', { readonly: true });

  // Connect to PostgreSQL
  const pgClient = new Client({
    host: 'localhost',
    port: 5433,
    database: 'elsayf',
    user: 'elsayf',
    password: 'elsayf_secure_2026'
  });
  await pgClient.connect();

  try {
    // Get all tables from SQLite
    const tables = sqliteDb.prepare(`
      SELECT name FROM sqlite_master
      WHERE type='table' AND name NOT LIKE 'sqlite_%' AND name NOT LIKE '_prisma%'
    `).all();

    for (const { name } of tables) {
      console.log(`📦 Migration de la table: ${name}`);

      // Get all rows
      const rows = sqliteDb.prepare(`SELECT * FROM "${name}"`).all();

      if (rows.length === 0) {
        console.log(`  ⏭️  Table vide, ignorée\n`);
        continue;
      }

      // Get column names
      const columns = Object.keys(rows[0]);

      // Prepare INSERT statement
      const placeholders = columns.map((_, i) => `$${i + 1}`).join(', ');
      const columnNames = columns.map(c => `"${c}"`).join(', ');
      const insertSQL = `INSERT INTO "${name}" (${columnNames}) VALUES (${placeholders}) ON CONFLICT DO NOTHING`;

      // Insert each row
      let inserted = 0;
      for (const row of rows) {
        try {
          const values = columns.map(col => row[col]);
          await pgClient.query(insertSQL, values);
          inserted++;
        } catch (err) {
          console.log(`  ⚠️  Erreur sur une ligne:`, err.message);
        }
      }

      console.log(`  ✅ ${inserted}/${rows.length} lignes insérées\n`);
    }

    console.log('🎉 Migration terminée!');

  } catch (error) {
    console.error('❌ Erreur:', error);
    throw error;
  } finally {
    sqliteDb.close();
    await pgClient.end();
  }
}

migrate();
