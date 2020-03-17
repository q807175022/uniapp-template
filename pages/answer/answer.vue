<template>
  <scroll-view
    class="scroll section"
    scroll-y
    :style="{ height: windowHeight + 'px' }"
    scroll-with-animation
    :scroll-into-view="intoView"
  >
    <view class="container section">
      <view class="anim-box">
        <view class="question-box left">
          <image
            class="head"
            src="../../static/heads-left.png"
            mode="aspectFill"
          ></image>
          <view class="chat text">
            欢迎来到《专业财商评估》测试，1分钟，揭秘你的财商有多高！
          </view>
        </view>
        <view class="question-box right">
          <image
            class="head"
            src="../../static/heads-right.png"
            mode="aspectFill"
          ></image>
          <view class="chat text" @click="startGame">
            我们开始吧！<text style="font-weight:bold;">(点击开始)</text>
          </view>
        </view>
      </view>
      <block v-for="(test, idx) in tests" :key="idx">
        <cmd-transition class="transition" v-if="test.show" name="fade-up">
          <view class="anim-box">
            <view class="num" v-if="idx < 20"
              >{{ idx + 1 }}/{{ answerLength }}</view
            >
            <view class="question-box left">
              <image
                class="head"
                src="../../static/heads-left.png"
                mode="aspectFill"
              ></image>
              <view class="chat text option" v-if="!test.over">
                <text class="topic font-bolder">{{ test.title }}</text>
                <view class="option-card">
                  <view
                    class="item"
                    v-for="(item, i) in test.option"
                    :class="{ checked: i == test.checked }"
                    :key="i"
                    @click="toggleClass(idx, i)"
                  >
                    {{ item }}
                  </view>
                </view>
              </view>
              <view class="chat test" v-else>
                {{ test.content }}
              </view>
            </view>
            <cmd-transition
              class="transition"
              v-if="tests[idx].answer !== '' && !tests[idx].over"
              name="fade-up"
            >
              <view class="question-box right">
                <image
                  class="head"
                  src="../../static/heads-right.png"
                  mode="aspectFill"
                ></image>
                <view class="chat text">
                  {{ tests[idx].answer }}
                </view>
              </view>
            </cmd-transition>
          </view>
          <view
            class="into-view-box"
            :id="'into-' + idx"
            style="height: 56rpx;width:100%"
          ></view>
        </cmd-transition>
      </block>
    </view>
    <cmd-transition v-if="over || !tests[0].show" name="fade-up">
      <view class="checkview">
        <view class="btn" @click="onSubmit('MP')" v-if="over">
          立即查看测试结果
        </view>
        <view class="btn" @click="startGame" v-else>
          开始测试
        </view>
      </view>
    </cmd-transition>

    <!-- 支付确认 -->
    <!-- #ifdef H5 -->
    <pay-dialog
      :visible.sync="payVisible"
      title="2020你会成为有钱人吗"
      @success="onSubmit"
    ></pay-dialog>
    <!-- #endif -->
  </scroll-view>
</template>

