// miniprogram/pages/sweetDaily/sweetDaily.js
const app = getApp()
const util = require('../../utils/util')

Page({

    data: {
        default: '',
        dailyList: null
    },

    formSubmit (e) {
        let content = e.detail.value.daily
        if (!content) {
            wx.showToast({
                title: '不能为空',
                duration: 1000,
                icon: 'loading'
            })
            return
        }
        this.setData({
            default: ''
        })
        wx.cloud.callFunction({
            name: 'updateDaily',
            data: {
                content: content,
                userInfo: app.globalData.userInfo,
                date: util.formatTime(new Date())
            }
        }).then(res => {
            wx.showToast({
                title: '发表成功',
                duration: 1000,
                complete: (res) => {
                    setTimeout(() => {
                        wx.redirectTo({
                            url: './sweetDaily',
                        })
                    }, 1000)
                }
            })
        })
        
    },

    getDaily () {
        wx.cloud.callFunction({
            name: 'getDaily'
        }).then(res => {
            console.log(res);
            let dailyList = res.result.data.reverse()
            this.setData({
                dailyList: dailyList
            })
        })
    },

    onLoad: function (options) {
        this.getDaily()
    },

    onShow: function () {

    },
})