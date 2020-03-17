<template>
  <view class="container">
    <view class="block-line">
      <view class="label">代理商名称:</view>
      <view class="value">{{agent_name}}</view>
    </view>
    <view class="block-line">
      <view class="label">代理商ID:</view>
      <view class="value">{{agent_id}}</view>
    </view>

    <view class="user-none" v-if="!nickName">
      <view class="user-none-text">
        <view>对不起,由于您没有同意授权获取您的信息</view>
        <view>无法开始绑定代理商</view>
        <view>请重启小程序重试</view>
      </view>
    </view>
    <view v-else>
      <view class="block-line">
        <view class="label">用户昵称:</view>
        <view class="value">{{nickName}}</view>
      </view>
      <view class="block-line">
        <view class="label">用户头像:</view>
        <image class="avatar-image" :src="avatarUrl" mode="widthFix" />
      </view>

      <button class="agent-btn" @tap="bindAgentBefore">确认绑定代理商</button>
    </view>
  </view>
</template>

<script>
export default {
  data() {
    return {
      isAuthorize: false,
      agent_id: "",
      agent_name: "",
      gender: "",
      avatarUrl: "",
      nickName: ""
    };
  },
  onLoad(opt) {
    console.log(opt);
    this.agent_id = opt.agent_id;
    this.agent_name = opt.agent_name;
    this.authorize();
  },
  methods: {
    authorize() {
      const that = this;
      uni.authorize({
        scope: "scope.userInfo",
        success(auth) {
          if (auth.data["scope.userInfo"] == "ok") {
            uni.getUserInfo({
              success(res) {
                if (res.errMsg == "getUserInfo:ok") {
                  that.avatarUrl = res.userInfo.avatarUrl;
                  that.nickName = res.userInfo.nickName;
                  that.gender = res.userInfo.gender;
                }
              }
            });
          }
        }
      });
    },
    bindAgentBefore() {
      const that = this;
      uni.showModal({
        title: "注意",
        content: "确认要绑定该代理商吗?",
        success: function(res) {
          if (res.confirm) {
            that.bindAgent();
          }
        }
      });
    },
    bindAgent() {
      const that=this;
      uni.showLoading({
        title: "处理中"
      });
      this.$ajax(
        "/api/agent/bind_agents",
        {
          tid: this.$store.state.tid,
          agent_id: this.agent_id,
          openid: this.$store.state.openid,
          avatarUrl: this.avatarUrl,
          nickName: this.nickName
        },
        { method: "POST" }
      )
        .then(res => {
          uni.hideLoading();
          if (res.code == 200) {
            uni.showModal({
              title: "提示",
              content: "绑定代理商成功!",
              confirmText: "前往首页",
              success: function(res) {
                if (res.confirm) {
                  let path_id = that.$store.state.path_id || uni.getStorageSync("path_id");
                  uni.reLaunch({
                    url: "/pages/index?path_id=" +path_id
                  });
                } else if (res.cancel) {
                  console.log("用户点击取消");
                }
              }
            });
          } else {
            uni.showModal({
              title: "提示",
              content: "绑定失败!!!",
              showCancel: false
            });
          }
        })
        .catch(err => {
          uni.hideLoading();
          uni.showModal({
            title: "提示",
            content: "绑定失败!!!",
            showCancel: false
          });
        });
    }
  }
};
</script>

<style>
.container {
  background-color: #fff;
  font-size: 32rpx;
  padding: 50rpx;
}
.block-line {
  display: flex;
  align-items: center;
  padding: 18rpx;
}
.block-line .label {
  flex: 0 0 200rpx;
  margin-right: 30rpx;
}
.user-none {
  margin-top: 200rpx;
}
.user-none-text {
  font-size: 28rpx;
  color: #666;
  text-align: center;
  line-height: 48rpx;
  padding: 30rpx 0;
}

.authorize-btn {
  background-color: #ff5068;
  display: block;
  width: 650rpx;
  margin: 0 auto;
  color: #fff;
}

.agent-btn {
  background: linear-gradient(
    0deg,
    rgba(20, 111, 229, 1),
    rgba(85, 193, 255, 1)
  );
  display: block;
  width: 650rpx;
  margin: 150rpx auto 0;
  color: #fff;
}
.avatar-image {
  width: 86rpx;
  height: 86rpx;
  border-radius: 50%;
}
</style>
