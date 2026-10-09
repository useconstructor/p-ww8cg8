import { db } from '@/lib/db'

export async function GET() {
  await db.execute(`
    CREATE TABLE IF NOT EXISTS products (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      sku TEXT NOT NULL,
      quantity INTEGER NOT NULL DEFAULT 0,
      price REAL NOT NULL DEFAULT 0,
      created_at TEXT DEFAULT (datetime('now'))
    )
  `)

  const { rows } = await db.execute('SELECT * FROM products ORDER BY created_at DESC')
  return Response.json(rows)
}

export async function POST(req: Request) {
  const body = await req.json()

  await db.execute(`
    CREATE TABLE IF NOT EXISTS products (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      sku TEXT NOT NULL,
      quantity INTEGER NOT NULL DEFAULT 0,
      price REAL NOT NULL DEFAULT 0,
      created_at TEXT DEFAULT (datetime('now'))
    )
  `)

  const result = await db.execute({
    sql: 'INSERT INTO products (name, sku, quantity, price) VALUES (?, ?, ?, ?)',
    args: [body.name, body.sku, body.quantity ?? 0, body.price ?? 0]
  })

  const { rows } = await db.execute({
    sql: 'SELECT * FROM products WHERE id = ?',
    args: [result.lastInsertRowid]
  })

  return Response.json(rows[0], { status: 201 })
}
