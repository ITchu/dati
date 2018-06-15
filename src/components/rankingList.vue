<template>
  <div class="rankingList">
    <main>
      <header>
        <div class="title">
          <span :class="{total:true,activeTotal:activeTotal}" @click="activeTotal=true;activeWeek=false">总榜</span>
          <span :class="{week:true,activeWeek:activeWeek}"  @click="weeks">本周</span>
        </div>
      </header>
      <ul class="ranking" v-if="activeTotal==true">
        <li class="oneself" v-if="totalself!=null">
          <div class="main">
            <span>{{totalself.totalnum}}</span>
            <div class="people">
              <img :src="totalself.head_pic ? totalself.head_pic : ''" alt="">
              <span>{{totalself.nickname}}</span>
            </div>
            <span class="money">
                                  {{totalself.money}}
                              </span>
          </div>
        </li>
        <li v-for="(r,index) in total" :key="index">
          <div class="main" >
            <span>{{index+1}}</span>
            <div class="people">
              <img :src="r.head_pic ? r.head_pic : '' " alt="">
              <span>{{r.nickname}}</span>
            </div>
            <span class="money">
                                  ￥{{r.award}}.00
                              </span>
          </div>
        </li>
      </ul>
      <ul class="ranking" v-if="activeWeek==true">
        <li class="oneself" v-if="weekself!=null">
          <div class="main">
            <span>{{weekself.weeknum}}</span>
            <div class="people">
              <img :src="weekself.head_pic ? weekself.head_pic : ''" alt="">
              <span>{{weekself.nickname}}</span>
            </div>
            <span class="money">
                                  {{weekself.money}}
                              </span>
          </div>
        </li>
        <li v-for="(w,index) in week" :key="index">
          <div class="main" >
            <span>{{index+1}}</span>
            <div class="people">
              <img :src="w.head_pic ? w.head_pic : ''" alt="">
              <span>{{w.nickname}}</span>
            </div>
            <span class="money">
                                  ￥{{w.award}}.00
                              </span>
          </div>
        </li>

      </ul>
      <p class="noRank" v-if="ranking">暂无排名~</p>
  </main>
  </div>
</template>

<script>
    export default {
        "name": "rankingList",
      data () {
        return {
          totalself:null,//总榜 自己信息
          total:null,//总榜列表
          weekself:null,//周榜 自己信息
          week:null,//周榜列表
          activeTotal:true,
          activeWeek:false,
          ranking:true,
          ws:this.ws
        }
      },
      methods:{
          weeks(){
            this.activeTotal=false;
            this.activeWeek=true;
            ws.send(JSON.stringify({type:'list_one',userid:this.userMessage.userid}));
          },
          onmessage(e){
            console.log(e.data);
            var data = JSON.parse(e.data);
            switch (data["type"]) {
              case "ping":
                ws.send('{"type":"pong"}');
                break;
              case "week":
                this.getWeekself(data);
                break;
              case "total":
                this.getTotalself(data);
                break;
            }
          },
          getWeekself(data){
            var reg=/\\/g;
            if(data[0]!=null){
              this.ranking=false;
              data[0].head_pic=data[0]['head_pic'].replace(reg,'');
              if(data[0].score==false){
                data[0].score=0;
              }
              this.weekself={
                userid:this.userMessage.userid,
                weeknum:'--',
                head_pic:data[0].head_pic,
                nickname:data[0].nickname,
                money:'￥'+data[0].score+'.00'
              }
              console.log(this.weekself);
            }
            else{
              this.ranking=true;
            }
            this.week=data[1];
            for(var i=0;i<this.week.length;i++){
              this.week[i].head_pic=this.week[i]['head_pic'].replace(reg,'');
              if(this.week[i].uid==this.weekself.userid){
                this.weekself.weeknum=i+1;
                return ;
              }else{
                this.weekself.weeknum='--';
              }
            }
            console.log(this.week);
          },
          getTotalself(data){
            var reg=/\\/g;
            if(data[0]!=null){
              this.ranking=false;
              data[0].head_pic=data[0]['head_pic'].replace(reg,'');
              if(data[0].score==false){
                data[0].score=0;
              }
              this.totalself={
                userid:this.userMessage.userid,
                totalnum:'--',
                head_pic:data[0].head_pic,
                nickname:data[0].nickname,
                money:'￥'+data[0].score+'.00'
              }
              console.log(this.totalself);
            }
            else{
              this.ranking=true;
            }
            this.total=data[1];
            for(var i=0;i<this.total.length;i++){
              this.total[i].head_pic=this.total[i]['head_pic'].replace(reg,'');
              if(this.total[i].uid==this.totalself.userid){
                this.totalself.totalnum=i+1;
                return ;
              }else{
                this.totalself.totalnum='--';
              }
            }
          },

      },
      mounted(){
          document.title="排行榜";
          this.ws.send(JSON.stringify({type:'list_all',userid:this.userMessage.userid}));
          this.ws.onmessage=this.onmessage;
      }
    }
