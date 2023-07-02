import run from './lib/bot.js'
const timeOut = 1000 * 30
// /*
setInterval(async () => {
  console.log('>> ', new Date())
  // await Promise.all([
  await run('euro', 'Euro Cup')
  await run('copa', 'Copa do Mundo')
  await run('super', 'Super Liga Sul-Americana')
  await run('premier', 'Premier League')
  // ])
}, timeOut)
//*/

// run('euro', 'Euro Cup')
