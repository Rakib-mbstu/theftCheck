import { prisma } from './db'

export async function getAllUsers() {
  return prisma.user.findMany({
    select: { id: true, name: true, email: true, isAdmin: true, createdAt: true },
    orderBy: { createdAt: 'desc' },
  })
}

export async function setUserAdmin(id: number, isAdmin: boolean) {
  const user = await prisma.user.findUnique({ where: { id } })
  if (!user) return null
  return prisma.user.update({ where: { id }, data: { isAdmin } })
}
