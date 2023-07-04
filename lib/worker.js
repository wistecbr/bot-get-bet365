import { parentPort, workerData } from 'worker_threads'
import run from './bot.js'


const start = Date.now()
const { campeonato, nomeCampeonato } = workerData
run(campeonato, nomeCampeonato)

parentPort.postMessage({ start, end: Date.now(), campeonato })
