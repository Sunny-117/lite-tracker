<template>
  <el-container>
    <el-aside>
      <el-menu
        default-active="$route.path"
        class="el-menu-vertical-demo"
        router
      >
        <el-menu-item index="/error-show">
          <i class="el-icon-location"></i>
          <span>JS错误</span>
        </el-menu-item>
        <el-menu-item index="/performance-show">
          <i class="el-icon-menu"></i>
          <span slot="title">性能指标</span>
        </el-menu-item>
        <el-menu-item index="/action-show">
          <i class="el-icon-document"></i>
          <span slot="title">事件追踪</span>
        </el-menu-item>
        <el-menu-item index="/behavior-show">
          <i class="el-icon-setting"></i>
          <span slot="title">页面访问</span>
        </el-menu-item>
        <el-menu-item index="/api-show">
          <i class="el-icon-setting"></i>
          <span slot="title">Api请求</span>
        </el-menu-item>
      </el-menu>
    </el-aside>

    <el-container>
      <el-main>
        <router-view />
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
export default {
  name: "App",
};
</script>

<style></style>
