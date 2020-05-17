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
        return updateDate(event, OPENID)
    } catch (error) {
        console.error(error)
    }
}

function updateDate(e, OPENID) {
    try {
        let title = e.title
        let date = e.date.substr(0,10)
        let day = e.date.substr(-3)
        return db.collection('anniversary').add({
            data: {
                title: title,
                date: date,
                day: day,
                _openid: OPENID,
                syDays: 0,
                statusText: '还有'
            }
        })
    } catch (error) {
        console.error(error);
    }
}