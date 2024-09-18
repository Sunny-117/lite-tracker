let moment = require('moment');
const COMMAND_ARGUMENT_BY_MINUTE = 'YYYY-MM-DD HH:mm';
const UNIT = {}
UNIT.YEAR = 'year'
UNIT.MONTH = 'month'
UNIT.DAY = 'day'
UNIT.HOUR = 'hour'
UNIT.MINUTE = 'minute'
UNIT.SECOND = 'second'
UNIT.MILLSECOND = 'millsecond' // countType最大支持10位字符串;
let nowByMinute = moment().format(COMMAND_ARGUMENT_BY_MINUTE)
console.log('nowByMinute',nowByMinute);
let lastDayStartAtByMinute = moment().subtract(1, UNIT.DAY).startOf(UNIT.DAY).format(COMMAND_ARGUMENT_BY_MINUTE)
console.log('lastDayStartAtByMinute',lastDayStartAtByMinute);
