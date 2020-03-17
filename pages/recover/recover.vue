<template>
  <view class="container">
    <view class="header">
      <image src="../../static/recover-banner.jpg" mode="widthFix"></image>
    </view>

    <view class="content-main">
      <image
        src="../../static/recover-title.png"
        mode="widthFix"
        class="title"
      ></image>
      <view class="text title">亲爱的测试者：</view>
      <view class="text detail">
        测算后你将可以获得你的专属财商报告
        你的财商指数有多高？处于什么水平？<text class="font-red"
          >如何提高财商？如何更快升职加薪？</text
        >仅需一杯饮料的价格，既可以知晓自身财商，错过本次机会，将立即恢复原价！
      </view>
      <view class="box">
        <view class="box-header">
          咨询项目：专业财商评估
        </view>
        <view class="box-content">
          <view class="box-inner">
            <view class="text c1">解密内容：财商指数，如何提高财商</view>
            <view class="text c2">
              <text>原价：￥188.80</text>
              <text>现时优惠倒计时</text>
            </view>
            <view class="text c3">
              <view class="c-left">
                <text class="jieyuan">结缘价</text>
                <text class="price">￥{{ price }}</text>
              </view>
              <view class="text c-right">
                00:{{ time.m | formatTime }}:{{ time.s | formatTime }}
              </view>
            </view>
          </view>
        </view>
      </view>
      <view class="num">
        <view class="text" style="font-size:28rpx">
          已有<text class="font-red">3548218</text>人测算
        </view>
        <view class="text" style="font-size:28rpx">
          好评率：<text class="text font-red">98.9%</text>
        </view>
      </view>
      <view class="btn" @click="onSubmit('MP')">立即支付</view>
    </view>
    <!-- 协议 -->
    <view style="padding:36rpx 0 24rpx;">
      <yz-protocol
        v-model="protocol"
        @redirect="toReport"
        @protocol="protocolVisible = true"
      />
    </view>
    <!-- 评论 -->
    <view class="comment-box">
      <swiper
        class="swiper"
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
    <!-- 客服弹框 -->
    <service-dialog
      class="service-dialog"
      :visible.sync="serviceVisible"
      :bgImage="require('../../static/bg-kefu.png')"
      :baseUrl="baseUrl"
    >
    </service-dialog>
    <!-- 协议内容弹框 -->
    <protocol-dialog
      :visible.sync="protocolVisible"
      @set-protocol="protocol = true"
    ></protocol-dialog>
    <!--  -->
    <!-- #ifdef H5 -->
    <pay-dialog
      :visible.sync="payVisible"
      title="2020你会成为有钱人吗"
      @success="onSubmit"
    ></pay-dialog>
    <!-- #endif -->
  </view>
</template>

<script>
// #ifdef H5
import payDialog from "yz-utils/pay-dialog/pay-dialog";
// #endif
import comment from "@/utils/evaluate.json";
import serviceDialog from "yz-utils/service-dialog/service-dialog";
import protocolDialog from "yz-utils/protocol-dialog/protocol-dialog";
import yzProtocol from "@/components/yz-protocol";
import { mapGetters } from "vuex";
import { doPay, getResult } from "@/api";
import request from "@/api/request";

export default {
  data() {
    return {
      baseUrl: request.config.baseUrl,
      time: {
        m: 0,
        s: 0
      },
      payVisible: false,
      serviceVisible: false,
      protocol: true,
      protocolVisible: false,
      disabledBtn: false,
      result_url: uni.getStorageSync("result_url"),
      comment
    };
  },
  onLoad(option) {
    console.log("onLoad======", JSON.stringify(option));
    this.user_id = option.user_id;
    this.countDown();
  },
  onShow() {
    this.recordUv(10);

    if (this.user_id === undefined) {
      uni.showModal({
        content: "缺少参数！",
        success(res) {
          uni.navigateTo({
            url: "/pages/index/index"
          });
        }
      });
    }
  },
  filters: {
    formatTime(num) {
      return num < 10 ? "0" + num : num;
    }
  },
  computed: mapGetters(["path_id", "price", "tid", "openid"]),
  components: {
    // #ifdef H5
    payDialog,
    // #endif
    serviceDialog,
    yzProtocol,
    protocolDialog
  },
  methods: {
    countDown(num = 900) {
      let m = parseInt(num / 60),
        s = num % 60;
      this.time.m = m;
      this.time.s = s;
      --num;
      if (num > 0) {
        setTimeout(() => {
          this.countDown(num);
        }, 1000);
      }
    },
    toReport() {
      if (this.result_url && window) {
        window.location.assign(this.result_url);
      } else {
        uni.navigateTo({
          url: `/pages/report/report?path_id=${this.path_id}`
        });
      }
    },
    onSubmit(e) {
      let zwGameId = uni.getStorageSync("zwGameId");
      // #ifdef H5
      // H5环境下先弹框提示支付方式
      if (e === "MP") {
        this.payVisible = true;
        return false;
      }
      // #endif
      if (this.disabledBtn) return false;

      let params = {
        path_id: this.path_id,
        user_id: this.user_id,
        // #ifdef H5
        callback: encodeURIComponent(
          `${window.location.origin}/uni/toff2020#/pages/result/result`
        ),
        callbackType: 1,
        // #endif
        // #ifdef MP
        is_toutiao: 1,
        tid: this.tid,
        openid: this.openid
        // #endif
      };
      // e==2 支付宝直接进行重定向跳转
      if (zwGameId) {
        params.channel = "zhiwu";
        params.zwGameId = zwGameId;
      }
      if (e === 2) {
        params.is_alipay = 1;
        return doPay(params, 2);
      }
      this.recordUv(11);
      this.disabledBtn = true;
      doPay(params)
        .then(res => {
          let { service, orderInfo, user_id } = res.data;
          // #ifdef H5
          if (zwGameId) {
            zwDivine.payIndex(res.data);
          } else {
            window.location.href = res.data.url;
          }
          // #endif
          // #ifdef MP-TOUTIAO
          tt.pay({
            service,
            orderInfo,
            success: pay_info => {
              this.disabledBtn = false;
              if (pay_info.code === 0) {
                uni.navigateTo({
                  url: "/pages/result/result?yz_id=" + user_id
                });
              } else {
                uni.showToast({
                  title: "支付失败！",
                  duration: 1500,
                  icon: "none"
                });
              }
            },
            fail: pay_err => {
              this.disabledBtn = false;
              uni.showToast({
                title: "支付错误:" + pay_err.errCode,
                duration: 2000,
                icon: "none"
              });
            },
            getOrderStatus: order => {
              let { out_order_no } = order;
              return new Promise((resolve, reject) => {
                getResult({ user_id })
                  .then(res => {
                    if (res.code === 200) {
                      resolve({ code: 0 });
                    } else {
                      resolve({ code: 2 });
                    }
                  })
                  .catch(err => {
                    reject(err);
                  });
              });
            }
          });
          // #endif
        })
        .catch(() => {
          this.disabledBtn = false;
        });
    }
  }
};
</script>

