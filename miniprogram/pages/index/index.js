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
    itemA: '李贵星',
    itemB: '宋闵浩',
    question: false
  },
  clickAnswer (e) {
    const index = e.currentTarget.dataset.index
    if (index === '1') {
      wx.showModal({
        title: '你答对啦',
        content: '没有人比李贵星更爱你了',
        confirmText: '我知道了',
        showCancel: false
      })
    } else {
      wx.showModal({
        title: '你答错啦',
        content: '你要记住李贵星才是最爱你的人',
        confirmText: '我错啦',
        showCancel: false
      })
    }
    this.setData({
      question: true
    })
  },
  // 去日志页
  toDaily () {
    if (app.globalData.loginStatus) {
      wx.navigateTo({
        url: '../daily/daily',
      })
    } else {
      app.showNoLoginModal()
    }
  },
  toAnniversary () {
    if (app.globalData.loginStatus) {
      wx.navigateTo({
        url: '../anniversary/anniversary',
      })
    } else {
      app.showNoLoginModal()
    }
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