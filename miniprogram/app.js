//app.js
App({
  onLaunch: function () {
  
    if (!wx.cloud) {
      console.error('请使用 2.2.3 或以上的基础库以使用云能力')
    } else {
      wx.cloud.init({
        // env 参数说明：
        //   env 参数决定接下来小程序发起的云开发调用（wx.cloud.xxx）会默认请求到哪个云环境的资源
        //   此处请填入环境 ID, 环境 ID 可打开云控制台查看
        //   如不填则使用默认环境（第一个创建的环境）
        // env: 'my-env-id',
        traceUser: true,
      })
    }

    this.checkSetting()

    this.globalData = {
      loginStatus: false,
      userInfo: null
    }
  },

  // 每次进入页面检查用户登录态
  checkSetting() {
    // 获取用户信息
    wx.getSetting({
      success: res => {
        // console.log('获取用户信息1' + JSON.stringify(res));
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
          wx.getUserInfo({
            lang: 'zh_CN',
            success: res => {
              // console.log('获取用户信息2' + JSON.stringify(res.userInfo) + JSON.stringify(this));
              this.globalData.userInfo = res.userInfo
              this.globalData.loginStatus = true

              // console.log(JSON.stringify(this));
              // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
              // 所以此处加入 callback 以防止这种情况
              if (this.userInfoReadyCallback) {
                this.userInfoReadyCallback(res)
              }
            }
          })
        } else {
          this.showNoLoginModal();
          // console.log('用户未登录');
        }
      },
    })
  },

  // 没有授权显示的信息
  showNoLoginModal() {
    wx.showModal({
      title: '亲爱的宝贝',
      content: '您尚未登录，要去登录吗？',
      cancelText: '随便逛逛',
      confirmText: '去登录',
      success: (res) => {
        if (res.confirm) {
          wx.navigateTo({
            url: '../login/login',
          })
          console.log('用户去授权页')
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      },
    })
  },
})