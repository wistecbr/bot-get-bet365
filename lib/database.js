import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

import { Low } from 'lowdb'
import { JSONFile } from 'lowdb/node'

// db.json file path
const __dirname = dirname(fileURLToPath(import.meta.url))

class Db {
  //propriedades e funções da classe aqui
  constructor(file, defaultData) {
    this.file = join(__dirname, file);
    this.defaultData = defaultData;
    this.adapter = new JSONFile(file)
    this.db = new Low(this.adapter, defaultData)
  }

  async selectAll(table) {
    await this.db.read()
    return this.db.data[`${table}`]
  }

  async insert(table, body) {
    await this.db.read()
    this.db.data[table].push(body)
    await this.db.write()
  }

  async findById(table, id) {
    await this.db.read()
    const data = this.db.data[`${table}`]
    return data.find(obj => obj.id === id)
  }

  async findByTime(table, hora, minuto) {
    await this.db.read()
    const data = this.db.data[`${table}`]
    const all = []
    // return data.find(obj => obj.hora === hora && obj.minuto === minuto && new Date(day).getDate() === day)
    data.forEach(obj => {
      if (obj.hora === hora && obj.minuto === minuto) {
        all.push(obj)
      }
    });
    return all
  }

  async findByTimeExact(table, hora, minuto, day, month) {
    await this.db.read()
    const data = this.db.data[`${table}`]
    let jogo
    for (let i = 0; i < data.length; i++) {
      const obj = data[i]
      const jogoDate = new Date(obj.id)
      if (obj.hora === hora && obj.minuto === minuto
        && jogoDate.getDate() === day
        && jogoDate.getMonth() === month) {
        jogo = obj
        break;
      }
    }
    return jogo
  }

  async findObjValue(table, name, value) {
    await this.db.read()
    const data = this.db.data[`${table}`]
    return data.find(obj => obj[name] === value)
  }

  async update(table, body) {
    await this.db.read()
    const data = this.db.data[`${table}`]
    const index = data.findIndex(obj => obj.id === body.id)
    data[index] = body
    this.db.data = { [table]: data }
    await this.db.write()
  }

  async remove(table, body) {
    await this.db.read()
    const data = this.db.data[`${table}`]
    const index = data.findIndex(obj => obj.id === body.id)
    data.splice(index, 1)
    this.db.data = { [table]: data }
    await this.db.write()
  }


}

export default Db
