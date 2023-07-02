import run from './lib/bot.js'
const timeOut = 1000 * 30
const delay = (time) => {
  return new Promise(resolve => {
    console.log(`Await ${time || timeOut}s`)
    setTimeout(() => resolve(true), time || timeOut)
  })
}
// /*
setInterval(async () => {
  console.log('>> ', new Date())
  // await Promise.all([
  await run('euro', 'Euro Cup')
  await delay()
  await run('copa', 'Copa do Mundo')
  await delay()
  await run('super', 'Super Liga Sul-Americana')
  await delay()
  await run('premier', 'Premier League')
  // ])
}, timeOut)
//*/

// run('euro', 'Euro Cup')
