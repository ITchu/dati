<template>
    <div class="reward">
      <ul class="details">
        <li v-for="(re,index) in reward" :key="index">
          <div class="text">
            <div class="left">
              <p>答对{{re.right_num}}题奖励</p>
              <p>{{re.send_time}}</p>
            </div>
            <p class="right">
              ￥{{re.week_award}}.00
            </p>
          </div>
        </li>

      </ul>
      <p class="noreward" v-if="isreward">暂无奖励明细!</p>
    </div>
</template>

<script>
    export default {
        "name": "reward",
        data() {
            return {
              reward:[],
              isreward:true,
              ws:this.ws
            }
        },
      methods:{
          onmessage(e){
            console.log(e.data);
            var data = JSON.parse(e.data);
            switch (data["type"]) {
              case "ping":
                ws.send('{"type":"pong"}');
                break;
              case "award":
                if(data[0].length==null){
                  this.isreward=true;
                }else{
                  this.isreward=false;
                  this.reward=data[0];
                }
                console.log(data);
                break;
            }
        }
      },
      beforeRouteLeave (to, from,next) {
        if(to.name==="start"){
          this.$router.push('/');
          return ;
        }else {
          next();
        }
      },
      mounted(){
        document.title="答题奖励明细";
        this.ws.send(JSON.stringify({type:'detail',userid:"2593"}));
        this.ws.onmessage=this.onmessage;
      }
    }
</script>

<style scoped>
  .noreward{
    position: absolute;
    left: 35%;
    top: 45%;
    font-size: 0.36rem;
    color: rgb(102, 102, 102);
    line-height: 1.2;
    text-align: center;
  }

  .details{
    width: 100%;
    height: 98%;
    margin: 0 auto;
  }
  .details>li:first-of-type{
    margin-top: 0.4rem;
  }
  .details>li{
    width: 7.5rem;
    height: 1.4rem;
    border-bottom: 0.01rem solid #eeeeee;
  }
  .details>li>.text{
    width: 6.9rem;
    height: 100%;
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin: 0 auto;
  }
  .details>li>.text>.left>p:first-of-type{
    font-size: 0.32rem;
    font-family: "PingFang";
    color: rgb(102, 102, 102);
    line-height: 1.5;
  }
  .details>li>.text>.left>p:nth-of-type(2){
    font-size: 0.28rem;
    font-family: "SanFranciscoDisplay";
    color: rgb(153, 153, 153);
    line-height: 1.5;
  }
  .details>li>.text>.right{
    font-size: 0.36rem;
    font-family: "PingFang";
    color: rgb(255, 98, 89);
  }

</style>
