<!--
 * @Author: Stephen
 * @Date: 2019-11-19 11:50:25
 * @LastEditors: Stephen
 * @LastEditTime: 2019-12-03 16:08:12
 -->
<template>
  <div class="rowColCenter pagiBox" :style="{width: size.contentWidth - 144 + 'px'}" style="height:50px;background:#0e5688;">
    <el-pagination @current-change="handleCurrentChange"
                   :current-page.sync="filterParams.pageNum"
                   :page-size="filterParams.pageSize"
                   layout="total, prev, pager, next, jumper"
                   :total="count"
                   background
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
  color:#ffffff
}
</style>
