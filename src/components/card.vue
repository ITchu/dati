<template>
  <div class="res-card">
      <main>
          <div class="top">
              <img src="../assets/img/icon_gift.png" alt="">
              <p class="join_chances">{{join_chances}}</p>
            <p>每周邀请累计3人注册即可获得1次进场参与答题的机会，多邀请多得，参与1场答题即使用1次</p>
          </div>
          <div class="center">
            <img src="../assets/img/icon_heart.png" alt="">
            <p class="revive_num">{{revive_num}}</p>
            <p>每场最多可使用1次复活机会，答错自动使用</p>
          </div>
          <div class="bottom">
            <img src="../assets/img/resurrection4.png" alt="">
            <p>活动开始时间起,每场/周答题累计邀请3位好友注册积土学吧即可获得1次复活机会和1次进场答题的机会，多邀请多得。</p>
            <div class="invitation">
              <a @click="enjoy">立即邀请</a>
            </div>
          </div>
      </main>
  </div>

</template>

<script>
  import wxsdk from '../assets/wx.js'
    export default {
        "name": "card",
        data() {
            return {
              wxsdk:wxsdk,
              join_chances:null,//答题机会
              revive_num:null//复活机会
            }
        },
      methods:{
        //接口
        enjoy(){
          this.wxsdk().init();
          this.wxsdk().shareMessage();
        }
      },
      mounted () {
        this.join_chances=this.$route.query.join;
        this.revive_num=this.$route.query.revive;
      }
    }
</script>

<style scoped>
  .res-card{
    width: 100%;
    height: 100%;
    background-image: linear-gradient( 0deg, rgb(89,50,205) 0%, rgb(42,16,118) 100%);
  }
  main{
    width: 88%;
    height: 100%;
    margin: 0 auto;
    box-sizing: border-box;
    display: flex;
    flex-direction: column;
    justify-content: space-around;
  }
  main>.top,main>.center,main>.bottom{
    width: 100%;
    border-radius: 20px;
    background-color: rgb(255, 255, 255);
    display: flex;
    flex-direction: column;
    justify-content: space-around;
    align-items: center;
    position: relative;
  }
  main>.top>img{
    width: 1.7rem;
    height: 1.66rem;
    margin: 0.3rem auto;
    position: relative;
  }
  main>.center>img{
    width: 1.84rem;
    height: 1.66rem;
    margin: 0.3rem auto;
    position: relative;
  }
  main>.center>p{
    font-size: 0.28rem;
    font-family: "PingFang";
    color: rgb(102, 102, 102);
    text-align: center;
    margin-bottom: 0.2rem;
  }

  main>.bottom>img{
    width: 1.38rem;
    height: 1.82rem;
    margin: 0.3rem auto;
  }
  main>.top>p,main>.bottom>p{
    width: 5.95rem;
    margin: 0 auto;
    font-size: 0.28rem;
    font-family: "PingFang";
    color: rgb(102, 102, 102);
    line-height: 1.5;
  }
  main>.top>p{
    margin-bottom: 0.3rem;
  }
  main>.bottom>.invitation{
    width: 6rem;
    height:1rem ;
    border-radius: 1rem;
    background-image:linear-gradient( 0deg, rgb(84,58,197) 0%, rgb(131,55,194) 100%);
    box-shadow: 0px 1px 20px 0px rgba(179, 136, 235, 0.004);
    margin: 0.3rem auto;
  }
  main>.bottom>.invitation>a{
    display: block;
    font-size: 0.36rem;
    font-family: "PingFang";
    color: rgb(255, 255, 255);
    line-height: 1rem;
    text-align: center;
  }
  main>.top>.join_chances,main>.center>.revive_num{
    position: absolute;
    text-align: center;
    top:1.25rem;
    font-size: 0.34rem;
    font-family: "PingFang";
    color: rgba(255, 255, 255, 0.6);
    font-weight: bold;
    line-height: 1.287;
    -moz-transform: matrix( 2.33921960209084,0,0,2.33921960209085,0,0);
    -webkit-transform: matrix( 2.33921960209084,0,0,2.33921960209085,0,0);
    -ms-transform: matrix( 2.33921960209084,0,0,2.33921960209085,0,0);
  }
  main>.center>.revive_num{
    top:1rem;
  }
</style>
