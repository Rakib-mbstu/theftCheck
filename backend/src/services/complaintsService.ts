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
