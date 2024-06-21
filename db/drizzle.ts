import { drizzle } from 'drizzle-orm/mysql2'
import mysql from 'mysql2/promise'
import * as schema from './schema'

export const connection = mysql.createPool({
  uri: process.env.DATABASE_URL,
})

export const db = drizzle(connection, { schema: schema, mode: 'default' })
