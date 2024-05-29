<template>
  <div>
    <el-table :data="errors" stripe style="width: 100%">
      <el-table-column prop="_id" label="编号"> </el-table-column>
      <el-table-column prop="errorType" label="错误类型"> </el-table-column>
      <el-table-column prop="errMsg" label="错误信息"> </el-table-column>
      <el-table-column prop="filename" label="错误文件"> </el-table-column>
      <el-table-column prop="functionName" label="错误函数"> </el-table-column>
      <el-table-column
        prop="createTime"
        label="错误时间"
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
import { getErrors } from "@/apis/monitorApi";
import dayjs from "dayjs";
export default {
  name: "ErrorPage",
  data() {
    return {
      errors: [],
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
      const res = await getErrors(this.page);
      this.errors = res.data;
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
