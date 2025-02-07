import { relations } from 'drizzle-orm'
import {
  mysqlTable,
  serial,
  varchar,
  int,
  bigint,
  mysqlEnum,
  boolean,
  timestamp,
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

export const lessonsRelations = relations(lessons, ({ one, many }) => ({
  unit: one(units, {
    fields: [lessons.unitId],
    references: [units.id],
  }),
  challenges: many(challenges),
}))

export const challengesEnum = mysqlEnum('type', ['SELECT', 'ASSIST'])

export const challenges = mysqlTable('challenges', {
  id: serial('id').primaryKey(),
  lessonId: bigint('lesson_id', {
    mode: 'number',
    unsigned: true,
  })
    .references(() => lessons.id, {
      onDelete: 'cascade',
    })
    .notNull(),
  type: challengesEnum.notNull(),
  question: varchar('question', { length: 255 }).notNull(),
  order: int('order').notNull(),
})

export const challengesRelations = relations(challenges, ({ one, many }) => ({
  lesson: one(lessons, {
    fields: [challenges.lessonId],
    references: [lessons.id],
  }),
  challengeOptions: many(challengeOptions),
  challengeProgress: many(challengeProgress),
}))

export const challengeOptions = mysqlTable('challenge_options', {
  id: serial('id').primaryKey(),
  challengeId: bigint('challenge_id', {
    mode: 'number',
    unsigned: true,
  })
    .references(() => challenges.id, {
      onDelete: 'cascade',
    })
    .notNull(),
  text: varchar('text', { length: 255 }).notNull(),
  correct: boolean('correct').notNull(),
  imageSrc: varchar('image_src', { length: 255 }),
  audioSrc: varchar('audio_src', { length: 255 }),
})

export const challengeOptionsRelations = relations(
  challengeOptions,
  ({ one }) => ({
    challenge: one(challenges, {
      fields: [challengeOptions.challengeId],
      references: [challenges.id],
    }),
  })
)

export const challengeProgress = mysqlTable('challenge_progress', {
  id: serial('id').primaryKey(),
  userId: varchar('user_id', { length: 255 }).notNull(),
  challengeId: bigint('challenge_id', {
    mode: 'number',
    unsigned: true,
  })
    .references(() => challenges.id, {
      onDelete: 'cascade',
    })
    .notNull(),
  completed: boolean('completed').notNull().default(false),
})

export const challengeProgressRelations = relations(
  challengeProgress,
  ({ one }) => ({
    challenge: one(challenges, {
      fields: [challengeProgress.challengeId],
      references: [challenges.id],
    }),
  })
)

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

export const userSubscription = mysqlTable('user_subscription', {
  id: serial('id').primaryKey(),
  userId: varchar('user_id', { length: 255 }).notNull().unique(),
  stripeCustomerId: varchar('stripe_customer_id', { length: 255 })
    .notNull()
    .unique(),
  stripeSubscriptionId: varchar('stripe_subscription_id', { length: 255 })
    .notNull()
    .unique(),
  stripePriceId: varchar('stripe_price_id', { length: 255 }).notNull(),
  stripeCurrentPeriodEnd: timestamp('stripe_current_period_end').notNull(),
})
