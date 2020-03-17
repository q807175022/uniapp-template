<template>
  <view class="container">
    <view class="result-box score-box">
      <view class="score-title">你的财商整体评分为：</view>
      <view class="total-score"> {{ animateNumber }}<text>分</text></view>
      <view class="score-tips">
        满分100分，得分越高说明财商越高，成功可能性越高
      </view>
      <view class="ratio-box">
        超过 <text v-if="detail">{{ detail.score[1] }}%</text> 的人
      </view>
    </view>
    <template v-if="!!detail">
      <!-- 财商概述 -->
      <view class="result-box">
        <image
          class="title"
          style="width:482rpx;"
          src="../../static/result-title1.png"
          mode="widthFix"
        />
        <view class="context">
          {{ detail.wealth_survey.data1 }}
        </view>
      </view>
      <!-- TA与你的财商相似 -->
      <view class="result-box">
        <image
          class="title"
          style="width:564rpx;"
          src="../../static/result-title2.png"
          mode="widthFix"
        />
        <view class="star-box  fl">
          <image :src="detail.wealth_survey.url_img" mode="widthFix" />
          <view class="star-name">{{ detail.wealth_survey.data4 }}</view>
        </view>
        <view class="context">
          {{ detail.wealth_survey.data2 }}
        </view>
      </view>
      <!-- 财商偏向占比图 -->
      <view class="result-box">
        <image
          class="title"
          style="width:564rpx;"
          src="../../static/result-title2.png"
          mode="widthFix"
        />
        <view class="proportion-box">
          <view class="proportion-line">
            <view class="proportion-item">
              <view
                class="proportion-progress"
                :style="{
                  width: proportionData[0][0]
                }"
              ></view>
            </view>
            <view class="proportion-name">较强(S)</view>
          </view>
          <view class="proportion-line right">
            <view class="proportion-item">
              <view
                class="proportion-progress"
                :style="{
                  width: proportionData[0][1]
                }"
              ></view>
            </view>
            <view class="proportion-name right">较弱(W)</view>
          </view>
          <view class="proportion-line">
            <view class="proportion-item">
              <view
                class="proportion-progress"
                :style="{
                  width: proportionData[1][0]
                }"
              ></view>
            </view>
            <view class="proportion-name">匮乏(P)</view>
          </view>
          <view class="proportion-line right">
            <view class="proportion-item">
              <view
                class="proportion-progress"
                :style="{
                  width: proportionData[1][1]
                }"
              ></view>
            </view>
            <view class="proportion-name right">丰富(D)</view>
          </view>
          <view class="proportion-line">
            <view class="proportion-item">
              <view
                class="proportion-progress"
                :style="{
                  width: proportionData[2][0]
                }"
              ></view>
            </view>
            <view class="proportion-name">不足(S)</view>
          </view>
          <view class="proportion-line right">
            <view class="proportion-item">
              <view
                class="proportion-progress"
                :style="{
                  width: proportionData[2][1]
                }"
              ></view>
            </view>
            <view class="proportion-name">充足(I)</view>
          </view>
        </view>
        <view class="proportion-tips" id="proportion-position">
          <image src="../../static/icon-help-black.svg" mode="widthFix" />
          <text>
            倾向示意图表示三个维度。从这可以大概判断你的基本心理。本图没有好坏之分，只做心理分析。
          </text>
        </view>
        <view class="context proportion-type">
          从你的财商占比图可以看出，你的财商偏向占比为
          <text>{{ detail.type.evidence }}型</text>
        </view>
        <view class="subtitle">观念分析</view>
        <view class="context">
          {{ detail.type.data1 }}
        </view>
        <view class="subtitle">知识分析</view>
        <view class="context">
          {{ detail.type.data2 }}
        </view>
        <view class="subtitle">行为分析</view>
        <view class="context">
          {{ detail.type.data3 }}
        </view>
      </view>
      <!-- 你的财富影响因素 -->
      <view class="result-box">
        <image
          class="title"
          style="width:564rpx;"
          src="../../static/result-title3.png"
          mode="widthFix"
        />
        <view class="factor-chart">
          <text class="factor-name one">日常理财</text>
          <text class="factor-name two">财务决策</text>
          <text class="factor-name three">资产、债务管理</text>

          <view
            class="left"
            :style="{
              borderLeftWidth: factorData[1],
              borderRightWidth: factorData[1],
              borderBottomWidth: factorData[0],
              borderTopWidth: factorData[0]
            }"
          ></view>
          <view
            class="right"
            :style="{
              borderRightWidth: factorData[2],
              borderLeftWidth: factorData[2],
              borderBottomWidth: factorData[0],
              borderTopWidth: factorData[0]
            }"
          ></view>
        </view>

        <view class="factor-tips" id="factor-position">
          *某因素得分越高,证明这方面能力越好*
        </view>
        <view class="subtitle">日常理财能力</view>
        <view class="context">
          {{ detail.wealth[1][0] }}
        </view>
        <view class="subtitle">财务决策能力</view>
        <view class="context">
          {{ detail.wealth[1][1] }}
        </view>
        <view class="subtitle">资产、债务管理能力</view>
        <view class="context">
          {{ detail.wealth[1][2] }}
        </view>
      </view>
      <!-- 你的投资风险偏好 -->
      <view class="result-box">
        <image
          class="title"
          style="width:564rpx;"
          src="../../static/result-title4.png"
          mode="widthFix"
        />
        <view class="risk-chart">
          <view
            class="risk-item m"
            :style="{ height: riskData.m * 90 + 'rpx' }"
          >
            <view class="name">冒险</view>
          </view>
          <view
            class="risk-item b"
            :style="{ height: riskData.b * 90 + 'rpx' }"
          >
            <view class="name">保守</view>
          </view>
        </view>
        <view class="context" id="risk-position">
          {{ detail.investment["data" + detail.investment.evidence] }}
        </view>
      </view>
      <!-- 专属建议 -->
      <view class="result-box">
        <image
          class="title"
          style="width:564rpx;"
          src="../../static/result-title5.png"
          mode="widthFix"
        />
        <view class="context">
          {{ detail.wealth_survey.data3 }}
        </view>
      </view>
    </template>
  </view>