<script>
// #ifdef H5
import payDialog from "yz-utils/pay-dialog/pay-dialog";
// #endif
import cmdTransition from "@/components/cmd-transition/cmd-transition";
import answerList from "./answer-list.json";
import { deepClone } from "@/utils/utils.js";
import { mapGetters } from "vuex";
import { doPay, getResult } from "@/api";
const app = getApp();
export default {
  name: "answer",
  data() {
    let _answerList = deepClone(answerList);
    return {
      windowHeight: app.globalData.systemInfo.windowHeight,
      payVisible: false,
      currentTest: 0,
      tests: _answerList,
      intoView: "",
      animBoxData: {},
      over: false,
      disabledBtn: false
    };
  },
  onLoad(option) {
    this.getTests();
    console.log(uni.getStorageSync("zwUid"));
  },
  computed: {
    ...mapGetters(["price", "path_id", "openid", "tid"]),
    answerLength() {
      return this.tests.length - 1;
    }
  },
  watch: {
    currentTest(newVal) {
      this.setCurrentAnswer("show", newVal, true);
      if (newVal == this.tests.length - 1) {
        setTimeout(() => {
          this.over = true;
        }, 350);
      }
    }
  },
  components: {
    cmdTransition,
    // #ifdef H5
    payDialog
    // #endif
  },
  methods: {
    toggleClass(idx, i) {
      this.setCurrentAnswer(
        "checked",
        idx,
        i,
        function(data) {
          data.testsData.disabled = true;
          this.bindAnswerData(data.idx, i);
        },
        true
      );
    },
    startGame() {
      this.setCurrentAnswer("show", 0, true, function() {
        this.intoView = "into-0";
      });
    },
    getTests() {
      this.tests.push({
        over: true,
        title: "",
        content:
          "好了，通过测试，我们已经对你的财商做出了评估，并且制定了专属你的财商提升建议！"
      });
    },
    bindAnswerData(idx, i) {
      this.setCurrentAnswer("answer", idx, this.fromCharCode(i), function(
        data
      ) {
        let { idx: testsIndex, testsData, result } = data;
        //答题成功后至切换到下一个动画的延迟
        setTimeout(() => {
          this.currentTest = testsIndex + 1;
          setTimeout(() => {
            this.intoView = `into-${testsIndex + 1}`;
          }, 250);
        }, 200);
      });
    },
    setCurrentAnswer(type, idx, value, callback = null, validation = false) {
      const testsData = this.tests[idx];
      if (validation && testsData.disabled) return false;
      try {
        this.$set(testsData, type, value);
        callback &&
          callback.call(this, {
            testsData,
            idx,
            result: value
          });
      } catch (e) {
        uni.showToast({
          title: e.message,
          icon: "none"
        });
        throw new Error(e.message);
      }
    },
    getRepeatNum(arr) {
      let _res = [];
      arr.sort();
      for (let i = 0; i < arr.length; ) {
        let count = 0;
        for (let j = i; j < arr.length; j++) {
          if (arr[i] == arr[j]) {
            count++;
          }
        }
        _res.push([arr[i], count, i]);
        i += count;
      }
      return _res;
    },
    fromCharCode(number) {
      return `${String.fromCharCode(number + 65)}`;
    },
    onSubmit(e) {
      if (this.disabledBtn) return false;
      let zwGameId = uni.getStorageSync("zwGameId");
      // #ifdef H5
      // H5环境下先弹框提示支付方式
      if (e === "MP") {
        this.payVisible = true;
        this.recordUv(5);
        if (zwGameId) {
          zwDivine.recordUserInfo({
            name: "2020你会成为有钱人吗?",
            gender: "",
            birthday: "",
            extra: JSON.stringify({ openid: this.openid })
          });
        }
        return false;
      }
      // #endif
      let answer_list = Object.assign([], this.tests.slice(0, 20));

      // 总分
      let score = 0;
      // 占比偏向图
      let ws = { W: 0, S: 0 }, //观念
        dp = { D: 0, P: 0 }, //知识分析
        is = { I: 0, S: 0 }; //行为分析
      //财富影响 [0]分数  [1]强弱影响
      let wealth = [
        [0, 0, 0],
        [
          { W: 0, S: 0 },
          { W: 0, S: 0 },
          { W: 0, S: 0 }
        ]
      ];
      let investment = 0;

      answer_list.forEach((v, i) => {
        score += v.answer.charCodeAt(0) - 63;
        if (i < 3) {
          if (v.answer === "A" || v.answer === "B") {
            ws.W += 1;
          } else {
            ws.S += 1;
          }
        } else if (i < 6) {
          if (v.answer === "A" || v.answer === "B") {
            dp.D += 1;
          } else {
            dp.P += 1;
          }
        } else if (i < 9) {
          if (v.answer === "A" || v.answer === "B") {
            is.I += 1;
          } else {
            is.S += 1;
          }
        } else if (i < 12) {
          wealth[0][0] += v.answer.charCodeAt(0) - 63;
          if (v.answer === "A" || v.answer === "B") {
            wealth[1][0].S += 1;
          } else {
            wealth[1][0].W += 1;
          }
        } else if (i < 15) {
          wealth[0][1] += v.answer.charCodeAt(0) - 63;
          if (v.answer === "A" || v.answer === "B") {
            wealth[1][1].S += 1;
          } else {
            wealth[1][1].W += 1;
          }
        } else if (i < 18) {
          wealth[0][2] += v.answer.charCodeAt(0) - 63;
          if (v.answer === "A" || v.answer === "B") {
            wealth[1][2].S += 1;
          } else {
            wealth[1][2].W += 1;
          }
        } else if (i < 20) {
          investment += v.answer.charCodeAt(0) - 63;
        }
      });
      // 占比偏向图类型结果
      let type = "";
      type += ws.W > ws.S ? "W" : "S";
      type += dp.D > dp.P ? "D" : "P";
      type += is.I > is.S ? "I" : "S";

      wealth[0] = wealth[0].join("-");

      wealth[1] = wealth[1].reduce((t, v) => {
        return (t += v.W > v.S ? "W" : "S");
      }, "");
      let params = {
        score,
        type,
        wealth,
        investment,
        path_id: this.path_id,
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
      this.recordUv(7);
      if (zwGameId) {
        params.channel = "zhiwu";
        params.zwGameId = zwGameId;
      }
      if (e === 2) {
        params.is_alipay = 1;
        return doPay(params, 2);
      }

      this.disabledBtn = true;
      doPay(params)
        .then(res => {
          let { service, orderInfo, user_id } = res.data;

          if (this.price == 0) {
            uni.redirectTo({
              url: `/pages/result/result?yz_id=${user_id}&path_id=${this.path_id}`
            });
            return false;
          }
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
                uni.redirectTo({
                  url: `/pages/result/result?yz_id=${user_id}&path_id=${this.path_id}`
                });
              } else {
                uni.showToast({
                  title: "支付失败！",
                  duration: 1500,
                  icon: "none"
                });
                setTimeout(() => {
                  uni.redirectTo({
                    url: `/pages/recover/recover?user_id=${user_id}&path_id=${this.path_id}`
                  });
                }, 1500);
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
.scroll {
  background: #fcf6f0;
}
.container {
  width: 100%;
  padding: 40rpx 44rpx 192rpx 30rpx;
  box-sizing: border-box;
}
.transition >>> .anim-box {
  margin-top: 72rpx;
}
.num {
  color: #ffffff;
  font-size: 28rpx;
  width: 100rpx;
  height: 50rpx;
  background: rgba(0, 0, 0, 0.2);
  line-height: 53rpx;
  margin: 0 auto;
  border-radius: 6rpx;
  text-align: center;
}
.checkview {
  width: 100%;
  position: fixed;
  height: 120rpx;
  display: flex;
  align-items: center;
  left: 0;
  bottom: 0;
  background: #ffe5c4;
}
.checkview .btn {
  width: 664rpx;
  height: 94rpx;
  margin: 0 auto;
  background: url("../../static/btn-bg.png") no-repeat center center;
  background-size: contain;
  color: #c55431;
  font-size: 36rpx;
  line-height: 92rpx;
  text-align: center;
  animation: submitbtn linear 1000ms infinite alternate;
}
.question-box {
  margin-top: 30rpx;
  display: flex;
}
.question-box.left {
  flex-direction: row;
}
.question-box.right {
  flex-direction: row-reverse;
  margin-top: 73rpx;
}
.question-box.left .chat {
  margin-left: 30rpx;
}
.question-box.right .chat {
  margin-right: 30rpx;
}
.chat {
  margin-top: 20rpx;
  max-width: 565rpx;
  min-width: 93rpx;
  background: #ffffff;
  border-radius: 24rpx;
  box-shadow: 0 4rpx 28rpx rgba(238, 197, 108, 0.1);
  padding: 26rpx 38rpx;
  position: relative;
}
.chat.test {
  font-size: 28rpx;
  color: #333333;
  line-height: 36rpx;
}
.chat.option {
  padding: 36rpx 38rpx;
}
.font-bolder {
  font-weight: bolder;
  color: #333333;
}
.option-card > .item {
  line-height: 44rpx;
  color: #989898;
  font-size: 26rpx;
  border-radius: 12rpx;
  background-color: #f5f5f5;
  padding: 24rpx 20rpx;
  margin-top: 20rpx;
  transform: translateZ(0);
  transition: background-color 300ms linear;
}
.option-card > .item.checked {
  pointer-events: none;
  background-color: #ffa66b;
  color: #ffffff;
}
.question-box.left .chat:after {
  content: "";
  position: absolute;
  right: 100%;
  top: 24rpx;
  width: 0;
  border: 16rpx solid transparent;
  border-right-width: 16rpx;
  border-right-color: #ffffff;
}
.question-box.right .chat:after {
  content: "";
  position: absolute;
  left: 100%;
  top: 24rpx;
  width: 0;
  border: 16rpx solid transparent;
  border-left-width: 16rpx;
  border-left-color: #ffffff;
}
.text {
  font-size: 28rpx;
  color: #333333;
  line-height: 42rpx;
}
.head {
  width: 86rpx;
  height: 86rpx;
  border-radius: 50%;
  overflow: hidden;
}
.old-price {
  font-size: 36rpx;
  color: #c55431;
  text-decoration: line-through;
}
@keyframes submitbtn {
  from {
    transform: scale(1);
  }
  to {
    transform: scale(0.92);
  }
}
</style>
