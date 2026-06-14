import { Request, Response } from 'express'
import { createComplaint, getUserComplaints } from '../services/complaintsService'

export async function submitComplaint(req: Request, res: Response) {
  const { imei, brand, model, locationStolen } = req.body
  if (!imei || !brand || !model || !locationStolen) {
    res.status(400).json({ error: 'imei, brand, model, and locationStolen are required' })
    return
  }

  const result = await createComplaint(req.user!.sub, imei.trim(), brand.trim(), model.trim(), locationStolen.trim())
  if (result.conflict) {
    res.status(409).json({ error: 'You already have an open complaint for this device' })
    return
  }
  res.status(201).json(result.complaint)
}

export async function getMyComplaints(req: Request, res: Response) {
  const complaints = await getUserComplaints(req.user!.sub)
  res.json(complaints)
}
