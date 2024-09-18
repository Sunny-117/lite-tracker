import Base from '~/src/commands/base'
import moment from 'moment'
import DATE_FORMAT from '~/src/constants/date_format'
import shell from 'shelljs'
import _ from 'lodash'
import env from '~/src/configs/env'
import path from 'path'
import schedule from 'node-schedule'

let projectBaseUri = path.resolve(__dirname, '../../../') // 项目所在文件夹
class TaskManager extends Base {
  static get signature () {
    return `
     Task:saveLog
     `
  }

  static get description () {
    return '任务调度主进程, 只能启动一次'
  }

  /**
   * 在最外层进行一次封装, 方便获得报错信息
   * @param args
   * @param options
   * @returns {Promise<void>}
   */
  async handle (args, options) {
    let that = this
    // 每分钟的第0秒启动
    schedule.scheduleJob('0 */1 * * * * *', function () {
      that.log('registerTaskRepeatPer1Minute 开始执行')
      that.execCommand('SaveLog:Nginx', []);
    })
  }


  async execCommand (commandName, args = []) {
    let argvString = args.map((arg) => { return `'${arg}'` }).join('   ')
    let command = `NODE_ENV=${env} node ${projectBaseUri}/dist/fee.js ${commandName}  ${argvString}`
    this.log(`待执行命令=> ${command}`)
    let commandStartAtFormated = moment().format(DATE_FORMAT.DISPLAY_BY_MILLSECOND)
    let commandStartAtms = moment().valueOf()
    shell.exec(command, {
      async: true,
      silent: true
    }, () => {
      let commandFinishAtFormated = moment().format(DATE_FORMAT.DISPLAY_BY_MILLSECOND)
      let commandFinishAtms = moment().valueOf()
      let during = (commandFinishAtms - commandStartAtms) / 1000
      this.log(`${command}命令执行完毕, 共用时${during}秒, 开始执行时间=> ${commandStartAtFormated}, 执行完毕时间=> ${commandFinishAtFormated}`)
    })
  }
}

export default TaskManager
