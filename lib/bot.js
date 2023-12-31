import { firefox } from 'playwright-firefox'
import dotenv from 'dotenv'
import Db from './database.js'
const isTest = process.env.TEST && process.env.TEST !== ''
const dir = !isTest ? '/home/wisley/projetos/bot-get-bet365/' : './'
if (isTest) {
  dotenv.config()
} else {
  dotenv.config({ path: dir + '.env' })
}

const sendApiEnable = !(process.env.API_DISABLE && process.env.API_DISABLE === 'true')

console.log('>APi Enable ', sendApiEnable)

const browserShow = !(process.env.BROWSER_SHOW && process.env.BROWSER_SHOW === 'true')
console.log('>> ', browserShow)

const baseUrlApi = process.env.BASE_URL || 'https://api-bot.wis.tec.br'

const timeOut = 1000
const defaultDelay = 15

const color = {
  euro: '\x1b[31m',
  super: '\x1b[32m',
  copa: '\x1b[33m',
  premier: '\x1b[34m'
}

const sendApi = async (data, collection) => {
  if (sendApiEnable) {
    try {
      const body = JSON.stringify(data)
      const resp = await fetch (
        `${baseUrlApi}${collection ? `/v2/${collection}` : '/webhook'}`,
        {
          headers: {
            'Content-type': 'application/json',
            'x-token-tips': process.env.TOKENBET365
          },
          method: 'POST',
          body
        }
      )

      console.log(`${color[collection || data.campeonato]}>> Send Api ${body}`)
      return resp
    } catch (err) {
      console.error(err)
    }
  } else {
    console.log(`${color[collection || data.campeonato]}>> APi Disable`)
  }
}

const delay = (time) => {
  return new Promise(resolve => {
    console.log(`Await ${(time || 1) * timeOut}ms`)
    setTimeout(() => resolve(true), (time || 1) * timeOut)
  })
}

const getPage = async (campeonato) => {
  console.log(`${color[campeonato]}>(${campeonato}) Criando Browser`)
  const browser = await firefox.launch({
    headless: browserShow
  })

  const page = await browser.newPage({
    userAgent: 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/16.4 Safari/605.1.15'
  })

  return { page, browser }
}

const run = async (campeonato, nomeCampeonato) => {
  // return new Promise(async (resolve) => {
  const dbErros = new Db(`${dir}data/error/${campeonato}.json`, { erros: [] })
  const tableErros = 'erros'
  // let i = 0
  while (true) {
    const { page, browser } = await getPage(campeonato)
    const hoje = new Date()
    let jogo
    // let lastJogo
    try {
      // i += 1
      // console.log(`${color[campeonato]}(${campeonato}) Carregando Banco de dados ...`)
      // const db = new Db(`${dir}data/${campeonato}.json`, { jogos: [] })
      // const table = 'jogos'
      console.log(`${color[campeonato]}(${campeonato}) Iniciando browser... `)
      // throw new Error('Test')

      await page.goto('https://www.bet365.com/#/AVR/B146/R^1/')
      await page.waitForLoadState('networkidle')

      await page.getByText(nomeCampeonato).click()
      // console.log('Buscando resultado ... ')
      await page.waitForTimeout(2000)
      await page.getByText('Resultados').first().click()
      console.log(`${color[campeonato]}(${campeonato}) Capturando resultado ...`)

      // FixtureDetails_Event
      // vrr-HTHTeamDetails_TeamOne
      // vrr-HTHTeamDetails_Score
      // vrr-HTHTeamDetails_TeamTwo

      const event = (await page.locator('.vrr-FixtureDetails_Event').first().textContent()).split(' - ')
      const [horaS, minutoS] = event[1].split('.')
      const hora = parseInt(horaS)
      const minuto = parseInt(minutoS)

      const placar = (await page.locator('.vrr-HTHTeamDetails_Score').first().textContent())
      const [placarCasaS, placarForaS] = placar.split(' - ')
      const placarCasa = parseInt(placarCasaS)
      const placarFora = parseInt(placarForaS)

      const timeCasa = (await page.locator('.vrr-HTHTeamDetails_TeamOne').first().textContent())
      const timeFora = (await page.locator('.vrr-HTHTeamDetails_TeamTwo').first().textContent())

      jogo = {
        id: hoje.getTime(),
        createdAt: hoje.toISOString(),
        hora,
        minuto,
        placarCasa,
        placarFora,
        campeonato,
        timeCasa,
        timeFora
      }
      // const all = await db.selectAll(table)
      // lastJogo = all.length && all[all.length - 1]
      // console.log('>> ', lastJogo)
      // const jogoExist = await db.findByTimeExact(table, hora, minuto, hoje.getDate(), hoje.getMonth())
      // console.log('>> ', jogoExist)
      // if (jogoExist) {
      //   console.log(`${color[campeonato]}(${campeonato}) Jogo exite no banco`)
      // } else {
      // if (!lastJogo || ((lastJogo.minuto + 3) % 60 <= jogo.minuto)) {
      // console.log('>> ', t)
      // await db.insert(table, jogo)
      // console.log(`${color[campeonato]}(${campeonato}) Jogo SALVO com sucesso`)
      // console.log(`${color[campeonato]}>(${campeonato})`, hoje, ' ', i)
      const data = await sendApi({ ...jogo, isTest }, campeonato)
      // console.log('>>> ', data)
      if (data.status < 300) {
        console.log(`${color[campeonato]}(${campeonato}) Jogo SALVO com sucesso`)
        sendApi({ campeonato, datetime: Date.now(), isTest })
      } else {
        console.log(`${color[campeonato]}(${campeonato}) ${await data.json()}`)
        throw new Error(`${data.status} => ${(await data.json()).message}`)
      }
      // } else {
      //   const nameError = `Data de jogo incompativel ${(lastJogo.minuto + 3) % 60} != ${jogo.minuto}`
      //   console.log(`${color[campeonato]} X ${nameError}`)
      //   throw new Error(nameError)
      // }
      // }
    } catch (error) {
      // console.log('', error.stack)
      const data = {
        id: Date.now(),
        times: [new Date().toISOString()],
        name: error.message,
        error: error.stack,
        jogo
      }
      const exists = await dbErros.findObjValue(tableErros, 'error', error.stack)

      if (!exists) {
        await dbErros.insert(tableErros, data)
      } else {
        const { times } = exists

        times.push(new Date().toISOString())

        await dbErros.update(tableErros, exists)
      }
    }
    await browser.close()
    const timeExec = (new Date().getTime() - hoje.getTime()) / 1000
    const timeDelay = (defaultDelay - timeExec) > 0 ? (defaultDelay - timeExec) : 0
    console.log(`${color[campeonato]}took (${campeonato}): ${timeExec}s`)
    await delay(timeDelay)
  }
}

export default run
