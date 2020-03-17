<template>
  <view class="container">
    <index-tips></index-tips>
    <image
      src="../../static/index-banner.jpg"
      mode="widthFix"
      :lazy-load="true"
    />
    <image
      src="../../static/index-banner2.jpg"
      mode="widthFix"
      :lazy-load="true"
    />
    <button type="default" id="submit-btn"  class="submit-btn" @click="onSubmit">
      <image mode="widthFix" src="../../static/index-btn.png" alt="立即测试">
    </button>
    <view class="navs">
      <view class="service-nav" @click="serviceVisible = true"><image src="../../static/icon-help.svg" mode="widthFix" /><text>联系客服</text></view>
      <view class="history-nav" @click="toReport"><text>点击查看历史订单</text></view>
    </view>
    <!-- 首页内容图片 -->
    <view class="details">
      <image
        src="../../static/index-image1.jpg"
        mode="widthFix"
        :lazy-load="true"
      />
      <image
        src="../../static/index-image2.jpg"
        mode="widthFix"
        :lazy-load="true"
      />
      <image
        src="../../static/index-image3.jpg"
        mode="widthFix"
        :lazy-load="true"
      />
      <image
        src="../../static/index-image4.jpg"
        mode="widthFix"
        :lazy-load="true"
      />
      <image
        src="../../static/index-image5.jpg"
        mode="widthFix"
        :lazy-load="true"
      />
    </view>
    <!-- 评论 -->
    <view class="comment-box">
      <swiper
        class="swiper"
        :circular="true"
        :vertical="true"
        :display-multiple-items="4"
        :autoplay="true"
        :disable-touch="true"
        :interval="3000"
        :duration="1000"
      >
        <swiper-item v-for="(item, index) in comment" :key="index">
          <view class="comment-item">
            <view class="comment-name">{{ item.name }}</view>
            <view class="comment-text">{{ item.content }}</view>
          </view>
        </swiper-item>
      </swiper>
    </view>
    <!-- 底部固定的测算按钮 -->
    <view :class="[{'footer-fixed': isFixed }, { footer: true }]">
      <button type="default" class="submit-btn" @click="onSubmit">
        <image mode="widthFix" src="../../static/index-btn.png" alt="立即测试">
      </button>
    </view>

    <!-- 客服组件 -->
    <service-dialog
      :visible.sync="serviceVisible"
      :bg-image="require('../../static/bg-kefu.png')"
      :base-url="baseUrl"
    />
     <button class="generalize-btn" @tap="generalize" v-show="agent_id && !_pathid">
      推广赚钱
    </button>
  </view>
</template>

<script>
// #ifdef H5
import { setRouterHijack } from "../../utils/utils";
// #endif
import { mapGetters, mapMutations } from "vuex";
import { getIndexUrl } from "../../api/index.js";
import request from "../../api/request"
import evaluate from "../../utils/evaluate.json";
import serviceDialog from "yz-utils/service-dialog/service-dialog"
import indexTips from "yz-utils/index-tips/index-tips"

