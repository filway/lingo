import 'dotenv/config'
import { drizzle } from 'drizzle-orm/mysql2'
import mysql from 'mysql2/promise'

import * as schema from '../db/schema'

const main = async () => {
  try {
    console.log('Reseting database')

    const sql = await mysql.createConnection({ uri: process.env.DATABASE_URL })

    const db = drizzle(sql, { schema, mode: 'default' })

    await db.delete(schema.courses)
    await db.delete(schema.userProgress)
    await db.delete(schema.units)
    await db.delete(schema.lessons)
    await db.delete(schema.challenges)
    await db.delete(schema.challengeOptions)
    await db.delete(schema.challengeProgress)
    await db.delete(schema.userSubscription)

    console.log('Reseting finished')

    process.exit(0)
  } catch (error) {
    console.error(error)
    throw new Error('Failed to reset the database')
  }
}

main()
