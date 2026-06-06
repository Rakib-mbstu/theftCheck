import { Request, Response } from 'express'
import { searchByImei } from '../services/searchService'

export async function searchDevice(req: Request, res: Response) {
  const imei = (req.query.imei as string)?.trim()
  if (!imei) {
    res.status(400).json({ error: 'imei query parameter is required' })
    return
  }

  const result = await searchByImei(imei)
  if (!result) {
    res.status(404).json({ error: 'No device found with that IMEI' })
    return
  }

  res.json(result)
}
