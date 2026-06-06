import { prisma } from './db'

export async function searchByImei(imei: string) {
  const device = await prisma.device.findUnique({
    where: { imei },
    include: {
      complaints: {
        where: { status: { not: 'Resolved' } },
        select: { id: true, locationStolen: true, createdAt: true },
        orderBy: { createdAt: 'desc' },
      },
    },
  })

  if (!device) return null

  return {
    imei: device.imei,
    brand: device.brand,
    model: device.model,
    isStolen: device.complaints.length > 0,
    complaints: device.complaints,
  }
}
