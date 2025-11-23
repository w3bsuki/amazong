import { Client } from "pg"
import fs from "fs"
import path from "path"
import { fileURLToPath } from "url"

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

async function main() {
  const connectionString = process.env.POSTGRES_URL || process.env.DATABASE_URL

  if (!connectionString) {
    console.error("No database connection string found. Please set POSTGRES_URL or DATABASE_URL.")
    process.exit(1)
  }

  const client = new Client({
    connectionString,
    ssl: {
      rejectUnauthorized: false,
    },
  })

  try {
    await client.connect()
    console.log("Connected to database.")

    const sqlPath = path.join(__dirname, "migrations.sql")
    const sql = fs.readFileSync(sqlPath, "utf8")

    console.log("Running migrations...")
    await client.query(sql)
    console.log("Migrations completed successfully.")
  } catch (err) {
    console.error("Error running migrations:", err)
    process.exit(1)
  } finally {
    await client.end()
  }
}

main()
