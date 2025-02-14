<template>
	<section class="dg-pagination">
		<el-pagination
			background
			@size-change="handleSizeChange"
			@current-change="handleCurrentChange"
			:current-page="currentPage"
			:page-sizes="pageSizes"
			:page-size="pageSize"
			layout="total, prev, pager, next, sizes, jumper"
			:total="total"
		/>
	</section>
</template>

<script>
export default {
	name:'dgPagination',
	props: {
		total: {
			type: Number,
			required: true,
		},
		currentPage: {
			type: Number,
			required: true,
		},
		pageSize: {
			type: Number,
			required: true,
		},
		pageSizes: {
      type: Array,
      default() {
        return [20, 50, 100, 200, 1000];
      }
    }
	},
	methods:{
		handleSizeChange(val) {
			let obj = {currentPage: 0, pageSize: val}
			this.$emit('updatePagination', obj)
		},
		handleCurrentChange(val) {
			let obj = {currentPage: val, pageSize: this.pageSize}
			this.$emit('updatePagination', obj)
		},
	}
}
</script>
<style lang="less" scoped>
  .dg-pagination{
    display: inline-block;
    width: 100%;
    .el-pagination {
        float: right;
        margin-top: 10px;
    }
    // .el-pagination__jump {
    //     margin-left: 10px!important;
    // }
  }
</style>
