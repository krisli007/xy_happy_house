// components/prize/prize.js

const util = require('../../utils/util')
const app = getApp()
Component({
    properties: {
    },

    data: {
        isStart: true,
        id: 0,
        prize: ['','给lgx加鸡腿','请lyy看电影','请lyy吃一顿饭','打lgx一顿','抱抱','给lyy泡脚按摩','亲亲','打lgx一顿',],
        time: null,
        prizeStatus: null,
        remainTime: null
    },

    methods: {
        startPrize () {
            if (this.data.isStart || this.data.prizeStatus === 0) {
                wx.showModal({
                    title: '今日已抽奖！',
                    content: '明日再来哦~',
                    confirmText: '确定',
                    showCancel: false
                })
                return
            }
            
            this.setData({
                isStart: true
            })
            // 开始抽奖逻辑
            const random = Math.floor(Math.random()*10)
            const range = random === 9 || random === 0 ? 18 : random + 16
            let count = 0
            const content = this.data.prize[random]
            // 定时器
            const iid = setInterval(() => {
                count = count + 1
                this.setData({
                    id: this.data.id + 1 === 9 ? 1 : this.data.id + 1
                })
                if (count === range) {
                    clearInterval(iid)
                    wx.showModal({
                        title: '恭喜你中奖啦！',
                        content: content,
                        confirmText: '确定',
                        showCancel: false,
                        complete: () => {
                            this.updatePrize(content)
                        }
                    })
                }
            }, 200)
        },

        updatePrize (content) {
            const data = {
                content: content,
                date: util.formatTime(new Date()),
                userInfo: app.globalData.userInfo
            }
            wx.cloud.callFunction({
                name: 'updateUser'
            }).then((res) => {
                console.log('更新用户信息' + JSON.stringify(res))
            })
            wx.cloud.callFunction({
                name: 'updatePrize',
                data: data
            }).then(() => {
                this.triggerEvent('updatePage', data)
            })

            this.setData({
                prizeStatus: 0,
                remainTime: 86400
            })
            setInterval(() => {
                this.setData({
                    remainTime: this.data.remainTime - 1
                })
            }, 1000);
        }
    },

    lifetimes: {
        attached: function() {
            wx.cloud.callFunction({
                name: 'getUser'
            }).then((res) => {
                if (!res.result.prizeStatus) {
                    let remainTime = Math.floor(res.result.remainTime / 1000) || 0
                    this.setData({
                        prizeStatus: res.result.prizeStatus,
                        remainTime: remainTime
                    })
                    const iid2 = setInterval(() => {
                        console.log(this.data.remainTime)
                        
                        if (this.data.remainTime === 0) {
                            this.setData({
                                isStart: false,
                                prizeStatus: 1
                            })
                            clearInterval(iid2)
                        }
                        this.setData({
                            remainTime: this.data.remainTime - 1
                        })
                    }, 1000);
                    console.log('用户是否能够抽奖' + JSON.stringify(res.result))
                }
            })
        },
        detached: function() {
            
        },
    }
})
