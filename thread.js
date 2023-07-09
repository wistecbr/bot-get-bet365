import { Worker } from 'worker_threads'

const isTest = process.env.TEST && process.env.TEST !== ''
const __dirname = !isTest ? '/home/wisley/projetos/bot-get-bet365/' : process.cwd()

const startWorker = (path, campeonato, nomeCampeonato, cb) => {
  const worker = new Worker(path, { workerData: { campeonato, nomeCampeonato } })
  worker.on('message', (msg) => {
    cb(null, msg)
  })
  worker.on('error', cb)
  worker.on('exit', (code) => {
    if (code !== 0) console.error(new Error(`Worker finalizado com exit code = ${code}`))
  })
  return worker
}

console.log('Thread principal')

const callbackWorker = (err, result) => {
  if (err) return console.error(err)
  // console.log("** COMPUTAÇÃO PESADA FINALIZADA **")
  console.log(`>(${result.campeonato}) Duração = ${(result.end - result.start) / 1000} segundos`)
}

// Inicia o worker em outra thread
startWorker(__dirname + '/lib/worker.js', 'premier', 'Premier League', callbackWorker)
if (!isTest) {
  startWorker(__dirname + '/lib/worker.js', 'euro', 'Euro Cup', callbackWorker)
  startWorker(__dirname + '/lib/worker.js', 'copa', 'Copa do Mundo', callbackWorker)
  startWorker(__dirname + '/lib/worker.js', 'super', 'Super Liga Sul-Americana', callbackWorker)
}
