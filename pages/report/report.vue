<template>
  <yz-report
    @to-result="toResult"
    @add-report="addReport"
    :baseUrl="baseUrl"
    theme="#FF6B87"
  />
</template>

<script>
import yzReport from "yz-utils/yz-report/yz-report";
import request from "../../api/request";
export default {
  components: { yzReport },
  data() {
    return {
      baseUrl: request.config.baseUrl
    };
  },
  computed: {
    path_id() {
      return this.$store.getters.path_id;
    }
  },
  methods: {
    toResult(id) {
      uni.navigateTo({
        url: `/pages/result/result?yz_id=${id}&path_id=${this.path_id}`
      });
    },
    addReport() {
      uni.navigateTo({
        url: `/pages/answer/answer?path_id=${this.path_id}`
      });
    }
  }
};
</script>

<style></style>
