<template>
  <div class="start">
    <main v-if="status==1" class="first">
      <div class="top">
        <img src="../assets/img/challenge.png" alt="">
      </div>
      <div class="center">
        <p>即将开始...</p>
      </div>
      <div class="bottom">
        <p>答对12题，共赢</p>
        <img src="../assets/img/ten.png" alt="">
        <div class="time">
          <p>每周六晚上19:30自动开始</p>
        </div>
      </div>
    </main>
    <main v-else-if="status==2" class="second">
        <p>{{start_time}}</p>
    </main>
    <main v-else-if="status==3" class="three">
        <div class="answer">
          <div class="outer">
            <div class="inner base"  v-if="clock">
              <div class="circle base left"></div>
              <div class="circle base right"></div>
            </div>
            <div v-if="answer=='no'" class="answer2">
              <img src="../assets/img/no.png" alt="">
            </div>
            <div v-if="role=='1'" :class="{title:true}">{{onlooker}}</div>
            <div v-if="role!='1' && answer==null" :class="{title:true,color:answer_color}">{{answer_time}}</div>
            <div v-if="answer=='yes'" class="answer2">
              <img src="../assets/img/yes.png" alt="">
            </div>
          </div>
          <div class="topic">
            <p :class="{zoomIn:zoomIn,zoomOut:zoomOut,animated:true}">{{currentIndex}}.{{question_title}}</p>
            <ul :class="{result:true,slideInUp:slideInUp,slideInDown:slideInDown}">
              <li v-for="(option,index) in options" @click="confirmAnswer(index)" :key='index'
                  :class="{isOption:index==isOption,wrongOption:index==wrongOption,correctOption:index==correctOption}" v-if="option.v!=null">
                <p>{{option.v}}</p>
              </li>
              <!--<li><p>2</p></li>
              <li><p>3</p></li>
              <li><p>4</p></li>
              <li><p>5</p></li>-->
            </ul>
          </div>
        </div>
        <p>{{condition}}</p>
    </main>
    <main v-else-if="status==4" class="four">
        <div class="top">
          <p>{{people_num}}人获得学习奖励券</p>
        </div>
        <div class="center">
          <p>{{num}}</p>
          <img src="../assets/img/icon_cup.png" alt="">
          <p v-show="awarded==1" class="study">本场暂未答题!分享到不同的微信群,邀请三位好友注册即可获得复活卡</p>
          <p v-show="awarded==2" class="study">暂未获得奖励!分享到不同的微信群,邀请三位好友注册即可获得复活卡哦</p>
          <p v-show="awarded==3" class="study">恭喜获得<span>￥{{study_awarded+'.00'}}元</span>学习奖励券</p>
          <div class="enjoy">
            <a @click="enjoy('military')">分享战绩</a>
          </div>
        </div>
        <router-link  class="bottom" to="/reward">查看我的奖励劵</router-link>
    </main>
    <div  v-if="wrong_condition" class="revived">
        <div  v-if="wrong_condition==1" class="wrong">
          <img src="../assets/img/close.png" alt="" @click="wrong_condition=false;click=true">
          <p>您被淘汰了</p>
          <p>分享到不同的微信群，<br>邀请三位好友注册即可获得复活卡</p>
          <div class="fen">
            <a @click="enjoy('out')">分享</a>
          </div>
        </div>
        <div v-if="wrong_condition==2" class="opportunity">
          <img src="../assets/img/close.png" alt="" @click="wrong_condition=false;">
          <p>已为您自动复活</p>
          <p>消耗一次复活机会，您可以继续答题</p>
        </div>
        <div v-if="wrong_condition==3" class="msgBox">
          <img src="../assets/img/close.png" alt="" @click="cancel">
          <p>确定中途退出吗?退出则视为放弃本次参赛机会，无法角逐本场10万大奖!</p>
          <div class="btnBox" style="">
            <a class="btnCancle" @click="cancel">取消</a>
            <a class="btnSure" @click="sure">确定</a>
          </div>
        </div>
    </div>
  </div>
