<template>
  <div>
    <div id="clicaptcha-container">
      <div class="clicaptcha-imgbox">
        <img class="clicaptcha-img" :src="imgSrc" @load="setTitle" @click.prevent="record($event)"
             alt="验证码加载失败，请点击刷新按钮">
        <span v-for="(item, index) in xy" :key="index" class="step"
              :style="`left:${item.split(',')[0] - 13}px;top:${item.split(',')[1] - 13}px`">{{ index + 1 }}</span>
      </div>
      <div class="clicaptcha-title" v-if="tip">
        {{ tip }}
      </div>
      <div class="clicaptcha-title" v-else>
        请依次点击
        <span v-for="(text, index) in text" :key="index"
              :class="xy.length > index ? 'clicaptcha-clicked' : ''">{{ text }}</span>
      </div>
      <div class="clicaptcha-refresh-box">
        <div class="clicaptcha-refresh-line clicaptcha-refresh-line-l"></div>
        <a href="javascript:;" class="clicaptcha-refresh-btn" title="刷新" @click="reset"></a>
        <div class="clicaptcha-refresh-line clicaptcha-refresh-line-r"></div>
      </div>
    </div>
    <div id="clicaptcha-mask" @click="close"></div>
  </div>
</template>

<script>
import axios from "axios";
import qs from "qs";
import VueCookies from 'vue-cookies'

axios.defaults.withCredentials = true;

export default {
  props: {
    src: String,
    callback: Function,
    close: Function,
  },
  data() {
    return {
      imgSrc: "",
      success: "验证成功！",
      error: "未点中正确区域，请重试！",
      tip: "",
      isCheck: false,
      xy: [],
      text: [],
    };
  },
  created() {
    this.loadImg();
  },
  methods: {
    loadImg() {
      this.imgSrc = this.src + "?" + new Date().getTime();
    },
    async setTitle() {
      this.tip = "";
      this.text = VueCookies.get("clicaptcha_text").split(",");
      this.xy = [];
    },
    record(event) {
      if (this.xy.length < this.text.length) {
        this.xy.push(event.offsetX + "," + event.offsetY);
        if (this.xy.length == this.text.length) {
          let captchainfo = [
            this.xy.join("-"),
            event.target.width,
            event.target.height
          ].join(";");
          axios
              .post(
                  this.src,
                  qs.stringify({
                    do: "check",
                    info: captchainfo
                  })
              )
              .then(cb => {
                if (cb.data == 1) {
                  this.tip = this.success;
                  setTimeout(() => {
                    // this.close();
                    this.callback({"info": captchainfo, status: true, src: this.src});
                  }, 1500);
                } else {
                  this.tip = this.error;
                  setTimeout(() => {
                    this.callback({"info": captchainfo, status: false, src: this.src});
                    this.reset();
                  }, 1500);
                }
              });
        }
      }
    },
    reset() {
      this.loadImg();
    }
  }
};
</script>

<style lang="scss" scoped>
#clicaptcha-container {
  width: auto;
  height: 290px;
  padding: 15px;
  border: 1px solid #b1b3b8;
  background-color: #f5f6f7;
  position: fixed;
  z-index: 10000;
  left: 50%;
  top: 50%;
  margin-left: -191px;
  margin-top: -161px;
  border-radius: 10px;
  box-shadow: 0 0 0 1px hsla(0, 0%, 100%, 0.3) inset,
  0 0.5em 1em rgba(0, 0, 0, 0.6);

  .clicaptcha-imgbox {
    position: relative;

    .clicaptcha-img {
      width: 350px;
      height: 200px;
      border: none;
    }

    .step {
      position: absolute;
      width: 20px;
      height: 20px;
      line-height: 20px;
      font-size: 14px;
      font-weight: bold;
      text-align: center;
      color: #f04848;
      border: 3px solid #f04848;
      background-color: #fff;
      border-radius: 30px;
      box-shadow: 0 0 10px #fff;
      -webkit-user-select: none;
      user-select: none;
    }
  }

  .clicaptcha-title {
    font-family: "Microsoft YaHei";
    height: 40px;
    line-height: 40px;
    font-size: 14px;
    text-align: center;
    color: #333;

    span {
      margin-left: 10px;
      font-size: 18px;
      font-weight: bold;
      color: #c00;

      &.clicaptcha-clicked {
        color: #069;
      }
    }
  }

  .clicaptcha-refresh-box {
    position: relative;
    //margin-top: 10px;
  }

  .clicaptcha-refresh-line {
    position: absolute;
    top: 16px;
    width: 140px;
    height: 1px;
    background-color: #ccc;
  }

  .clicaptcha-refresh-line-l {
    left: 5px;
  }

  .clicaptcha-refresh-line-r {
    right: 5px;
  }

  .clicaptcha-refresh-btn {
    display: block;
    margin: 0 auto;
    width: 32px;
    height: 32px;
    background: url(../assets/refresh.png) no-repeat;

    &:hover {
      background-position: -32px 0;
    }
  }
}

#clicaptcha-mask {
  position: fixed;
  z-index: 9999;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  opacity: 0.5;
  background-color: rgb(0, 0, 0);
}
</style>
