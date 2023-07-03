import run, { getPage } from './lib/bot.js'

const runAll = async () => {
  run('euro', 'Euro Cup')

  run('copa', 'Copa do Mundo')

  run('super', 'Super Liga Sul-Americana')

  run('premier', 'Premier League')
}


runAll()

// run('premier', 'Premier League')
