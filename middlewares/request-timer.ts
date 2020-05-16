import * as express from 'express'
import logger from '../utils/logger'

export default (req: express.Request, res: express.Response, next) => {
	const startHrTime = process.hrtime()
	res.on('finish', () => {
		const elapsedHrTime = process.hrtime(startHrTime)
		const elapsedTimeInMs = elapsedHrTime[0] * 1000 + elapsedHrTime[1] / 1e6
		logger.info(`elapsed request time: ${elapsedTimeInMs}ms`)
	})
	next()
}