export default {
  data() {
    return {
      baseUrl:request.config.baseUrl,
      submitTop: 500,
      serviceVisible:false,
      isFixed: false,
      _pathid:null,
      comment: evaluate,
      result_url: null
    };
  },
  computed: {
    ...mapGetters(["path_id", "price","agent_id"])
  },
  components: {
    serviceDialog,indexTips
  },
  onLoad(option) {
    this._pathid = option.path_id
    setTimeout(() => {
      this.init();
      this.recordUv(1)
    }, 500);
    //#ifdef H5
    this.$nextTick(()=>{
      this.getLink();
    })
    //#endif
  },
  onPageScroll(e) {
    this.isFixed = e.scrollTop >= this.submitTop;
  },
  methods: {
    ...mapMutations('index',["set_price"]),
    generalize(){
      uni.reLaunch({
        url: "/pages/index/index?path_id=" + this.path_id
      });
    },
    onSubmit() {
      this.recordUv(4)
      uni.navigateTo({
        url: `/pages/answer/answer?path_id=${this.path_id}` //`/pages/answer/index?price=${this.price}&path_id=${this.path_id}`
      });
    },
    toReport() {
      //#ifdef H5
      window.location.assign(this.result_url);
      //#endif
      //#ifdef MP
      uni.navigateTo({
        url: `/pages/report/report?path_id=${this.path_id}`
      });
      //#endif
        
      
    },
    init() {
      uni
        .createSelectorQuery()
        .select("#submit-btn")
        .boundingClientRect(res => {
          if (res) {
            this.submitTop = res.top + 60;
          }
        })
        .exec();
    },
    getLink() {
      getIndexUrl({ path_id: this.path_id, type: 1 ,is_toutiao: 1}).then(res => {
        if (res.code == 200) {
          const { price, back_url, result_url } = res.data;
          
          this.set_price(price);
          this.result_url = result_url;
          uni.setStorageSync('result_url',result_url)
          let callbackUrl = this.$route.query.callbackUrl;
          if (callbackUrl || res.data.back_url) {
            setRouterHijack(
              1,
              callbackUrl ? window.atob(callbackUrl) : res.data.back_url
            );
          }
        }
      });
    }
  },
  onHide() {
    //#ifdef H5
    setRouterHijack();
    //#endif
  }
};
</script>

<style lang="scss">
.generalize-btn{
  font-size:28rpx;
  color: #fff;
  line-height: 36rpx;
  position: fixed;
  right: 0;
  top: 560rpx;
  width: 56rpx;
  z-index: 90;
  padding:18rpx 14rpx;
  background-color:#FF8514;
  border-radius: 12rpx 0 0 12rpx;
}
.container {
  background-color: #EA4655;
  position: relative;
  padding-bottom: 100rpx;
}
.submit-btn{
  width: 646rpx;
  height: 106rpx;
  background-color: transparent;
  position:absolute;
  left:52rpx;
  top:1000rpx;
  transform: scale(1);
  animation: btn-scale linear 1200ms infinite alternate;
}
@keyframes btn-scale{
  0%{ transform: scale(1);}
  100%{ transform: scale(.92);}
}
.footer{
  width: 100%;
  height: 150rpx;
  background-color: rgba($color: #000000, $alpha: 0.4);
  position: fixed;
  left: 0;
  bottom: 0;
  display: none;
  animation: fade-in linear 300ms;
  &.footer-fixed{
    display: block;
  }
}
@keyframes fade-in{
  0%{opacity: 0;}
  100%{opacity: 1;}
}
.footer .submit-btn{
  top: 20rpx;
}
.navs{
  width: 646rpx;
  position:absolute;
  left:52rpx;
  top:1136rpx;
  display: flex;
  justify-content: space-between;
  font-size:28rpx;
  .service-nav{
    display: flex;
    white-space: nowrap;
    align-items: center;
    image{
      width:30rpx;
      height: 30rpx;
      margin-right: 12rpx;
    }
  }
  .history-nav{
    position: relative;
    &::after{
      content: "";
      display: block;
      background-color:#FFF4E2;
      height: 1px;
      width: 100%;
      left: 0;
      bottom: -6rpx;
      position: absolute;
    }
  }
  text{
    color:#FFF4E2;
  }
}
.comment-box{
  background: url("../../static/index-comment.jpg") no-repeat left top / cover;
  height: 1232rpx;
  padding: 310rpx 66rpx 180rpx;
  .swiper{
    height: 100%;
  }
  .comment-item{
    padding: 18rpx 0 24rpx;
    border-bottom: 1px solid #FFA380;
  }
  .comment-name{
    font-size: 30rpx;
    margin-bottom: 12rpx;
  }
  .comment-text{
    font-size: 26rpx;
    line-height: 36rpx;
  }
}
</style>
