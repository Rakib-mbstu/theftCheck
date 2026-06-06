import { OAuth2Client } from 'google-auth-library'
import jwt from 'jsonwebtoken'
import { randomUUID } from 'crypto'
import { prisma } from './db'

const googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID)

export async function verifyGoogleToken(idToken: string) {
  const ticket = await googleClient.verifyIdToken({
    idToken,
    audience: process.env.GOOGLE_CLIENT_ID,
  })
  const payload = ticket.getPayload()
  if (!payload?.sub || !payload.email || !payload.name) {
    throw new Error('Invalid Google token payload')
  }
  return { googleId: payload.sub, email: payload.email, name: payload.name }
}

export async function findOrCreateUser(googleId: string, email: string, name: string) {
  const adminEmails = (process.env.ADMIN_EMAILS ?? '').split(',').map(e => e.trim())

  return prisma.user.upsert({
    where: { googleId },
    update: { email, name },
    create: { googleId, email, name, isAdmin: adminEmails.includes(email) },
  })
}

export function issueJwt(user: { id: number; email: string; name: string; isAdmin: boolean }) {
  const jti = randomUUID()
  const token = jwt.sign(
    { sub: user.id, email: user.email, name: user.name, isAdmin: user.isAdmin, jti },
    process.env.JWT_SECRET!,
    {
      issuer: process.env.JWT_ISSUER,
      audience: process.env.JWT_AUDIENCE,
      expiresIn: process.env.JWT_EXPIRES_IN ?? '7d',
    }
  )
  return { token, jti }
}

export async function revokeToken(jti: string, expiresAt: Date) {
  await prisma.revokedToken.upsert({
    where: { jti },
    update: {},
    create: { jti, expiresAt },
  })
}
