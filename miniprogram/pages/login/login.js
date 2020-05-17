// miniprogram/pages/login/login.js

const app = getApp()

Page({
    data: {

    },

    // 第一次登录获得用户授权信息并且更新到数据库
    getUserInfo(e) {
        console.log(e);
        app.globalData.userInfo = e.detail.userInfo
        app.globalData.loginStatus = true
        // wx.cloud.callFunction({
        //     name: 'updateUser',
        //     data: {
        //         userInfo: e.detail.userInfo
        //     }
        // })
        wx.showLoading({
            title: '登录成功',
            success: () => {
                setTimeout(() => {
                    wx.redirectTo({
                        url: '../daily/daily',
                    })
                }, 1000);
            },
        })
    },

})