<script>
// #ifdef H5
import { importSDK_zw } from "./utils/utils";
// #endif
// #ifndef H5
import { decodeOpenid } from "./api";
// #endif
import { mapMutations } from "vuex";
export default {
  onLaunch: function(option) {
    if (option.query.path_id) {
      this.set_path_id(option.query.path_id);
    }

    this.applogin();

    // 版本检测
    // #ifndef H5
    const updateManager = uni.getUpdateManager();
    updateManager.onCheckForUpdate(function(res) {
      // 请求完新版本信息的回调
      console.log(res.hasUpdate);
    });
    updateManager.onUpdateReady(function(res) {
      uni.showModal({
        title: "更新提示",
        content: "新版本已经准备好，是否重启应用？",
        success(res) {
          if (res.confirm) {
            // 新的版本已经下载好，调用 applyUpdate 应用新版本并重启
            updateManager.applyUpdate();
          }
        }
      });
    });
    // #endif

    // #ifdef H5
    if (option.query.zwGameId) {
      uni.setStorageSync("zwGameId", option.query.zwGameId);
      uni.setStorageSync("zwUid", option.query.zwUid);
    }
    importSDK_zw();
    // #endif
  },
  methods: {
    ...mapMutations("index", ["login", "set_path_id"]),
    applogin(count = 0) {
      const that = this;
      // #ifndef H5
      // 除了 H5 平台，其它平台均存在的代码
      uni.showLoading({
        title: "登录中..."
      });
      uni.login({
        success(res) {
          console.log(res);
          if (res.errMsg == "login:ok") {
            decodeOpenid({
              code: res.code,
              tid: that.$store.getters.tid,
              is_toutiao: 1
            })
              .then(function(response) {
                that.login(response);
              })
              .catch(function(err) {
                if (count < 3) {
                  that.applogin(count + 1);
                }
              });
          }
        },
        fail(err) {
          console.log(err);

          uni.hideLoading();
          uni.showModal({
            title: "提示",
            content: "登录异常!",
            showCancel: false
          });
        }
      });
      // #endif
    }
  },
  globalData: {
    systemInfo: uni.getSystemInfoSync()
  }
};
</script>

<style lang="scss">
/*每个页面公共css */
/* #ifdef H5 */
@import url("./utils/reset-h5.scss");
uni-page-head {
  display: none;
}
/* #endif */
@import url("./utils/reset-mp.scss");
.container {
  width: 100%;
  min-height: 100vh;
  overflow: hidden;
}
</style>