</template>

<script>
import { getResult } from "@/api";
import { jsonToQuery } from "../../utils/utils";
export default {
  name: "result",
  data() {
    let systemInfo = uni.getSystemInfoSync();
    return {
      windowHeight: systemInfo.windowHeight,
      animateNumber: 0,
      detail: null,
      proportion: [
        // 偏向占比图数据
        0,
        0,
        0
      ],
      factor: [
        //3因素图
        0,
        0,
        0
      ],

      risk: 0, // 投资偏好图
      riskTop: 1500,
      factorTop: 1000,
      proportionTop: 800
    };
  },
  computed: {
    proportionData() {
      return this.proportion.map(v => {
        return [
          v < 0 ? (v * -100) / 5 + "%" : 0,
          v > 0 ? (v * 100) / 5 + "%" : 0
        ];
      });
    },
    factorData() {
      return this.factor.map(v => {
        return v * 6 + "rpx";
      });
    },
    riskData() {
      if (this.risk === 0) {
        return { m: 0, b: 0 };
      } else if (this.risk == 1) {
        return { m: 1, b: 2 };
      } else if (this.risk == 2) {
        return { m: 2, b: 1 };
      }
    }
  },
  onLoad(option) {
    this.getResult(option.yz_id);
    setTimeout(() => {
      this.recordUv(8);
    });
  },
  methods: {
    getResult(user_id) {
      getResult({ user_id, is_toutiao: 1 })
        .then(res => {
          this.detail = res.data;
          this.numberAnimation(res.data.score[0]);
          setTimeout(() => {
            this.init();
          }, 500);
        })
        .catch(res => {
          console.log(res);

          if (res.msg.indexOf("支付失败") !== -1) {
            uni.setStorageSync("path_id", res.data.path_id);
            uni.setStorageSync("price", res.data.price);
            uni.showModal({
              title: "提示",
              content: res.msg,
              showCancel: false,
              success() {
                uni.redirectTo({
                  url: `/pages/recover/recover?${jsonToQuery(res.data)}`
                });
              }
            });
          }
        });
    },
    numberAnimation(end_num) {
      let timer = setInterval(() => {
        this.animateNumber += 1;
        if (this.animateNumber >= end_num - 1) {
          clearInterval(timer);
        }
      }, 24);
    },
    init() {
      // 查询图表位置
      uni
        .createSelectorQuery()
        .select("#proportion-position")
        .boundingClientRect(res => {
          if (res) {
            this.proportionTop = res.top - this.windowHeight;
          }
        })
        .exec();

      uni
        .createSelectorQuery()
        .select("#factor-position")
        .boundingClientRect(res => {
          if (res) {
            this.factorTop = res.top - this.windowHeight;
          }
        })
        .exec();
      uni
        .createSelectorQuery()
        .select("#risk-position")
        .boundingClientRect(res => {
          if (res) {
            this.riskTop = res.top - this.windowHeight;
          }
        })
        .exec();
    }
  },
  onPageScroll(e) {
    if (e.scrollTop > this.proportionTop && this.proportion[0] === 0) {
      this.proportion = this.detail.type.tu;
    }
    if (e.scrollTop > this.factorTop && this.factor[0] === 0) {
      this.factor = this.detail.wealth[0];
    }
    if (e.scrollTop > this.riskTop && this.risk === 0) {
      this.risk = this.detail.investment.evidence;
    }
  }
};
</script>

