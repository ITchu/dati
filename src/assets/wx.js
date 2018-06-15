import "./jquery-3.2.1"
function wxsdk(shareint){
  // var mockHost = "https://api.7tsoft.com/"; //t环境
// var mockHost = "https://api.study-test.bihaohuo.cn/"; // tp环境
var mockHost = "https://api.study.bihaohuo.cn/"; // 正式环境
  var wechat = window.wx;
  var wxconfig = null;
  var shareInfoemation= {
    title: "积土学吧知识竞赛答题共赢十万大奖，你赢我也赚！",
    desc: "每周瓜分100000大奖，呼朋唤友来抢答！",
    link:"http://m.7tsoft.com/html/activity/zhishijingsai/",
    imgUrl: "https://m.study.bihaohuo.cn/images/logo.png"
  }
  var share=shareint == undefined ? shareInfoemation : shareint;
  return {
    init:  (config, callback) =>{
      var self = this;
      // console.log(wechat);
      if (wechat) {
        $.ajax({
          url:mockHost+'JsSdk/getSignPackage',
          type:'post',
          data:{url: window.location.href},
          success:function (res) {
              wxconfig = res.data;
              // console.log(wxconfig);

              wechat.config({
                debug: true, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
                appId: wxconfig.appId, // 必填，公众号的唯一标识
                timestamp: wxconfig.timestamp.toString(), // 必填，生成签名的时间戳
                nonceStr: wxconfig.nonceStr, // 必填，生成签名的随机串
                signature: wxconfig.signature, // 必填，签名，见附录1
                jsApiList: [ // 必填，需要使用的JS接口列表，所有JS接口列表见附录2
                  "onMenuShareTimeline",
                  "onMenuShareAppMessage",
                  "onMenuShareQQ",
                  "onMenuShareWeibo",
                  "onMenuShareQZone",
                  "previewImage",
                  "checkJsApi",
                  'chooseWXPay'
                ]
              });
              wechat.ready(function () {
                console.log(wechat.ready);
                self.enabled = true;
                callback && callback({
                  success: true,
                  msg: "wechat.ready"
                });

                //第二种用法下面的ngWechat.ShareTimeline()等方法
                wechat.onMenuShareTimeline({
                  title: share.title,
                  link: share.link,
                  imgUrl: share.imgUrl,
                  success: function (e) {
                    success && success(e);
                  },
                  cancel: function (err) {
                    fail && fail(err)
                  }
                });
                wechat.onMenuShareQQ({
                  title: share.title,
                  link: share.link,
                  imgUrl: share.imgUrl,
                  success: function (e) {
                    success && success(e);
                  },
                  cancel: function (err) {
                    fail && fail(err)
                  }
                });
                wechat.onMenuShareAppMessage({
                  title: share.title,
                  desc: share.desc, // 分享描述
                  type: 'link', // 分享类型,music、video或link，不填默认为link
                  link: share.link,
                  imgUrl: share.imgUrl,
                  dataUrl: '',
                  trigger: function (e) {
                    //alert('用户点击发送给朋友');
                  },
                  success: function (e) {
                  },
                  cancel: function (err) {
                  }
                });
                wechat.onMenuShareWeibo({
                  title: share.title,
                  desc: share.desc, // 分享描述
                  imgUrl: share.imgUrl,
                  link: share.link,
                  success: function (e) {
                    // 用户确认分享后执行的回调函数
                  },
                  cancel: function (err) {
                    // 用户取消分享后执行的回调函数
                  }
                });
                wechat.onMenuShareQZone({
                  title: share.title,
                  desc: share.desc, // 分享描述
                  imgUrl: share.imgUrl,
                  link: share.link,
                  success: function (e) {
                    // 用户确认分享后执行的回调函数
                  },
                  cancel: function (err) {
                    // 用户取消分享后执行的回调函数
                  }
                });
              });
              wechat.error(function (res) {
                callback && callback({
                  success: false,
                  msg: "wechat.error"
                })
              })

          }
        })
      };
      if (window.WeixinJSBridge) {
        wxJs = window.WeixinJSBridge;
        window.document.addEventListener('WeixinJSBridgeReady', function () {
        }, false);
      };
    },
    setShare: function (config) {
      share.title = config.title || "";
      share.desc = config.desc || "";
      share.link = config.link || "";
      if(config.imgUrl){
        share.imgUrl = config.imgUrl;
      };
    },
    shareTimeline: function (success, fail) {
      // 分享到朋友圈
      if (wechat) {
        wechat.onMenuShareTimeline({
          title: share.title,
          link: share.link,
          imgUrl: share.imgUrl,
          success: function (e) {
            success && success(e);
          },
          cancel: function (err) {
            fail && fail(err)
          }
        });
      } else {
        fail && fail({
          "msg": "wechat isnt has"
        })
      }
    },
    shareMessage: function (success, fail) {
      // 分享给朋友
      wechat && wechat.onMenuShareAppMessage({
        title: share.title,
        desc: share.desc,
        link: share.link,
        imgUrl: share.imgUrl,
        type: 'link', // 分享类型,music、video或link，不填默认为link
        dataUrl: '', // 如果type是music或video，则要提供数据链接，默认为空
        success: function (e) {
          success && success(e);
        },
        cancel: function (err) {
          fail && fail(err)
        }
      });
    },
    shareqq: function () {
      // 分享到QQ
      wechat && wechat.onMenuShareQQ({
        title: share.title,
        desc: share.desc,
        link: share.link,
        imgUrl: share.imgUrl,
        success: function () {

        },
        cancel: function () {

        }
      });
    },
    shareweibo: function () {
      // 分享到微博
      wechat && wechat.onMenuShareWeibo({
        title: share.title,
        desc: share.desc,
        link: share.link,
        imgUrl: share.imgUrl,
        success: function () {

        },
        cancel: function () {

        }
      });
    },
    shareqzone: function () {
      //分享到QQ空间
      wechat && wechat.onMenuShareQZone({
        title: share.title,
        desc: share.desc,
        link: share.link,
        imgUrl: share.imgUrl,
        success: function () {

        },
        cancel: function () {

        }
      });
    }
  }

}
export default wxsdk;

