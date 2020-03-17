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
      您的个人信息仅用于生成分析报报告，不会用于其他用途
    </view>
    <view class="protocol-link">
      <view>已为{{ number }}人生成报告</view>
      <view :style="{ color: theme }" @click="$emit('redirect')"
        >点击查看历史订单</view
      >
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
  margin: 0 auto;
  color: #fff;
}
.protocol {
  display: flex;
  align-items: center;
}
.protocol image {
  width: 32rpx;
  height: 32rpx;
}
.protocol text {
  font-size: 28rpx;
  color: #fff;
}
.protocol-tips {
  line-height: 72rpx;
  font-size: 26rpx;
}
.protocol-link {
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  font-size: 26rpx;
}
.protocol-link view:nth-of-type(2) {
  font-size: 32rpx;
  text-decoration: underline;
}
</style>
