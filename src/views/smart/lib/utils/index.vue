<!--
 * @Author: Stephen
 * @Date: 2019-11-19 11:50:25
 * @LastEditors: Stephen
 * @LastEditTime: 2019-12-03 16:08:12
 -->
<template>
  <div class="rowColCenter pagiBox" style="height:50px;width: calc(100vw - 144px);">
    <el-pagination @current-change="handleCurrentChange"
                   :current-page.sync="filterParams.pageNum"
                   :page-size="filterParams.pageSize"
                   layout="total, prev, pager, next, jumper"
                   :total="count"
    ></el-pagination>
  </div>
</template>

<script>
export default {
  props: {
    count: {
      type: Number,
      required: true
    },
    filterParams: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      size: {
        contentWidth: window.innerWidth,
        contentHeight: window.innerHeight
      },
    }
  },
  methods: {
    handleCurrentChange (val) {
      this.filterParams.pageNum = val
      this.$emit('getPageNum', this.filterParams)
    }
  }
}
</script>

<style lang="less" scoped>
.pagiBox {
  position:fixed;
  left:144px;
  bottom:12px;
  height: 12px;
  width: calc(100vw - 164px)!important;
  // padding-top:15px
}
// /deep/.el-pagination button {
//     background-color: #0e5688;
// }
// /deep/.el-pager li {
//     background-color: #0e5688;
// }
</style>
