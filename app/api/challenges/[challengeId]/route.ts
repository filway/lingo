import { db } from '@/db/drizzle'
import { challenges } from '@/db/schema'
import { isAdmin } from '@/lib/admin'
import { eq } from 'drizzle-orm'
import { NextResponse } from 'next/server'

export const GET = async (
  req: Request,
  { params }: { params: { challengeId: number } }
) => {
  if (!isAdmin()) {
    return new NextResponse('Unauthorized', { status: 401 })
  }
  const data = await db.query.challenges.findFirst({
    where: eq(challenges.id, params.challengeId),
  })

  return NextResponse.json(data)
}

export const PUT = async (
  req: Request,
  { params }: { params: { challengeId: number } }
) => {
  if (!isAdmin()) {
    return new NextResponse('Unauthorized', { status: 401 })
  }

  const body = await req.json()

  const data = await db
    .update(challenges)
    .set({
      ...body,
    })
    .where(eq(challenges.id, params.challengeId))

  return NextResponse.json({ id: params.challengeId })
}

export const DELETE = async (
  req: Request,
  { params }: { params: { challengeId: number } }
) => {
  if (!isAdmin()) {
    return new NextResponse('Unauthorized', { status: 401 })
  }
  const data = await db
    .delete(challenges)
    .where(eq(challenges.id, params.challengeId))

  return NextResponse.json({ id: params.challengeId })
}
