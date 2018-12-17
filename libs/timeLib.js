const moment =require('moment')
const momenttz = require('moment-timezone')

const timezone = 'Asia/Calcutta'

let now =() => {
    return moment.utc().format()
}
let getLocalTime = () => {
    return moment.tz(timezone).format()
}

let convertToLocalTime = (time) => {
    return momenttz.tz(time,timezone).format()
}

module.exports ={
    now: now,
    getLocalTime: getLocalTime,
    ConvertToLocalTime: convertToLocalTime
}