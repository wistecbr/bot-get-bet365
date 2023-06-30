import run from './lib/bot.js'
const timeOut = 1000 * 30

setInterval(async () => {
  console.log('>> ', new Date())
  await Promise.all([
    run('euro', 'Euro Cup'),
    // run('copa', 'Copa do Mundo'),
    // run('super', 'Super Liga Sul-Americana'),
    // run('premier', 'Premier League')
  ])
}, timeOut)

// run('euro', 'Euro Cup')
