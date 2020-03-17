<template>
  <view :class="'cmd-' + name">
    <slot></slot>
  </view>
</template>

<script>
/**
 * 动画组件
 * @description 复用动画切换组件,可自行拆取动画。
 * @tutorial https://ext.dcloud.net.cn/plugin?id=211
 * @property {String} name 动画名 - 默认：fade
 * @example <cmd-transition name="fade">你好，uni-app</cmd-transition>
 */
export default {
  name: "cmd-transition",
  props: {
    /**
     * 使用动画名
     * 淡入淡出 - fade、fade-up、fade-down、fade-left、fade-right
     * 滑动 - slide-up、slide-down、slide-left、slide-right
     * 弹动 bounce
     * 中部弹出 zoom
     * 中部弹入 punch
     * 飞入 fly
     */
    name: {
      type: String,
      default: "fade"
    }
  }
};
</script>

<style>
.cmd-zoom {
  animation: zoom-in 0.3s;
  animation-timing-function: cubic-bezier(0.215, 0.61, 0.355, 1);
}

@keyframes zoom-in {
  from {
    opacity: 0.01;
    transform: scale(0.75);
  }

  to {
    opacity: 1;
    transform: scale(1);
  }
}

.cmd-punch {
  animation: punch-in 0.3s;
  animation-timing-function: cubic-bezier(0.215, 0.61, 0.355, 1);
}

@keyframes punch-in {
  from {
    opacity: 0.01;
    transform: scale(1.35);
  }

  to {
    opacity: 1;
    transform: scale(1);
  }
}

.cmd-fade {
  animation: fade 0.3s 1;
}

@keyframes fade {
  from {
    opacity: 0.01;
  }

  to {
    opacity: 1;
  }
}

.cmd-fade-left {
  animation: fade-left 0.3s 1;
}

@keyframes fade-left {
  from {
    opacity: 0;
    transform: scale(0.8);
  }

  to {
    opacity: 1;
    transform: scale(1);
  }
}

.cmd-fade-right {
  animation: fade-right 0.3s 1;
  animation-fill-mode: forwards;
}

@keyframes fade-right {
  from {
    transform: scale(1.2);
    opacity: 0;
  }

  to {
    transform: scale(1);
    opacity: 1;
  }
}

.cmd-fade-up {
  animation: fade-up 0.3s linear 1;
}

@keyframes fade-up {
  from {
    transform: translate3d(0, 20%, 0);
    opacity: 0;
  }

  to {
    transform: translate3d(0, 0, 0);
    opacity: 1;
  }
}

.cmd-fade-down {
  animation: fade-down 0.3s 1;
}

@keyframes fade-down {
  from {
    transform: translate3d(0, -20%, 0);
    opacity: 0;
  }

  to {
    transform: translate3d(0, 0, 0);
    opacity: 1;
  }
}

.cmd-slide-right {
  animation: slide-right 0.3s 1;
}

@keyframes slide-right {
  from {
    transform: translateX(100%);
  }

  to {
    transform: translateX(0);
  }
}

.cmd-slide-left {
  animation: slide-left 0.3s 1;
}

@keyframes slide-left {
  from {
    transform: translateX(-100%);
  }

  to {
    transform: translateX(0);
  }
}

.cmd-slide-up {
  animation: slide-up 0.3s 1;
}

@keyframes slide-up {
  from {
    transform: translateY(-100%);
    opacity: 0;
  }

  to {
    transform: translateX(0);
    opacity: 1;
  }
}

.cmd-slide-down {
  animation: slide-down 0.3s 1;
}

@keyframes slide-down {
  from {
    transform: translateY(100%);
    opacity: 0;
  }

  to {
    transform: translateX(0);
    opacity: 1;
  }
}

.cmd-fly {
  animation: fly-in 0.6s;
  animation-timing-function: cubic-bezier(0.215, 0.61, 0.355, 1);
}

@keyframes fly-in {
  0% {
    opacity: 0.5;
    -webkit-transform: scale(0.5) translate3d(0, 0.5rem, 0);
    transform: scale(0.5) translate3d(0, 0.5rem, 0);
  }

  45% {
    opacity: 1;
    -webkit-transform: scale(1.05) translate3d(0, -0.5rem, 0);
    transform: scale(1.05) translate3d(0, -0.5rem, 0);
  }

  to {
    -webkit-transform: scale(1) translateZ(0);
    transform: scale(1) translateZ(0);
  }
}

.cmd-bounce {
  animation: bounce-in 0.3s linear;
}

@keyframes bounce-in {
  0% {
    -webkit-transform: scale(0.5);
    transform: scale(0.5);
  }

  45% {
    -webkit-transform: scale(1.05);
    transform: scale(1.05);
  }

  80% {
    -webkit-transform: scale(0.95);
    transform: scale(0.95);
  }

  to {
    -webkit-transform: scale(1);
    transform: scale(1);
  }
}
</style>
