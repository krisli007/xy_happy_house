// miniprogram/pages/daily/daily.js
Page({

    /**
     * 页面的初始数据
     */
    data: {
        test: ''
    },
    submitDaily (e) {
        console.log(e);
        this.setData({
            test: e.detail.value
        })
    },
    toFruitMachine () {
        wx.navigateTo({
          url: '../fruitMachine/fruitMachine',
        })
    },
    toSweetDaily () {
        wx.navigateTo({
          url: '../sweetDaily/sweetDaily',
        })
    },
    toAnniversary () {
        wx.navigateTo({
          url: '../anniversary/anniversary',
        })
    },
    toMore () {
        wx.showModal({
            title: '正在研发中',
            content: '不要催啦！暂时想不到啦！',
            confirmText: '好的好的',
            showCancel: false
        })
    }
})