//index.js
const app = getApp()

Page({
  data: {
    logged: false,
    takeSession: false,
    openid: '',
    countUp: '',
    countDown: '',
    // 轮播图
    banner: {
        list: [
            '../../images/swiper1.jpg',
            '../../images/swiper2.jpg',
            '../../images/swiper3.jpg',
            '../../images/swiper4.jpg',
            '../../images/swiper5.jpg'
        ],
        indicatorDots: true,
        autoplay: true,
        interval: 4000,
        duration: 1000,
        circular: true
    },
  },
  toDaily () {
    wx.navigateTo({
      url: '../daily/daily',
    })
  },

  onGetUserInfo: function (e) {
    if (!this.data.logged && e.detail.userInfo) {
      this.setData({
        logged: true,
        avatarUrl: e.detail.userInfo.avatarUrl,
        userInfo: e.detail.userInfo
      })
    }
  },

  onGetOpenid: function () {
    // 调用云函数
    wx.cloud.callFunction({
      name: 'login',
      data: {},
      success: res => {
        console.log('[云函数] [login] user openid: ', res.result.openid)
        this.setData({
          openid: res.result.openid
        })
      },
      fail: err => {
        console.error('[云函数] [login] 调用失败', err)
        wx.navigateTo({
          url: '../deployFunctions/deployFunctions',
        })
      }
    })
  },

  // 上传图片
  doUpload: function () {
    // 选择图片
    wx.chooseImage({
      count: 1,
      sizeType: ['compressed'],
      sourceType: ['album', 'camera'],
      success: function (res) {

        wx.showLoading({
          title: '上传中',
        })

        const filePath = res.tempFilePaths[0]

        // 上传图片
        const cloudPath = 'my-image' + filePath.match(/\.[^.]+?$/)[0]
        wx.cloud.uploadFile({
          cloudPath,
          filePath,
          success: res => {
            console.log('[上传文件] 成功：', res)

            app.globalData.fileID = res.fileID
            app.globalData.cloudPath = cloudPath
            app.globalData.imagePath = filePath

            wx.navigateTo({
              url: '../storageConsole/storageConsole'
            })
          },
          fail: e => {
            console.error('[上传文件] 失败：', e)
            wx.showToast({
              icon: 'none',
              title: '上传失败',
            })
          },
          complete: () => {
            wx.hideLoading()
          }
        })

      },
      fail: e => {
        console.error(e)
      }
    })
  },

  onLoad: function () {

    // 计算时间
    let nowTime = new Date()
    let nowTimeStamp = nowTime.getTime()
    let startTime = new Date('2017/10/09').getTime()
    let passTime = nowTimeStamp - startTime
    let passDay = ~~(passTime / 1000 / 60 / 60 / 24)
    
    let countTime = new Date()
    let hour = countTime.getHours() < 10 ? '0' + countTime.getHours() : countTime.getHours()
    let minute = countTime.getMinutes() < 10 ? '0' + countTime.getMinutes() : countTime.getMinutes()
    let second = countTime.getSeconds() < 10 ? '0' + countTime.getSeconds() : countTime.getSeconds()
    let nowConutDown = `${hour}:${minute}:${second}`
    this.setData({
      countUp: passDay,
      countDown: nowConutDown
    })
    setInterval(() => {
      let countTime = new Date()
      let hour = countTime.getHours() < 10 ? '0' + countTime.getHours() : countTime.getHours()
      let minute = countTime.getMinutes() < 10 ? '0' + countTime.getMinutes() : countTime.getMinutes()
      let second = countTime.getSeconds() < 10 ? '0' + countTime.getSeconds() : countTime.getSeconds()
      let newConutDown = `${hour}:${minute}:${second}`

      this.setData({
        countDown: newConutDown
      })
    }, 1000);
    console.log(nowTime, startTime, );


    // 获取用户信息
    wx.getSetting({
      success: res => {
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
          wx.getUserInfo({
            success: res => {
              this.setData({
                avatarUrl: res.userInfo.avatarUrl,
                userInfo: res.userInfo
              })
            }
          })
        }
      }
    })
  },
})