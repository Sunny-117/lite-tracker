<template>
  <div>
    <el-table :data="behaviors" stripe style="width: 100%">
      <el-table-column prop="_id" label="编号"> </el-table-column>
      <el-table-column prop="subType" label="访问类型"> </el-table-column>
      <el-table-column prop="stayTime" label="停留时间"> </el-table-column>
      <el-table-column prop="effectiveType" label="网络类型"> </el-table-column>
      <el-table-column prop="referrer" label="上一页面"> </el-table-column>
      <el-table-column prop="rtt" label="往返时间"> </el-table-column>
      <el-table-column prop="from" label="路由 From"> </el-table-column>
      <el-table-column prop="to" label="路由 To"> </el-table-column>
      <el-table-column prop="name" label="路由 Name"> </el-table-column>
      <el-table-column
        prop="createTime"
        label="时间"
        :formatter="dateFormat"
      >
      </el-table-column>
    </el-table>

    <el-pagination
      @current-change="handlePageChange"
      :pager-count="11"
      :current-page="page"
      layout="total, prev, pager, next, jumper"
      :total="total"
      background
      style="float: right; margin-top: 20px"
    >
    </el-pagination>

  </div>
</template>

<script>
import { getBehaviors } from "@/apis/monitorApi";
import dayjs from "dayjs";
export default {
  name: "BehaviorPage",
  data() {
    return {
      behaviors: [],
      total: 0,
      page: 1,
      pages: 1,
    };
  },
  methods: {
    dateFormat(row, column, cellValue, index) {
      if (cellValue === undefined || cellValue === null) {
        return "";
      }
      return dayjs(cellValue).format("YYYY-MM-DD HH:mm");
    },
    handlePageChange(page) { 
      this.page = page;
      this.getData();
    },
    async getData() {
      console.log(this.page);
      const res = await getBehaviors(this.page);
      this.behaviors = res.data;
      this.total = res.total;
      this.pages = res.pages;
    },
  },
  created() {
    this.getData();
  },
};
</script>

<style scoped></style>
