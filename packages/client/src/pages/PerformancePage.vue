<template>
  <div>
    <el-table :data="performances" stripe style="width: 100%">
      <el-table-column prop="_id" label="编号"> </el-table-column>
      <el-table-column prop="name" label="性能指标类型"> </el-table-column>
      <el-table-column prop="rating" label="性能指标评级"> </el-table-column>
      <el-table-column prop="value" label="性能测试时间"> </el-table-column>
      <el-table-column prop="delta" label="指标变化量"> </el-table-column>
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
import { getPerformances } from "@/apis/monitorApi";
import dayjs from "dayjs";
export default {
  name: "PerformancePage",
  data() {
    return {
      performances: [],
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
      const res = await getPerformances(this.page);
      this.performances = res.data;
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
