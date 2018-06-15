<template>
  <div class="start">
    <main>
      <div class="top">
        <img src="../assets/img/start2.png" alt="">
      </div>
      <div class="center">
        <p v-if="time==1">本场活动已结束</p>
        <p v-if="time==2">答题时间未到</p>
        <a v-if="time==3" @click="enter">进入答题</a>
      </div>
      <p>每周六晚上19:30自动开始</p>
      <div class="bottom">
        <div class="one">
          <router-link to="/reward">累计答题奖励</router-link>
          <router-link :to="{path:'/card',query:{join:join_chances,revive:revive_num}}">答题/复活机会</router-link>
        </div>
        <div class="two">
          <router-link to="/reward">{{total_award}}元</router-link>
          <router-link :to="{path:'/card',query:{join:join_chances,revive:revive_num}}">{{join_chances}}/{{revive_num}}</router-link>
        </div>
        <div class="card">
          <a @click="enjoy">我要复活卡</a>
        </div>
      </div>
      <div class="more">
        <router-link to="rules">比赛规则</router-link>
        <span>|</span>
        <router-link to="rankingList">获奖榜单</router-link>
      </div>
    </main>
    <!--<div class=""></div>-->
  </div>
</template>

<script>
  import wxsdk from '../assets/wx.js'
  import bus from '../assets/eventbus.js'
  export default {
    name: 'index',
    data () {
      return {
        time:2,//是否能进入答题 1. 活动已结束 2.答题时间未到 3.进入答题
        total_award:0,//累计奖励
        revive_num:1,//复活机会
        join_chances:1,//答题机会
        wxsdk:wxsdk,//分享接口
        userid:null,
        token:null,
        wsdata:null,
        enterd:false,//是否已经进入答题
        ws:this.ws,
      }
    },
    methods:{
      connect(){
        this.ws.onopen =()=> {
          this.open=true;
          console.log("websocket握手成功");
          var wait={
            type:"wait",
            userid:this.userid,
            token:this.token,
          }
          this.ws.send(JSON.stringify(wait));
        };
      //服务器发来的信息
        this.ws.onmessage=this.onmessage;
        this.ws.onclose=function () {
          console.log("连接关闭")
        }
        this.ws.onerror = function () {
          console.log("连接出现错误");
        }
      },
      onmessage (e) {
        var data = JSON.parse(e.data);
        console.log(data);
        switch (data["type"]) {
          case "ping":
            this.ws.send('{"type":"pong"}');
            break;
          //活动结束
          case "ended":
            this.time='1';
            this.total_award=data.total_award;
            this.revive_num=data.revive_num;
            this.join_chances=data.join_chances;
            break;
          // 进入答题
          case "ok":
            this.time='3';
            this.total_award=data.total_award;
            this.revive_num=data.revive_num;
            this.join_chances=data.join_chances;
            break;
          //答题时间未到
          case "noway":
            this.time='2';
            this.total_award=data.total_award;
            this.revive_num=data.revive_num;
            this.join_chances=data.join_chances;
            break;
          case "enter":
            console.log("enter");
            if(this.enterd==true){
              return;
            }else{
              this.enter();
            }
            break;
        }
      },
      enter(){
        this.enterd=true;
        this.$router.push({name:'start',params:{revive_num:this.revive_num}})

      },
      //接口
      enjoy(){
        this.wxsdk().init();
        this.wxsdk().shareMessage();
      }
    },
    created(){
      document.title='积土学吧答题挑战赛';
      this.userid=this.userMessage.userid;
      this.token=this.userMessage.token;
        var wait={
          type:"wait",
          userid:this.userid,
          token:this.token,
        }
        console.log(wait);
        this.ws.send(JSON.stringify(wait));
    },
    mounted () {
      this.connect();
    },
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  .start{
    width: 100%;
    height: 100%;
    background-image: linear-gradient( 0deg, rgb(89,50,205) 0%, rgb(42,16,118) 100%);
  }
  main{
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    justify-content: space-around;
    align-items: center;
  }
  main>.top{
    width: 6.9rem;
    margin-bottom: -0.9rem;
  }
  main>.top>img{
    display: block;
    width: 100%;
    height: 100%;
  }
  main>.center{
    margin-bottom: -0.6rem;
    width: 4.4rem;
    height: 1rem;
    border-radius: 1rem;
    background-color: rgb(244, 214, 73);
    box-shadow: 0 0.06rem 0  rgb(165, 143, 42);
  }
  main>.center>a{
    display: block;
    font-size: 0.36rem;
    font-family: "PingFang";
    color: rgb(255, 47, 91);
    text-align: center;
    text-shadow: 0px 1px 0px rgba(122, 14, 14, 0.004);
    line-height: 1rem;
    font-weight: 800;
  }

  main>.center>p{
    font-size: 0.36rem;
    font-family: "PingFang";
    color: rgb(255, 255, 255);
    line-height: 1rem;
    text-align: center;
    text-shadow: 0px 1px 0px rgba(45, 45, 45, 0.004);
    font-weight: 800;
  }
  main>p{
    font-size: 0.28rem;
    font-family: "PingFang";
    color: rgb(255, 255, 255);
    text-align: center;
    margin-top: 0.4rem;
  }
  main>.bottom{
    background: url("../assets/img/start3.png") no-repeat center;
    background-size: 100% 100%;
    width:6.9rem;
    height: 3.96rem;
  }
  main>.bottom>.one{
    font-size: 0.32rem;
    font-family: "PingFang";
    margin-top: 0.75rem;
    display: flex;
    justify-content: space-around;
  }
  main>.bottom>.one>a{
    color: rgb(51, 51, 51);
  }
  main>.bottom>.two{
    font-size: 0.30rem;
    font-family: "PingFang";
    text-align: center;
    margin-top: 0.3rem;
    display: flex;
    justify-content: space-around;
  }
  main>.bottom>.two>a{
    color: rgb(51, 51, 51);
  }
  main>.bottom>.card{
    width: 6.3rem;
    height:1.06rem ;
    margin: 0.6rem auto;
    border-radius: 1rem;
    background-image:linear-gradient( 90deg, rgb(84,58,197) 0%, rgb(131,55,194) 100%);
    box-shadow: 0px 1px 20px 0px rgba(179, 136, 235, 0.004);
    text-align: center;
  }
  main>.bottom>.card>a{
    display: block;
    font-size: 0.36rem;
    font-family: "PingFang";
    color: rgb(255, 255, 255);
    line-height: 1.06rem;
  }
  main>.more{
    text-align: center;
    font-size: 0.3rem;
    font-family: "PingFang";
    color: rgb(255, 255, 255);
  }
  main>.more>a{
    color: rgb(255, 255, 255);
  }
  main>.more>a:first-of-type{
    margin-right: 0.3rem;
  }
  main>.more>a:last-of-type{
    margin-left: 0.3rem;
  }

</style>