</template>
<script>
  import wxsdk from '../assets/wx.js'
    export default {
        "name": "start",
        data() {
            return {
              userid:null,
              token:null,
              status:1,//状态：1.即将开始  2.倒计时 3.答题中 4.结果
              start_time:null,//答题开始倒计时
              onlooker:null,
              answer_time:null,//答题时间倒计时
              role:null,//角色  1.围观者 2.答题者  3.淘汰者 4 复活者
              answer_color:true,//答题状态颜色
              answer:null,//答案是否正确：no不正确 yes正确  null
              options:null/*{'A':'2','B':'3','C':'4','D':'5'}*/,//题目选项
              question_title:null/*"1+1=?"*/,//题目
              question_id:null,//题目id
              currentIndex:1,//第几题
              click:false,//点击状态 false 未点击 true点击了
              isOption:-1,//自己选中项标记
              wrongOption:-1,//错误选项标记
              correctOption:-1,//正确选项标记
              people_num:null,//获得奖励券的人数
              num:null,//答对的题数
              awarded:false,//是否获得奖励券 1 暂未答题 2 答对0题 3 答对多题
              wrong_condition: false,//答错情况 1.淘汰 2.复活 3.中途退出
              resurrection:0,//复活机会
              clock:false,//圆弧倒计时
              zoomIn:false,//题目进入动画
              zoomOut:false,//题目出去动画
              slideInUp:false,//选项进入动画
              slideInDown:false,//选项出去动画
              study_awarded:null,//获得的奖励券
              condition:null,//答题情况 1.人数已满 2.上周已答题 3.淘汰
              exit:false,//是否退出
              isuse:false,//是否复活
              isout:false,//是否淘汰
              wxsdk:wxsdk,
              ws:this.ws
            }
        },
        methods: {
          onmessage(e){
            console.log(e.data);
            var data = JSON.parse(e.data);
            switch (data["type"]) {
              case "ping":
                this.ws.send('{"type":"pong"}');
                break;
              //加入房间
              case "joined":
                console.log('joined');
                this.joined(data);
                break;
              //错过准点答题
              case "late":
                console.log("late");
                this.role=data.user_type;
                this.condition=data.message;
                break;
              //房间已满
              case "full":
                console.log("房间已满");
                this.full(data);
                break;
              //上周已答题
              case "exist":
                this.role=data.user_type;
                this.condition=data.message;
                break;
              //答题倒计时
              case "start":
                console.log("答题开始倒计时");
                this.start();
                break;
              //开始发题
              case "question":
                console.log("开始发题");
                this.question(data);
                break;
              //答案验证
              case "Confirmed":
                console.log("答案验证完成");
                this.Confirmed(data);
                break;
              //复活成功
              case "revived":
                this.revived(data);
                break;
              //复活失败
              case "lose":
                this.lose(data);
                break;
              //答题结果
              case "result":
                console.log("返回结果");
                this.result(data);
                break;
            }
          },
            /*加入房间*/
          joined(data){
              this.join = true;
              this.status = 1;
              this.role = data.user_type;
              if(this.role==3){
                this.wrong_condition=false;
              }else if(this.role==1){
                this.wrong_condition=false;
                this.onlooker='围观';
              }
              console.log(this.role);
              this.condition=data.message;
              console.log('加入房间成功');
            },
          //房间已满
          full(data){
            this.role=data.user_type;
            this.condition=data.message;
            console.log("房间已满");
          },
          //答题倒计时
          start(){
            this.status = 2;
            var i =this.start_time=5;
            var t = setInterval(() => {
              if (i == 1) {
                this.start_time="答题开始";
                clearInterval(t);
                return;
              }
              this.start_time = i;
              i--;
            }, 1000);
          },
          //复活成功
          revived(data){
            this.role=data.user_type;
          },
          //复活失败
          lose(data){
            this.role=data.user_type;
          },
          //开始发题
          question(data){
            this.init();
            var y = 10;
            this.answer_time = y + 's';
            var answer1 = JSON.parse(data.select_answer);
            this.question_id = data.question_id;
            this.currentIndex = data.question_index;
            this.question_title = data.question_title;
            let answers2 = [];
            for (let key in answer1) {
              answers2.push({
                'k': key,
                'v': answer1[key]
              })
            };
            this.options = answers2;
            var t2 = setInterval(() => {
              this.clock = true;
              this.answer_time = y + 's';
              switch (data.question_answer) {
                case 'A':
                  data.question_answer = 0;
                  break;
                case 'B':
                  data.question_answer = 1;
                  break;
                case 'C':
                  data.question_answer = 2;
                  break;
                case 'D':
                  data.question_answer = 3;
                  break;
              }
              if (this.role == 1 || this.role==3) {
                this.click = true;
              }
              if (y == 1) {
                if (this.isOption == data.question_answer) {
                  this.wrong_condition = false;
                  this.answer = 'yes';
                  this.correctOption = this.isOption;
                }
                console.log(this.role);
                console.log(typeof  this.role);
                console.log(this.isOption);
                 if(this.isOption==-1 && this.role==2){
                    if(this.resurrection!='0' && this.isuse==false){
                      this.resurrection--;
                      document.title="复活机会"+this.resurrection;
                      this.isuse=true;
                      this.wrong_condition = 2;
                      var z = 3;
                      var t3 = setInterval(() => {
                        if (z < 1) {
                          this.wrong_condition = false;
                          clearInterval(t3);
                        }
                        z--;
                      }, 1000)
                    }
                    else{
                      this.isout=true;
                      this.wrong_condition = 1;
                      this.role = 3;
                      this.condition="您已被淘汰。可观战,不能答题";
                    }
                   this.answer = 'no';
                   this.wrongOption = this.isOption;
                   console.log("发送空答案");
                   this.confirmAnswer('');
                 }
                if (this.isOption != data.question_answer && this.role ==2 && this.isOption!=-1) {
                    if(this.isuse==false){
                      this.resurrection--;
                      document.title="复活机会"+this.resurrection;
                      this.wrong_condition = 2;
                      this.isuse=true;
                      var z = 3;
                      var t3 = setInterval(() => {
                        if (z < 1) {
                          this.wrong_condition = false;
                          clearInterval(t3);
                        }
                        z--;
                      }, 1000)
                    }
                    this.answer = 'no';
                    this.wrongOption = this.isOption;

                }
                if(this.isOption != data.question_answer && this.role ==3 && this.isOption!=-1){
                  if(this.isout==false){
                    this.wrong_condition = 1;
                    this.role = 3;
                    this.condition="您已被淘汰。可观战,不能答题";
                    this.isout=true
                  }
                  this.answer = 'no';
                  this.wrongOption = this.isOption;
                }
                this.correctOption = data.question_answer;
              }
              if (y < 1) {
                if (this.currentIndex == 5) {
                  var final={
                    type:'final',
                    userid:this.userid
                  }
                  this.ws.send(JSON.stringify(final));
                  console.log("finnal");
                  this.zoomIn = false;
                  this.slideInDown = false;
                  this.slideInUp = false;
                  this.zoomOut = false;
                  clearInterval(t2);
                  return;
                }
                this.slideInUp = false;
                this.zoomIn = false;
                this.slideInDown = true;
                this.zoomOut = true;
                clearInterval(t2);
              }
              y--;
            }, 1000)
          },
            //最终结果
          result(data){
              this.people_num = data.people_num;
              this.num = "连续答对" + data.num + "题";
              this.status = 4;
              if (this.role == 1) {
                console.log(this.role);
                this.awarded = 1;
                return;
              }
              if (data.num == 0 && this.role==3) {
                this.num = "连续答对0题"
                this.awarded = 2;
              } else {
                this.study_awarded = data.study_awarded;
                this.awarded = 3;
              }
              console.log("pk结束");
              this.status = 4;
              document.title="积土学吧知识竞赛"
            },
          //答案验证完成
          Confirmed(data){},
          /*发题前的初始化数据*/
          init: function () {
            this.answer_time = null;
            this.answer_color = true;
            this.answer = null,
            this.isOption = -1;
            this.wrongOption = -1;
            this.correctOption = -1;
            this.status = 3;
            this.clock = false;
            this.zoomIn = true;
            this.zoomOut = false;
            this.click = false;
            this.slideInUp = true;
            this.slideInDown = false;
          },
          /*发送答案进行验证*/
          confirmAnswer(answer) {
            if (this.click) {
              return;
            }
            this.isOption = answer;
            switch (answer) {
              case 0:
                answer = 'A';
                break;
              case 1:
                answer = 'B';
                break;
              case 2:
                answer = 'C';
                break;
              case 3:
                answer = 'D';
                break;
            }
            this.click = true;
            var user_answer = {
              type: "confirmAnswer",
              userid:this.userid,
              token:this.token,
              question_index: this.currentIndex,
              answer: answer || "",
              question_id: this.question_id,
            }
            this.ws.send(JSON.stringify(user_answer));
          },
          //请求复活
          /*revive() {
              if (this.role == 4) {
                var  revive = {
                type: "revive",
                userid: this.userid,
                token: this.token,
                user_type: 4
              }
              ws.send(JSON.stringify(revive));
              }
            },*/
          sure(){
            this.exit=true;
            var quit={
              type:'quit',
              userid:this.userid,
            }
            this.ws.send(JSON.stringify(quit));
            this.$router.go(-1);
          },
          cancel(){
            this.wrong_condition=false;
            document.title='复活机会'+this.resurrection;
          },
          enjoy(argu){
            if(argu=='out'){
              this.wxsdk().init();
              this.wxsdk().shareMessage();
              return
            }
            if(argu=='military'){
              var share= {
                title: "积土学吧，每周六19:30，速来参与吧！",
                desc: "我参与积土学吧答题已瓜分本场10万元大奖，来不及解释了，点击速来参与！",
                link:"http://m.7tsoft.com/html/activity/zhishijingsai/",
                imgUrl: "https://m.study.bihaohuo.cn/images/logo.png"
              }
              this.wxsdk(share).init();
              this.wxsdk(share).shareMessage();
            }
          }
        },
        beforeRouteLeave (to, from,next) {
          if (this.status==3) {
            if(this.wrong_condition==3){
              next();
              return ;
            }else{
              next(false);
              this.wrong_condition=3;
            }
          }
          else if(to.name==='reward'||to.name==='index'){
            next();
          }
        },
        mounted(){
          document.title="复活机会"+this.$route.params.revive_num;
          this.resurrection=this.$route.params.revive_num;
          this.userid=this.userMessage.userid;
          this.token=this.userMessage.token;
          this.ws.onmessage=this.onmessage;
          var join={
            type:"join",
            userid:this.userid,
            token:this.token,
          }
          this.ws.send(JSON.stringify(join));
        }
    }
