// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()

const db = cloud.database()
const _ = db.command

// 云函数入口函数
exports.main = async (event, context) => {
    try {
        const wxContext = cloud.getWXContext()
        const { OPENID } = wxContext
        return getUser(event, OPENID)
    } catch (error) {
        console.error(error)
    }
}

function getUser(e, OPENID) {
    // 1.每次进入页面判断用户状态
    // 2.首先判断有无用户
    // 3.增加用户状态
    // 4.返回结果
    try {
        return db.collection('user').where({
            _openid: OPENID,
        }).get().then(res => {
            // 每次进入页面都会判断
            if (res.data.length === 0) {
                // 用户未抽过奖，不执行操作
                return 0
            } else {
                const nowTime = new Date().getTime()
                const startTime = res.data[0].prizeTimeStamp
                const remainTime = 86400000 - nowTime + startTime
                return nowTime - startTime >= 86400000 ? 1 : {prizeStatus:0 , remainTime}
            }
        })
    } catch (error) {
        console.error(error)
    }
}