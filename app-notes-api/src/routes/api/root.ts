import { Router, Request, Response } from 'express'
import path from 'path'

const router: Router = Router()

router.get('^/$|/index(.html)?', (_req: Request, res: Response): void => {
    res.sendFile(path.join(__dirname, '..', '..', '..', 'views', 'index.html'))
})

export default router
