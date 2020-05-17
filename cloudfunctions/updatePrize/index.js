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
        return pushPrize(event, OPENID)
    } catch (error) {
        console.error(error)
    }
}

function pushPrize(e, OPENID) {
    try {
        return db.collection('prize').add({
            data: {
                content: e.content,
                date: e.date,
                userInfo: e.userInfo,
                _openid: OPENID
            }
        })
    } catch (error) {
        console.error(error);
    }
}