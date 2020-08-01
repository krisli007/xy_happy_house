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
        return updateDaily(event, OPENID)
    } catch (error) {
        console.error(error)
    }
}

function updateDaily(e, OPENID) {
    try {
        let content = e.content
        let userInfo = e.userInfo
        let date = e.date
        return db.collection('daily').add({
            data: {
                date: date,
                _openid: OPENID,
                content: content,
                userInfo: userInfo
            }
        })
    } catch (error) {
        console.error(error);
    }
}