</script>

<style scoped>
  .rankingList{
    width: 100%;
    height: 100%;
    background-image: linear-gradient( 0deg, rgb(89,50,205) 0%, rgb(42,16,118) 100%);
  }
  main{
    width: 100%;
    height: 100%;
    padding-top: 0.4rem;
    box-sizing: border-box;
  }
  main .noRank{
    position: absolute;
    left: 42%;
    top: 45%;
    font-size: 0.36rem;
    font-family: "PingFang";
    color: rgb(255, 255, 255);
    line-height: 1.2;
    text-align: center;
  }
  header{
    width: 100%;
    height: 13%;
    display: flex;
    justify-content: center;
    align-items: center;
  }
  header>.title{
    width: 5.2rem;
/*    background: url("../assets/img/ranking.png") no-repeat center;*/
    background-size: 5.2rem 0.8rem;
    height: 100%;
    display: flex;
    justify-content: space-between;
  }
  header .title>span{
    font-size: 0.34rem;
    font-family: "PingFang";
    color: rgb(255, 255, 255);
    line-height: 0.8rem;
    text-align: center;
    display: inline-block;
    width: 2.6rem;
    height: 0.8rem;
  }
  header .title>.total{
    border: 0.02rem #ffffff solid;
    border-radius: 0 0.4rem 0.4rem 0;
    border-right: 0;
    box-sizing: border-box;
    border-radius: 0.4rem 0 0 0.4rem;
  }
  header .title>.activeTotal{
    border: 0;
    background-image: -webkit-linear-gradient( 0deg, rgb(255,168,0) 0%, rgb(255,126,0) 100%);
  }
  header .title>.week{
    border: 0.02rem #ffffff solid;
    border-radius: 0 0.4rem 0.4rem 0;
    border-left: 0;
    box-sizing: border-box;
  }
  header .title>.activeWeek{
    border: 0;
    background-image: -webkit-linear-gradient( 0deg, rgb(255,126,0) 100%, rgb(255,168,0) 0%);
  }
  .ranking{
    width: 92%;
    height: 87%;
    margin: 0 auto;
  }
  .ranking>li{
    width: 6.9rem;
    height: 1.2rem;
    border-bottom: 0.02rem solid rgb(80, 66, 142);
  }


  .ranking>li>.main{
    width: 6.3rem;
    height: 100%;
    margin: 0 auto;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  .ranking>li>.main>span{
    font-size: 0.34rem;
    font-family: "HYk2gj";
    color: rgb(255,255,255);
    line-height: 1.2rem;
  }
  .ranking>.oneself{
    color:rgb(255,255,255);
  }
  .ranking>li:nth-child(2) span,.ranking>li:nth-child(3) span{
    color: rgb(251, 219, 49);
  }
  .ranking>li:nth-child(4) span{
    color: rgb(251, 219, 49);
  }
  .ranking>li>.main>.people{
    display: flex;
    justify-content: space-around;
    align-items: center;
    font-size: 0.3rem;
    font-family: "PingFang";
    color: rgb(255, 255, 255);
    margin-left: -1.5rem;
  }
  .ranking>li>.main>.people>img{
    display: block;
    width: 0.6rem;
    height: 0.6rem;
    margin-right:0.2rem ;
  }
  .ranking>li> span{
    font-size: 0.3rem;
    font-family: "PingFang";
    color: rgb(255, 255, 255);
  }
</style>
