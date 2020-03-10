<template>
  <view class="container">
    <button type="default" id="submit-btn" @click="onSubmit">立即测试</button>
    <!-- 首页内容图片 -->
    <view class="details">
      <!-- <image src="../../static/details-1.jpg" mode="widthFix" :lazy-load="true"/> -->
    </view>
    <!-- 评论 -->
    <view class="comment-box">
      <!-- <view class="header">
        <image src="../../static/header.png" mode="widthFix" />
        <text>评论块标题</text>
      </view> -->
      <!-- <view class="comment-tag">
        <view class="tag active">测得准(268213)</view>
        <view class="tag">内容详细(115633)</view>
        <view class="tag">被治愈了(301542)</view>
        <view class="tag">建议有效(464532)</view>
        <view class="tag">有用(546451)</view>
        <view class="tag active">很专业(225321)</view>
      </view> -->
      <view class="comment-list">
        <swiper
          class="swiper"
          :vertical="true"
          :display-multiple-items="3"
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
    </view>
    <!-- 底部固定的测算按钮 -->
    <view :class="[{ 'footer-fixed': isFixed }, { footer: true }]">
      <button type="default" @click="onSubmit">立即测试</button>
    </view>
  </view>
</template>

<script>
// #ifdef H5
import { setRouterHijack } from "../../utils/utils";
// #endif
import { mapState, mapMutations } from "vuex";
import { getIndexUrl } from "../../api/index.js";
import evaluate from "../../utils/evaluate.json";
export default {
  data() {
    return {
      submitTop: 500,
      isFixed: false,
      comment: evaluate,
      top: 0,
      result_url: null
    };
  },
  computed: {
    ...mapState(["path_id", "price"])
  },
  watch: {
    path_id(newValue) {
      if (newValue) {
        this.getLink();
      }
    }
  },
  onLoad(option) {
    setTimeout(() => {
      this.init();
    }, 500);
    if (this.path_id) {
      this.getLink();
    }
  },
  onPageScroll(e) {
    //#ifdef H5
    this.isFixed = e.scrollTop >= this.top + 44;
    //#endif

    // #ifndef H5
    this.isFixed = e.scrollTop >= this.top;
    // #endif
  },
  methods: {
    ...mapMutations(["set_price"]),
    onSubmit() {
      uni.navigateTo({
        url: "" //`/pages/answer/index?price=${this.price}&path_id=${this.path_id}`
      });
    },
    onLinkRecord() {
      if (this.result_url) {
        window.location.assign(this.result_url);
      } else {
        uni.navigateTo({
          url: "/pages/record/index"
        });
      }
    },
    init() {
      uni
        .createSelectorQuery()
        .select("#submit-btn")
        .boundingClientRect(res => {
          if (res) {
            this.submitTop = res.top;
          }
        })
        .exec();
    },
    getLink() {
      getIndexUrl({ path_id: this.path_id, type: 1 }).then(res => {
        if (res.code == 200) {
          const { price, back_url, result_url } = res.data;
          this.set_price(price);
          //#ifdef H5
          this.result_url = result_url;
          let callbackUrl = this.$route.query.callbackUrl;
          if (callbackUrl || res.data.back_url) {
            setRouterHijack(
              1,
              callbackUrl ? window.atob(callbackUrl) : res.data.back_url
            );
          }
          //#endif
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
.container {
  background-color: #f7f7f7;
  position: relative;
}
</style>
