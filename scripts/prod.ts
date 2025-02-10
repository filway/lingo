import 'dotenv/config'
import { drizzle } from 'drizzle-orm/mysql2'
import mysql from 'mysql2/promise'
import { ResultSetHeader } from 'mysql2/promise'

import * as schema from '../db/schema'

const COURSES = [
  {
    title: 'Spanish',
    imageSrc: '/es.svg',
  },
]

const main = async () => {
  try {
    console.log('Seeding database')

    const sql = await mysql.createConnection({ uri: process.env.DATABASE_URL })

    const db = drizzle(sql, { schema, mode: 'default' })

    // Delete all existing data
    await Promise.all([
      db.delete(schema.courses),
      db.delete(schema.userProgress),
      db.delete(schema.units),
      db.delete(schema.lessons),
      db.delete(schema.challenges),
      db.delete(schema.challengeOptions),
      db.delete(schema.challengeProgress),
      db.delete(schema.userSubscription),
    ])

    // Insert courses
    const courses = (await db
      .insert(schema.courses)
      .values(COURSES)) as ResultSetHeader[]

    // For each course, insert units mysql.ResultSetHeader
    for (let i = 0; i < 1; i++) {
      const units = await db.insert(schema.units).values([
        {
          courseId: courses[i].insertId,
          title: 'Unit 1',
          description: `Learn the basics of ${COURSES[i].title}`,
          order: 1,
        },
        {
          courseId: courses[i].insertId,
          title: 'Unit 2',
          description: `Learn intermediate of ${COURSES[i].title}`,
          order: 2,
        },
      ])

      const firstUnitId = units[0].insertId

      // For each unit, insert lessons
      for (let l = 0; l < 2; l++) {
        const unitId = firstUnitId + l
        const lessons = await db.insert(schema.lessons).values([
          {
            unitId: unitId,
            title: 'Nouns',
            order: 1,
          },
          {
            unitId: unitId,
            title: 'Verbs',
            order: 2,
          },
          {
            unitId: unitId,
            title: 'Adjectives',
            order: 3,
          },
          {
            unitId: unitId,
            title: 'Phrases',
            order: 4,
          },
          {
            unitId: unitId,
            title: 'Sentences',
            order: 5,
          },
        ])

        const firestLessonId = lessons[0].insertId

        // For each lesson, insert challenges
        for (let k = 0; k < 5; k++) {
          const lessonId = firestLessonId + k
          const challengesResult = await db.insert(schema.challenges).values([
            {
              lessonId: lessonId,
              type: 'SELECT',
              question: 'Which one of these is the "the man"?',
              order: 1,
            },
            {
              lessonId: lessonId,
              type: 'SELECT',
              question: 'Which one of these is the "the woman"?',
              order: 2,
            },
            {
              lessonId: lessonId,
              type: 'SELECT',
              question: 'Which one of these is the "the boy"?',
              order: 3,
            },
            {
              lessonId: lessonId,
              type: 'ASSIST',
              question: '"the man"',
              order: 4,
            },
            {
              lessonId: lessonId,
              type: 'SELECT',
              question: 'Which one of these is the "the zombie"?',
              order: 5,
            },
            {
              lessonId: lessonId,
              type: 'SELECT',
              question: 'Which one of these is the "the robot"?',
              order: 6,
            },
            {
              lessonId: lessonId,
              type: 'SELECT',
              question: 'Which one of these is the "the girl"?',
              order: 7,
            },
            {
              lessonId: lessonId,
              type: 'ASSIST',
              question: '"the zombie"',
              order: 8,
            },
          ])

          const firstInsertId = challengesResult[0].insertId

          // For each challenge, insert challenge options
          for (let j = 0; j < 8; j++) {
            const challengeId = firstInsertId + j

            if (j === 0) {
              await db.insert(schema.challengeOptions).values([
                {
                  challengeId: challengeId,
                  correct: true,
                  text: 'el hombre',
                  imageSrc: '/man.svg',
                  audioSrc: 'es_man.mp3',
                },
                {
                  challengeId: challengeId,
                  correct: false,
                  text: 'la mujer',
                  imageSrc: '/woman.svg',
                  audioSrc: 'es_woman.mp3',
                },
                {
                  challengeId: challengeId,
                  correct: false,
                  text: 'el chico',
                  imageSrc: '/boy.svg',
                  audioSrc: '/es_boy.mp3',
                },
              ])
            }

            if (j === 1) {
              await db.insert(schema.challengeOptions).values([
                {
                  challengeId: challengeId,
                  correct: true,
                  text: 'la mujer',
                  imageSrc: '/woman.svg',
                  audioSrc: 'es_woman.mp3',
                },
                {
                  challengeId: challengeId,
                  correct: false,
                  text: 'el chico',
                  imageSrc: '/boy.svg',
                  audioSrc: '/es_boy.mp3',
                },
                {
                  challengeId: challengeId,
                  correct: false,
                  text: 'el hombre',
                  imageSrc: '/man.svg',
                  audioSrc: 'es_man.mp3',
                },
              ])
            }

            if (j === 2) {
              await db.insert(schema.challengeOptions).values([
                {
                  challengeId: challengeId,
                  correct: false,
                  text: 'la mujer',
                  imageSrc: '/woman.svg',
                  audioSrc: 'es_woman.mp3',
                },
                {
                  challengeId: challengeId,
                  correct: false,
                  text: 'el hombre',
                  imageSrc: '/man.svg',
                  audioSrc: 'es_man.mp3',
                },
                {
                  challengeId: challengeId,
                  correct: true,
                  text: 'el chico',
                  imageSrc: '/boy.svg',
                  audioSrc: '/es_boy.mp3',
                },
              ])
            }

            if (j === 3) {
              await db.insert(schema.challengeOptions).values([
                {
                  challengeId: challengeId,
                  text: 'el hombre',
                  correct: true,
                  audioSrc: '/es_man.mp3',
                },
                {
                  challengeId: challengeId,
                  text: 'la mujer',
                  correct: false,
                  audioSrc: '/es_woman.mp3',
                },
                {
                  challengeId: challengeId,
                  text: 'el robot',
                  correct: false,
                  audioSrc: '/es_robot.mp3',
                },
              ])
            }

            // zombie
            if (j === 4) {
              await db.insert(schema.challengeOptions).values([
                {
                  challengeId: challengeId,
                  correct: false,
                  text: 'el chica',
                  imageSrc: '/girl.svg',
                  audioSrc: 'es_girl.mp3',
                },
                {
                  challengeId: challengeId,
                  correct: true,
                  text: 'el zombi',
                  imageSrc: '/zombie.svg',
                  audioSrc: 'es_zombie.mp3',
                },
                {
                  challengeId: challengeId,
                  correct: false,
                  text: 'el chico',
                  imageSrc: '/boy.svg',
                  audioSrc: '/es_boy.mp3',
                },
              ])
            }

            // robot
            if (j === 5) {
              await db.insert(schema.challengeOptions).values([
                {
                  challengeId: challengeId,
                  correct: false,
                  text: 'el chica',
                  imageSrc: '/girl.svg',
                  audioSrc: 'es_girl.mp3',
                },
                {
                  challengeId: challengeId,
                  correct: false,
                  text: 'el chico',
                  imageSrc: '/boy.svg',
                  audioSrc: '/es_boy.mp3',
                },
                {
                  challengeId: challengeId,
                  correct: true,
                  text: 'el robot',
                  imageSrc: '/robot.svg',
                  audioSrc: '/es_robot.mp3',
                },
              ])
            }

            // girl
            if (j === 6) {
              await db.insert(schema.challengeOptions).values([
                {
                  challengeId: challengeId,
                  correct: true,
                  text: 'el chica',
                  imageSrc: '/girl.svg',
                  audioSrc: 'es_girl.mp3',
                },
                {
                  challengeId: challengeId,
                  correct: false,
                  text: 'el chico',
                  imageSrc: '/boy.svg',
                  audioSrc: '/es_boy.mp3',
                },
                {
                  challengeId: challengeId,
                  correct: false,
                  text: 'el hombre',
                  imageSrc: '/man.svg',
                  audioSrc: '/es_man.mp3',
                },
              ])
            }

            if (j === 7) {
              await db.insert(schema.challengeOptions).values([
                {
                  challengeId: challengeId,
                  text: 'el zombi',
                  correct: true,
                  audioSrc: '/es_zombie.mp3',
                },
                {
                  challengeId: challengeId,
                  text: 'la mujer',
                  correct: false,
                  audioSrc: '/es_woman.mp3',
                },
                {
                  challengeId: challengeId,
                  text: 'el robot',
                  correct: false,
                  audioSrc: '/es_robot.mp3',
                },
              ])
            }
          }
        }
      }
    }

    console.log('Sedding finished')

    process.exit(0)
  } catch (error) {
    console.error(error)
    throw new Error('Failed to seed the database')
  }
}

main()