<style lang="scss" scoped>
.container {
  background-color: #e94755;
}
.result-box {
  width: 710rpx;
  margin: 0 auto 70rpx;
  padding: 70rpx 30rpx 42rpx;
  background-color: #fff4e2;
  border-radius: 30rpx;
  position: relative;
}
.result-box.score-box {
  margin-top: 40rpx;
  padding-bottom: 180rpx;
}
.score-title {
  font-size: 38rpx;
  color: #ff6316;
  text-align: center;
  font-weight: bolder;
}
.total-score {
  width: 292rpx;
  height: 292rpx;
  margin: 24rpx auto;
  display: flex;
  align-items: center;
  justify-content: center;
  background: url("../../static/result-score-bg.png") no-repeat center center /
    cover;
  color: #e97130;
  font-size: 96rpx;
  text {
    color: #e97130;
    font-size: 72rpx;
  }
}
.score-tips {
  color: #ff9b65;
  font-size: 24rpx;
  text-align: center;
  font-weight: lighter;
}
.ratio-box {
  font-size: 32rpx;
  color: #383838;
  position: absolute;
  bottom: 80rpx;
  left: 50%;
  transform: translateX(-50%);
  white-space: nowrap;
  text {
    color: #ff6316;
    font-size: 66rpx;
    font-weight: bolder;
    margin: 0 12rpx;
  }
  &::before {
    content: "";
    display: block;
    background: url("../../static/result-score-border.png") no-repeat;
    background-size: contain;
    width: 138rpx;
    height: 11rpx;
    position: absolute;
    left: 105%;
    bottom: 18rpx;
    transform: scaleX(-1);
  }
  &::after {
    content: "";
    display: block;
    background: url("../../static/result-score-border.png") no-repeat;
    background-size: contain;
    width: 138rpx;
    height: 11rpx;
    position: absolute;
    bottom: 18rpx;
    right: 105%;
  }
}
image.title {
  height: 95rpx;
  position: absolute;
  left: 50%;
  top: -22rpx;
  transform: translateX(-50%);
}
.context {
  margin-top: 30rpx;
  font-size: 32rpx;
  line-height: 48rpx;
  letter-spacing: 4rpx;
  text-align: justify;
  color: #333;
}
.fl {
  float: left;
}
.star-box {
  width: 248rpx;
  position: relative;
  padding-bottom: 40rpx;
  margin: 36rpx 24rpx 0 0;
  border-radius: 12rpx 12rpx 0 0;
  overflow: hidden;
  .star-name {
    position: absolute;
    bottom: 0;
    left: 0;
    width: 100%;
    background-color: #fed48d;
    color: #fe6215;
    text-align: center;
    line-height: 50rpx;
    font-size: 30rpx;
    border-radius: 12rpx;
  }
}
.proportion-box {
  width: 650rpx;
  height: 373rpx;
  background: url("../../static/chart-bg2.png") no-repeat;
  background-size: contain;
  margin: 24rpx auto;
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  justify-content: space-around;
  padding: 0 12rpx 50rpx;
  .proportion-line {
    flex: 0 0 290rpx;
  }
  .proportion-item {
    width: 100%;
    height: 38rpx;
    background-color: #fff4e2;
    border: 1px solid #ff9548;
    overflow: hidden;
    position: relative;
  }
  .proportion-name {
    color: #ff9548;
    font-size: 28rpx;
    padding: 12rpx 0 0;
  }
  .proportion-progress {
    background-color: #ffe094;
    width: 0;
    height: 100%;
    position: absolute;
    right: 0;
    top: 0;
    transform-origin: right center;
    transition: 1000ms linear;
  }
}
.proportion-line.right .proportion-name {
  text-align: right;
}
.proportion-line.right .proportion-progress {
  right: auto;
  left: 0;
  transform-origin: left center;
}
.proportion-tips {
  display: flex;
  align-items: center;
  text {
    color: #999999;
    font-size: 24rpx;
    line-height: 36rpx;
    padding-left: 6rpx;
  }
  image {
    flex: 0 0 36rpx;
    width: 36rpx;
    height: 36rpx;
  }
}
.proportion-type {
  text {
    color: #ff6316;
  }
}
.subtitle {
  font-size: 34rpx;
  color: #ff6316;
  font-weight: bolder;
  margin-top: 42rpx;
}
.factor-tips {
  color: #acacac;
  font-size: 24rpx;
  text-align: center;
  margin-bottom: 80rpx;
}
.factor-chart {
  width: 470rpx;
  height: 210rpx;
  margin: 50rpx auto 20rpx;
  position: relative;
  border-bottom: 1px solid #ff9548;
  &::before {
    content: "";
    display: block;
    position: absolute;
    left: 235rpx;
    bottom: 0;
    width: 1px;
    height: 200rpx;
    background-color: #ff9548;
    z-index: 3;
  }
  .factor-name {
    text-align: center;
    position: absolute;
    font-size: 28rpx;
    color: #ff9548;
    white-space: nowrap;
    transform: translateX(-50%);
    z-index: 1;
    &.one {
      bottom: 210rpx;
      left: 50%;
    }
    &.two {
      bottom: 20rpx;
      left: 0;
    }
    &.three {
      bottom: 20rpx;
      right: 0;
      transform: translateX(50%);
    }
  }
  .left {
    width: 0;
    height: 0;
    position: absolute;
    right: 50%;
    bottom: 0;
    border-color: #ffe094;
    border-style: solid;
    border-left-color: transparent;
    border-top-color: transparent;
    transition: 1200ms linear;
  }
  .right {
    width: 0;
    height: 0;
    position: absolute;
    left: 50%;
    bottom: 0;
    border-color: #ffe094;
    border-style: solid;
    border-right-color: transparent;
    border-top-color: transparent;
    transition: 1200ms linear;
  }
}
.risk-chart {
  width: 596rpx;
  height: 238rpx;
  background: url("../../static/chart-bg1.png") no-repeat;
  background-size: contain;
  margin: 24rpx auto 72rpx;
  display: flex;
  align-items: flex-end;
  justify-content: space-around;
  padding: 0 80rpx 0;
  .risk-item {
    transition: 800ms linear;
    position: relative;
    width: 40rpx;
    height: 0;
    &.m {
      background-color: #ffa8a6;
    }
    &.b {
      background-color: #7cb8f6;
    }
    .name {
      white-space: nowrap;
      font-size: 28rpx;
      text-align: center;
      position: absolute;
      bottom: -42rpx;
      left: 50%;
      transform: translateX(-50%);
    }
  }
}
</style>
