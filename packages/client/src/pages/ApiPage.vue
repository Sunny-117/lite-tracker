<template>
  <div>
    <el-table :data="apis" stripe style="width: 100%">
      <el-table-column prop="_id" label="编号"> </el-table-column>
      <el-table-column prop="subType" label="类型"> </el-table-column>
      <el-table-column prop="method" label="请求方式"> </el-table-column>
      <el-table-column prop="url" label="请求地址"> </el-table-column>
      <el-table-column prop="status" label="状态"> </el-table-column>
      <el-table-column prop="startTime" label="开始时间" :formatter="dateMsFormat"> </el-table-column>
      <el-table-column prop="endTime" label="结束时间" :formatter="dateMsFormat"> </el-table-column>
      <el-table-column prop="duration" label="持续时间"> </el-table-column>
      <el-table-column prop="success" label="是否成功" :formatter="booleanFormat"> </el-table-column>
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
import { getApis } from "@/apis/monitorApi";
import dayjs from "dayjs";
export default {
  name: "BehaviorPage",
  data() {
    return {
      apis: [],
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
    dateMsFormat(row, column, cellValue, index) {
      if (cellValue === undefined || cellValue === null) {
        return "";
      }
      return dayjs(cellValue).format("YYYY-MM-DD HH:mm:ss.SSS");
    },
    booleanFormat(row, column, cellValue, index) {
      console.log(typeof cellValue)
      if (cellValue === undefined || cellValue === null) {
        return "";
      }
      return /true/.test(cellValue) ? "是" : "否";
    },
    handlePageChange(page) { 
      this.page = page;
      this.getData();
    },
    async getData() {
      const res = await getApis(this.page);
      this.apis = res.data;
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
