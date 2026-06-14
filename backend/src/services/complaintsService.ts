import { prisma } from './db'

export async function getAllComplaints() {
  return prisma.complaint.findMany({
    include: {
      device: { select: { imei: true, brand: true, model: true } },
      user:   { select: { name: true, email: true } },
    },
    orderBy: { createdAt: 'desc' },
  })
}

export async function updateComplaintStatus(id: number, status: 'Approved' | 'Rejected' | 'Resolved') {
  const complaint = await prisma.complaint.findUnique({ where: { id } })
  if (!complaint) return null
  return prisma.complaint.update({ where: { id }, data: { status } })
}

export async function getUserComplaints(userId: number) {
  return prisma.complaint.findMany({
    where: { userId },
    include: { device: { select: { imei: true, brand: true, model: true } } },
    orderBy: { createdAt: 'desc' },
  })
}

export async function createComplaint(
  userId: number,
  imei: string,
  brand: string,
  model: string,
  locationStolen: string,
) {
  const device = await prisma.device.upsert({
    where: { imei },
    update: {},
    create: { imei, brand, model },
  })

  const existing = await prisma.complaint.findFirst({
    where: { deviceId: device.id, userId, status: { not: 'Resolved' } },
  })
  if (existing) return { conflict: true as const }

  const complaint = await prisma.complaint.create({
    data: { deviceId: device.id, userId, locationStolen },
    include: { device: { select: { imei: true, brand: true, model: true } } },
  })
  return { conflict: false as const, complaint }
}
