import { relations } from 'drizzle-orm'
import {
  mysqlTable,
  serial,
  varchar,
  int,
  bigint,
} from 'drizzle-orm/mysql-core'

export const courses = mysqlTable('courses', {
  id: serial('id').primaryKey(),
  title: varchar('title', { length: 255 }).notNull(),
  imageSrc: varchar('image_src', { length: 255 }).notNull(),
})

export const coursesRelations = relations(courses, ({ many }) => ({
  userProgress: many(userProgress),
  units: many(units),
}))

export const units = mysqlTable('units', {
  id: serial('id').primaryKey(),
  title: varchar('title', { length: 255 }).notNull(), // Unit 1
  description: varchar('description', { length: 255 }).notNull(), // Learn the basics of Spanish
  courseId: bigint('course_id', {
    mode: 'number',
    unsigned: true,
  })
    .references(() => courses.id, {
      onDelete: 'cascade',
    })
    .notNull(),
  order: int('order').notNull(),
})

export const unitsRelations = relations(units, ({ one, many }) => ({
  course: one(courses, {
    fields: [units.courseId],
    references: [courses.id],
  }),
  lessons: many(lessons),
}))

export const lessons = mysqlTable('lessons', {
  id: serial('id').primaryKey(),
  title: varchar('title', { length: 255 }).notNull(),
  unitId: bigint('unit_id', {
    mode: 'number',
    unsigned: true,
  })
    .references(() => units.id, {
      onDelete: 'cascade',
    })
    .notNull(),
  order: int('order').notNull(),
})

export const lessonsRelations = relations(lessons, ({ one }) => ({
  unit: one(units, {
    fields: [lessons.unitId],
    references: [units.id],
  }),
}))

export const userProgress = mysqlTable('user_progress', {
  userId: varchar('user_id', { length: 255 }).primaryKey(),
  userName: varchar('user_name', { length: 255 }).notNull().default('User'),
  userImageSrc: varchar('user_image_src', { length: 255 })
    .notNull()
    .default('/mascot.svg'),
  activeCourseId: bigint('active_course_id', {
    mode: 'number',
    unsigned: true,
  }).references(() => courses.id, {
    onDelete: 'cascade',
  }),
  hearts: int('hearts').notNull().default(5),
  points: int('points').notNull().default(0),
})

export const userProgressRelations = relations(userProgress, ({ one }) => ({
  activeCourse: one(courses, {
    fields: [userProgress.activeCourseId],
    references: [courses.id],
  }),
}))
