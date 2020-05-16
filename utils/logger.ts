
const rTracer = require('cls-rtracer')

const printId = () => {
	const id = rTracer.id()
	return id ? `[${id}]` : ''
}

export default {
	error: (...msg: any[]) => console.log(`[ ERROR ]${printId()}`, ...msg),
	info: (...msg: any[]) => console.info(`[ INFO  ]${printId()}`, ...msg),
}
