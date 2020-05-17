// miniprogram/pages/anniversary/anniversary.js
import util from '../../utils/util'
Page({
    data: {
        date: null,
        test: 123123,
        anniversary: null,
        detailStatus: true,
        detailText: ''
    },
    formSubmit (e) {
        if (!e.detail.value.title) {
            wx.showToast({
                title: '事件不能为空',
                duration: 1000,
                icon: 'loading'
            })
            return
        }
        wx.cloud.callFunction({
            name: 'updateDate',
            data: e.detail.value
        }).then(res => {
            wx.showToast({
                title: '保存成功',
                duration: 1000,
                complete: (res) => {
                    setTimeout(() => {
                        wx.redirectTo({
                            url: './anniversary',
                        })
                    }, 1000)
                }
            })
        })
        
    },
    delete (e) {
        let index = e.currentTarget.dataset.index
        let deleteId = this.data.anniversary[index]._id
        wx.cloud.callFunction({
            name: 'deleteDate',
            data: {
                id: deleteId
            }
        }).then(res => {
            wx.showToast({
                title: '删除成功',
                duration: 1000,
                complete: (res) => {
                    setTimeout(() => {
                        wx.redirectTo({
                            url: './anniversary',
                        })
                    }, 1000)
                }
            })
        })
    },
    bindDateChange: function(e) {
        console.log('picker发送选择改变，携带值为', e.detail.value)
        const date =  e.detail.value
        this.setData({
            date: date + ' ' + this.isDay(new Date(date).getDay())
        })
    },
    // 判断星期几
    isDay (num) {
        const day = ['星期日','星期一','星期二','星期三','星期四','星期五','星期六',]
        return day[num]
    },
    getDate () {
        wx.cloud.callFunction({
            name: 'getDate'
        }).then(res => {
            console.log(res);
            let dateList = res.result.data.reverse()
            for (const item of dateList) {
                let nowTime = new Date().getTime()
                let endTime = new Date(item.date).getTime()
                let syTime = endTime - nowTime > 0 ? endTime - nowTime : nowTime - endTime
                let syDays = ~~(syTime / 1000 / 60 / 60 / 24)
                let statusText = endTime - nowTime > 0 ? '还有' : '已经'
                item.syDays = syDays
                item.statusText = statusText
            }
            this.setData({
                anniversary: dateList
            })
            console.log(this.data.anniversary);
        })
    },
    onLoad: function (options) {
        const date = util.formatDate(new Date())
        this.setData({
            date: date + ' ' +this.isDay(new Date().getDay())
        })
        this.getDate()
    }
})