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
    await Promise.all([
      run('euro', 'Euro Cup'),
      // await delay()
      run('copa', 'Copa do Mundo'),
      // await delay()
      run('super', 'Super Liga Sul-Americana'),
      // await delay()
      run('premier', 'Premier League')
    ])
    const endTime = new Date()
    const difTime = endTime - initTime
    const timeDelay = (60000 - difTime) / 1000
    console.log('Took: ', difTime, ' ', timeDelay)
    await delay(timeDelay > 0 ? timeDelay : 1)
  }
}

runAll()
