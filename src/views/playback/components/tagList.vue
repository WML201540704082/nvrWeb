<template>
  <el-dialog 
      title="标签回放"
      width="800px"
      :visible.sync="dialogVisible"
      :close-on-click-modal="false"
      style="margin-top:-25px">
    <div>
        <span>通道：</span>
        <el-select v-model="channelId" @change="changeChannel(channelId)" size="mini" placeholder="请选择通道">
            <el-option
            v-for="item in channelList"
            :key="'new_' + item.id"
            :label="item.name"
            :value="item.id">
            </el-option>
        </el-select>
    </div>
    <el-table
        :data="tagList"
        stripe
        size="mini"
        style="width: 100%; height: 500px; overflow: auto;">
        <el-table-column
            prop="id"
            label="序号"
            width="50">
        </el-table-column>
        <el-table-column
            prop="label"
            label="标签名称"
            width="220">
        </el-table-column>
        <el-table-column
            prop="channel"
            width="80"
            label="通道号">
        </el-table-column>
        <el-table-column
            prop="beginTime"
            width="180"
            label="起始时间">
        </el-table-column>
        <el-table-column
            prop="duration"
            width="80"
            label="视频时长">
        </el-table-column>
        <el-table-column
            label="操作"
            width="120">
            <template slot-scope="scope">
                <span style="cursor: pointer; color:red;" @click="deleteTag( scope.row.id )">删除</span>
                <span style="color:green;padding-left: 20px;cursor: pointer;" @click="play(scope.row)">播放</span>
            </template>
        </el-table-column>
    </el-table>
    <play-video ref="video"></play-video>
    <dg-pagination :total="count" :currentPage="pageNum" :pageSize="pageSize" @updatePagination="pagination_event"/>
  </el-dialog>
</template>
<script>
import dgPagination from '@/components/dg-pagination'
import moment from 'moment'
import { getChannelList, tagList, deleteTag } from '@/api'
import playVideo from '@/components/playVideo'
export default {
  name: 'TagList',
  data () {
      return {
          dialogVisible: false,
          count: 0,
          pageSize: 20,
          pageNum: 1,
          tagList: [],
          channelList: [],
          channelId: 1,
      }
  },
  components: {
      dgPagination,
      playVideo,
  },
  methods: {
      init(channelId) {
          this.$nextTick(()=>{
              this.getChannelList()
              this.dialogVisible = true
              this.channelId = channelId
          })
      },
      changeChannel(channelId) {
        this.channelId = channelId
        this.getTagList()
      },
      getChannelList() {
          getChannelList().then((res) => {
              if (res.data.code === 200000) {
                this.channelList = []
                  res.data.data.map(item => {
                    this.channelList.push({id: item.channel, name: `D${item.channel}`})
                  })
                  this.channelId = this.channelList[0].id
                  this.getTagList()
              }
          });
      },
      getTagList() {
        let params = {
            channelId: this.channelId,
            pageNum: this.pageNum,
            pageSize: this.pageSize
        }
          tagList( params ).then((res) => {
              if (res.data.code === 200000) {
                this.tagList = []
                this.tagList = res.data.data.map(item => {
                    return {
                        ...item,
                        channel: `D${item.channel}`,
                        channelId: item.channel,
                        beginTime: moment(item.beginTime).format("YYYY-MM-DD HH:mm:ss"),
                        duration: `${item.duration}s`,
                        long: item.duration,
                        fileType: item.type,
                    }
                })
                this.count = res.data.count
              }
          })
      },
      // 分页
      pagination_event(val) {
          this.pageSize = val.pageSize
          this.pageNum = val.currentPage
          this.getTagList()
      },
      deleteTag( id ) {
          deleteTag( id ).then(res => {
              if (res.data.code === 200000) {
                this.getTagList()
                this.$message.success('删除成功！')
              }
          })
      },
      play(row) {
          let changeRow = {
            channelID: row.channelId,
            videoStartTime: row.beginTime,
            fileType: row.fileType,
            videoEndTime: moment(row.beginTime).add(row.long, 'seconds').format("YYYY-MM-DD HH:mm:ss")
          }
          this.$nextTick(()=>{
              this.$refs['video'].init(changeRow,'tag')
          })
      },
  },
}
</script>
<style lang="less" scoped>
.el-table--border::after, .el-table--group::after, .el-table::before {
    content: none;
}
</style>
