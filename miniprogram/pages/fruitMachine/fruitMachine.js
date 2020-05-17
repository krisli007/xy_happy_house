
let app = getApp()

Page({
    data: {
        prize: []
    },
    updatePage (e) {
        this.data.prize.unshift(e.detail)
        this.setData({
            prize: this.data.prize
        })
    },
    onLoad () {
        wx.cloud.callFunction({
            name: 'getPrize'
        }).then(res => {
            this.setData({
                prize: res.result.data.reverse()
            })
        })
    },
})
