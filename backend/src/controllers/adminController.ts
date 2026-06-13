import { Request, Response } from 'express'
import { getAllComplaints, updateComplaintStatus } from '../services/complaintsService'
import { getAllUsers, setUserAdmin } from '../services/usersService'

export async function getComplaints(req: Request, res: Response) {
  const complaints = await getAllComplaints()
  res.json(complaints)
}

export async function approveComplaint(req: Request, res: Response) {
  const complaint = await updateComplaintStatus(parseInt(req.params.id), 'Approved')
  if (!complaint) { res.status(404).json({ error: 'Complaint not found' }); return }
  res.json(complaint)
}

export async function rejectComplaint(req: Request, res: Response) {
  const complaint = await updateComplaintStatus(parseInt(req.params.id), 'Rejected')
  if (!complaint) { res.status(404).json({ error: 'Complaint not found' }); return }
  res.json(complaint)
}

export async function resolveComplaint(req: Request, res: Response) {
  const complaint = await updateComplaintStatus(parseInt(req.params.id), 'Resolved')
  if (!complaint) { res.status(404).json({ error: 'Complaint not found' }); return }
  res.json(complaint)
}

export async function getUsers(req: Request, res: Response) {
  const users = await getAllUsers()
  res.json(users)
}

export async function updateUserAdmin(req: Request, res: Response) {
  const { isAdmin } = req.body
  if (typeof isAdmin !== 'boolean') {
    res.status(400).json({ error: 'isAdmin must be a boolean' })
    return
  }
  const user = await setUserAdmin(parseInt(req.params.id), isAdmin)
  if (!user) { res.status(404).json({ error: 'User not found' }); return }
  res.json(user)
}
