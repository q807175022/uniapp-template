<template>
  <view class="protocol-container">
    <view class="protocol">
      <image
        :src="value ? icon_checked : icon_uncheck"
        mode="widthFix"
        @click="$emit('input', !value)"
      />
      <text>
        我已阅读并同意
      </text>
      <text :style="{ color: theme }" @click="$emit('protocol')">
        《易知用户隐私协议》
      </text>
    </view>
    <view class="protocol-tips">
      <view>您的个人信息仅用于生成分析报报告，不会用于其他用途</view>
      <!-- #ifdef MP -->
      <view>本产品仅供娱乐,测试结果与平台无关!</view>
      <!-- #endif -->
    </view>
    <view class="protocol-link">
      <view class="service-nav" @click="$emit('service')">
        <image src="../static/icon-help.svg" mode="widthFix" />
        <text :style="{ color: theme }">联系客服</text>
      </view>
      <view
        class="history-nav"
        :style="{ color: theme }"
        @click="$emit('redirect')"
      >
        点击查看历史订单
      </view>
    </view>
  </view>
</template>

<script>
export default {
  name: "yz-protocol",
  data() {
    return {
      icon_checked:
        "https://ttmini.oss-cn-shenzhen.aliyuncs.com/static_npm/icon-checked.svg",
      icon_uncheck:
        "https://ttmini.oss-cn-shenzhen.aliyuncs.com/static_npm/icon-uncheck.svg"
    };
  },
  props: {
    value: null,
    theme: {
      type: String,
      default: "#FFE5BC"
    },
    number: {
      type: Number,
      default: 1283241
    }
  },
  mounted() {},
  methods: {}
};
</script>

<style lang="scss" scoped>
.protocol-container {
  width: 690rpx;
  color: #fff;
  position: absolute;
  left: 30rpx;
  top: 1200rpx;
}
.protocol {
  display: flex;
  align-items: center;
}
.protocol image {
  width: 36rpx;
  height: 36rpx;
  margin-right: 12rpx;
}
.protocol text {
  font-size: 28rpx;
  color: #fff9f9;
}
.protocol-tips {
  font-size: 26rpx;
  color: #fff9f9;
  font-weight: lighter;
  padding: 16rpx 0;
}
.protocol-tips view {
  line-height: 42rpx;
}
.protocol-link {
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  font-size: 26rpx;
}
.service-nav {
  display: flex;
  align-items: center;
  white-space: nowrap;
  color: #ffe5bc;
  font-size: 30rpx;
  text-decoration: underline;
}
.service-nav image {
  width: 36rpx;
  height: 36rpx;
  margin-right: 12rpx;
}
.history-nav {
  position: relative;
  font-size: 30rpx;
  text-decoration: underline;
}
</style>
