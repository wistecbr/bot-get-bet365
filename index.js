import run from './lib/bot.js'
import { getPage } from './lib/bot.js'
const timeOut = 1000

const delay = (time) => {
  return new Promise(resolve => {
    console.log(`Await ${(time || 1) * timeOut}ms`)
    setTimeout(() => resolve(true), (time || 1) * timeOut)
  })
}
const runAll = async () => {
  const page = await getPage()
  while (true) {
    const initTime = new Date()
    console.log('>> ', initTime)
    // await Promise.all([
    await run('euro', 'Euro Cup', page)
    // await delay()
    await run('copa', 'Copa do Mundo', page)
    // await delay()
    await run('super', 'Super Liga Sul-Americana', page)
    // await delay()
    await run('premier', 'Premier League', page)
    // ])
    const endTime = new Date()
    const difTime = endTime - initTime
    const timeDelay = (60000 - difTime) / 1000
    console.log('Took: ', difTime, ' ', timeDelay)
    await delay(timeDelay > 0 ? timeDelay : 1)
  }
}

runAll()
