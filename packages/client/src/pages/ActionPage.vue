<template>
  <div>
    <el-table :data="actions" stripe style="width: 100%">
      <el-table-column prop="_id" label="编号"> </el-table-column>
      <el-table-column prop="eventType" label="事件类型"> </el-table-column>
      <el-table-column prop="tagName" label="事件源节点"> </el-table-column>
      <el-table-column prop="paths" label="触发路径"> </el-table-column>
      <el-table-column prop="x" label="x"> </el-table-column>
      <el-table-column prop="y" label="y"> </el-table-column>
      <el-table-column prop="currentPage" label="页面地址"> </el-table-column>
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
import { getActions } from "@/apis/monitorApi";
import dayjs from "dayjs";
export default {
  name: "ActionPage",
  data() {
    return {
      actions: [],
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
      const res = await getActions(this.page);
      this.actions = res.data;
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