</script>
<style>
  @import "../assets/css/animate.css";
 /* @import "../assets/css/clock.css";*/
  /*圆弧倒计时*/
  .three>.answer>.outer>.inner{
    background-color: #f3f3f3;
    position: absolute;
    width: 1.44rem;
    height: 1.44rem;
    left:0.08rem;
    top: 0.08rem;
    border-radius: 0.72rem;
    clip: rect(0rem, 1.44rem, 1.44rem, 0.72rem);
  }
  .three>.answer>.outer>.inner>.circle{
    width:1.25rem;
    height: 1.25rem;
    border: 0.1rem solid #F4D649;
    border-radius: 0.72rem;
    position: absolute;
    clip: rect(0, 0.73rem, 1.44rem, 0);
  }
  div[class~='base'] {
    -webkit-animation-iteration-count: 1;  /* Only run once */
    -webkit-animation-fill-mode: forwards; /* Hold the last keyframe */
    -webkit-animation-timing-function:linear; /* Linear animation */
  }

  .inner[class~='inner'] {
    -webkit-animation-duration: 0.01s; /* Complete keyframes asap */
    -webkit-animation-delay: 5s; /* Wait half of the animation */
    -webkit-animation-name: close-wrapper; /* Keyframes name */
  }

  .circle[class~='left'] {
    -webkit-animation-duration: 10s; /* Full animation time */
    -webkit-animation-name: left-spin;
  }

  .circle[class~='right'] {
    -webkit-animation-duration: 5s; /* Half animation time */
    -webkit-animation-name: right-spin;
  }

  /* Rotate the right side of the progress bar from 0 to 180 degrees */
  @-webkit-keyframes right-spin {
    from {
      -webkit-transform: rotate(0deg);
    }
    to {
      -webkit-transform: rotate(180deg);
    }
  }
  /* Rotate the left side of the progress bar from 0 to 360 degrees */
  @-webkit-keyframes left-spin {
    from {
      -webkit-transform: rotate(0deg);
    }
    to {
      -webkit-transform: rotate(360deg);
    }
  }
  /* Set the wrapper clip to auto, effectively removing the clip */
  @-webkit-keyframes close-wrapper {
    to {
      clip: rect(auto, auto, auto, auto);
    }
  }


  .start{
    width: 100%;
    height: 100%;
    background-image: linear-gradient( 0deg, rgb(89,50,205) 0%, rgb(42,16,118) 100%);
  }
  /*即将开始*/
  .first{
    width: 100%;
    height: 92%;
    display: flex;
    flex-direction: column;
    margin: 0 auto;
    justify-content: space-around;
    align-items: center;
  }
  .first>.top{
    width: 6.88rem;
    margin: 0.22rem auto 0;
  }
  .first>.top>img{
    display: block;
    width: 100%;
    height: 100%;
  }
  .first>.center{
    width: 4.4rem;
    height: 1rem;
    border-radius: 1rem;
  }
  .first>.center>p{
    font-size: 0.34rem;
    font-family: "PingFang";
    color: rgb(255, 255, 255);
    line-height: 1rem;
    text-align: center;
    text-shadow: 0 0.01rem 0 rgba(122, 14, 14, 0.004);
  }
  .first>.bottom>p{
    font-size: 0.60rem;
    font-family: "PingFang";
    color: rgb(255, 255, 255);
    text-align: center;
    line-height: 1.5;
    margin-bottom: 0.66rem;
  }
  .first>.bottom>img{
    display: block;
    width:5.37rem;
    height: 1.12rem;
    margin:  0 auto 0.94rem;
  }
  .first>.bottom>.time{
    width: 6.64rem;
    background:url("../assets/img/footer.png") no-repeat center;
    background-size:  100% 100%;
    margin: 0 auto;
  }
  .first>.bottom>.time>p{
    font-size: 0.36rem;
    font-family: "PingFang";
    color: rgb(42, 16, 118);
    line-height: 1.44rem;
    text-align: center;
  }
  /*倒计时*/
  .second{
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-content: center;
  }
  .second>p{
    margin-top: -1.2rem;
    font-size: 1.2rem;
    font-family: "PingFang";
    color: rgb(251, 219, 49);
    font-weight: bold;
    text-align: center;
    text-shadow: 0px 1px 10px rgba(179, 136, 235, 0.004);
  }
  /*答题页*/
  .three{
    width: 100%;
    padding-top: 1.4rem;
    box-sizing: border-box;
  }
  .answer{
    background-color: white;
    border-radius: 0.2rem;
    width: 92%;
    height: 8.5rem;
    margin: 0 auto 0.4rem;
  }

  .answer>.outer{
    position: relative;
    width: 1.6rem;
    height: 1.6rem;
    left:0;
    right: 0;
    margin: auto;
    top:-0.8rem;
    background-color: #ffffff;
    border-radius: 50%;
  }
  .answer>.outer>.title{
    background: #ffffff;
    position: absolute;
    width: 1.25rem;
    height: 1.25rem;
    left:0.18rem;
    top: 0.18rem;
    border-radius: 50%;
    text-align: center;
    line-height: 1.25rem;
    font-size: 0.36rem;
    font-family: "PingFang";
    color: rgb(153, 153, 153);
    font-weight: bold;
    z-index: 2;
  }
  .answer>.outer>.color{
    color: #291076;
  }
  .answer>.outer>.answer2{
    left:0.08rem;
    top: 0.08rem;
    position: absolute;
    width: 1.44rem;
    height: 1.44rem;
    z-index: 3;
  }
  .answer>.outer>.answer2>img{
    display: block;
    width: 100%;
    height:100%;
  }
  .answer>.topic{
    width: 6.36rem;
    height: 7.68rem;
    margin: -0.8rem auto 0;
    background-color: #ffffff;
  }
  .answer>.topic>p{
    font-size: 0.34rem;
    font-family: "PingFang";
    color: rgb(51, 51, 51);
    font-weight: bold;
    margin-bottom: 0.6rem;
  }
  .answer>.topic>.result{
    width: 6.36rem;
    height: 6.6rem;
    align-items: center;
    animation-duration: .4s;
    animation-fill-mode: both;
  }
  .answer>.topic>.result>li{
    width: 6.36rem;
    height: 1.1rem;
    border-radius: 1.1rem;
    background-color: rgb(255, 255, 255);
    box-shadow: 0px 1px 20px 0px rgba(41, 17, 118, 0.2);
    font-size: 0.32rem;
    display: flex;
    justify-content: center;
    align-items: center;
    overflow: hidden;
    color: rgb(51, 51, 51);
    margin-top: 0.6rem;
  }
  .answer>.topic>.result>li:first-of-type{
    margin-top: 0;
  }
  .answer>.topic>.result>li.isOption{
    background-color:#543ac5 ;
    color: rgb(255,255,255);
  }
  .answer>.topic>.result>li.correctOption{
    background-color:#70e183 ;
    color: rgb(255,255,255);
  }
  .answer>.topic>.result>li.wrongOption{
    background-color:#ff6259 ;
    color: rgb(255,255,255);
  }
  .answer>.topic>.result>li>p{
    margin: 0.2rem auto;
    width: 80%;
    font-family: "PingFang";
    line-height: 0.4rem;
    overflow: hidden;
    max-height: 0.8rem;
  }
  .three>p{
    font-size: 0.28rem;
    font-family: "PingFang";
    color: rgb(251, 219, 49);
    line-height: 1.5;
    text-align: center;
    margin-bottom: 0.2rem;
  }
