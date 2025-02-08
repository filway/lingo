import { AdminUserIds } from '@/constants'
import { auth } from '@clerk/nextjs/server'

export const isAdmin = () => {
  const { userId } = auth()

  if (!userId) {
    return false
  }

  return AdminUserIds.indexOf(userId) !== -1
}
