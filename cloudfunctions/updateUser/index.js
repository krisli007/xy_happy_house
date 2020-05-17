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
        return updateUser(event, OPENID)
    } catch (error) {
        console.error(error)
    }
}

function updateUser(e, OPENID) {
    // 1.每次进入页面判断用户状态
    // 2.首先判断有无用户
    // 3.增加用户状态
    // 4.返回结果
    try {
        return db.collection('user').where({
            _openid: OPENID,
        }).get().then(res => {
            // 第一次抽奖
            if (res.data.length === 0) {
                db.collection('user').add({
                    data: {
                        _openid: OPENID,
                        prizeTimeStamp: new Date().getTime(),
                        prizeStatus: 0
                    }
                })
                return '用户第一次抽奖，添加成功'
            } else {
                db.collection('user').where({
                    _openid: OPENID,
                }).update({
                    data: {
                        prizeTimeStamp: new Date().getTime()
                    },
                })
                return '用户再次抽奖，更新成功'
            }
        })
    } catch (error) {
        console.error(error)
    }
}