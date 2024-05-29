import { mysqlTable, serial, varchar } from 'drizzle-orm/mysql-core'

export const courses = mysqlTable('courses', {
  id: serial('id').primaryKey(),
  title: varchar('title', { length: 255 }).notNull(),
  imageSrc: varchar('image_src', { length: 255 }).notNull(),
})
