import ParseBase from '~/src/commands/parse/base'
import moment from 'moment'
import _ from 'lodash'
import MUvRecord from '~/src/model/parse/uv_record'
import DATE_FORMAT from '~/src/constants/date_format'

class ParseUV extends ParseBase {
  static get signature () {
    return `
     Parse:UV 
     {startAtYmdHi:日志扫描范围上限${DATE_FORMAT.COMMAND_ARGUMENT_BY_MINUTE}格式}
     {endAtYmdHi:日志扫描范围下限${DATE_FORMAT.COMMAND_ARGUMENT_BY_MINUTE}格式}
     `
  }

  static get description () {
    return '[按小时] 解析nginx日志, 分析记录指定时间范围内的uv'
  }

  /**
   * 判断该条记录是不是uv记录
   * @param {Object} record
   * @return {Boolean}
   */
  isLegalRecord (record) {
    return true
  }

  /**
   * 更新记录
   */
  async processRecordAndCacheInProjectMap (record) {
    let commonInfo = _.get(record, ['common'], {})
    let uuid = _.get(commonInfo, ['uuid'], '')
    let visitAt = _.get(record, ['time'], 0)
    let projectId = _.get(record, ['project_id'], 0)
    let country = _.get(record, ['country'], '')
    let province = _.get(record, ['province'], '')
    let city = _.get(record, ['city'], '')
    //this.log('uv record',record);
    
    let pvCount = 1
    if (_.isNumber(visitAt) === false || visitAt === 0 || _.isEmpty(uuid)) {
      this.log(`数据不合法, 自动跳过 visitAt => ${visitAt}, uuid => ${uuid}`)
      return false
    }
    let visitAtHour = moment.unix(visitAt).format(DATE_FORMAT.DATABASE_BY_MINUTE)
    let uvRecord = {
      projectId,
      visitAt,
      uuid,
      country,
      province,
      city,
      pvCount
    }
    this.log('uvRecord',uvRecord);
    let visitAtMap = new Map()
    let uvMap = new Map()
    if (this.projectMap.has(projectId)) {
      visitAtMap = this.projectMap.get(projectId)
      if (visitAtMap.has(visitAtHour)) {
        uvMap = visitAtMap.get(visitAtHour)
        if (uvMap.has(uuid)) {
          let oldUvRecord = uvMap.get(uuid)
          uvRecord.pvCount = oldUvRecord.pvCount + uvRecord.pvCount
        }
      }
    }
    this.log('uuid, uvRecord ',uuid, uvRecord);
    uvMap.set(uuid, uvRecord)
    //this.log('uvRecord',uvRecord);
    this.log('visitAtHour, uvMap',visitAtHour, uvMap);
    visitAtMap.set(visitAtHour, uvMap)
    this.log('uvMap.size ',uvMap.size);
    this.log('before this.projectMap',this.projectMap,projectId,visitAtMap);
    this.projectMap.set(projectId, visitAtMap);
    this.log('after this.projectMap',this.projectMap);
    return true
  }

  /**
   * 将数据同步到数据库中
   */
  async save2DB () {
    let totalRecordCount = this.getRecordCountInProjectMap()
    let processRecordCount = 0
    let successSaveCount = 0
    this.log('this.projectMap.size',this.projectMap.size);
    
    for (let [projectId, visitAtMap] of this.projectMap) {
      for (let [visitAtHour, uvMap] of visitAtMap) {
        let visitAtInDb = moment(visitAtHour, DATE_FORMAT.DATABASE_BY_MINUTE).unix();
        this.log('visitAtInDb ',visitAtInDb );
        let existUuidSet = await MUvRecord.getExistUuidSetInHour(projectId, visitAtInDb);
        this.log('existUuidSet.size ',existUuidSet.size );
        for (let [key, uvRecord] of uvMap) {
          this.log('uuid, uvRecord  ',key, uvRecord );
          let {
            projectId,
            visitAt,
            uuid,
            country,
            province,
            city
          } = uvRecord
          let isSuccess = false
          uuid = `${uuid}` // 转成string
          this.log('existUuidSet.has(uuid) ',existUuidSet.has(uuid));
          if (existUuidSet.has(uuid) === false) {
            // 只有当uuid不存在时才插入
            isSuccess = await MUvRecord.replaceUvRecord(projectId, uuid, visitAt, country, province, city)
            // 插入完成后, 把uuid再补进去(意义不大, 只为了增强稳定性)
            existUuidSet.add(uuid)
          }
          processRecordCount = processRecordCount + 1
          if (isSuccess) {
            successSaveCount = successSaveCount + 1
          }
          this.reportProcess(processRecordCount, successSaveCount, totalRecordCount)
        }
      }
    }
    return { totalRecordCount, processRecordCount, successSaveCount }
  }

  /**
   * 统计 projectUvMap 中的记录总数
   */
  getRecordCountInProjectMap () {
    let totalCount = 0
    for (let [projectId, visitAtMap] of this.projectMap) {
      for (let [visitAtHour, uvMap] of visitAtMap) {
        for (let [uv, uvRecord] of uvMap) {
          totalCount = totalCount + 1
        }
      }
    }
    return totalCount
  }
}

export default ParseUV
