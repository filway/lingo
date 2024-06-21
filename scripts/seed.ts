import 'dotenv/config'
import { drizzle } from 'drizzle-orm/mysql2'
import mysql from 'mysql2/promise'

import * as schema from '../db/schema'

const main = async () => {
  try {
    console.log('Sedding database')

    const sql = await mysql.createConnection({ uri: process.env.DATABASE_URL })

    const db = drizzle(sql, { schema, mode: 'default' })

    await db.delete(schema.courses)
    await db.delete(schema.userProgress)

    await db.insert(schema.courses).values([
      {
        id: 1,
        title: 'Spanish',
        imageSrc: '/es.svg',
      },
      {
        id: 2,
        title: 'French',
        imageSrc: '/fr.svg',
      },
      {
        id: 3,
        title: 'Croatian',
        imageSrc: '/hr.svg',
      },
      {
        id: 4,
        title: 'Italian',
        imageSrc: '/it.svg',
      },
    ])

    console.log('Sedding finished')

    process.exit(0)
  } catch (error) {
    console.error(error)
    throw new Error('Failed to seed the database')
  }
}

main()
