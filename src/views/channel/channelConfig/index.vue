<template>
   <div class="ChannelConfig">
     <!-- <div style="padding: 0 0 20px 0">
      <span style="color: #626262">搜索设备</span>
     </div> -->
     <div style="margin: 0 0 10px 0">
      <!-- <el-button size="small" @click="onQueryDev">搜索设备</el-button> -->
      <el-button type="primary" size="small" @click="onAddChannelM">一键添加</el-button>
      <el-button type="primary" size="small" @click="onAddChannelS">自定义添加</el-button>
      <el-button type="primary" size="small" @click="onProtocol">协议管理</el-button>
      <el-button size="small" @click="onDeleteM">删除</el-button>
      <el-button size="small" @click="onReboot">重启</el-button>
      <el-button size="small" @click="onRefresh">刷新</el-button>
      <el-button size="small" @click="onExport">导出</el-button>
     </div>
     <div >
       <el-table
       size="mini"
       ref="multipleTable"
        :data="tableData2"
        v-loading="loading2"
        element-loading-text="正在加载中"
        element-loading-spinner="el-icon-loading"
        @selection-change="handleSelectionChange2"
        :height="`${size.contentHeight - 160}`"
        style="width: 100%">
         <el-table-column
          type="selection"
          width="55">
        </el-table-column>
        <el-table-column
          prop="channel"
          label="通道" width="60px">
        </el-table-column>
        <el-table-column :show-overflow-tooltip='true'
          prop="ip"
          label="IP地址" width="120px">
        </el-table-column>
        <el-table-column
          prop="status"
          label="设备状态" width="120px">
          <template slot-scope="scope">
            <div class="device-status" :class="DEVICE_STATUS[scope.row.status]?.class">
            </div>
            {{ DEVICE_STATUS[scope.row.status]?.label || '' }}
          </template>
        </el-table-column>
        <el-table-column
          prop="devChannel"
          label="设备通道号">
        </el-table-column>
        <el-table-column
          prop="ctrlPort"
          label="控制端口">
        </el-table-column>
         <el-table-column
          prop="dataPort"
          label="数据端口">
        </el-table-column>
        <el-table-column :show-overflow-tooltip='true'
          prop="protocol"
          label="协议" :formatter="formatProtocol">
        </el-table-column>
        <!-- <el-table-column
          prop="accessType"
          label="访问类型">
          <template slot-scope="scope">
            {{scope.row.accessType == 1 ? 'IPC' :(scope.row.accessType == 2 ? '非IPC':scope.row.accessType)}}
          </template>
        </el-table-column> -->
         <!-- <el-table-column
          prop="channelType"
          label="通道类型">
        </el-table-column> -->
         <!-- <el-table-column
          width="120"
          prop="channelUseType"
          label="通道用途">
        </el-table-column> -->
         <!-- <el-table-column
          prop="devChCnt"
          label="设备通道数量">
        </el-table-column> -->
         <el-table-column :show-overflow-tooltip='true'
          prop="devModel"
          label="设备型号">
        </el-table-column>
        <!-- <el-table-column
          prop="gateWay"
          label="网关">
        </el-table-column> -->
         <!-- <el-table-column
          prop="mac"
          label="设备mac">
        </el-table-column> -->
         <el-table-column :show-overflow-tooltip='true'
          prop="manufactor"
          label="厂商">
        </el-table-column>
         <!-- <el-table-column
          prop="mask"
          label="子网掩码">
        </el-table-column> -->
         <el-table-column :show-overflow-tooltip='true'
          prop="serialNumber"
          label="序列号">
        </el-table-column>
         <el-table-column :show-overflow-tooltip='true'
          prop="softwareVersion"
          width="140"
          label="软件版本号">
        </el-table-column>
        <el-table-column :show-overflow-tooltip='true'
          prop="enabled"
          label="智能分析">
          <template slot-scope="scope">
            <el-switch @change="switchEnable(scope.row)"
                       v-model="scope.row.enabled"
                       active-color="#3A74FF"
                       inactive-color="#909399"
            ></el-switch>
          </template>
        </el-table-column>
         <!-- <el-table-column
          prop="webPort"
          label="web端口">
        </el-table-column> -->
        <el-table-column label="操作" width="200">
          <template slot-scope="scope">
            <el-button type="text" icon="el-icon-video-play" v-if="scope.row.status === 1" @click="handlePreview(scope.row)">预览</el-button>
            <el-button type="text" icon="el-icon-edit-outline" :style="{marginLeft: scope.row.status === 1 ? '' : '59px'}" @click="handleEditC(scope.$index, scope.row)">编辑</el-button>
            <el-button type="text" style="color: red" icon="el-icon-delete" @click="handleDeleteC(scope.$index, scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
     </div>

     <el-dialog :append-to-body="true"  :close-on-click-modal="false"  title="协议管理" :visible.sync="dialogProtocol">
      <el-tabs v-model="activeName" @tab-click="handleClick">
        <el-tab-pane label="自定义协议" name="frist">
          <el-form size="mini" ref="form" :model="form" label-width="100px">
            <el-form-item label="自定义协议">
              <el-select v-model="form.protoId" @change="onProtoChange">
                <el-option v-for="item in protocolList" :key="item.protoId" :label="`[${item.protoId}] ${item.name}`" :value="item.protoId"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="协议名称">
              <el-input v-model="form.name" style="width: 200px"></el-input>
            </el-form-item>
            
            <el-form-item label="码流类型">
              <el-checkbox label="主码流" v-model="form.streamType1" disabled></el-checkbox>
              <el-checkbox label="子码流" v-model="form.streamType2" style="margin-left: 125px"></el-checkbox>
            </el-form-item>
            <el-form-item label="类型">
              <el-select v-model="form.type1">
                <el-option label="RTSP" :value="1"></el-option>
              </el-select>
              <el-select v-model="form.type2" style="margin-left: 20px" >
              <el-option label="RTSP" :value="1"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="传输协议">
              <el-select v-model="form.transProto1" >
                <el-option label="TCP" :value="1"></el-option>
                <el-option label="UDP" :value="2"></el-option>
              </el-select>
              <el-select v-model="form.transProto2" style="margin-left: 20px">
                <el-option label="TCP" :value="1"></el-option>
                <el-option label="UDP" :value="2" ></el-option>
              </el-select>
            </el-form-item>
            
            <el-form-item label="数据端口">
              <el-input v-model="form.dataPort1" style="width: 200px"></el-input>
              <el-input v-model="form.dataPort2" style="width: 200px ; margin-left: 20px"></el-input>
            </el-form-item>
            
            <el-form-item label="资源路径">
              <el-input v-model="form.url1" style="width: 200px"></el-input>
              <el-input v-model="form.url2" style="width: 200px;margin-left: 20px"></el-input>
            </el-form-item>
          </el-form>
        </el-tab-pane>
        <el-tab-pane label="GB28181服务" name="second">
           <el-form size="mini" ref="form2" :model="form2" label-width="110px">
            <el-form-item label="SIP服务器ID">
              <el-input v-model="form2.sipId" style="width: 200px"></el-input>
            </el-form-item>
            <el-form-item label="SIP服务器端口">
              <el-input v-model="form2.sipPort" style="width: 200px"></el-input>
            </el-form-item>
            <el-form-item label="认证密码" prop="passwd">
              <el-input v-model="form2.passwd" :type="showPass ? 'text' : 'password'" style="width: 200px">
                <i slot="suffix" @click="changeShowPass">
                  <svg-icon :icon="showPass ? 'eye_show' : 'eye_close'"></svg-icon>
                </i>
              </el-input>
            </el-form-item>
            <el-form-item label="心跳周期">
              <el-input v-model="form2.heartbeatCycle" style="width: 200px"></el-input>
            </el-form-item>
            <el-form-item label="心跳次数">
              <el-input v-model="form2.heartbeatTimes" style="width: 200px"></el-input>
            </el-form-item>
          </el-form>
        </el-tab-pane>
      </el-tabs>
      <div slot="footer" class="dialog-footer">
        <el-button size="small" @click="onCancelProtocol">取 消</el-button>
        <el-button type="primary" size="small" @click="onSaveProtocol">确 定</el-button>
      </div>
    </el-dialog>
     <el-dialog :append-to-body="true" class="edit-channel"  :close-on-click-modal="false"  @close="onCloseChannel" width="450px"  :title="addChannelFlag ? '新增通道' :'修改通道'" :visible.sync="dialogChannel">
      <el-form size="mini" ref="ruleForm2" :rules="rules2" :model="form4" label-width="120px">
        <el-form-item label="通道">
          <el-input v-model="form4.channel"  disabled></el-input>
        </el-form-item>
        <el-form-item label="协议">
          <el-select v-model="form4.protocol" style="width: 200px" @change="onProtoChange4">
            <el-option v-for="item in protocolList2" :key="item.protoId" :label="item.name" :value="item.protoId"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="IP地址" v-if="form4.protocol!='GB28181'">
          <el-input v-model="form4.ip" ></el-input>
        </el-form-item>
        <el-form-item label="设备ID" v-if="form4.protocol=='GB28181'">
          <el-input v-model="form4.ip"></el-input>
        </el-form-item>
        <!-- <el-form-item label="设备ip结束">
          <el-input v-model="form4.ipAddrEnd" ></el-input>
        </el-form-item>
        <el-form-item label="domain">
          <el-input v-model="form4.domain" ></el-input>
        </el-form-item> -->
        <!-- <el-form-item label="传输协议">
          <el-input v-model="form4.transportProtocol" ></el-input>
        </el-form-item> -->
        <el-form-item label="传输协议">
              <el-select :disabled="(form4.protocol == 'ONVIF' || form4.protocol == 'GB28181')? false : true" v-model="form4.transportProtocol" style="width: 200px">
                <el-option label="TCP" :value="1"></el-option>
                <el-option label="UDP" :value="2"></el-option>
              </el-select>
            </el-form-item>
        <el-form-item label="控制端口">
          <el-input :disabled="(form4.protocol == 'ONVIF' || form4.protocol == 'GB28181')? false : true" v-model="form4.ctrlPort" ></el-input>
        </el-form-item>
        <el-form-item label="数据端口">
          <el-input :disabled="(form4.protocol == 'ONVIF' || form4.protocol == 'GB28181')? false : true" v-model="form4.dataPort" ></el-input>
        </el-form-item>
        <el-form-item label="接入方式"> 
          <el-select :disabled="(form4.protocol == 'ONVIF'  || form4.protocol == 'GB28181')? false : true" v-model="form4.accessType" style="width: 200px">
              <el-option label="IPC" :value="1"></el-option>
              <el-option label="非IPC" :value="2"></el-option>
            </el-select>
        </el-form-item>
        <el-form-item label="设备通道号">
          <el-input v-model="form4.devChannel" ></el-input>
        </el-form-item>
        <el-form-item label="工位号">
          <el-input v-model="form4.stationNo" ></el-input>
        </el-form-item>
        <el-form-item label="账号" prop="userName">
          <el-input v-model="form4.userName"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="passwd" >
          <el-input v-model="form4.passwd"  :type="showPass ? 'text' : 'password'" autocomplete="new-password">
            <i slot="suffix" @click="changeShowPass">
              <svg-icon :icon="showPass ? 'eye_show' : 'eye_close'"></svg-icon>
            </i>
          </el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button size="small" @click="onCanclechannel('ruleForm2')">取 消</el-button>
        <el-button type="primary" size="small" @click="onSaveChannel('ruleForm2')">确 定</el-button>
      </div>
    </el-dialog>
    <el-dialog title="自定义添加" width="550px" :append-to-body="true" :close-on-click-modal="false"
      @close="onCloseChannelS('ruleForm')" :visible.sync="dialogChannelSelf">
      
      <el-form size="mini" ref="ruleForm" :model="form3" :rules="rules" label-width="90px">
        <el-row style="width: 90%;display: inline-block;">
          <el-col :span="24">
            <el-col :span="24" :offset="0">
              <el-form-item :label="form3IPFlag?'域名':'IP地址'" v-if="form3.protocol!='GB28181'">
                <el-input v-model="form3.ip" style="width: 200px"></el-input>
                <span v-if="!form3IPFlag">
                  -
                </span>
                <el-input v-if="!form3IPFlag" v-model="form3.ipAddrEnd" style="width: 55px"></el-input>
                <el-button style="margin-left: 10px" @click="form3IPFlag =!form3IPFlag">{{form3IPFlag ? 'IP地址':
                  '域名'}}</el-button>
              </el-form-item>
            </el-col>
            <el-col :span="24" :offset="0">
              <el-form-item label="协议">
                <el-select v-model="form3.protocol" style="width: 200px" @change="onProtoChange2">
                  <el-option v-for="item in protocolList2" :key="item.protoId" :label="item.name"
                    :value="item.protoId"></el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="24" :offset="0">
              <el-form-item label="设备ID" v-if="form3.protocol=='GB28181'">
                <el-input v-model="form3.ip" style="width: 200px"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="24" :offset="0">
              <el-form-item label="传输协议">
                <el-select :disabled="(form3.protocol == 'ONVIF' || form3.protocol == 'GB28181')? false : true"
                  v-model="form3.transportProtocol" style="width: 200px">
                  <el-option label="TCP" :value="1"></el-option>
                  <el-option label="UDP" :value="2"></el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="24" :offset="0">
              <el-form-item label="控制端口">
                <el-input :disabled="(form3.protocol == 'ONVIF'  || form3.protocol == 'GB28181')? false : true"
                  v-model="form3.ctrlPort" style="width: 200px"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="24" :offset="0">
              <el-form-item label="数据端口" v-if="form3.protocol!='GB28181'">
                <el-input :disabled="(form3.protocol == 'ONVIF'|| form3.protocol == 'GB28181')?   false : true"
                  v-model="form3.dataPort" style="width: 200px"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="24" :offset="0">
              <el-form-item label="设备通道号" v-if="form3.accessType == 2">
                <el-input v-model="form3.devChannel" style="width: 200px"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="24" :offset="0">
              <el-form-item label="用户名" prop="userName">
                <el-input v-model="form3.userName" style="width: 200px"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="24" :offset="0">
              <el-form-item label="密码" prop="passwd">
                <el-input v-model="form3.passwd" :type="showPass ? 'text' : 'password'" style="width: 200px">
                  <i slot="suffix" @click="changeShowPass">
                    <svg-icon :icon="showPass ? 'eye_show' : 'eye_close'"></svg-icon>
                  </i>
                </el-input>
              </el-form-item>
            </el-col>
          </el-col>
        </el-row>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button size="small" @click="onCloseChannelS('ruleForm')">取 消</el-button>
        <el-button size="small" type="primary" @click="onSaveChannelS('ruleForm')">确 定</el-button>
      </div>
    </el-dialog>
    <el-dialog 
      v-loading="sureLoading"
      element-loading-text="添加中，请稍后"
      title="一键添加" 
      style="margin-top: -10vh;
      margin-bottom: -50px;" 
      width="95%" 
      :append-to-body="true" 
      :close-on-click-modal="false"
      :visible.sync="dialogForm5">
      
      <el-form size="mini" ref="ruleForm1" :model="form5" :rules="rules1" label-width="90px">
        <el-row style="width: 90%;display: inline-block;">
          <el-col :span="24">
            <el-col :span="6" :offset="0">
              <el-form-item label="用户名" prop="userName">
                <el-input v-model="form5.userName" autocomplete="off"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="6" :offset="0">
              <el-form-item label="密码" prop="passwd">
                <el-input v-model="form5.passwd" :type="showPass ? 'text' : 'password'" autocomplete="off">
                  <i slot="suffix" @click="changeShowPass">
                    <svg-icon :icon="showPass ? 'eye_show' : 'eye_close'"></svg-icon>
                  </i>
                </el-input>
              </el-form-item>
            </el-col>
          </el-col>
        </el-row>
        <div class="search-btn" style="height: auto">
          <el-button type="primary" plain size="small" @click="onQueryDev">搜 索</el-button>
        </div>
      </el-form>
      <div style="margin-bottom: 20px;">
        <el-table size="mini" 
          v-loading="loading1" 
          element-loading-text="正在加载中" 
          ref="multipleTable" 
          :data="tableData"
          @selection-change="handleSelectionChange" 
          height="450" style="width: 100%">
          <el-table-column type="selection" width="55" :selectable="checkSelectable">
          </el-table-column>
          <el-table-column prop="" label="序号" width="60px">
            <template slot-scope="scope">
              {{scope.$index+1}}
            </template>
          </el-table-column>
          <el-table-column prop="ip" label="IP地址">
          </el-table-column>
          <el-table-column prop="ctrlPort" label="控制端口">
          </el-table-column>
          <el-table-column prop="dataPort" label="数据端口">
          </el-table-column>
          <!-- <el-table-column
                  prop="devChCnt"
                  width="120"
                  label="设备通道数量">
                </el-table-column> -->
          <el-table-column prop="devChannel" label="设备通道号">
          </el-table-column>
          <el-table-column :show-overflow-tooltip='true' prop="devModel" label="设备型号">
          </el-table-column>
          <el-table-column :show-overflow-tooltip='true' prop="protocol" label="协议">
          </el-table-column>
          <!-- <el-table-column
                  prop="gateWay"
                  label="网关">
                </el-table-column> -->
          <!-- <el-table-column
                  prop="mac"
                  label="设备mac">
                </el-table-column> -->
          <el-table-column :show-overflow-tooltip='true' prop="manufactor" label="厂商">
          </el-table-column>
          <!-- <el-table-column
                  prop="mask"
                  label="子网掩码">
                </el-table-column> -->
          <el-table-column :show-overflow-tooltip='true' prop="serialNumber" label="序列号">
          </el-table-column>
          <el-table-column :show-overflow-tooltip='true' prop="softwareVersion" label="软件版本号">
          </el-table-column>
          <el-table-column prop="status" label="设备状态">
            <template slot-scope="scope">
              {{scope.row.status == 2 ? '已初始化' :scope.row.status}}
            </template>
          </el-table-column>
          <!-- <el-table-column
                  prop="webPort"
                  label="web端口">
                </el-table-column> -->
        </el-table>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button size="small" @click="cancleForm5('ruleForm1')">取 消</el-button>
        <el-button size="small" type="primary" @click="saveForm5('ruleForm1')">确 定</el-button>
      </div>
    </el-dialog>
    <el-dialog title="视频预览" width="760px" append-to-body :close-on-click-modal="false" @close="closePreviewDialog" :visible.sync="previewVisible" class="play-video">
      <div class="video">
        <canvas
          ref="canvas"
          style="position:absolute;margin-left: 320px;"
        ></canvas>
      </div>
    </el-dialog>
   </div>