<style scoped>
.container {
  background: #e94755;
  color: #383838;
}
.header {
  margin-bottom: -300rpx;
}
.content-main {
  width: 710rpx;
  position: relative;
  z-index: 11;
  margin: 0 auto;
  padding: 100rpx 60rpx 50rpx;
  background: #fff4e2;
  border-radius: 30rpx;
}
image.title {
  width: 536rpx;
  height: 93rpx;
  position: absolute;
  left: 87rpx;
  top: -22rpx;
}
.font-red {
  color: #d01b13;
}
.title {
  font-size: 32rpx;
  font-weight: bolder;
}
.detail {
  font-size: 30rpx;
  margin-top: 15rpx;
  text-align: justify;
  letter-spacing: 3rpx;
  line-height: 46rpx;
}
.box .box-header {
  background: #cf2908;
  color: #ffffff;
  font-size: 32rpx;
  text-align: center;
  padding: 16rpx;
  border-radius: 10rpx 10rpx 0 0;
  margin-top: 38rpx;
}
.box .box-content {
  border: 2px solid #d01b13;
  border-radius: 0 0 10rpx 10rpx;
  margin-bottom: 20rpx;
}
.box-inner {
  width: 90%;
  margin: 0 auto;
}
.box-content .c1 {
  font-size: 28rpx;
  height: 67rpx;
  line-height: 65rpx;
  text-align: left;
  position: relative;
}
.box-content .c1:after {
  content: "";
  width: 100%;
  position: absolute;
  height: 0.5px;
  left: 0;
  bottom: 0;
  background: #383838;
}
.box-content .c2 {
  height: 67rpx;
  display: flex;
  line-height: 65rpx;
  justify-content: space-between;
}
.service-dialog {
  font-size: 32rpx;
}
.c2 > text {
  font-size: 28rpx;
}
.box-content .c3 {
  height: 75rpx;
  display: flex;
  justify-content: space-between;
}
.pdd {
  margin: 0 9rpx;
}
.num {
  display: flex;
  justify-content: space-between;
}
.c3 .jieyuan {
  display: inline-block;
  vertical-align: middle;
  color: #ffffff;
  font-size: 28rpx;
  width: 143rpx;
  height: 41rpx;
  background: #f94b4a;
  border-radius: 7rpx;
  text-align: center;
  line-height: 40rpx;
}
.c3 .price {
  display: inline-block;
  vertical-align: middle;
  font-size: 36rpx;
  font-weight: bolder;
}
.c-right {
  font-size: 30rpx;
  color: #d93232;
}
.font-red {
  color: #d93232;
}
.btn {
  color: #ffffff;
  font-size: 38rpx;
  background: #4ccd6b;
  border-radius: 10rpx;
  height: 81rpx;
  line-height: 79rpx;
  text-align: center;
  margin-top: 21rpx;
}
.tiaokuan {
  display: flex;
  margin-top: 34rpx;
  align-items: center;
}
.tiaokuan .icon {
  width: 23rpx;
  height: 23rpx;
}
.tiaokuan > div {
  margin-left: 6rpx;
  vertical-align: middle;
  font-size: 26rpx;
}
.tiaokuan > div > span {
  color: #4ba4ff;
}
.text {
  font-size: 30rpx;
  line-height: 44rpx;
}
.font-red {
  color: #cf2908;
}
.bottom {
  width: 100%;
  display: flex;
  justify-content: space-between;
}
.bottom text {
  font-size: 27.95rpx;
  color: #44a5ff;
}
.bottom .right text {
  text-decoration: underline;
}
.comment-box {
  background: url("../../static/index-comment.jpg") no-repeat left top / cover;
  height: 1232rpx;
  padding: 310rpx 66rpx 180rpx;
}
.swiper {
  height: 100%;
}
.comment-item {
  padding: 18rpx 0 24rpx;
  border-bottom: 1px solid #ffa380;
}
.comment-name {
  font-size: 30rpx;
  margin-bottom: 12rpx;
}
.comment-text {
  font-size: 26rpx;
  font-weight: lighter;
  line-height: 36rpx;
}
</style>
