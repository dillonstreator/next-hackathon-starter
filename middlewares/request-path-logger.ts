import * as express from 'express'
import logger from '../utils/logger'

export default (req: express.Request, res: express.Response, next: () => void) => {
	logger.info(`${req.method} ${req.url}`)
	next()
}