</template>
<script>
import { getProtocolCustom, putProtocolCustom, getProtocolgb28,
 putProtocolgb28 ,getDevSearch,getChannel,postChannel,deleteChannel,
 putChannel,postDevreboot, putChannelEnable } from '@/api/systemAPI';
import XLSX from 'xlsx'
import Blob from '@/utils/excel/Blob'
const { export_json_to_excel } = require('@/utils/excel/Export2Excel');
import { HOST} from "@/utils/constant";
export default {
  name: 'ChannelConfig',
  inject: ["size"],
  data() {
    return {
      previewVisible: false,
      playParams: { lateopen: true, preset: "realtime" },
      DEVICE_STATUS: {
        0: {
          label: '不在线',
          class: 'danger'
        },
        1: {
          label: '在线',
          class: 'success'
        },
        2: {
          label: '带宽不足',
          class: 'warning'
        },
        3: {
          label: 'mac校验失败',
          class: 'warning'
        },
        4: {
          label: '网络异常',
          class: 'warning'
        },
        5: {
          label: '用户名密码错误',
          class: 'warning'
        },
        6: {
          label: '正在连接',
          class: 'info'
        }
      },
      dialogProtocol: false,
      activeName: 'frist',
      showPass: false,
      protocolList: [],
      protocolList2: [],
      protocolObj: {},
      form: {
        protoId: '',
        name: '',
        streamType1: true,
        streamType2: false,
        type1: 1,
        type2: 1,
        dataPort1: "",
        dataPort2: "",
        url1: "",
        url2: "",
        transProto1: "",
        transProto2: "",
      },
      forOld: {},
      form2: {
        sipId: '',
        sipPort: 0,
        passwd: '',
        heartbeatCycle: 0,
        heartbeatTimes: 0,
      },
      form3: {
        channel: '',
        protocol: '',
        transportProtocol: '',
        domain: '',
        ip: '',
        ipAddrEnd: '',
        ctrlPort: '',
        dataPort: '',
        accessType: '',
        devChannel: '',
        stationNo: '',
        userName: '',
        passwd: '',
      },
      rules: {
        userName: [
              { required: true, message: '请输入用户名', trigger: 'blur' }
          ],
          passwd: [
              { required: true, message: '请输入密码', trigger: 'blur' }
          ],
      },
      rules1: {
        userName: [
              { required: true, message: '请输入用户名', trigger: 'blur' }
          ],
          passwd: [
              { required: true, message: '请输入密码', trigger: 'blur' }
          ],
      },
      rules2: {
        userName: [
              { required: true, message: '请输入用户名', trigger: 'blur' }
          ],
          passwd: [
              { required: true, message: '请输入密码', trigger: 'blur' }
          ],
      },
      form4: {
        channel: '',
        protocol: '',
        transportProtocol: '',
        domain: '',
        ip: '',
        ipAddrEnd: '',
        ctrlPort: '',
        dataPort: '',
        accessType: '',
        devChannel: '',
        stationNo: '',
        userName: '',
        passwd: '',
      },
      tableData: [],
      tableData2: [],
      dialogChannel: false,
      multipleSelection: [],
      multipleSelection2: [],
      dialogChannelSelf: false,
      channelNameList: [],
      form3IPFlag: false,
      addChannelFlag: true,
      dialogForm5: false,
      sureLoading: false, // 一键添加loading
      form5: {
        userName: '',
        passwd: '',
      },
      loading1: false,
      loading2: false,
      checkNumber: 10,
    }
    
  },
  created() {
    this.queryChannelName()
    this.onQueryDev()
    this.queryProtocolCustom()
    this.queryGb28181()
  },

  watch:{
        form:{
          handler(n,o){
            this._upDataList(n)
          },
          deep:true,
          immediate:true,
      }
  },
  methods: {
    // 获取自定义协议列表
    queryProtocolCustom() {
      this.protocolList = []
      this.protocolList2 = []
      getProtocolCustom().then(res => {
        this.protocolList2 = [{name: "Onvif",protoId: "ONVIF"}, {name: "GB28181",protoId: "GB28181"}].concat(res.data.data||[])
        this.protocolList = res.data.data||[]
        this.form3.protocol = 'ONVIF'
        this.onProtoChange2(this.protocolList2[0].protoId)

        // this.onProtoChange(this.protocolList[0].protoId)
      })
    },
    switchEnable(item) {
      putChannelEnable(item.channel, { enabled: item.enabled }).then(res => {
        const enabled = res.data.data.enabled;
        enabled ? this.$message.success('通道开启智能分析') : this.$message.success('通道关闭智能分析')
      })
    },
   changeShowPass() {
     this.showPass = !this.showPass
   },
    // 协议管理弹框展示
    onProtocol() {
      this.queryProtocolCustom()
      this.queryGb28181()
      this.dialogProtocol = true
    },
    // 自定义协议change
    onProtoChange(e) {
      let Index = this.protocolList.findIndex(item=> {
        return e == item.protoId
      })
      let obj = this.protocolList[Index]
      this.form = {
        protoId: obj.protoId,
        name: obj.name,
        streamType1: obj.streamInfo[0].enable == 1 ? true:false,
        streamType2: obj.streamInfo[1].enable == 1 ? true:false,
        type1: obj.streamInfo[0].type,
        type2: obj.streamInfo[1].type,
        dataPort1: obj.streamInfo[0].dataPort,
        dataPort2:  obj.streamInfo[1].dataPort,
        url1:  obj.streamInfo[0].url,
        url2:  obj.streamInfo[1].url,
        transProto1:  obj.streamInfo[0].transProto,
        transProto2:  obj.streamInfo[1].transProto,
      }
     
    },
    // 自定义协议change
    onProtoChange2(e) {
      let Index = this.protocolList2.findIndex(item=> {
        return e == item.protoId
      })
      let obj = this.protocolList2[Index]
      if(obj.protoId == 'ONVIF'){
        this.form3.dataPort = 554
        this.form3.transportProtocol = 1
        this.form3.ctrlPort = 80
        this.form3.accessType = 1
        this.form3.userName = 'admin'
        return
      }
      if(obj.protoId == 'GB28181'){
        this.form3.transportProtocol = 1
        this.form3.ctrlPort = 5060
        this.form3.accessType = 1
        this.form3.userName = 'admin'
        return
      }
      this.form3.dataPort = obj.streamInfo[0].dataPort
      this.form3.transportProtocol = obj.streamInfo[0].transProto
      this.form3.ctrlPort = 80
      this.form3.accessType = 1
      this.form3.userName = 'admin'
    },
    onProtoChange4(e) {
      let Index = this.protocolList2.findIndex(item=> {
        return e == item.protoId
      })
      let obj = this.protocolList2[Index]
      if(obj.protoId == 'ONVIF'){
        this.form4.dataPort = 554
        this.form4.transportProtocol = 1
        this.form4.ctrlPort = 80
        this.form4.accessType = 1
        this.form4.userName = 'admin'
        return
      }
      if(obj.protoId == 'GB28181'){
        this.form4.transportProtocol = 1
        this.form4.ctrlPort = 5060
        this.form4.accessType = 1
        this.form4.userName = 'admin'
        return
      }
      console.log("obj:", obj)
      this.form4.dataPort = obj.streamInfo[0].dataPort
      this.form4.transportProtocol = obj.streamInfo[0].transProto
      this.form4.ctrlPort = 80
      this.form4.accessType = 1
      this.form4.userName = 'admin'
    },
    _upDataList(obj){
      let Index = this.protocolList.findIndex(item=> {
        return item.protoId == obj.protoId
      })
      console.info(Index)
      this.protocolList[Index] = {
        "name": obj.name,
        "protoId": obj.protoId,
        "streamInfo": [
            {
                "dataPort": Number(obj.dataPort1),
                "enable":  Number(obj.streamType1),
                "streamType":  1,
                "transProto":  Number(obj.transProto1),
                "type":  Number(obj.type1),
                "url": obj.url1
            },
            {
                "dataPort": Number(obj.dataPort2),
                "enable":  Number(obj.streamType2),
                "streamType":  2,
                "transProto":  Number(obj.transProto2),
                "type":  Number(obj.type2),
                "url": obj.url2
            }
        ]
      }
    },
    // 保存协议管理
    onSaveProtocol() {
      if(this.activeName == 'frist') {
        this.setCustom()
      } else if(this.activeName == 'second') {
        this.setGb28181()
      }
      this.showPass = false
    },
    // 取消协议管理
    onCancelProtocol() {
      this.form = {
        protoId: '',
        name: '',
        streamType1: true,
        streamType2: false,
        type1: 1,
        type2: 1,
        dataPort1: "",
        dataPort2: "",
        url1: "",
        url2: "",
        transProto1: "",
        transProto2: "",
      }
      this.form2= {
        sipId: '',
        sipPort: 0,
        passwd: '',
        heartbeatCycle: 0,
        heartbeatTimes: 0,
      }
      this.dialogProtocol = false
      this.showPass = false
    },
    handleClick(e){

    },
    setCustom() {
      putProtocolCustom(this.protocolList).then(res => {
        if(res.data.code===200000){
          this.dialogProtocol = false
          this.$message({
            showClose: true,
            message: '保存成功',
            type:'success'
          })
        } else {
          this.$message({
            showClose:true,
            message: '保存失败',
            type: 'error'
          })
        }
      }).catch(()=>{
        this.$message({
          showClose:true,
          message: '保存失败',
          type: 'error'
        })
      })
    },
    queryGb28181() {
      getProtocolgb28().then(res => {
        if(res.data.code == 200000) {
          this.form2 = {
            sipId: res.data.data.sipId,
            sipPort: res.data.data.sipPort,
            passwd: res.data.data.passwd,
            heartbeatCycle: res.data.data.heartbeatCycle,
            heartbeatTimes: res.data.data.heartbeatTimes,
          }
        }
      })
    },
    setGb28181() {
      let obj = {
          sipId: this.form2.sipId,
          sipPort: Number(this.form2.sipPort),
          passwd: this.form2.passwd,
          heartbeatCycle: Number(this.form2.heartbeatCycle),
          heartbeatTimes: Number(this.form2.heartbeatTimes),
      }
      putProtocolgb28(obj).then(res =>{
        if(res.data.code == 200000){
          this.dialogProtocol = false
          this.$message({
            showClose: true,
            message: '保存成功',
            type: 'success'
          })
        } else {
          this.$message({
            showClose: true,
            message: '保存失败',
            type: 'error'
          })
        }
        
      }).catch(()=>{
        this.$message({
          showClose: true,
          message: '保存失败',
          type: 'error'
        })
      })
    },
    // 搜索设备
    onQueryDev() {
      this.loading1 = true
      getDevSearch().then(res=> {
        this.loading1 = false
        if(res.data.code == 200000) {
          this.tableData = res.data.data
          this.tableData = Array.from(new Set(this.tableData))
        }
      }).catch(err => {
        this.loading1 = false
      })
    },
    checkSelectable(row) {
      let index = this.multipleSelection.findIndex((v) => v.ip === row.ip);
      return this.multipleSelection.length >= this.checkNumber ? (index !== -1 ? true : false) : true
    },
    handleSelectionChange(val) {
      this.multipleSelection = val;
      if (val.length > this.checkNumber) {
        this.limitFn(val);
        return;
      }
    },
    // 限制数量方法
    limitFn(list) {
      let tableRef = this.$refs.multipleTable
      tableRef.clearSelection(); //用于多选表格，清空用户的选择
      for (let i = 0; i < this.checkNumber; i++) {
        tableRef.toggleRowSelection(list[i]); //用于多选表格，切换某一行的选中状态，如果使用了第二个参数，则是设置这一行选中与否（selected 为 true 则选中）
      }
    },
    handleSelectionChange2(val) {
      this.multipleSelection2 = val;
    },
    // 一键添加
    onAddChannelM() {
      this.dialogForm5 = true
      this.queryChannelName()
    },
    // 自定义添加
    onAddChannelS() {
      this.dialogChannelSelf = true
      this.queryChannelName()
      this.queryProtocolCustom()
    },
    //获取通道名
    queryChannelName() {
      this.loading2 = true
      getChannel().then(res => {
        this.loading2 = false
        if(res.data.code == 200000) {
          var temp = res.data.data.unboundList
          var map=new Map()
          //ip 去重
          this.channelNameList=temp.filter(item=>{
            if(!map.has(item.ip)){
              map.set(item.ip,1) 
              return true
            }
          })
          this.tableData2 = res.data.data.boundList
          if(this.channelNameList && this.channelNameList[0]){
            this.form3.channel = this.channelNameList[0].id
          }
        }
      }).catch(err=> {
        this.loading2 = false
      })
    },
    // 自定义保存
    onSaveChannelS(formName) {
      this.$refs[formName].validate((valid) => {
                if (valid) {
                  if(!this.form3.ip) {
                    message_is_blank='IP不能为空'
                    if (this.form3.protocol=="GB28181") {
                      message_is_blank='设备ID不能为空'
                    }
                    this.$message({
                      showClose: true,
                      type: 'warning',
                      message: message_is_blank
                    })
                    return
                  } else if (this.form3.protocol!="GB28181") {
                    if(/^(?:(?:[01]?\d{1,2}|2[0-4]\d|25[0-5])\.){3}(?:[01]?\d{1,2}|2[0-4]\d|25[0-5])$/.test(this.form3.ip.replace(/ /g, ''))){

                    } else {
                      this.$message({
                        showClose: true,
                        type: 'warning',
                        message: 'IP地址不合法！'
                      })
                    return
                    }
                  }
                  let arr = []
                  if (this.form3.ipAddrEnd!="") {
                    let ips = this.form3.ip.split('.')
                    let startIp = Number(ips[3])
                    let endIp = parseInt(this.form3.ipAddrEnd)
                    if (isNaN(endIp)||endIp <= 0 || endIp > 255 ) {
                      this.$message({
                        showClose: true,
                        type: 'warning',
                        message: '终止IP第四段值必须为1~255数字'
                      })
                      return
                    }
                    if (endIp <= startIp) {
                      this.$message({
                        showClose: true,
                        type: 'warning',
                        message: '终止IP第四段值应大于起始IP第四段值'
                      })
                      return
                    }
                    let addNum = endIp - startIp + 1
                    if (addNum > this.channelNameList.length) {
                      this.$message({
                        showClose: true,
                        type: 'warning',
                        message: '超出设备接入路数上限!'
                      })
                      return
                    }
                    for (var i=startIp,j=0;i<=endIp;i++,j++) {
                      arr.push({
                        "channel": Number(this.channelNameList[j].id),
                        "protocol": this.form3.protocol,
                        "ip": ips[0] + "." + ips[1] + "." + ips[2] + "." + i,
                        "ipAddrEnd": this.form3.ipAddrEnd,
                        "domain": this.form3.domain,
                        "transportProtocol": Number(this.form3.transportProtocol),
                        "ctrlPort": Number(this.form3.ctrlPort),
                        "dataPort": Number(this.form3.dataPort),
                        "accessType": Number(this.form3.accessType),
                        "devChannel": Number(this.form3.devChannel),
                        "stationNo": this.form3.stationNo,
                        "userName": this.form3.userName,
                        "passwd": this.form3.passwd
                      })
                    }
                  } else {
                    arr.push({
                        "channel": Number(this.form3.channel),
                        "protocol": this.form3.protocol,
                        "ip": this.form3.ip,
                        "ipAddrEnd": this.form3.ipAddrEnd,
                        "domain": this.form3.domain,
                        "transportProtocol": Number(this.form3.transportProtocol),
                        "ctrlPort": Number(this.form3.ctrlPort),
                        "dataPort": Number(this.form3.dataPort),
                        "accessType": Number(this.form3.accessType),
                        "devChannel": Number(this.form3.devChannel),
                        "stationNo": this.form3.stationNo,
                        "userName": this.form3.userName,
                        "passwd": this.form3.passwd
                    })
                  }
                  const loading = this.$loading({
                    lock: true,
                    text: '正在处理中...',
                    spinner: 'el-icon-loading',
                    background: 'rgba(0, 0, 0,0)'
                  });
                  postChannel(arr).then(res => {
                    if(res.data.code==200000){
                      this.queryChannelName()
                      setTimeout(this.queryChannelName,3000);
                      this.$message.success("添加成功！")
                      this.dialogChannelSelf = false
                      this.showPass = false
                    } else {
                      this.$message({
                        showClose:true,
                        message: '添加失败',
                        type: 'error'
                      })
                    }
                  // }).catch(()=>{
                  //   this.$message({
                  //     showClose:true,
                  //     message: '添加失败',
                  //     type: 'error'
                  //   })
                  }).finally(()=>{
                    loading.close();
                  })
                } else {
                return false;
                }
            });
     
    },
    //关闭自定义保存弹框
    onCloseChannelS(formName) {
      this.dialogChannelSelf = false;
      this.showPass = false
      this.$refs[formName].resetFields();
       this.form3= {
        channel: '',
        protocol: '',
        transportProtocol: '',
        domain: '',
        ip: '',
        ipAddrEnd: '',
        ctrlPort: '',
        dataPort: '',
        accessType: '',
        devChannel: '',
        stationNo: '',
        userName: '',
        passwd: '',
      }
    },
    // 单点IP
    onCellClick(row, column, cell, event){
      // if(column.label == "IP地址"){
        console.log(row)
        this.form3.ip = row.ip
        this.form3.ctrlPort = row.ctrlPort
        this.form3.dataPort = row.dataPort
        this.form3.protocol = row.protocol.toUpperCase()
        this.form3.devChannel = row.devChannel
        this.form3.transportProtocol = 1
        this.form3.accessType = 1
        this.form3.userName = 'admin'
      // }
    },
    // 新增通道
    onChannel() {
      this.dialogChannel = true
      this.addChannelFlag = true;
    },
    // 预览视频
    handlePreview(row) {
      this.previewVisible = true
      this.$nextTick(()=>{
        this.playUrl(row.channel);
      })
    },
    playUrl(channelId) {
      try {
        FGPlayer.create({
          canvas: this.$refs.canvas,
          enableBBox: true,
          onSizeChange: (width, height) => {
            this.sizeChange(width, height);
          },
        }).then(player => {
          player.genOSD(
              0,
              [
                  "00", "01", "02", "03", "04", "05", "06", "07", "08", "09", "10",
                  "11", "12", "13", "14", "15", "16", "17", "18", "19", "20", "对齐"
              ],
              "96px monospace",
              undefined,
              "#00ff00"
          );
          player.genOSD(
            1,
            ["当前人数：  "],
            "96px monospace",
            undefined,
            "red"
          );
          player.genOSD(
              3,
              ['其他终端正在预览, 需等待对方关闭后再试'],
              "96px monospace",
              undefined,
              "red"
          );
          const token = JSON.parse(localStorage.getItem('user')).token
          this.player = player
          player.play(
            `ws://${HOST}/api/nvr/preview/channel/${channelId}/0?Authorization=${token}`,
            this.playParams
          );
        })
        .catch(e => {
            console.log(e);
        });
      } catch (e) {
          this.reload()
          throw new Error("Player 创建失败");
      }
    },
		sizeChange(w,h) {
      const canvas = this.$refs.canvas;
			canvas.width = 700
			canvas.height = 400
		},
		closePreviewDialog() {
			if (this.player) {
				this.player.stop();
        this.player.destroy();
				this.player = null
			}
		},
    // 编辑
    handleEditC(index,row) {
      this.addChannelFlag = false;
      this.dialogChannel = true
      this.form4 = {
          channel: row.channel,
          protocol: row.protocol,
          transportProtocol: row.transportProtocol,
          domain: row.domain,
          ip: row.ip,
          ipAddrEnd: row.ipAddrEnd,
          ctrlPort: row.ctrlPort,
          dataPort: row.dataPort,
          accessType: row.accessType,
          devChannel: row.devChannel,
          stationNo: row.stationNo,
          userName: row.userName,
          passwd: row.passwd,
      }
    },
    // close 通道弹框
    onCloseChannel() {
      this.form4 = {
        channel: '',
        protocol: '',
        transportProtocol: '',
        domain: '',
        ip: '',
        ipAddrEnd: '',
        ctrlPort: '',
        dataPort: '',
        accessType: '',
        devChannel: '',
        stationNo: '',
        userName: '',
        passwd: '',
      }
      this.addChannelFlag = true;
    },
    // 保存通道
    onSaveChannel(formName) {
      this.$refs[formName].validate((valid) => {
          if (valid) {
            if(!this.form4.ip) {
              message_is_blank='IP不能为空'
              if (this.form4.protocol=="GB28181") {
                message_is_blank='设备ID不能为空'
              }
              this.$message({
                showClose: true,
                type: 'warning',
                message: message_is_blank
              })
              return
            } else if (this.form4.protocol!="GB28181") {
              if(/^(?:(?:[01]?\d{1,2}|2[0-4]\d|25[0-5])\.){3}(?:[01]?\d{1,2}|2[0-4]\d|25[0-5])$/.test(this.form4.ip.replace(/ /g, ''))){

              } else {
                this.$message({
                  showClose: true,
                  type: 'warning',
                  message: 'IP地址不合法！'
                })
              return
              }
            }
            let obj = {
                "channel": Number(this.form4.channel),
                "protocol": this.form4.protocol,
                "ip": this.form4.ip,
                "ipAddrEnd": this.form4.ipAddrEnd,
                "domain": this.form4.domain,
                "transportProtocol": Number(this.form4.transportProtocol),
                "ctrlPort": Number(this.form4.ctrlPort),
                "dataPort": Number(this.form4.dataPort),
                "accessType": Number(this.form4.accessType),
                "devChannel": Number(this.form4.devChannel),
                "stationNo": this.form4.stationNo,
                "userName": this.form4.userName,
                "passwd": this.form4.passwd
            }
            
            if(this.addChannelFlag) {
              // 新增
              let arr = []
              arr.push(obj)
              postChannel(arr).then(res => {
                if(res.data.code == 200000) {
                  this.queryChannelName()
                  this.$message.success("新增成功！")
                  this.dialogChannel = false
                  this.showPass = false
                } else {
                  this.$message({
                    showClose:true,
                    message: '修改失败',
                    type: 'error'
                  })
                }
              }).catch(()=>{
                this.$message({
                    showClose:true,
                    message: '修改失败',
                    type: 'error'
                  })
              })
            } else {
              // 修改
              putChannel(obj.channel,obj).then(res => {
                if(res.data.code == 200000) {
                  this.queryChannelName()
                  setTimeout(this.queryChannelName, 3000);
                  this.$message.success("修改成功！")
                  this.showPass = false
                  this.dialogChannel = false
                } else {
                  this.$message({
                    showClose:true,
                    message: '修改失败',
                    type: 'error'
                  })
                }
              }).catch(()=>{
                this.$message({
                  showClose:true,
                  message: '修改失败',
                  type: 'error'
                })
              })
            }
          } else {
          return false;
          }
      });
     
    },
    // 取消保存
    onCanclechannel(formName){
      this.$refs[formName].resetFields();

      this.form4= {
        channel: '',
        protocol: '',
        transportProtocol: '',
        domain: '',
        ip: '',
        ipAddrEnd: '',
        ctrlPort: '',
        dataPort: '',
        accessType: '',
        devChannel: '',
        stationNo: '',
        userName: '',
        passwd: '',
      }
      this.dialogChannel = false
      this.showPass = false
    },
    handleDeleteC(res,row) {
      let arr = []
      arr.push(row.channel)
      this.$confirm('是否确认删除此通道？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          deleteChannel(arr).then(res=> {
          if(res.data.code == 200000) {
            this.queryChannelName()
            this.$message.success("删除成功！")
          } else {
            this.$message({
              showClose:true,
              message: '删除失败',
              type: 'error'
            })
          }
        }).catch(()=>{
          this.$message({
            showClose:true,
            message: '删除失败',
            type: 'error'
          })
        })
        }).catch(() => {
          
        });
      
    },
    onDeleteM() {
      if(this.multipleSelection2.length){
        this.$confirm('是否确认删除选中通道？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          let arr = []
          this.multipleSelection2.forEach(item=>{
            arr.push(item.channel)
          })
          deleteChannel(arr).then(res=> {
            if(res.data.code == 200000) {
              this.queryChannelName()
              this.$message.success("删除成功！")
            } else {
              this.$message({
                showClose:true,
                message: '删除失败',
                type: 'error'
              })
            }
          }).catch(()=>{
            this.$message({
              showClose:true,
              message: '删除失败',
              type: 'error'
            })
          })
        })
      } else {
        this.$message.warning("请先选择要删除的数据！")
      }
    },
    onReboot() {
       if(this.multipleSelection2.length){
        let arr = []
        this.multipleSelection2.forEach(item=>{
          postDevreboot(item.channel).then(res=> {
            if(res.data.code==200000){
              this.$message.success("重启成功！")
            } else {
              this.$message({
                showClose:true,
                message: '重启失败',
                type: 'error'
              })
            }
          }).catch(()=>{
            this.$message({
              showClose:true,
              message: '重启失败',
              type: 'error'
            })
          })
        })
       
      } else {
        this.$message.warning("请先选择要重启的设备！")
      }
    },
    onRefresh() {
      this.queryChannelName()
    },
    // 一键添加
    saveForm5(formName){
      this.$refs[formName].validate((valid) => {
                if (valid) {
                  if(this.channelNameList.length<this.multipleSelection.length) {
                    this.$message.warning("超出设备接入路数上限！")
                  } else if(!this.multipleSelection.length) {
                    this.$message.warning("请先选择要添加的设备！")
                  } else if(this.multipleSelection.length > 10) {
                    this.$message.warning("单次添加设备不能超过10个！")
                  }
                  else {
                    this.sureLoading = true
                    let arr = []
                    this.multipleSelection.forEach((item,index)=>{
                      arr.push({
                        ...item,
                        "channel": Number(this.channelNameList[index].id),
                        "userName": this.form5.userName,
                        "passwd": this.form5.passwd,
                        "accessType": 1,
                        "transportProtocol": 1
                      })
                    })
                    postChannel(arr).then(res => {
                      if(res.data.code==200000){
                        this.queryChannelName()
                        setTimeout(this.queryChannelName,3000);
                        this.$message.success("添加成功！")
                        this.dialogForm5 = false
                        this.sureLoading = false
                        this.showPass = false
                      } else {
                        this.sureLoading = false
                        this.$message({
                          showClose:true,
                          message: '添加失败',
                          type: 'error'
                        })
                      }
                    }).catch(()=>{
                      this.sureLoading = false
                      this.$message({
                        showClose:true,
                        message: '添加失败',
                        type: 'error'
                      })
                    })
                  }
                } else {
                  
                return false;
                }
            });
      
    },
    //  一键添加取消
    cancleForm5(formName){
      this.$refs[formName].resetFields();
      this.form5 = {
        userName: '',
        passwd: '',
      }
      this.dialogForm5 = false
      this.showPass = false
    },
    // 刷新
    onUpdata() {
      this.queryChannelName()
    },
    // 导出
    onExport() {
      require.ensure([], () => {
        const tHeader = ['IP地址', '协议', 'web端口', '数据端口', '传输协议'];
        const filterVal = ['ip', 'protocol', 'webPort', 'dataPort', 'transportProtocol'];
        const list = this.tableData2;
        const data = this.formatJson(filterVal, list);
        export_json_to_excel(tHeader, data, '列表excel');
      })
    },
    formatJson(filterVal, jsonData) {
      return jsonData.map(v => filterVal.map(j => v[j]))
    },
    // 格式化表格内容--协议名称字段翻译
    formatProtocol(row) {
				let customProtocolName = row.protocol;
				this.protocolList.forEach(item => {
					if (row.protocol == item.protoId) {
						customProtocolName = item.name;
					}
				});
				return customProtocolName;
		}
  }
}
</script>
<style scoped lang="less">
.video {
  width: 400px;
  height: 400px;
  display: flex;
  justify-content: center;
  align-items: center;
}
.ChannelConfig{
}
.edit-channel {
  .el-input {
    width: 200px;
  }
}
.search-btn {
  width: 10%;
  height: 100px;
  float: right;
  display: inline-flex;
  justify-content: center;
  align-items: center;
}
.device-status {
  width: 10px;
  height: 10px;
  display: inline-block;
  background: #909399;
  border: 2px solid #d3d4d6;
  border-radius: 50%;
  &.success {
    background: #67c23a;
    border-color: #c2e7b0;
  }
  &.warning {
    background: #e6a23c;
    border-color: #f5dab1;
  }
  &.danger {
    background: #f56c6c;
    border-color: #fbc4c4;
  }
}
  /deep/.el-switch__core {
    width: 26px!important;
    height: 12px;
    margin-left: 10px;
  }
  /deep/.el-switch.is-checked .el-switch__core::after {
    margin-left: -10px !important;
  }
  /deep/.el-switch__core::after {
    width: 10px;
    height: 10px;
    margin-top:-1px;
    margin-bottom: 1px;
    // margin-left: -10px !important;
  }
</style>
