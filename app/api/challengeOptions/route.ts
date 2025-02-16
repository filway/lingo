import { db } from '@/db/drizzle'
import { challengeOptions } from '@/db/schema'
import { isAdmin } from '@/lib/admin'
import { NextResponse } from 'next/server'

export const GET = async () => {
  if (!isAdmin()) {
    return new NextResponse('Unauthorized', { status: 401 })
  }
  const data = await db.query.challengeOptions.findMany()

  return NextResponse.json(data)
}

export const POST = async (req: Request) => {
  if (!isAdmin()) {
    return new NextResponse('Unauthorized', { status: 401 })
  }

  const body = await req.json()

  const data = await db.insert(challengeOptions).values({
    ...body,
  })

  return NextResponse.json({ id: data[0].insertId })
}
