import { Request, Response } from 'express'
import jwt from 'jsonwebtoken'
import { verifyGoogleToken, findOrCreateUser, issueJwt, revokeToken } from '../services/authService'
import { AuthPayload } from '../middleware/auth'

export async function googleLogin(req: Request, res: Response) {
  const { idToken } = req.body
  if (!idToken) {
    res.status(400).json({ error: 'idToken is required' })
    return
  }

  try {
    const { googleId, email, name } = await verifyGoogleToken(idToken)
    const user = await findOrCreateUser(googleId, email, name)
    const { token } = issueJwt(user)

    res.json({ token, name: user.name, email: user.email, isAdmin: user.isAdmin })
  } catch (err) {
    res.status(401).json({ error: 'Invalid Google token' })
  }
}

export async function logout(req: Request, res: Response) {
  const user = req.user as AuthPayload
  try {
    const decoded = jwt.decode(req.headers.authorization!.slice(7)) as { exp?: number; jti?: string }
    if (decoded?.jti && decoded?.exp) {
      await revokeToken(decoded.jti, new Date(decoded.exp * 1000))
    }
  } catch {
    // Token already invalid — nothing to revoke
  }
  res.status(204).send()
}