.revived{
    position: absolute;
    left: 0;
    top: 0;
    z-index: 100;
    width: 100%;
    height: 100%;
    background-color: rgba(153,153,153,0.6);
  }
  .revived .wrong{
    position: absolute;
    left: 0;
    top: 0;
    bottom: 0;
    right: 0;
    margin: auto;
    width: 5.8rem;
    height:5.2rem;
    border-radius: 0.2rem;
    background-color: rgb(255, 255, 255);
    padding-top: 1rem;
    box-sizing: border-box;
  }
  .revived .wrong>img,.revived>.opportunity>img,.revived>.msgBox>img{
    position: absolute;
    right: 0.38rem;
    top: 0.3rem;
    width: 0.3rem;
    height: 0.3rem;
  }
  .revived .wrong>p:first-of-type,.revived>.opportunity>p:first-of-type{
    font-size: 0.36rem;
    font-family: "PingFang";
    color: rgb(51, 51, 51);
    text-align: center;
  }
  .revived .wrong>p:nth-of-type(2),.revived>.opportunity>p:nth-of-type(2){
    margin-top: 0.4rem;
    font-size: 0.30rem;
    font-family: "PingFang";
    color: rgb(102, 102, 102);
    text-align: center;
  }
  .revived .wrong>.fen{
    margin: 0.7rem auto 0;
    width: 4.8rem;
    height:0.9rem ;
    border-radius: 1rem;
    background-image:linear-gradient( 90deg, rgb(84,58,197) 0%, rgb(131,55,194) 100%);
    box-shadow: 0px 1px 20px 0px rgba(179, 136, 235, 0.004);
    text-align: center;
  }
  .revived .wrong>.fen>a{
    display: block;
    font-size: 0.36rem;
    font-family: "PingFang";
    color: rgb(255, 255, 255);
    line-height: 0.9rem;
  }
  .revived .opportunity{
    position: absolute;
    left: 0;
    top: 0;
    bottom: 0;
    right: 0;
    margin: auto;
    width: 5.8rem;
    height:3.1rem;
    padding-top: 1rem;
    box-sizing: border-box;
    border-radius: 0.2rem;
    background-color: #ffffff;
  }
  .revived .msgBox{
    position: absolute;
    left: 0;
    top: 0;
    bottom: 0;
    right: 0;
    margin: auto;
    width: 5.8rem;
    height:4.5rem;
    background-color: #ffffff;
    padding-top: 1rem;
    box-sizing: border-box;
    border-radius: 0.2rem;
  }
  .revived .msgBox p{
    width: 90%;
    margin: 0 auto;
    font-size: 0.3rem;
    text-align: center;
    line-height: 1.5;
  }
  .revived .msgBox .btnBox{
    width: 80%;
    margin: 0.6rem auto 0;
  }
  .revived .msgBox .btnBox a{
    display: inline-block;
    width: 2rem;
    height: 0.8rem;
    border: 0.02rem solid #797979;
    font-size: 0.24rem;
    color: #333333;
    text-align: center;
    line-height: 0.8rem;
    margin-left: 0.1rem;
  }
  /*结果页*/
  .four{
    width: 100%;
    height: 98%;
    border-top: 0.01rem solid #6c5aa4;
    display: flex;
    flex-direction: column;
    margin: 0 auto;
    justify-content: space-around;
    align-items: center;
  }
  .four>.top{
    width: 6.64rem;
    background:url("../assets/img/footer.png") no-repeat center;
    background-size:  100% 100%;
    margin: 0 auto;
  }
  .four>.top>p{
    display: block;
    font-size: 0.36rem;
    font-family: "PingFang";
    color: rgb(42, 16, 118);
    line-height: 1.44rem;
    text-align: center;
  }
  .four>.center{
    width: 6.9rem;
    height: 7.5rem;
    border-radius: 0.2rem;
    background-color: rgb(255, 255, 255);
    margin: 0 auto;
  }
  .four>.center>p:first-of-type{
    font-size: 0.4rem;
    font-family: "PingFang";
    color: rgb(153, 153, 153);
    font-weight: bold;
    line-height: 1.6rem;
    text-align: center;
  }
  .four>.center>img{
    display: block;
    width: 2.3rem;
    height: 2.4rem;
    margin: 0 auto;
    margin-bottom: 0.5rem;
  }
  .four>.center>.study{
    font-size: 0.34rem;
    font-family: "PingFang";
    color: rgb(102, 102, 102);
    margin: 0 0.6rem 0.5rem 0.6rem;
  }
  .four>.center>.study>span{
    color:#ff6259;
    font-size: 0.46rem;
  }
  .four>.center>.enjoy{
    width: 6.3rem;
    border-radius: 1rem;
    background-image:linear-gradient( 90deg, rgb(84,58,197) 0%, rgb(131,55,194) 100%);
    box-shadow: 0px 1px 20px 0px rgba(179, 136, 235, 0.004);
    margin: 0  auto 0.56rem;
  }
  .four>.center>.enjoy>a{
    display: block;
    font-size: 0.36rem;
    font-family: "PingFang";
    color: rgb(255, 255, 255);
    line-height: 1.06rem;
    text-align: center;
  }
  .four>.bottom{
    display: block;
    font-size: 0.34rem;
    font-family: "PingFang";
    color: rgb(237, 237, 237);
    line-height: 0.706;
    text-align: center;
  }
</style>
