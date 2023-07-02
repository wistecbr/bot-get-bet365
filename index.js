import run from './lib/bot.js'
const timeOut = 1000

const delay = (time) => {
  return new Promise(resolve => {
    console.log(`Await ${(time || 1) * timeOut}ms`)
    setTimeout(() => resolve(true), (time || 1) * timeOut)
  })
}
const runAll = async () => {
  while (true) {
    const initTime = new Date()
    console.log('>> ', initTime)
    await run('euro', 'Euro Cup')
    // await delay()
    await run('copa', 'Copa do Mundo')
    // await delay()
    await run('super', 'Super Liga Sul-Americana')
    // await delay()
    await run('premier', 'Premier League')
    const endTime = new Date()
    const difTime = endTime - initTime
    console.log('Took: ', difTime)
    await delay(10)
  }
}

runAll()
