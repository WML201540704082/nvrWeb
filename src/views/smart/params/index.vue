<template>
    <!-- 设备管理 -->
  <div class="algo">
    <canvas
      ref="scene"
      v-show="browerType === 'notIE' && sceneMode === 2"
      style="position:absolute;"
    ></canvas>
    <div class="algo_top" style="display: flex">
      <el-form :model="algorithm" ref="algorithm-form" :inline="true">
        <el-form-item label="通道" prop="channelId">
          <el-select size="small" v-model="algorithm.channelId" @change="changeChannel(algorithm.channelId,'cut')" placeholder="请选择通道">
            <el-option
              v-for="item in enableList"
              :key="'channel' + item.id"
              :label="item.chName"
              :value="item.id"/>
          </el-select>
        </el-form-item>
        <el-form-item label="智能事件" prop="getIndex">
          <el-select size="small" v-model="getIndex" @change="changeAlgoList" placeholder="请选择智能事件">
            <el-option
              v-for="item in algoList"
              :key="'alg' + item.index"
              :label="item.newLable + (item.enabled ? '已开启' : '已关闭')"
              :value="item.index">
              <span style="float: left;">{{item.name}}</span>
              <span :class="item.enabled ? 'classA' : 'classB'" style="float: right;">{{item.enabled ? '已开启' : '已关闭'}}</span>
            </el-option>
          </el-select>
        </el-form-item>
      </el-form>
    </div>
    <div class="gap_line"></div>
    <div class="algo_bottom">
      <div class="algo_bottom_right" v-if="isHaveAlg">
        <el-tabs class="smart-tab" v-model="activeName" @tab-click="handleClick" type="card">
          <el-tab-pane name="first">
            <span slot="label">
              <i class="el-icon-set-up"></i>
              参数配置
            </span>
            <div class="algo_bottom_right_bottom_title">监测区域设置</div>
            <div class="algo_bottom_right_bottom">
              <div class="algo_bottom_right_bottom_left" v-if="picView">
                  <div>
                      <!-- 视频截图及操作按钮 -->
                      <div class="algo_bottom_right_bottom_left_top">
                        <img style="position: absolute;left: 0;top: 0;" :width="canvasSize.width" :height="canvasSize.height" :src="roiBase64" id="videoCapture" alt />
                        <canvas
                          id="canvas"
                          style="position:absolute;top:0;left:0;"
                          class="algo-canvas"
                          :width="canvasSize.width"
                          :height="canvasSize.height"
                          @contextmenu.prevent
                          v-show="getIndex != 29 && getIndex != 19"
                        ></canvas>
                        <canvas
                          id="canvas5"
                          style="position:absolute;top:0;left:0;"
                          class="algo-canvas"
                          :width="canvasSize.width"
                          :height="canvasSize.height"
                          @contextmenu.prevent
                          v-show="getIndex == 29 || getIndex == 19"
                        ></canvas>
                      </div>
                      <div v-if="getIndex != 13 && getIndex != 29 && getIndex != 19" class="but_con">
                        <div class="identifyClass" id="drawArea">
                          <i class="el-icon-edit" ></i>识别区域
                        </div>
                        <div class="identifyClass identifyClass1" id="clearAll">
                            <i class="el-icon-refresh"></i>清空
                        </div>
                        <div class="description">点击“识别区域”按钮后,单击左键开始绘制，双击左键可结束绘制。</div>
                      </div>
                      <div v-if="getIndex == 19" class="but_con">
                        <div class="identifyClass" id="drawArea" @click="createOutDraw(false)">
                          <i class="el-icon-edit" ></i>识别区域
                        </div>
                        <div class="identifyClass identifyClass1" @click="deleteOutDraw" id="clearAll">
                            <i class="el-icon-refresh"></i>清空
                        </div>
                        <div class="description">点击“识别区域”按钮后,单击左键开始绘制，再次单击左键可结束绘制。</div>
                      </div>
                  </div>
                <div class="algo_bottom_right_bottom_left_bottom">
                  <el-col :span="24" class="con">
                    <span class="total">已开通算法通道({{this.algorithmNum.length}})</span>
                    <div v-if="this.algorithmNum.length>0">
                      <div class="title">
                        <span class="title1">通道名称</span>
                        <span class="title1">IP地址</span>
                      </div>
                      <div v-for="(item,index) of this.algorithmNum" :key="'algorithmNum' + index" class="channelTable">
                        <span class="ellipsis" :title="item.name">{{item.name}}</span>
                        <span class="ellipsis" :title="item.url">{{item.url}}</span>
                      </div>
                    </div>
                  </el-col>
                </div>
              </div>
              <div style="width: 60%;min-width: 650px;height: calc(100%);;line-height: 360px;text-align: center;font-size: 16px;color: #87888A;border-right: 1px solid rgb(235, 238, 245);" v-if="!picView">
                  此通道处于关闭状态，不能进行识别操作
              </div>
              <div class="algo_bottom_right_bottom_right" v-if="getIndex != 29">
                <div class="enable">
                  算法开关 <el-switch v-model="enabled" @change="changeEnabled" class="switch"></el-switch>
                </div>
                <div style="margin: 20px 20px 0;">                  
                  <div v-if="getIndex == 13">
                    <button type="button" class="button" style="background:rgb(10 181 10); width:80px; height:30px; border: 1px solid rgb(10 181 10);" id="drawArea">识别区域</button>
                    <button type="button" class="button ml10" style="background:rgb(181 59 10); width:80px; height:30px; border: 1px solid rgb(181 59 10);" id="drawArea3">超级柜台</button>
                    <button type="button" class="button ml10" style="border: 1px solid #17FFFA; width:80px; height:30px;" id="drawArea1">屏幕区域</button>
                    <button type="button" class="button ml10" style="background:rgb(241 208 40); width:80px; height:30px; border: 1px solid rgb(241 208 40);" id="drawArea2">键盘区域</button>
                    <button type="button" class="delButton ml10" style="border: 1px solid #17FFFA; width:56px; height:30px;" id="clearAll">清空</button>
                  </div>
                </div>
                <div class="con">
                  <div>
                    <div v-if="getIndex != 19" class="title">
                      区域参数
                    </div>
                    <!-- 参数设置 -->
                    <el-form
                      :inline="true"
                      ref="form"
                      :model="getIndex == 0 ? face : getIndex == 1 ? pedestrian : getIndex == 2 ? vehicle : getIndex == 3 ? nonmotor : 
                              getIndex == 4 ? shoot : getIndex == 5 ? fall : getIndex == 6 ? cash : getIndex == 7 ? smogFire :
                              getIndex == 8 ? struggle : getIndex == 9 ? skeleton : getIndex == 10 ? fastMove : getIndex == 11 ? remain :
                              getIndex == 12 ? specialPed : getIndex == 13 ? stm : getIndex == 14 ? hover : getIndex == 15 ? bag : 
                              getIndex == 16 ? ipcmove : getIndex == 17 ? sleep : getIndex == 18 ? adPost : getIndex == 19 ? outOfBounds :
                              getIndex == 20 ? enterArea : getIndex == 21 ? leaveArea : getIndex == 22 ? playPhone : getIndex == 23 ? grab : 
                              getIndex == 24 ? smoking : getIndex == 25 ? atmRemain : getIndex == 26 ? recline : getIndex == 27 ? faceClustering : 
                              getIndex == 28 ? hijack : getIndex == 30 ? swapBag :getIndex == 31 ? touchBag :flowAreasNew"
                      label-width="100px"
                      label-position="right"
                      :rules="rules"
                      style="padding-top:10px"
                    >
                      <!-- 人脸 -->
                      <div v-if="getIndex == 0">
                        <el-col :span="24">
                          <el-form-item label="目标范围" prop="faceMinSize" class="inputLab">
                            <input
                            v-model.number="face.faceMinSize"
                            class="input inputSys faceInput"
                            :placeholder="$t('pleaseEnter')+$t('bbox')"
                            />
                          </el-form-item>-
                          <el-form-item prop="faceMaxSize" class="inputLab">
                            <input
                            v-model.number="face.faceMaxSize"
                            class="input inputSys faceInput"
                            style="margin-left:6px"
                            :placeholder="$t('pleaseEnter')+$t('bbox')"
                            />
                          </el-form-item>
                          <el-tooltip :content="$t('fbboxRemark')" placement="right">
                            <i class="el-icon-question"></i>
                          </el-tooltip>
                        </el-col>
                        <div v-for="(item,index) of json.face" :key="index">
                          <el-col :span="24">
                            <el-form-item
                            :label="$t(item.label)"
                            :prop="item.prop"
                            class="inputLab"
                            v-if="item.type === 'input'"
                            >
                              <input
                                class="input inputSys faceInput"
                                v-model.number="face[item.prop]"
                                :placeholder="$t('pleaseEnter')+$t(item.label)"
                              />
                              <el-tooltip
                                class="ml10"
                                :content="$t(item.content)"
                                placement="right"
                                v-if="item.tip"
                              >
                                <i class="el-icon-question"></i>
                              </el-tooltip>
                            </el-form-item>
                          </el-col>
                        </div>
                      </div>
                      <!-- 行人 -->
                      <div v-if="getIndex == 1">
                          <el-col :span="24">
                            <el-form-item label="目标范围" prop="pedestrianMinSize" class="inputLab">
                              <input
                                v-model.number="pedestrian.pedestrianMinSize"
                                class="input inputSys faceInput"
                                :placeholder="$t('pleaseEnter')+$t('bbox')"
                              />
                            </el-form-item>-
                            <el-form-item prop="pedestrianMaxSize" class="inputLab">
                              <input
                                v-model.number="pedestrian.pedestrianMaxSize"
                                class="input inputSys faceInput"
                                style="margin-left:6px"
                                :placeholder="$t('pleaseEnter')+$t('bbox')"
                              />
                            </el-form-item>
                            <el-tooltip :content="$t('pbboxRemark')" placement="right">
                              <i class="el-icon-question"></i>
                            </el-tooltip>
                          </el-col>
                          <div v-for="(item,index) of json.pedestrian" :key="index">
                            <el-col :span="24">
                              <el-form-item
                                :label="$t(item.label)"
                                :prop="item.prop"
                                class="inputLab"
                                v-if="item.type === 'input'"
                              >
                                <input
                                  class="input inputSys faceInput"
                                  v-model.number="pedestrian[item.prop]"
                                  :placeholder="$t('pleaseEnter')+$t(item.label)"
                                />
                                <el-tooltip
                                  class="ml10"
                                  :content="$t(item.content)"
                                  placement="right"
                                  v-if="item.tip"
                                >
                                  <i class="el-icon-question"></i>
                                </el-tooltip>
                              </el-form-item>
                            </el-col>
                          </div>
                      </div>
                      <!-- 机动车 -->
                      <div v-if="getIndex == 2">
                          <el-col :span="24">
                            <el-form-item label="目标范围" prop="vehicleMinSize" class="inputLab" label-width="100px">
                              <input
                                v-model.number="vehicle.vehicleMinSize"
                                class="input inputSys faceInput"
                                :placeholder="$t('pleaseEnter')+$t('bbox')"
                              />
                            </el-form-item>-
                            <el-form-item prop="vehicleMaxSize" class="inputLab">
                              <input
                                v-model.number="vehicle.vehicleMaxSize"
                                class="input inputSys faceInput"
                                style="margin-left:6px"
                                :placeholder="$t('pleaseEnter')+$t('bbox')"
                              />
                            </el-form-item>
                            <el-tooltip :content="$t('vbboxRemark')" placement="right">
                              <i class="el-icon-question"></i>
                            </el-tooltip>
                          </el-col>
                          <div v-for="(item,index) of json.vehicle" :key="index">
                            <el-col :span="24">
                              <el-form-item
                                :label="$t(item.label)"
                                :prop="item.prop"
                                class="inputLab"
                                label-width="100px"
                                v-if="item.type === 'select'"
                              >
                                <el-select v-model="vehicle[item.prop]" placeholder="请选择" clearable style="width:130px">
                                  <el-option
                                    v-for="item in json.localPlate"
                                    :key="item.code"
                                    :label="item.code"
                                    :value="item.code"/>
                                </el-select>
                              </el-form-item>
                              <el-form-item
                                :label="$t(item.label)"
                                :prop="item.prop"
                                class="inputLab"
                                label-width="100px"
                                v-if="item.type === 'input'"
                              >
                                <input
                                  class="input inputSys faceInput"
                                  v-model.number="vehicle[item.prop]"
                                  :placeholder="$t('pleaseEnter')+$t(item.label)"
                                />
                                <el-tooltip
                                  class="ml10"
                                  :content="$t(item.content)"
                                  placement="right"
                                  v-if="item.tip"
                                >
                                  <i class="el-icon-question"></i>
                                </el-tooltip>
                              </el-form-item>
                            </el-col>
                          </div>
                      </div>
                      <!-- 非机动车 -->
                      <div v-if="getIndex == 3">
                        <el-col :span="24">
                          <el-form-item label="目标范围" label-width="110px" prop="nonmotorMinSize" class="inputLab">
                            <input
                              v-model.number="nonmotor.nonmotorMinSize"
                              class="input inputSys faceInput"
                              :placeholder="$t('pleaseEnter')+$t('bbox')"
                            />
                          </el-form-item>-
                          <el-form-item prop="nonmotorMaxSize" label-width="110px" class="inputLab">
                            <input
                              v-model.number="nonmotor.nonmotorMaxSize"
                              class="input inputSys faceInput"
                              style="margin-left:6px"
                              :placeholder="$t('pleaseEnter')+$t('bbox')"
                            />
                          </el-form-item>
                          <el-tooltip :content="$t('nbboxRemark')" placement="right">
                            <i class="el-icon-question"></i>
                          </el-tooltip>
                        </el-col>
                        <div v-for="(item,index) of json.nonmotor" :key="index">
                          <el-col :span="24">
                            <el-form-item
                              :label="$t(item.label)"
                              label-width="110px"
                              :prop="item.prop"
                              class="inputLab"
                              v-if="item.type === 'input'"
                            >
                              <input
                                class="input inputSys faceInput"
                                v-model.number="nonmotor[item.prop]"
                                :placeholder="$t('pleaseEnter')+$t(item.label)"
                              />
                              <el-tooltip
                                class="ml10"
                                :content="$t(item.content)"
                                placement="right"
                                v-if="item.tip"
                              >
                                <i class="el-icon-question"></i>
                              </el-tooltip>
                            </el-form-item>
                          </el-col>
                        </div>
                      </div>
                      <!-- 拍屏 -->
                      <div v-if="getIndex == 4">
                        <div v-for="(item,index) of json.shoot" :key="index">
                          <el-col :span="24">
                            <el-form-item
                              :label="item.zn"
                              :prop="item.prop"
                              class="inputLab"
                              v-if="item.type === 'input'"
                            >
                              <input
                                class="input inputSys faceInput"
                                v-model.number="shoot[item.prop]"
                                :placeholder="$t('pleaseEnter')+item.zn"
                              />
                              <el-tooltip
                                class="ml10"
                                :content="item.content"
                                placement="right"
                                v-if="item.tip"
                              >
                                <i class="el-icon-question"></i>
                              </el-tooltip>
                            </el-form-item>
                          </el-col>
                        </div>
                        <el-col :span="24">
                          <el-form-item label="识别策略" prop="batchSecond" class="inputLab">
                            <span class="typeface">连续 </span>
                            <input
                              v-model.number="shoot.batchSecond"
                              class="input inputSys faceInput inputWidth"
                              :placeholder="$t('pleaseEnter')+'秒数'"
                            />
                            <span class="typeface"> 秒检查到目标 </span>
                          </el-form-item>
                          <el-form-item prop="eventNum" class="inputLab">
                            <input
                              v-model.number="shoot.eventNum"
                              class="input inputSys faceInput inputWidth"
                              :placeholder="$t('pleaseEnter')+'次数'"
                            />
                            <span class="typeface"> 次记为一次有效识别 </span>
                          </el-form-item>
                          <el-tooltip :content="$t('strategyContent')" placement="right">
                            <i class="el-icon-question"></i>
                          </el-tooltip>
                        </el-col>
                        <el-col :span="24">
                          <el-form-item label="生效时间" class="inputLab">
                            <el-time-picker
                              :editable="false"
                              is-range
                              v-model="shootTime0"
                              range-separator="至"
                              start-placeholder="开始时间"
                              end-placeholder="结束时间"
                              placeholder="选择时间范围">
                            </el-time-picker>
                          </el-form-item>
                        </el-col>
                        <el-col :span="24">
                          <el-form-item label=" " class="inputLab">
                            <el-time-picker
                              :editable="false"
                              is-range
                              v-model="shootTime1"
                              range-separator="至"
                              start-placeholder="开始时间"
                              end-placeholder="结束时间"
                              placeholder="选择时间范围">
                            </el-time-picker>
                          </el-form-item>
                        </el-col>
                      </div>
                      <!-- 倒地 -->
                      <div v-if="getIndex == 5">
                        <div v-for="(item,index) of json.fall" :key="index">
                          <el-col :span="24">
                            <el-form-item
                              :label="item.zn"
                              :prop="item.prop"
                              class="inputLab"
                              v-if="item.type === 'input'"
                            >
                              <input
                                class="input inputSys faceInput"
                                v-model.number="fall[item.prop]"
                                :placeholder="$t('pleaseEnter')+item.zn"
                              />
                              <el-tooltip
                                class="ml10"
                                :content="item.content"
                                placement="right"
                                v-if="item.tip"
                              >
                                <i class="el-icon-question"></i>
                              </el-tooltip>
                            </el-form-item>
                          </el-col>
                        </div>
                        <!-- <el-col :span="24">
                          <el-form-item label="识别策略" prop="batchSecond" class="inputLab">
                            <span class="typeface">连续 </span>
                            <input
                              v-model.number="fall.batchSecond"
                              class="input inputSys faceInput inputWidth"
                              :placeholder="$t('pleaseEnter')+'秒数'"
                            />
                            <span class="typeface"> 秒检查到目标 </span>
                          </el-form-item>
                          <el-form-item prop="eventNum" class="inputLab">
                            <input
                              v-model.number="fall.eventNum"
                              class="input inputSys faceInput inputWidth"
                              :placeholder="$t('pleaseEnter')+'次数'"
                            />
                            <span class="typeface"> 次记为一次有效识别 </span>
                          </el-form-item>
                          <el-tooltip :content="$t('strategyFallContent')" placement="right">
                            <i class="el-icon-question"></i>
                          </el-tooltip>
                        </el-col> -->
                        <el-col :span="24">
                          <el-form-item label="生效时间" class="inputLab">
                            <el-time-picker
                              :editable="false"
                              is-range
                              v-model="fallTime0"
                              range-separator="至"
                              start-placeholder="开始时间"
                              end-placeholder="结束时间"
                              placeholder="选择时间范围">
                            </el-time-picker>
                          </el-form-item>
                        </el-col>
                        <el-col :span="24">
                          <el-form-item label=" " class="inputLab">
                            <el-time-picker
                              :editable="false"
                              is-range
                              v-model="fallTime1"
                              range-separator="至"
                              start-placeholder="开始时间"
                              end-placeholder="结束时间"
                              placeholder="选择时间范围">
                            </el-time-picker>
                          </el-form-item>
                        </el-col>
                      </div>
                      <!-- 临时离柜 -->
                      <div v-if="getIndex == 6">
                        <div v-for="(item,index) of json.cash" :key="index">
                          <el-col :span="24">
                            <el-form-item
                              :label="item.zn"
                              label-width="110px"
                              :prop="item.prop"
                              class="inputLab"
                              v-if="item.type === 'input'"
                            >
                              <input
                                class="input inputSys faceInput"
                                v-model.number="cash[item.prop]"
                                :placeholder="$t('pleaseEnter')+item.zn"
                              />
                              <el-tooltip
                                class="ml10"
                                :content="item.content"
                                placement="right"
                                v-if="item.tip"
                              >
                                <i class="el-icon-question"></i>
                              </el-tooltip>
                            </el-form-item>
                          </el-col>
                        </div>
                        <el-col :span="24">
                          <el-form-item label="识别策略" label-width="110px" prop="batchSecond" class="inputLab">
                            <span class="typeface">连续 </span>
                            <input
                              v-model.number="cash.batchSecond"
                              class="input inputSys faceInput inputWidth"
                              :placeholder="$t('pleaseEnter')+'秒数'"
                            />
                            <span class="typeface"> 秒检查到目标 </span>
                          </el-form-item>
                          <el-form-item prop="eventNum" class="inputLab">
                            <input
                              v-model.number="cash.eventNum"
                              class="input inputSys faceInput inputWidth"
                              :placeholder="$t('pleaseEnter')+'次数'"
                            />
                            <span class="typeface"> 次记为一次有效识别 </span>
                          </el-form-item>
                          <el-tooltip :content="$t('strategyContent')" placement="right">
                            <i class="el-icon-question"></i>
                          </el-tooltip>
                        </el-col>
                        <el-col :span="24">
                          <el-form-item label="生效时间" label-width="110px" class="inputLab">
                            <el-time-picker
                              :editable="false"
                              is-range
                              v-model="cashTime0"
                              range-separator="至"
                              start-placeholder="开始时间"
                              end-placeholder="结束时间"
                              placeholder="选择时间范围">
                            </el-time-picker>
                          </el-form-item>
                        </el-col>
                        <el-col :span="24">
                          <el-form-item label=" " label-width="110px" class="inputLab">
                            <el-time-picker
                              :editable="false"
                              is-range
                              v-model="cashTime1"
                              range-separator="至"
                              start-placeholder="开始时间"
                              end-placeholder="结束时间"
                              placeholder="选择时间范围">
                            </el-time-picker>
                          </el-form-item>
                        </el-col>
                      </div>
                      <!-- 烟雾 -->
                      <div v-if="getIndex == 7">
                        <el-col :span="24">
                          <el-form-item label="目标范围" prop="smogFireMinSize" class="inputLab">
                            <input
                              v-model.number="smogFire.smogFireMinSize"
                              class="input inputSys faceInput"
                              :placeholder="$t('pleaseEnter')+$t('bbox')"
                            />
                          </el-form-item>-
                          <el-form-item prop="smogFireMaxSize" class="inputLab">
                            <input
                              v-model.number="smogFire.smogFireMaxSize"
                              class="input inputSys faceInput"
                              style="margin-left:6px"
                              :placeholder="$t('pleaseEnter')+$t('bbox')"
                            />
                          </el-form-item>
                          <el-tooltip :content="$t('smogbboxRemark')" placement="right">
                            <i class="el-icon-question"></i>
                          </el-tooltip>
                        </el-col>
                      </div>
                      <!-- 打斗 -->
                      <div v-if="getIndex == 8">
                        <div v-for="(item,index) of json.struggle" :key="index">
                          <el-col :span="24">
                            <el-form-item
                              :label="item.zn"
                              :prop="item.prop"
                              class="inputLab"
                              v-if="item.type === 'input'"
                            >
                              <input
                                class="input inputSys faceInput"
                                v-model.number="struggle[item.prop]"
                                :placeholder="$t('pleaseEnter')+item.zn"
                              />
                              <el-tooltip
                                class="ml10"
                                :content="item.content"
                                placement="right"
                                v-if="item.tip"
                              >
                                <i class="el-icon-question"></i>
                              </el-tooltip>
                            </el-form-item>
                          </el-col>
                        </div>
                        <el-col :span="24">
                          <el-form-item label="识别策略" prop="batchSecond" class="inputLab">
                            <span class="typeface">连续 </span>
                            <input
                              v-model.number="struggle.batchSecond"
                              class="input inputSys faceInput inputWidth"
                              :placeholder="$t('pleaseEnter')+'秒数'"
                            />
                            <span class="typeface"> 秒检查到目标 </span>
                          </el-form-item>
                          <el-form-item prop="eventNum" class="inputLab">
                            <input
                              v-model.number="struggle.eventNum"
                              class="input inputSys faceInput inputWidth"
                              :placeholder="$t('pleaseEnter')+'次数'"
                            />
                            <span class="typeface"> 次记为一次有效识别 </span>
                          </el-form-item>
                          <el-tooltip :content="$t('strategyFallContent')" placement="right">
                            <i class="el-icon-question"></i>
                          </el-tooltip>
                        </el-col>
                        <el-col :span="24">
                          <el-form-item label="生效时间" class="inputLab">
                            <el-time-picker
                              :editable="false"
                              is-range
                              v-model="struggleTime0"
                              range-separator="至"
                              start-placeholder="开始时间"
                              end-placeholder="结束时间"
                              placeholder="选择时间范围">
                            </el-time-picker>
                          </el-form-item>
                        </el-col>
                        <el-col :span="24">
                          <el-form-item label=" " class="inputLab">
                            <el-time-picker
                              :editable="false"
                              is-range
                              v-model="struggleTime1"
                              range-separator="至"
                              start-placeholder="开始时间"
                              end-placeholder="结束时间"
                              placeholder="选择时间范围">
                            </el-time-picker>
                          </el-form-item>
                        </el-col>
                      </div>
                      <!-- 数人 -->
                      <div v-if="getIndex == 9">
                        <div v-for="(item,index) of json.skeleton" :key="index">
                          <el-col :span="24">
                            <el-form-item
                              :label="$t(item.label)"
                              label-width="110px"
                              :prop="item.prop"
                              class="inputLab"
                              v-if="item.type === 'input'"
                            >
                              <input
                                class="input inputSys faceInput"
                                v-model.number="skeleton[item.prop]"
                                :placeholder="$t('pleaseEnter')+$t(item.label)"
                              />
                              <el-tooltip
                                class="ml10"
                                :content="$t(item.content)"
                                placement="right"
                                v-if="item.tip"
                              >
                                <i class="el-icon-question"></i>
                              </el-tooltip>
                            </el-form-item>
                          </el-col>
                        </div>
                      </div>
                      <!-- 快速移动 -->
                      <div v-if="getIndex == 10">
                        <div v-for="(item,index) of json.fastMove" :key="index">
                          <el-col :span="24">
                            <el-form-item
                              :label="item.zn"
                              :prop="item.prop"
                              class="inputLab"
                              v-if="item.type === 'input'"
                            >
                              <input
                                class="input inputSys faceInput"
                                v-model.number="fastMove[item.prop]"
                                :placeholder="$t('pleaseEnter')+item.zn"
                              />
                              <el-tooltip
                                class="ml10"
                                :content="item.content"
                                placement="right"
                                v-if="item.tip"
                              >
                                <i class="el-icon-question"></i>
                              </el-tooltip>
                            </el-form-item>
                          </el-col>
                        </div>
                        <el-col :span="24">
                          <el-form-item label="识别策略" prop="batchSecond" class="inputLab">
                            <span class="typeface">连续 </span>
                            <input
                              v-model.number="fastMove.batchSecond"
                              class="input inputSys faceInput inputWidth"
                              :placeholder="$t('pleaseEnter')+'秒数'"
                            />
                            <span class="typeface"> 秒检查到目标 </span>
                          </el-form-item>
                          <el-form-item prop="eventNum" class="inputLab">
                            <input
                              v-model.number="fastMove.eventNum"
                              class="input inputSys faceInput inputWidth"
                              :placeholder="$t('pleaseEnter')+'次数'"
                            />
                            <span class="typeface"> 次记为一次有效识别 </span>
                          </el-form-item>
                          <el-tooltip :content="$t('strategyContent')" placement="right">
                            <i class="el-icon-question"></i>
                          </el-tooltip>
                        </el-col>
                        <el-col :span="24">
                          <el-form-item label="生效时间" class="inputLab">
                            <el-time-picker
                              :editable="false"
                              is-range
                              v-model="fastMoveTime0"
                              range-separator="至"
                              start-placeholder="开始时间"
                              end-placeholder="结束时间"
                              placeholder="选择时间范围">
                            </el-time-picker>
                          </el-form-item>
                        </el-col>
                        <el-col :span="24">
                          <el-form-item label=" " class="inputLab">
                            <el-time-picker
                              :editable="false"
                              is-range
                              v-model="fastMoveTime1"
                              range-separator="至"
                              start-placeholder="开始时间"
                              end-placeholder="结束时间"
                              placeholder="选择时间范围">
                            </el-time-picker>
                          </el-form-item>
                        </el-col>
                      </div>
                      <!-- 遗留物 -->
                      <div v-if="getIndex == 11">
                        <div v-for="(item,index) of json.remain" :key="index">
                          <el-col :span="24">
                            <el-form-item
                              :label="item.zn"
                              :prop="item.prop"
                              class="inputLab"
                              v-if="item.type === 'input'"
                            >
                              <input
                                class="input inputSys faceInput"
                                v-model.number="remain[item.prop]"
                                :placeholder="$t('pleaseEnter')+item.zn"
                              />
                              <el-tooltip
                                class="ml10"
                                :content="item.content"
                                placement="right"
                                v-if="item.tip"
                              >
                                <i class="el-icon-question"></i>
                              </el-tooltip>
                            </el-form-item>
                          </el-col>
                        </div>
                        <el-col :span="24">
                          <el-form-item label="识别策略" prop="batchSecond" class="inputLab">
                            <span class="typeface">连续 </span>
                            <input
                              v-model.number="remain.batchSecond"
                              class="input inputSys faceInput inputWidth"
                              :placeholder="$t('pleaseEnter')+'秒数'"
                            />
                            <span class="typeface"> 秒检查到目标 </span>
                          </el-form-item>
                          <el-form-item prop="eventNum" class="inputLab">
                            <input
                              v-model.number="remain.eventNum"
                              class="input inputSys faceInput inputWidth"
                              :placeholder="$t('pleaseEnter')+'次数'"
                            />
                            <span class="typeface"> 次记为一次有效识别 </span>
                          </el-form-item>
                          <el-tooltip :content="$t('strategyContent')" placement="right">
                            <i class="el-icon-question"></i>
                          </el-tooltip>
                        </el-col>
                        <el-col :span="24">
                          <el-form-item label="生效时间" class="inputLab">
                            <el-time-picker
                              :editable="false"
                              is-range
                              v-model="remainTime0"
                              range-separator="至"
                              start-placeholder="开始时间"
                              end-placeholder="结束时间"
                              placeholder="选择时间范围">
                            </el-time-picker>
                          </el-form-item>
                        </el-col>
                        <el-col :span="24">
                          <el-form-item label=" " class="inputLab">
                            <el-time-picker
                              :editable="false"
                              is-range
                              v-model="remainTime1"
                              range-separator="至"
                              start-placeholder="开始时间"
                              end-placeholder="结束时间"
                              placeholder="选择时间范围">
                            </el-time-picker>
                          </el-form-item>
                        </el-col>
                      </div>
                      <!-- 特殊人群 -->
                      <div v-if="getIndex == 12">
                        <div v-for="(item,index) of json.specialPed" :key="index">
                          <el-col :span="24">
                            <el-form-item
                              :label="item.zn"
                              :prop="item.prop"
                              class="inputLab"
                              v-if="item.type === 'input'"
                            >
                              <input
                                class="input inputSys faceInput"
                                v-model.number="specialPed[item.prop]"
                                :placeholder="$t('pleaseEnter')+item.zn"
                              />
                              <el-tooltip
                                class="ml10"
                                :content="item.content"
                                placement="right"
                                v-if="item.tip"
                              >
                                <i class="el-icon-question"></i>
                              </el-tooltip>
                            </el-form-item>
                          </el-col>
                        </div>
                        <el-col :span="24">
                          <el-form-item label="识别策略" prop="batchSecond" class="inputLab">
                            <span class="typeface">连续 </span>
                            <input
                              v-model.number="specialPed.batchSecond"
                              class="input inputSys faceInput inputWidth"
                              :placeholder="$t('pleaseEnter')+'秒数'"
                            />
                            <span class="typeface"> 秒检查到目标 </span>
                          </el-form-item>
                          <el-form-item prop="eventNum" class="inputLab">
                            <input
                              v-model.number="specialPed.eventNum"
                              class="input inputSys faceInput inputWidth"
                              :placeholder="$t('pleaseEnter')+'次数'"
                            />
                            <span class="typeface"> 次记为一次有效识别 </span>
                          </el-form-item>
                          <el-tooltip :content="$t('strategyContent')" placement="right">
                            <i class="el-icon-question"></i>
                          </el-tooltip>
                        </el-col>
                        <el-col :span="24">
                          <el-form-item label="生效时间" class="inputLab">
                            <el-time-picker
                              :editable="false"
                              is-range
                              v-model="specialPedTime0"
                              range-separator="至"
                              start-placeholder="开始时间"
                              end-placeholder="结束时间"
                              placeholder="选择时间范围">
                            </el-time-picker>
                          </el-form-item>
                        </el-col>
                        <el-col :span="24">
                          <el-form-item label=" " class="inputLab">
                            <el-time-picker
                              :editable="false"
                              is-range
                              v-model="specialPedTime1"
                              range-separator="至"
                              start-placeholder="开始时间"
                              end-placeholder="结束时间"
                              placeholder="选择时间范围">
                            </el-time-picker>
                          </el-form-item>
                        </el-col>
                      </div>
                      <!-- 代客操作 -->
                      <div v-if="getIndex == 13">
                        <div v-for="(item,index) of json.stm" :key="index">
                          <el-col :span="24">
                            <el-form-item
                              :label="item.zn"
                              label-width="100px"
                              :prop="item.prop"
                              class="inputLab"
                              v-if="item.type === 'input'"
                            >
                              <input
                                class="input inputSys faceInput"
                                v-model.number="stm[item.prop]"
                                :placeholder="$t('pleaseEnter')+item.zn"
                              />
                              <el-tooltip
                                class="ml10"
                                :content="item.content"
                                placement="right"
                                v-if="item.tip"
                              >
                                <i class="el-icon-question"></i>
                              </el-tooltip>
                            </el-form-item>
                          </el-col>
                        </div>
                        <el-col :span="24">
                          <el-form-item label="识别策略" prop="batchSecond" class="inputLab">
                            <span class="typeface">连续 </span>
                            <input
                              v-model.number="stm.batchSecond"
                              class="input inputSys faceInput inputWidth"
                              :placeholder="$t('pleaseEnter')+'秒数'"
                            />
                            <span class="typeface"> 秒检查到目标 </span>
                          </el-form-item>
                          <el-form-item prop="eventNum" class="inputLab">
                            <input
                              v-model.number="stm.eventNum"
                              class="input inputSys faceInput inputWidth"
                              :placeholder="$t('pleaseEnter')+'次数'"
                            />
                            <span class="typeface"> 次记为一次有效识别 </span>
                          </el-form-item>
                          <el-tooltip :content="$t('strategyContent')" placement="right">
                            <i class="el-icon-question"></i>
                          </el-tooltip>
                        </el-col>
                        <el-col :span="24">
                          <el-form-item label="生效时间" label-width="100px" class="inputLab">
                            <el-time-picker
                              :editable="false"
                              is-range
                              v-model="stmTime0"
                              range-separator="至"
                              start-placeholder="开始时间"
                              end-placeholder="结束时间"
                              placeholder="选择时间范围">
                            </el-time-picker>
                          </el-form-item>
                        </el-col>
                        <el-col :span="24">
                          <el-form-item label=" " label-width="100px" class="inputLab">
                            <el-time-picker
                              :editable="false"
                              is-range
                              v-model="stmTime1"
                              range-separator="至"
                              start-placeholder="开始时间"
                              end-placeholder="结束时间"
                              placeholder="选择时间范围">
                            </el-time-picker>
                          </el-form-item>
                        </el-col>
                      </div>
                      <!-- 徘徊 -->
                      <div v-if="getIndex == 14">
                        <div v-for="(item,index) of json.hover" :key="index">
                          <el-col :span="24">
                            <el-form-item
                              :label="item.zn"
                              label-width="110px"
                              :prop="item.prop"
                              class="inputLab"
                              v-if="item.type === 'input'"
                            >
                              <input
                                class="input inputSys faceInput"
                                v-model.number="hover[item.prop]"
                                :placeholder="$t('pleaseEnter')+item.zn"
                              />
                              <el-tooltip
                                class="ml10"
                                :content="item.content"
                                placement="right"
                                v-if="item.tip"
                              >
                                <i class="el-icon-question"></i>
                              </el-tooltip>
                            </el-form-item>
                          </el-col>
                        </div>
                        <el-col :span="24">
                          <el-form-item label="生效时间" label-width="110px" class="inputLab">
                            <el-time-picker
                              :editable="false"
                              is-range
                              v-model="hoverTime0"
                              range-separator="至"
                              start-placeholder="开始时间"
                              end-placeholder="结束时间"
                              placeholder="选择时间范围">
                            </el-time-picker>
                          </el-form-item>
                        </el-col>
                        <el-col :span="24">
                          <el-form-item label=" " label-width="110px" class="inputLab">
                            <el-time-picker
                              :editable="false"
                              is-range
                              v-model="hoverTime1"
                              range-separator="至"
                              start-placeholder="开始时间"
                              end-placeholder="结束时间"
                              placeholder="选择时间范围">
                            </el-time-picker>
                          </el-form-item>
                        </el-col>
                      </div>
                      <!-- 箱包 -->
                      <div v-if="getIndex == 15">
                        <div v-for="(item,index) of json.bag" :key="index">
                          <el-col :span="24">
                            <el-form-item
                              :label="item.zn"
                              label-width="100px"
                              :prop="item.prop"
                              class="inputLab"
                              v-if="item.type === 'input'"
                            >
                              <input
                                class="input inputSys faceInput"
                                v-model.number="bag[item.prop]"
                                :placeholder="$t('pleaseEnter')+item.zn"
                              />
                              <el-tooltip
                                class="ml10"
                                :content="item.content"
                                placement="right"
                                v-if="item.tip"
                              >
                                <i class="el-icon-question"></i>
                              </el-tooltip>
                            </el-form-item>
                          </el-col>
                        </div>
                        <el-col :span="24">
                          <el-form-item label="识别策略" label-width="100px" prop="batchSecond" class="inputLab">
                            <span class="typeface">连续 </span>
                            <input
                              v-model.number="bag.batchSecond"
                              class="input inputSys faceInput inputWidth"
                              :placeholder="$t('pleaseEnter')+'秒数'"
                            />
                            <span class="typeface"> 秒检查到目标 </span>
                          </el-form-item>
                          <el-form-item prop="eventNum" class="inputLab">
                            <input
                              v-model.number="bag.eventNum"
                              class="input inputSys faceInput inputWidth"
                              :placeholder="$t('pleaseEnter')+'次数'"
                            />
                            <span class="typeface"> 次记为一次有效识别 </span>
                          </el-form-item>
                          <el-tooltip :content="$t('strategyContent')" placement="right">
                            <i class="el-icon-question"></i>
                          </el-tooltip>
                        </el-col>
                        <el-col :span="24">
                          <el-form-item label="生效时间" label-width="100px" class="inputLab">
                            <el-time-picker
                              :editable="false"
                              is-range
                              v-model="bagTime0"
                              range-separator="至"
                              start-placeholder="开始时间"
                              end-placeholder="结束时间"
                              placeholder="选择时间范围">
                            </el-time-picker>
                          </el-form-item>
                        </el-col>
                        <el-col :span="24">
                          <el-form-item label=" " label-width="100px" class="inputLab">
                            <el-time-picker
                              :editable="false"
                              is-range
                              v-model="bagTime1"
                              range-separator="至"
                              start-placeholder="开始时间"
                              end-placeholder="结束时间"
                              placeholder="选择时间范围">
                            </el-time-picker>
                          </el-form-item>
                        </el-col>
                      </div>
                      <!-- 摄像头移动 -->
                      <div v-if="getIndex == 16">
                        <div v-for="(item,index) of json.ipcmove" :key="index">
                          <el-col :span="24">
                            <el-form-item
                              :label="item.zn"
                              :prop="item.prop"
                              class="inputLab"
                              v-if="item.type === 'input'"
                            >
                              <input
                                class="input inputSys faceInput"
                                v-model.number="ipcmove[item.prop]"
                                :placeholder="$t('pleaseEnter')+item.zn"
                              />
                              <el-tooltip
                                class="ml10"
                                :content="item.content"
                                placement="right"
                                v-if="item.tip"
                              >
                                <i class="el-icon-question"></i>
                              </el-tooltip>
                            </el-form-item>
                          </el-col>
                        </div>
                        <el-col :span="24">
                          <el-form-item label="识别策略" prop="batchSecond" class="inputLab">
                            <span class="typeface">连续 </span>
                            <input
                              v-model.number="ipcmove.batchSecond"
                              class="input inputSys faceInput inputWidth"
                              :placeholder="$t('pleaseEnter')+'秒数'"
                            />
                            <span class="typeface"> 秒检查到目标 </span>
                          </el-form-item>
                          <el-form-item prop="eventNum" class="inputLab">
                            <input
                              v-model.number="ipcmove.eventNum"
                              class="input inputSys faceInput inputWidth"
                              :placeholder="$t('pleaseEnter')+'次数'"
                            />
                            <span class="typeface"> 次记为一次有效识别 </span>
                          </el-form-item>
                          <el-tooltip :content="$t('strategyContent')" placement="right">
                            <i class="el-icon-question"></i>
                          </el-tooltip>
                        </el-col>
                        <el-col :span="24">
                          <el-form-item label="生效时间" label-width="90px" class="inputLab">
                            <el-time-picker
                              :editable="false"
                              is-range
                              v-model="ipcmoveTime0"
                              range-separator="至"
                              start-placeholder="开始时间"
                              end-placeholder="结束时间"
                              placeholder="选择时间范围">
                            </el-time-picker>
                          </el-form-item>
                        </el-col>
                        <el-col :span="24">
                          <el-form-item label=" " label-width="90px" class="inputLab">
                            <el-time-picker
                              :editable="false"
                              is-range
                              v-model="ipcmoveTime1"
                              range-separator="至"
                              start-placeholder="开始时间"
                              end-placeholder="结束时间"
                              placeholder="选择时间范围">
                            </el-time-picker>
                          </el-form-item>
                        </el-col>
                      </div>
                      <!-- 睡岗 -->
                      <div v-if="getIndex == 17">
                        <div v-for="(item,index) of json.sleep" :key="index">
                          <el-col :span="24">
                            <el-form-item
                              :label="item.zn"
                              label-width="110px"
                              :prop="item.prop"
                              class="inputLab"
                              v-if="item.type === 'input'"
                            >
                              <input
                                class="input inputSys faceInput"
                                v-model.number="sleep[item.prop]"
                                :placeholder="$t('pleaseEnter')+item.zn"
                              />
                              <el-tooltip
                                class="ml10"
                                :content="item.content"
                                placement="right"
                                v-if="item.tip"
                              >
                                <i class="el-icon-question"></i>
                              </el-tooltip>
                            </el-form-item>
                          </el-col>
                        </div>
                        <el-col :span="24">
                          <el-form-item label="生效时间" label-width="110px" class="inputLab">
                            <el-time-picker
                              :editable="false"
                              is-range
                              v-model="sleepTime0"
                              range-separator="至"
                              start-placeholder="开始时间"
                              end-placeholder="结束时间"
                              placeholder="选择时间范围">
                            </el-time-picker>
                          </el-form-item>
                        </el-col>
                        <el-col :span="24">
                          <el-form-item label=" " label-width="110px" class="inputLab">
                            <el-time-picker
                              :editable="false"
                              is-range
                              v-model="sleepTime1"
                              range-separator="至"
                              start-placeholder="开始时间"
                              end-placeholder="结束时间"
                              placeholder="选择时间范围">
                            </el-time-picker>
                          </el-form-item>
                        </el-col>
                      </div>
                      <!-- 广告张贴 -->
                      <div v-if="getIndex == 18">
                        <div v-for="(item,index) of json.adPost" :key="index">
                          <el-col :span="24">
                            <el-form-item
                              :label="item.zn"
                              label-width="100px"
                              :prop="item.prop"
                              class="inputLab"
                              v-if="item.type === 'input'"
                            >
                              <input
                                class="input inputSys faceInput"
                                v-model.number="adPost[item.prop]"
                                :placeholder="$t('pleaseEnter')+item.zn"
                              />
                              <el-tooltip
                                class="ml10"
                                :content="item.content"
                                placement="right"
                                v-if="item.tip"
                              >
                                <i class="el-icon-question"></i>
                              </el-tooltip>
                            </el-form-item>
                          </el-col>
                        </div>
                        <el-col :span="24">
                          <el-form-item label="生效时间" label-width="100px" class="inputLab">
                            <el-time-picker
                              :editable="false"
                              is-range
                              v-model="sleepTime0"
                              range-separator="至"
                              start-placeholder="开始时间"
                              end-placeholder="结束时间"
                              placeholder="选择时间范围">
                            </el-time-picker>
                          </el-form-item>
                        </el-col>
                        <el-col :span="24">
                          <el-form-item label=" " label-width="100px" class="inputLab">
                            <el-time-picker
                              :editable="false"
                              is-range
                              v-model="sleepTime1"
                              range-separator="至"
                              start-placeholder="开始时间"
                              end-placeholder="结束时间"
                              placeholder="选择时间范围">
                            </el-time-picker>
                          </el-form-item>
                        </el-col>
                      </div>
                      <!-- 越界侦测 -->
                      <div v-if="getIndex == 19">
                        <template>
                          <div style="margin-left: 40px; color: #909399">
                            <span class="mustIcon">区域</span>
                            <el-select v-model.number="outOfBounds.id" size="mini" placeholder="请选择绘制区域" style="margin: 0 20px 0 10px;" @change="outIdChange">
                              <el-option label="1" :value="1"></el-option>
                              <el-option label="2" :value="2"></el-option>
                              <el-option label="3" :value="3"></el-option>
                              <el-option label="4" :value="4"></el-option>
                            </el-select>
                          </div>
                          <div style="margin: 20px 0 0 40px; color: #909399">
                            <span class="mustIcon">方向</span>
                            <el-select v-model.number="outOfBounds.area[outOfBounds.id - 1].direction" size="mini" placeholder="请选择绘制方向" style="margin: 0 20px 0 10px;" @change="outDirChange">
                              <el-option label="A>B" :value="1"></el-option>
                              <el-option label="B>A" :value="2"></el-option>
                              <el-option label="A<>B" :value="3"></el-option>
                            </el-select>
                          </div>
                        </template>
                        <div style="margin: 20px 0;">
                          <div style="margin-left: 20px;">区域参数</div>
                        </div>
                          <el-col :span="24">
                            <el-form-item label="目标检测" class="is-required" style="margin-top: -11px;">
                              <div style="display: inline-block; font-size: 12px !important; color: #909399 !important; margin-right: 20px;">
                                <label for="pedestrian" style="cursor: pointer;">
                                  <input type="checkbox" id="pedestrian" :checked="outOfBounds.area[outOfBounds.id - 1].pedestrian" v-model="outOfBounds.area[outOfBounds.id - 1].pedestrian"/>
                                  人体
                                </label>
                              </div>
                              <div style="display: inline-block; font-size: 12px !important; color: #909399 !important; margin-right: 20px;">
                                <label for="vehicle" style="cursor: pointer;">
                                  <input type="checkbox" id="vehicle" :checked="outOfBounds.area[outOfBounds.id - 1].vehicle" v-model="outOfBounds.area[outOfBounds.id - 1].vehicle">
                                  车辆
                                </label>
                              </div>
                            </el-form-item>
                            <el-tooltip content="请选择检测对象" style="margin: -16px;">
                              <i class="el-icon-question"></i>
                            </el-tooltip>
                          </el-col>
                          <el-col :span="24">
                            <el-form-item label="目标范围" prop="outOfBoundsMinSize" class="inputLab is-required">
                              <input v-model.number="outOfBounds.area[outOfBounds.id - 1].outOfBoundsMinSize" class="input inputSys" :placeholder="$t('pleaseEnter')+$t('bbox')">
                            </el-form-item>-
                            <el-form-item prop="outOfBoundsMaxSize" class="inputLab">
                              <input v-model.number="outOfBounds.area[outOfBounds.id - 1].outOfBoundsMaxSize" class="input inputSys" :placeholder="$t('pleaseEnter')+$t('bbox')">
                            </el-form-item>
                            <el-tooltip :content="$t('obboxRemark')" placement="right">
                              <i class="el-icon-question"></i>
                            </el-tooltip>
                          </el-col>
                          <div v-for="(item,index) of json.outOfBounds" :key="index">
                            <el-col :span="24">
                              <el-form-item :label="item.zn" :prop="item.prop" class="inputLab" v-if="item.type === 'input'">
                                <input class="input inputSys" v-model.number="outOfBounds.area[outOfBounds.id - 1][item.prop]" :placeholder="$t('pleaseEnter')+item.zn"/>
                                <el-tooltip class="ml10" :content="$t(item.content)" v-if="item.tip" placement="right">
                                  <i class="el-icon-question"></i>
                                </el-tooltip>
                              </el-form-item>
                            </el-col>
                          </div>
                          <!-- <el-col :span="24">
                            <el-form-item label="生效时间" class="inputLab">
                              <el-time-picker
                                :editable="false"
                                is-range
                                v-model="outOfBoundsTime0"
                                range-separator="至"
                                start-placeholder="开始时间"
                                end-placeholder="结束时间"
                                placeholder="选择时间范围">
                              </el-time-picker>
                            </el-form-item>
                          </el-col>
                          <el-col :span="24">
                            <el-form-item label=" " class="inputLab">
                              <el-time-picker
                                :editable="false"
                                is-range
                                v-model="outOfBoundsTime1"
                                range-separator="至"
                                start-placeholder="开始时间"
                                end-placeholder="结束时间"
                                placeholder="选择时间范围">
                              </el-time-picker>
                            </el-form-item>
                          </el-col> -->
                      </div>
                      <!-- 进入区域侦测 -->
                      <div v-if="getIndex == 20">
                        <el-col :span="24">
                            <el-form-item label="目标检测" class="is-required" style="margin-top: -11px;">
                              <el-checkbox v-model="enterArea.pedestrian" label="人体" prop="pedestrian" style="margin-right: 100px; color:#909399 !important;"></el-checkbox>
                              <el-checkbox v-model="enterArea.vehicle" label="车辆" prop="vehicle" style="margin-left: -70px !important; margin-right: 10px; color:#909399 !important;"></el-checkbox>
                            </el-form-item>
                            <el-tooltip content="请选择检测对象" style="margin: -16px;">
                              <i class="el-icon-question"></i>
                            </el-tooltip>
                          </el-col>
                          <el-col :span="24">
                            <el-form-item label="目标范围" prop="enterAreaMinSize" class="inputLab">
                              <input v-model.number="enterArea.enterAreaMinSize" class="input inputSys" :placeholder="$t('pleaseEnter')+$t('bbox')">
                            </el-form-item>-
                            <el-form-item prop="enterAreaMaxSize" class="inputLab">
                              <input v-model.number="enterArea.enterAreaMaxSize" class="input inputSys" :placeholder="$t('pleaseEnter')+$t('bbox')">
                            </el-form-item>
                            <el-tooltip :content="$t('nbboxRemark')" placement="right">
                              <i class="el-icon-question"></i>
                            </el-tooltip>
                          </el-col>
                          <div v-for="(item,index) of json.enterArea" :key="index">
                            <el-col :span="24">
                              <el-form-item :label="item.zn" :prop="item.prop" class="inputLab" v-if="item.type === 'input'">
                                <input class="input inputSys" v-model.number="enterArea[item.prop]" :placeholder="$t('pleaseEnter')+item.zn"/>
                                <el-tooltip class="ml10" :content="$t(item.content)" v-if="item.tip" placement="right">
                                  <i class="el-icon-question"></i>
                                </el-tooltip>
                              </el-form-item>
                            </el-col>
                          </div>
                          <el-col :span="24">
                            <el-form-item label="生效时间" class="inputLab">
                              <el-time-picker
                                :editable="false"
                                is-range
                                v-model="enterAreaTime0"
                                range-separator="至"
                                start-placeholder="开始时间"
                                end-placeholder="结束时间"
                                placeholder="选择时间范围">
                              </el-time-picker>
                            </el-form-item>
                          </el-col>
                          <el-col :span="24">
                            <el-form-item label=" " class="inputLab">
                              <el-time-picker
                                :editable="false"
                                is-range
                                v-model="enterAreaTime1"
                                range-separator="至"
                                start-placeholder="开始时间"
                                end-placeholder="结束时间"
                                placeholder="选择时间范围">
                              </el-time-picker>
                            </el-form-item>
                          </el-col>
                      </div>
                      <!-- 离开区域侦测 -->
                      <div v-if="getIndex == 21">
                        <el-col :span="24">
                            <el-form-item label="目标检测" class="is-required" style="margin-top: -11px;">
                              <el-checkbox v-model="leaveArea.pedestrian" label="人体" prop="pedestrian" style="margin-right: 100px; color:#909399 !important;"></el-checkbox>
                              <el-checkbox v-model="leaveArea.vehicle" label="车辆" prop="vehicle" style="margin-left: -70px !important; margin-right: 10px; color:#909399 !important;"></el-checkbox>
                            </el-form-item>
                            <el-tooltip content="请选择检测对象" style="margin: -16px;">
                              <i class="el-icon-question"></i>
                            </el-tooltip>
                          </el-col>
                          <el-col :span="24">
                            <el-form-item label="目标范围" prop="leaveAreaMinSize" class="inputLab">
                              <input v-model.number="leaveArea.leaveAreaMinSize" class="input inputSys" :placeholder="$t('pleaseEnter')+$t('bbox')">
                            </el-form-item>-
                            <el-form-item prop="leaveAreaMaxSize" class="inputLab">
                              <input v-model.number="leaveArea.leaveAreaMaxSize" class="input inputSys" :placeholder="$t('pleaseEnter')+$t('bbox')">
                            </el-form-item>
                            <el-tooltip :content="$t('nbboxRemark')" placement="right">
                              <i class="el-icon-question"></i>
                            </el-tooltip>
                          </el-col>
                          <div v-for="(item,index) of json.leaveArea" :key="index">
                            <el-col :span="24">
                              <el-form-item :label="item.zn" :prop="item.prop" class="inputLab" v-if="item.type === 'input'">
                                <input class="input inputSys" v-model.number="leaveArea[item.prop]" :placeholder="$t('pleaseEnter')+item.zn"/>
                                <el-tooltip class="ml10" :content="$t(item.content)" v-if="item.tip" placement="right">
                                  <i class="el-icon-question"></i>
                                </el-tooltip>
                              </el-form-item>
                            </el-col>
                          </div>
                          <el-col :span="24">
                            <el-form-item label="生效时间" class="inputLab">
                              <el-time-picker
                                :editable="false"
                                is-range
                                v-model="leaveAreaTime0"
                                range-separator="至"
                                start-placeholder="开始时间"
                                end-placeholder="结束时间"
                                placeholder="选择时间范围">
                              </el-time-picker>
                            </el-form-item>
                          </el-col>
                          <el-col :span="24">
                            <el-form-item label=" " class="inputLab">
                              <el-time-picker
                                :editable="false"
                                is-range
                                v-model="leaveAreaTime1"
                                range-separator="至"
                                start-placeholder="开始时间"
                                end-placeholder="结束时间"
                                placeholder="选择时间范围">
                              </el-time-picker>
                            </el-form-item>
                          </el-col>
                      </div>
                      <!-- 玩手机 -->
                      <div v-if="getIndex == 22">
                        <div v-for="(item,index) of json.playPhone" :key="index">
                          <el-col :span="24">
                            <el-form-item
                              :label="item.zn"
                              label-width="110px"
                              :prop="item.prop"
                              class="inputLab"
                              v-if="item.type === 'input'"
                            >
                              <input
                                class="input inputSys faceInput"
                                v-model.number="playPhone[item.prop]"
                                :placeholder="$t('pleaseEnter')+item.zn"
                              />
                              <el-tooltip
                                class="ml10"
                                :content="item.content"
                                placement="right"
                                v-if="item.tip"
                              >
                                <i class="el-icon-question"></i>
                              </el-tooltip>
                            </el-form-item>
                          </el-col>
                        </div>
                        <el-col :span="24">
                          <el-form-item label="生效时间" label-width="110px" class="inputLab">
                            <el-time-picker
                              :editable="false"
                              is-range
                              v-model="playPhoneTime0"
                              range-separator="至"
                              start-placeholder="开始时间"
                              end-placeholder="结束时间"
                              placeholder="选择时间范围">
                            </el-time-picker>
                          </el-form-item>
                        </el-col>
                        <el-col :span="24">
                          <el-form-item label=" " label-width="110px" class="inputLab">
                            <el-time-picker
                              :editable="false"
                              is-range
                              v-model="playPhoneTime1"
                              range-separator="至"
                              start-placeholder="开始时间"
                              end-placeholder="结束时间"
                              placeholder="选择时间范围">
                            </el-time-picker>
                          </el-form-item>
                        </el-col>
                      </div>
                      <!-- 抢包 -->
                      <div v-if="getIndex == 23">
                        <div v-for="(item,index) of json.grab" :key="index">
                          <el-col :span="24">
                            <el-form-item
                              :label="item.zn"
                              :prop="item.prop"
                              class="inputLab"
                              v-if="item.type === 'input'"
                            >
                              <input
                                class="input inputSys faceInput"
                                v-model.number="grab[item.prop]"
                                :placeholder="$t('pleaseEnter')+item.zn"
                              />
                              <el-tooltip
                                class="ml10"
                                :content="item.content"
                                placement="right"
                                v-if="item.tip"
                              >
                                <i class="el-icon-question"></i>
                              </el-tooltip>
                            </el-form-item>
                          </el-col>
                        </div>
                        <el-col :span="24">
                          <el-form-item label="生效时间" class="inputLab">
                            <el-time-picker
                              :editable="false"
                              is-range
                              v-model="grabTime0"
                              range-separator="至"
                              start-placeholder="开始时间"
                              end-placeholder="结束时间"
                              placeholder="选择时间范围">
                            </el-time-picker>
                          </el-form-item>
                        </el-col>
                        <el-col :span="24">
                          <el-form-item label=" " class="inputLab">
                            <el-time-picker
                              :editable="false"
                              is-range
                              v-model="grabTime1"
                              range-separator="至"
                              start-placeholder="开始时间"
                              end-placeholder="结束时间"
                              placeholder="选择时间范围">
                            </el-time-picker>
                          </el-form-item>
                        </el-col>
                      </div>
                      <!-- 吸烟 -->
                      <div v-if="getIndex == 24">
                        <div v-for="(item,index) of json.smoking" :key="index">
                          <el-col :span="24">
                            <el-form-item
                              :label="item.zn"
                              label-width="100px"
                              :prop="item.prop"
                              class="inputLab"
                              v-if="item.type === 'input'"
                            >
                              <input
                                class="input inputSys faceInput"
                                v-model.number="smoking[item.prop]"
                                :placeholder="$t('pleaseEnter')+item.zn"
                              />
                              <el-tooltip
                                class="ml10"
                                :content="item.content"
                                placement="right"
                                v-if="item.tip"
                              >
                                <i class="el-icon-question"></i>
                              </el-tooltip>
                            </el-form-item>
                          </el-col>
                        </div>
                        <el-col :span="24">
                          <el-form-item label="生效时间" label-width="100px" class="inputLab">
                            <el-time-picker
                              :editable="false"
                              is-range
                              v-model="smokingTime0"
                              range-separator="至"
                              start-placeholder="开始时间"
                              end-placeholder="结束时间"
                              placeholder="选择时间范围">
                            </el-time-picker>
                          </el-form-item>
                        </el-col>
                        <el-col :span="24">
                          <el-form-item label=" " label-width="100px" class="inputLab">
                            <el-time-picker
                              :editable="false"
                              is-range
                              v-model="smokingTime1"
                              range-separator="至"
                              start-placeholder="开始时间"
                              end-placeholder="结束时间"
                              placeholder="选择时间范围">
                            </el-time-picker>
                          </el-form-item>
                        </el-col>
                      </div>
                      <!-- ATM柜台遗留物检查 -->
                      <div v-if="getIndex == 25">
                        <div v-for="(item,index) of json.atmRemain" :key="index">
                          <el-col :span="24">
                            <el-form-item
                              :label="item.zn"
                              label-width="110px"
                              :prop="item.prop"
                              class="inputLab"
                              v-if="item.type === 'input'"
                            >
                              <input
                                class="input inputSys faceInput"
                                v-model.number="atmRemain[item.prop]"
                                :placeholder="$t('pleaseEnter')+item.zn"
                              />
                              <el-tooltip
                                class="ml10"
                                :content="item.content"
                                placement="right"
                                v-if="item.tip"
                              >
                                <i class="el-icon-question"></i>
                              </el-tooltip>
                            </el-form-item>
                          </el-col>
                        </div>
                        <!-- <el-col :span="24">
                          <el-form-item label="识别策略" label-width="110px" prop="batchSecond" class="inputLab">
                            <span class="typeface">连续 </span>
                            <input
                              v-model.number="atmRemain.batchSecond"
                              class="input inputSys faceInput inputWidth"
                              :placeholder="$t('pleaseEnter')+'秒数'"
                            />
                            <span class="typeface"> 秒检查到目标 </span>
                          </el-form-item>
                          <el-form-item prop="eventNum" class="inputLab">
                            <input
                              v-model.number="atmRemain.eventNum"
                              class="input inputSys faceInput inputWidth"
                              :placeholder="$t('pleaseEnter')+'次数'"
                            />
                            <span class="typeface"> 次记为一次有效识别 </span>
                          </el-form-item>
                          <el-tooltip :content="$t('strategyContent')" placement="right">
                            <i class="el-icon-question"></i>
                          </el-tooltip>
                        </el-col> -->
                        <el-col :span="24">
                          <el-form-item label="生效时间" label-width="110px" class="inputLab">
                            <el-time-picker
                              :editable="false"
                              is-range
                              v-model="atmRemainTime0"
                              range-separator="至"
                              start-placeholder="开始时间"
                              end-placeholder="结束时间"
                              placeholder="选择时间范围">
                            </el-time-picker>
                          </el-form-item>
                        </el-col>
                        <el-col :span="24">
                          <el-form-item label=" " label-width="110px" class="inputLab">
                            <el-time-picker
                              :editable="false"
                              is-range
                              v-model="atmRemainTime1"
                              range-separator="至"
                              start-placeholder="开始时间"
                              end-placeholder="结束时间"
                              placeholder="选择时间范围">
                            </el-time-picker>
                          </el-form-item>
                        </el-col>
                      </div>
                      <!-- 坐姿不雅 -->
                      <div v-if="getIndex == 26">
                        <div v-for="(item,index) of json.recline" :key="index">
                          <el-col :span="24">
                            <el-form-item
                              :label="item.zn"
                              :prop="item.prop"
                              class="inputLab"
                              label-width="110px"
                              v-if="item.type === 'input'"
                            >
                              <input
                                class="input inputSys faceInput"
                                v-model.number="recline[item.prop]"
                                :placeholder="$t('pleaseEnter')+item.zn"
                              />
                              <el-tooltip
                                class="ml10"
                                :content="item.content"
                                placement="right"
                                v-if="item.tip"
                              >
                                <i class="el-icon-question"></i>
                              </el-tooltip>
                            </el-form-item>
                          </el-col>
                        </div>
                        <el-col :span="24">
                          <el-form-item label="生效时间" label-width="110px" class="inputLab">
                            <el-time-picker
                              :editable="false"
                              is-range
                              v-model="reclineTime0"
                              range-separator="至"
                              start-placeholder="开始时间"
                              end-placeholder="结束时间"
                              placeholder="选择时间范围">
                            </el-time-picker>
                          </el-form-item>
                        </el-col>
                        <el-col :span="24">
                          <el-form-item label=" " label-width="110px" class="inputLab">
                            <el-time-picker
                              :editable="false"
                              is-range
                              v-model="reclineTime1"
                              range-separator="至"
                              start-placeholder="开始时间"
                              end-placeholder="结束时间"
                              placeholder="选择时间范围">
                            </el-time-picker>
                          </el-form-item>
                        </el-col>
                      </div>
                      <!-- 人脸聚类 -->
                      <div v-if="getIndex == 27">
                        <el-col :span="24">
                          <el-form-item label="目标范围" prop="faceClusteringMinSize" class="inputLab">
                            <input
                              v-model.number="faceClustering.faceClusteringMinSize"
                              class="input inputSys faceInput"
                              :placeholder="$t('pleaseEnter')+$t('bbox')"
                            />
                          </el-form-item>-
                          <el-form-item prop="faceClusteringMaxSize" class="inputLab">
                            <input
                              v-model.number="faceClustering.faceClusteringMaxSize"
                              class="input inputSys faceInput"
                              style="margin-left:6px"
                              :placeholder="$t('pleaseEnter')+$t('bbox')"
                            />
                          </el-form-item>
                          <el-tooltip :content="$t('fbboxRemark')" placement="right">
                            <i class="el-icon-question"></i>
                          </el-tooltip>
                        </el-col>
                        <div v-for="(item,index) of json.faceClustering" :key="index">
                          <el-col :span="24">
                            <el-form-item
                              :label="$t(item.label)"
                              :prop="item.prop"
                              class="inputLab"
                              v-if="item.type === 'input'"
                            >
                              <input
                                class="input inputSys faceInput"
                                v-model.number="faceClustering[item.prop]"
                                :placeholder="$t('pleaseEnter')+$t(item.label)"
                              />
                              <el-tooltip
                                class="ml10"
                                :content="$t(item.content)"
                                placement="right"
                                v-if="item.tip"
                              >
                                <i class="el-icon-question"></i>
                              </el-tooltip>
                            </el-form-item>
                          </el-col>
                        </div>
                      </div>
                      <!-- 人体挟持 -->
                      <div v-if="getIndex == 28">
                        <div v-for="(item,index) of json.hijack" :key="index">
                          <el-col :span="24">
                            <el-form-item
                              :label="item.zn"
                              :prop="item.prop"
                              class="inputLab"
                              v-if="item.type === 'input'"
                            >
                              <input
                                class="input inputSys faceInput"
                                v-model.number="hijack[item.prop]"
                                :placeholder="$t('pleaseEnter')+item.zn"
                              />
                              <el-tooltip
                                class="ml10"
                                :content="item.content"
                                placement="right"
                                v-if="item.tip"
                              >
                                <i class="el-icon-question"></i>
                              </el-tooltip>
                            </el-form-item>
                          </el-col>
                        </div>
                        <el-col :span="24">
                          <el-form-item label="识别策略" prop="batchSecond" class="inputLab">
                            <span class="typeface">连续 </span>
                            <input
                              v-model.number="hijack.batchSecond"
                              class="input inputSys faceInput inputWidth"
                              :placeholder="$t('pleaseEnter')+'秒数'"
                            />
                            <span class="typeface"> 秒检查到目标 </span>
                          </el-form-item>
                          <el-form-item prop="eventNum" class="inputLab">
                            <input
                              v-model.number="hijack.eventNum"
                              class="input inputSys faceInput inputWidth"
                              :placeholder="$t('pleaseEnter')+'次数'"
                            />
                            <span class="typeface"> 次记为一次有效识别 </span>
                          </el-form-item>
                          <el-tooltip :content="$t('strategyContent')" placement="right">
                            <i class="el-icon-question"></i>
                          </el-tooltip>
                        </el-col>
                        <el-col :span="24">
                          <el-form-item label="生效时间" label-width="90px" class="inputLab">
                            <el-time-picker
                              :editable="false"
                              is-range
                              v-model="hijackTime0"
                              range-separator="至"
                              start-placeholder="开始时间"
                              end-placeholder="结束时间"
                              placeholder="选择时间范围">
                            </el-time-picker>
                          </el-form-item>
                        </el-col>
                        <el-col :span="24">
                          <el-form-item label=" " label-width="90px" class="inputLab">
                            <el-time-picker
                              :editable="false"
                              is-range
                              v-model="hijackTime1"
                              range-separator="至"
                              start-placeholder="开始时间"
                              end-placeholder="结束时间"
                              placeholder="选择时间范围">
                            </el-time-picker>
                          </el-form-item>
                        </el-col>
                      </div>
                      <!-- 箱包交接 -->
                      <div v-if="getIndex == 30">
                        <el-col :span="24">
                          <el-form-item label="区域镜头" class="is-required" style="margin-top: -11px;">
                            <el-radio-group v-model="swapBag.type">
                              <el-radio :label="1">交接区</el-radio>
                              <el-radio :label="2">高柜区</el-radio>
                              <el-radio :label="3">内厅</el-radio>
                            </el-radio-group>
                          </el-form-item>
                          <el-tooltip content="请选择区域镜头" style="margin: -16px; margin-left: 10px;">
                            <i class="el-icon-question"></i>
                          </el-tooltip>
                        </el-col>
                        <div v-for="(item,index) of json.swapBag" :key="index">
                          <el-col :span="24">
                            <el-form-item
                              :label="item.zn"
                              :prop="item.prop"
                              class="inputLab"
                              v-if="item.type === 'input'"
                            >
                              <input
                                class="input inputSys faceInput"
                                v-model.number="swapBag[item.prop]"
                                :placeholder="$t('pleaseEnter')+item.zn"
                              />
                              <el-tooltip
                                class="ml10"
                                :content="item.content"
                                placement="right"
                                v-if="item.tip"
                              >
                                <i class="el-icon-question"></i>
                              </el-tooltip>
                            </el-form-item>
                          </el-col>
                        </div>
                        <el-col :span="24">
                          <el-form-item label="生效时间" label-width="90px" class="inputLab">
                            <el-time-picker
                              :editable="false"
                              is-range
                              v-model="swapBagTime0"
                              range-separator="至"
                              start-placeholder="开始时间"
                              end-placeholder="结束时间"
                              placeholder="选择时间范围">
                            </el-time-picker>
                          </el-form-item>
                        </el-col>
                        <el-col :span="24">
                          <el-form-item label=" " label-width="90px" class="inputLab">
                            <el-time-picker
                              :editable="false"
                              is-range
                              v-model="swapBagTime1"
                              range-separator="至"
                              start-placeholder="开始时间"
                              end-placeholder="结束时间"
                              placeholder="选择时间范围">
                            </el-time-picker>
                          </el-form-item>
                        </el-col>
                      </div>
                      <!-- 一日两碰箱 -->
                      <div v-if="getIndex == 31">
                        <div v-for="(item,index) of json.touchBag" :key="index">
                          <el-col :span="24">
                            <el-form-item
                              :label="item.zn"
                              :prop="item.prop"
                              class="inputLab"
                              v-if="item.type === 'input'"
                            >
                              <input
                                class="input inputSys faceInput"
                                v-model.number="touchBag[item.prop]"
                                :placeholder="$t('pleaseEnter')+item.zn"
                              />
                              <el-tooltip
                                class="ml10"
                                :content="item.content"
                                placement="right"
                                v-if="item.tip"
                              >
                                <i class="el-icon-question"></i>
                              </el-tooltip>
                            </el-form-item>
                          </el-col>
                        </div>
                        <el-col :span="24">
                          <el-form-item label="生效时间" label-width="90px" class="inputLab">
                            <el-time-picker
                              :editable="false"
                              is-range
                              v-model="touchBagTime0"
                              range-separator="至"
                              start-placeholder="开始时间"
                              end-placeholder="结束时间"
                              placeholder="选择时间范围">
                            </el-time-picker>
                          </el-form-item>
                        </el-col>
                        <el-col :span="24">
                          <el-form-item label=" " label-width="90px" class="inputLab">
                            <el-time-picker
                              :editable="false"
                              is-range
                              v-model="touchBagTime1"
                              range-separator="至"
                              start-placeholder="开始时间"
                              end-placeholder="结束时间"
                              placeholder="选择时间范围">
                            </el-time-picker>
                          </el-form-item>
                        </el-col>
                      </div>
                    </el-form>
                  </div>
                  <div class="lib" v-if="picView">
                    <div v-if="getIndex == 0 || getIndex == 2" class="title1">报警参数</div>
                    <div v-if="getIndex == 0" class="lib_con">
                        <SmartLib libType="face" @formData="formData" ref="channelIdInit"></SmartLib>
                    </div>
                    <div v-if="getIndex == 2" class="lib_con">
                        <SmartLib libType="vehicle" @formData="formData" ref="channelIdInit"></SmartLib>
                    </div>
                  </div>
                  <button class="button save" :disabled="btnDisabled" @click="submit('form')">保存配置</button>
                </div>
              </div>
              <div class="algo_bottom_right_bottom_right" v-else>
                <div style="margin:20px 20px 0">
                  <div>
                    算法开关 <el-switch style="margin-left:10px" v-model="enabled" disabled></el-switch>
                    <span style="font-size: 12px;color: #87888A;padding: 2px;">
                      客流只要添加绊线便认定为开启状态
                    </span>
                  </div>
                </div>
                <div style="margin: 20px 20px 0;">
                  <div v-if="getIndex == 29">
                    <div>
                      <span>区域</span>
                      <el-select v-model.number="curTrip.id" size="mini" placeholder="请选择车道方向" style="margin:0 20px 0 20px" @change="tripIdChange">
                        <el-option label="1" :value="1"></el-option>
                        <el-option label="2" :value="2"></el-option>
                        <el-option label="3" :value="3"></el-option>
                        <el-option label="4" :value="4"></el-option>
                      </el-select>
                    </div>
                    <div style="margin-top:20px;">
                      <span>方向</span>
                      <el-select v-model.number="curTrip.direction" size="mini" placeholder="请选择车道方向" style="margin:0 20px 0 20px" @change="tripDirChange">
                        <el-option label="顺时针" :value="1"></el-option>
                        <el-option label="逆时针" :value="2"></el-option>
                        <el-option label="双向" :value="0"></el-option>
                      </el-select>
                    </div>
                    <div class="flexRowStart mt20 trip">
                      <span>灵敏度</span>
                      <el-slider v-model="curTrip.sensitivity" style="margin-left:10px;width:180px" @change="tripSenChange">
                      </el-slider>
                    </div>
                    <div style="display:flex;margin-top:20px;">
                      <div class="identifyClass" style="width:85px;height:26px;border:1px solid #E7EDEF;color: #17FFFA;cursor:pointer;" id="trip" @click="createTripDraw(false)">
                        <div style="width:100%;height:100%;display:flex;align-items:center;justify-content:center;">
                          <img src="@/assets/img/identify.png" alt=""/>绘制
                        </div>
                      </div>
                      <div class="identifyClass" style="width:85px;height:26px;border:1px solid #E7EDEF;color: #17FFFA;margin-left:10px;cursor:pointer;" id="clearAll4" @click="deleteTripDraw">
                        <div style="width:100%;height:100%;display:flex;align-items:center;justify-content:center;">
                          <img src="@/assets/img/clear.png" alt="">清空
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <button class="button save" style="height:25px;line-height:25px;margin: 40px 30px;" :disabled="btnDisabled" @click="submit('form')">保存配置</button>
              </div>
            </div>
          </el-tab-pane>
          <el-tab-pane name="second" v-if="getIndex !== '' && !(getIndex == 1 || getIndex == 3 || getIndex == 9)">
            <span slot="label">
              <i class="el-icon-s-operation"></i>
              布防计划设定
            </span>
            <Deployment ref="channelIdInitDef"></Deployment>
          </el-tab-pane>
        </el-tabs>
      </div>
      <div class="nothing" v-else>
        暂无数据
      </div>
    </div>
  </div>
</template>

<script>
import { getChannels, getChannel, putChannels, getChannelDet, getChannelPic, putChannelTask, getChannelList } from '@/api/systemAPI';
import { getPicSize } from "../utils/getBase64"
import Draw from "../utils/canvasDraw"
import { validateNum, validateOneToFourNum } from "../utils/validate copy";
import moment from 'moment'
import _ from 'lodash'
import Deployment from '../deployment/index.vue';
import SmartLib from '../smartLib/index.vue';
import bus from '@/utils/eventBus'
import { algApi } from '@/api/intel.js'

const WIDTH_DRAW = 640,
      CANVAS_RATIO = 720 / 1280

let json = require("../params/config").json
export default {
    name: "Smart",
    inject: ["size", "reload"],
    data() {
        return {
          flag: false,
          isHaveAlg: false,
            moment,
            formDataObj: {},
            activeName: "first",
            algorithm: {
                channelId: null
            },
            channelList: [],
            channelEnabledList: [],
            channelEnabledCheckedList: [],
            checkDisabled: [],
            algoList: [],
            enabled: true,
            dialogVisible: false,
            checkChannelAll: false,
            checkedChannels: [],
            isIndeterminate: true,
            btnDisabled: false,
            browerType: "IE",
            playerStop: false,
            roiBase64: "",
            // 尺寸
            canvasSize: {
                width: 0,
                height: 0
            },
            sceneMode: 1,
            getIndex: '',
            // 绊线 
            curTrip: {
                id: 1,
                direction: 1,
                sensitivity: 60,
                start: {},
                end: {}
            },
            flowAreasNew: [],
            curTripPoints: [],
            isOnRound: { result: false, index: null },
            json,
            rules: {
                // 人脸
                faceMinSize: [
                    { required: true, message: this.$t("bboxCannotBeEmpty"), trigger: "blur" },
                    { validator: validateNum, message: this.$t("pleaseEnterCorrectFormat"), trigger: "blur" }
                ],
                faceMaxSize: [
                    { required: true, message: this.$t("bboxCannotBeEmpty"), trigger: "blur" },
                    { validator: validateNum, message: this.$t("pleaseEnterCorrectFormat"), trigger: "blur" }
                ],
                quality: [
                    { required: true, message: this.$t("qualityCannotBeEmpty"), trigger: "blur" },
                    { validator: validateNum, message: this.$t("pleaseEnterCorrectFormat"), trigger: "blur" }
                ],
                confidence: [
                    { required: true, message: this.$t("confidenceCannotBeEmpty"), trigger: "blur" },
                    { validator: validateNum, message: this.$t("pleaseEnterCorrectFormat"), trigger: "blur" }
                ],
                localPlate: [
                // { required: true, message: this.$t("localPlateCannotBeEmpty"), trigger: "blur" },
                ],
                localPlateConfidence: [
                    { required: true, message: this.$t("localPlateConfidenceCannotBeEmpty"), trigger: "blur" },
                    { validator: validateNum, message: this.$t("pleaseEnterCorrectFormat"), trigger: "blur" }
                ],
                yaw: [
                    { required: true, message: this.$t("yawCannotBeEmpty"), trigger: "blur" },
                    { validator: validateNum, message: this.$t("pleaseEnterCorrectFormat"), trigger: "blur" }
                ],
                pitch: [
                    { required: true, message: this.$t("pitchCannotBeEmpty"), trigger: "blur" },
                    { validator: validateNum, message: this.$t("pleaseEnterCorrectFormat"), trigger: "blur" }
                ],
                roll: [
                    { required: true, message: this.$t("rollCannotBeEmpty"), trigger: "blur" },
                    { validator: validateNum, message: this.$t("pleaseEnterCorrectFormat"), trigger: "blur" }
                ],
                blur: [
                    { required: true, message: this.$t("blurCannotBeEmpty"), trigger: "blur" },
                    { validator: validateNum, message: this.$t("pleaseEnterCorrectFormat"), trigger: "blur" }
                ],
                // 人脸聚类
                faceClusteringMinSize: [
                    { required: true, message: this.$t("bboxCannotBeEmpty"), trigger: "blur" },
                    { validator: validateNum, message: this.$t("pleaseEnterCorrectFormat"), trigger: "blur" }
                ],
                faceClusteringMaxSize: [
                    { required: true, message: this.$t("bboxCannotBeEmpty"), trigger: "blur" },
                    { validator: validateNum, message: this.$t("pleaseEnterCorrectFormat"), trigger: "blur" }
                ],
                // 行人
                pedestrianMinSize: [
                    { required: true, message: this.$t("bboxCannotBeEmpty"), trigger: "blur" },
                    { validator: validateNum, message: this.$t("pleaseEnterCorrectFormat"), trigger: "blur" }
                ],
                pedestrianMaxSize: [
                    { required: true, message: this.$t("bboxCannotBeEmpty"), trigger: "blur" },
                    { validator: validateNum, message: this.$t("pleaseEnterCorrectFormat"), trigger: "blur" }
                ],
                // 机动车
                vehicleMinSize: [
                    { required: true, message: this.$t("bboxCannotBeEmpty"), trigger: "blur" },
                    { validator: validateNum, message: this.$t("pleaseEnterCorrectFormat"), trigger: "blur" }
                ],
                vehicleMaxSize: [
                    { required: true, message: this.$t("bboxCannotBeEmpty"), trigger: "blur" },
                    { validator: validateNum, message: this.$t("pleaseEnterCorrectFormat"), trigger: "blur" }
                ],
                // 非机动车
                nonmotorMinSize: [
                    { required: true, message: this.$t("bboxCannotBeEmpty"), trigger: "blur"
                    },
                    { validator: validateNum, message: this.$t("pleaseEnterCorrectFormat"), trigger: "blur" }
                ],
                nonmotorMaxSize: [
                    { required: true, message: this.$t("bboxCannotBeEmpty"), trigger: "blur" },
                    { validator: validateNum, message: this.$t("pleaseEnterCorrectFormat"), trigger: "blur" }
                ],
                // 拍屏
                pedConfidence: [
                    { required: true, message: "人体置信度不能为空", trigger: "blur" },
                    { validator: validateNum, message: this.$t("pleaseEnterCorrectFormat"), trigger: "blur" }
                ],
                phoneConfidence: [
                    { required: true, message: "手机置信度不能为空", trigger: "blur" },
                    { validator: validateNum, message: this.$t("pleaseEnterCorrectFormat"), trigger: "blur" }
                ],
                screenConfidence: [
                    { required: true, message: "屏幕置信度不能为空", trigger: "blur" },
                    { validator: validateNum, message: this.$t("pleaseEnterCorrectFormat"), trigger: "blur" }
                ],
                batchSecond: [
                    { required: true, message: "秒数不能为空", trigger: "blur" },
                    { validator: validateNum, message: this.$t("pleaseEnterCorrectFormat"), trigger: "blur" }
                ],
                eventNum: [
                    { required: true, message: "次数不能为空", trigger: "blur" },
                    { validator: validateNum, message: this.$t("pleaseEnterCorrectFormat"), trigger: "blur" }
                ],
                duration: [
                    { required: true, message: "报警间隔不能为空", trigger: "blur" },
                    { validator: validateNum, message: this.$t("pleaseEnterCorrectFormat"), trigger: "blur" }
                ],
                sensitivity: [
                    { required: true, message: "灵敏度不能为空", trigger: "blur" },
                    { validator: validateNum, message: this.$t("pleaseEnterCorrectFormat"), trigger: "blur" }
                ],
                // 临时离柜
                cashConfidence: [
                    { required: true, message: "现金置信度不能为空", trigger: "blur" },
                    { validator: validateNum, message: this.$t("pleaseEnterCorrectFormat"), trigger: "blur" }
                ],
                leaveNum: [
                    { required: true, message: "人体离开时间不能为空", trigger: "blur" },
                    { validator: validateNum, message: this.$t("pleaseEnterCorrectFormat"), trigger: "blur" }
                ],
                // 烟雾
                smogFireMinSize: [
                    { required: true, message: this.$t("bboxCannotBeEmpty"), trigger: "blur" },
                    { validator: validateNum, message: this.$t("pleaseEnterCorrectFormat"), trigger: "blur" }
                ],
                smogFireMaxSize: [
                    { required: true, message: this.$t("bboxCannotBeEmpty"), trigger: "blur" },
                    { validator: validateNum, message: this.$t("pleaseEnterCorrectFormat"), trigger: "blur" }
                ],
                // 打斗
                flowThreshold: [
                    { required: true, message: "打斗阈值不能为空", trigger: "blur" },
                    { validator: validateNum, message: this.$t("pleaseEnterCorrectFormat"), trigger: "blur" }
                ],
                // 骨骼数人
                interval: [
                    { required: true, message: this.$t("skeletonIntervalCannotBeEmpty"), trigger: "blur" },
                    { validator: validateNum, message: this.$t("pleaseEnterCorrectFormat"), trigger: "blur" }
                ],
                // 快速移动
                fastSpeed: [
                    { required: true, message: "快速移动阈值不能为空", trigger: "blur" },
                    { validator: validateNum, message: this.$t("pleaseEnterCorrectFormat"), trigger: "blur" }
                ],
                // 遗留物检测
                threshold: [
                    { required: true, message: "遗留物阈值不能为空", trigger: "blur" },
                    { validator: validateNum, message: this.$t("pleaseEnterCorrectFormat"), trigger: "blur" }
                ],
                time: [
                  { required: true, message: '持续时间不能为空', trigger: "blur" },
                  { validator: validateNum, message: this.$t("pleaseEnterCorrectFormat"), trigger: "blur" }
                ],
                // 摄像头移动
                ipcmove_threshold: [
                    { required: true, message: "阈值不能为空", trigger: "blur" },
                    { validator: validateNum, message: this.$t("pleaseEnterCorrectFormat"), trigger: "blur" }
                ],
                // 代客操作
                direction: [
                    { required: true, message: "方向不能为空", trigger: "blur" },
                    { validator: validateOneToFourNum, message: this.$t("pleaseEnterCorrectFormat"), trigger: "blur" }
                ],
                // 箱包
                bagConfidence: [
                    { required: true, message: "箱包阈值不能为空", trigger: "blur" },
                    { validator: validateNum, message: this.$t("pleaseEnterCorrectFormat"), trigger: "blur" }
                ],
                // 箱包
                moneyBoxConfidence: [
                    { required: true, message: "箱包阈值不能为空", trigger: "blur" },
                    { validator: validateNum, message: this.$t("pleaseEnterCorrectFormat"), trigger: "blur" }
                ],
                // 坐姿不雅
                crossLegDuration: [
                    { required: true, message: "翘腿间隔不能为空", trigger: "blur" },
                    { validator: validateNum, message: "请输入翘腿间隔", trigger: "blur" }
                ],
                // 翘腿数量
                crossLegNum: [
                    { required: true, message: "翘腿数量不能为空", trigger: "blur" },
                    { validator: validateNum, message: "请输入翘腿数量", trigger: "blur" }
                ],
                // 睡觉间隔
                sleepDuration: [
                    { required: true, message: "睡觉间隔不能为空", trigger: "blur" },
                    { validator: validateNum, message: "请输入睡觉间隔", trigger: "blur" }
                ],
                // 玩手机间隔
                playPhoneDuration: [
                    { required: true, message: "玩手机间隔不能为空", trigger: "blur" },
                    { validator: validateNum, message: "请输入玩手机间隔", trigger: "blur" }
                ],
                // 广告置信度
                adConfidence: [
                    { required: true, message: "广告置信度不能为空", trigger: "blur" },
                    { validator: validateNum, message: "请输入广告置信度", trigger: "blur" }
                ],
                // 越界侦测
                // outOfBoundsMinSize: [
                //   { required: true, message: this.$t("bboxCannotBeEmpty"), trigger: "blur" },
                //   { validator: validateNum, message: this.$t("pleaseEnterCorrectFormat"), trigger: "blur" }
                // ],
                // outOfBoundsMaxSize: [
                //   { required: true, message: this.$t("bboxCannotBeEmpty"), trigger: "blur" },
                //   { validator: validateNum, message: this.$t("pleaseEnterCorrectFormat"), trigger: "blur" }
                // ],
                detectTime: [
                    { required: true, message: "时间阈值不能为空", trigger: "blur" },
                    { validator: validateNum, message: "请输入时间阈值", trigger: "blur" }
                ],
                // 进入区域侦测
                enterAreaMinSize: [
                    { required: true, message: this.$t("bboxCannotBeEmpty"), trigger: "blur" },
                    { validator: validateNum, message: this.$t("pleaseEnterCorrectFormat"), trigger: "blur" }
                ],
                enterAreaMaxSize: [
                    { required: true, message: this.$t("bboxCannotBeEmpty"), trigger: "blur" },
                    { validator: validateNum, message: this.$t("pleaseEnterCorrectFormat"), trigger: "blur" }
                ],
                // 离开区域侦测
                leaveAreaMinSize: [
                    { required: true, message: this.$t("bboxCannotBeEmpty"), trigger: "blur" },
                    { validator: validateNum, message: this.$t("pleaseEnterCorrectFormat"), trigger: "blur" }
                ],
                leaveAreaMaxSize: [
                    { required: true, message: this.$t("bboxCannotBeEmpty"), trigger: "blur" },
                    { validator: validateNum, message: this.$t("pleaseEnterCorrectFormat"), trigger: "blur" }
                ],
                // 抢包
                grabConfidence: [
                    { required: true, message: "抢包置信度不能为空", trigger: "blur" },
                    { validator: validateNum, message: "请输入抢包置信度", trigger: "blur" }
                ],
                // 吸烟
                smokingConfidence: [
                    { required: true, message: "吸烟置信度不能为空", trigger: "blur" },
                    { validator: validateNum, message: "请输入吸烟置信度", trigger: "blur" }
                ],
                // 箱包交接
                propertime: [
                    { required: true, message: "合规度不能为空", trigger: "blur" },
                    { validator: validateNum, message: "请输入合规度", trigger: "blur" }
                ],
                // ATM遗留物
                cardConfidence: [
                  { required: true, message: '银行卡置信度不能为空', trigger: "blur" },
                  { validator: validateNum, message: this.$t("pleaseEnterCorrectFormat"), trigger: "blur" }
                ],
                keyConfidence: [
                  { required: true, message: '钥匙置信度不能为空', trigger: "blur" },
                  { validator: validateNum, message: this.$t("pleaseEnterCorrectFormat"), trigger: "blur" }
                ],
            },
            // 人脸
            face: {
                bbox: {},
                blur: "",
                confidence: "",
                enabled: "",
                pitch: "",
                quality: "",
                roll: "",
                yaw: ""
            },
            // 行人
            pedestrian: {
                bbox: {},
                pedestrianMinSize: "",
                pedestrianMaxSize: "",
                quality: "",
                confidence: ""
            },
            // 机动车
            vehicle: {
                bbox: {},
                vehicleMinSize: "",
                vehicleMaxSize: "",
                quality: "",
                confidence: ""
            },
            // 非机动车
            nonmotor: {
                bbox: {},
                nonmotorMinSize: "",
                nonmotorMaxSize: "",
                quality: "",
                confidence: ""
            },
            // 拍屏
            shoot: {
                pedConfidence: "",
                phoneConfidence: "",
                screenConfidence: "",
                duration: "",
                sensitivity: "",
                batchSecond: "",
                eventNum: ""
            },
            shootTime0: null,
            shootTime1: null,
            // 倒地
            fall: {
                pedConfidence: "",
                duration: "",
                sensitivity: "",
                batchSecond: "",
                eventNum: ""
            },
            fallTime0: null,
            fallTime1: null,
            // 临时离柜
            cash: {
                pedConfidence: "",
                cashConfidence: "",
                duration: "",
                sensitivity: "",
                leaveNum: "",
                batchSecond: "",
                eventNum: ""
            },
            cashTime0: null,
            cashTime1: null,
            // 烟雾
            smogFire: {
                bbox: {},
                smogFireMinSize: "",
                smogFireMaxSize: ""
            },
            // 打斗
            struggle: {
                pedConfidence: "",
                flowThreshold: "",
                duration: "",
                sensitivity: "",
                batchSecond: "",
                eventNum: ""
            },
            struggleTime0: null,
            struggleTime1: null,
            // 数人
            skeleton: {
                confidence: "",
                interval: ""
            },
            // 快速移动
            fastMove: {
                pedConfidence: "",
                fastSpeed: "",
                duration: "",
                sensitivity: "",
                batchSecond: "",
                eventNum: "",
            },
            fastMoveTime0: null,
            fastMoveTime1: null,
            // 遗留物
            remain: {
                pedConfidence: "",
                threshold: "",
                duration: "",
                sensitivity: "",
                batchSecond: "",
                eventNum: ""
            },
            remainTime0: null,
            remainTime1: null,
            // 特殊人群
            specialPed: {
                pedConfidence: "",
                duration: "",
                sensitivity: "",
                batchSecond: "",
                eventNum: ""
            },
            specialPedTime0: null,
            specialPedTime1: null,
            // 代客操作
            stm: {
                pedConfidence: "",
                direction: "",
                threshold: "",
                duration: "",
                sensitivity: "",
                batchSecond: "",
                eventNum: ""
            },
            stmTime0: null,
            stmTime1: null,
            // 徘徊
            hover: {
                pedConfidence: "",
                duration: "",
                sensitivity: "",
                batchSecond: "",
                eventNum: ""
            },
            hoverTime0: null,
            hoverTime1: null,
            // 箱包
            bag: {
                pedConfidence: "",
                bagConfidence: "",
                moneyBoxConfidence: "",
                duration: "",
                sensitivity: "",
                batchSecond: "",
                eventNum: ""
            },
            bagTime0: null,
            bagTime1: null,
            // 摄像头移动
            ipcmove: {
                threshold: "",
                ipcmove_threshold: "",
                duration: "",
                sensitivity: "",
                batchSecond: "",
                eventNum: ""
            },
            ipcmoveTime0: null,
            ipcmoveTime1: null,
            // 睡岗
            sleep: {
                pedConfidence: "",
                phoneConfidence: "",
                duration: "",
                sensitivity: "",
                batchSecond: "",
                eventNum: ""
            },
            sleepTime0: null,
            sleepTime1: null,
            // 广告张贴
            adPost: {
                pedConfidence: "",
                adConfidence: "",
                sensitivity: "",
                batchSecond: "",
                eventNum: ""
            },
            adPostTime0: null,
            adPostTime1: null,
            // 越界侦测
            outOfBounds: {
                area: [
                    {
                        id: 1,
                        direction: 1,
                        outAreas: [],
                        outPoints: [],
                        bbox: {},
                        outOfBoundsMinSize: "",
                        outOfBoundsMaxSize: "",
                        pedestrian: false,
                        vehicle: false,
                        confidence: "",
                        quality: "",
                        sensitivity: "",
                        detectTime: "",
                        batchSecond: "",
                        eventNum: "",
                        // outOfBoundsTime0: null,
                        // outOfBoundsTime1: null,
                    },
                    {
                        id: 2,
                        direction: 1,
                        outAreas: [],
                        outPoints: [],
                        bbox: {},
                        outOfBoundsMinSize: "",
                        outOfBoundsMaxSize: "",
                        pedestrian: false,
                        vehicle: false,
                        confidence: "",
                        quality: "",
                        sensitivity: "",
                        detectTime: "",
                        batchSecond: "",
                        eventNum: "",
                        // outOfBoundsTime0: null,
                        // outOfBoundsTime1: null,
                    },
                    {
                        id: 3,
                        direction: 1,
                        outAreas: [],
                        outPoints: [],
                        bbox: {},
                        outOfBoundsMinSize: "",
                        outOfBoundsMaxSize: "",
                        pedestrian: false,
                        vehicle: false,
                        confidence: "",
                        quality: "",
                        sensitivity: "",
                        detectTime: "",
                        batchSecond: "",
                        eventNum: "",
                        // outOfBoundsTime0: null,
                        // outOfBoundsTime1: null,
                    },
                    {
                        id: 4,
                        direction: 1,
                        outAreas: [],
                        outPoints: [],
                        bbox: {},
                        outOfBoundsMinSize: "",
                        outOfBoundsMaxSize: "",
                        pedestrian: false,
                        vehicle: false,
                        confidence: "",
                        quality: "",
                        sensitivity: "",
                        detectTime: "",
                        batchSecond: "",
                        eventNum: "",
                        // outOfBoundsTime0: null,
                        // outOfBoundsTime1: null,
                    }
                ],
                id: 1,
            },
            // 进入区域侦测
            enterArea: {
                bbox: {},
                enterAreaMinSize: "",
                enterAreaMaxSize: "",
                checkArr: [],
                pedestrian: false,
                vehicle: false,
                confidence: "",
                quality: "",
                sensitivity: "",
                detectTime: "",
                batchSecond: "",
                eventNum: "",
            },
            enterAreaTime0: null,
            enterAreaTime1: null,
            // 离开区域侦测
            leaveArea: {
                bbox: {},
                leaveAreaMinSize: "",
                leaveAreaMaxSize: "",
                checkArr: [],
                pedestrian: false,
                vehicle: false,
                confidence: "",
                quality: "",
                sensitivity: "",
                detectTime: "",
                batchSecond: "",
                eventNum: "",
            },
            leaveAreaTime0: null,
            leaveAreaTime1: null,
            // 玩手机
            playPhone: {
                pedConfidence: "",
                phoneConfidence: "",
                duration: "",
                sensitivity: "",
                batchSecond: "",
                eventNum: ""
            },
            playPhoneTime0: null,
            playPhoneTime1: null,
            // 抢包
            grab: {
                grabConfidence: "",
                duration: "",
                sensitivity: "",
                batchSecond: "",
                eventNum: ""
            },
            grabTime0: null,
            grabTime1: null,
            // 吸烟
            smoking: {
                pedConfidence: "",
                smokingConfidence: "",
                duration: "",
                sensitivity: "",
                batchSecond: "",
                eventNum: "",
            },
            smokingTime0: null,
            smokingTime1: null,
            // ATM柜台遗留物检查
            atmRemain: {
                pedConfidence: "",
                phoneConfidence: "",
                cashConfidence: "",
                duration: "",
                sensitivity: "",
                batchSecond: "",
                eventNum: ""
            },
            atmRemainTime0: null,
            atmRemainTime1: null,
            // 坐姿不正
            recline: {
                pedConfidence: "",
                phoneConfidence: "",
                crossLegDuration: "",
                crossLegNum: "",
                sleepDuration: "",
                playPhoneDuration: "",
                duration: "",
                sensitivity: "",
            },
            reclineTime0: null,
            reclineTime1: null,
            // 人脸聚类
            faceClustering: {
                bbox: {},
                blur: "",
                confidence: "",
                pitch: "",
                quality: "",
                roll: "",
                yaw: ""
            },
            // 人体挟持
            hijack: {
                pedConfidence: "",
                duration: "",
                sensitivity: "",
                batchSecond: "",
                eventNum: ""
            },
            hijackTime0: null,
            hijackTime1: null,
            // 箱包交接
            swapBag: {
                pedConfidence: "",
                propertime: "",
                sensitivity: "",
                type: 1
            },
            swapBagTime0: null,
            swapBagTime1: null,
            // 一日两碰箱
            touchBag: {
                pedConfidence: "",
                propertime: "",
                sensitivity: ""
            },
            touchBagTime0: null,
            touchBagTime1: null,
            algorithmNum: [],
            picView: false,
            details: {},
            checked: false,
            flagIndex: 0,
            enableList: [],
        };
    },
    created() {
        this.getChannelList("cut");
        console.log(this.$route.query);
    },
    methods: {
      handleClick(tab, event) {
        if(tab.index == '1') {
          this.flag = true
        }
      },
        handleCheckChannelAllChange(val) {
            this.checkedChannels = val ? this.channelEnabledCheckedList : [];
            this.isIndeterminate = false;
        },
        handleCheckedChannelsChange(value) {
            this.checkedChannels = value;
            let checkedCount = value.length;
            this.checkChannelAll = checkedCount === this.channelEnabledCheckedList.length;
            this.isIndeterminate = checkedCount > 0 && checkedCount < this.channelEnabledCheckedList.length;
        },
        changeEnabled(e) {
            this.enabled = e;
        },
        showBatchDetails() {
            this.dialogBatchVisible = true;
        },
        // 通道列表
        getChannelList(param) {
          let enableList1 = []
          getChannel().then(res => {
            if (res.data.code === 200000) {
              res.data.data.boundList.forEach(item => {
                if(item.enabled) {
                  enableList1.push(item.channel)
                }
              })
            getChannels().then(res => {
              let channels = res.data.data
              this.channelList = channels.filter(item => {
                return item.isBound
              })
              this.enableList = []
              this.enableList = this.channelList.filter(item => {
                return enableList1.includes(Number(item.id))
              })
              getChannelList().then((res) => {
                if (res.data.code === 200000) {
                  res.data.data.forEach((item,index)=> {
                    let name = !item.chanNameList ? '' : (item.chanNameList.length>0 ? item.chanNameList[0].channelName : '')
                    if(enableList1.includes(item.channel)) {
                      this.enableList.forEach((item1, index1) => {
                        if(item.channel == item1.id) {
                          this.enableList[index1] = {...this.enableList[index1], chName: ('[' + item.channelType + "" + item.channel + ']' + name)}
                        }
                      })
                    }
                    this.channelList[index] = {...this.channelList[index], chName: ('[' + item.channelType + "" + item.channel + ']' + name)}
                  })
                  // 初始化首个通道
                  this.algorithm.channelId = this.enableList[0]?.id;
                  this.alName = 'algo'
                  this.initAlgList()
                  this.$nextTick(() => {
                    this.changeChannel(this.algorithm.channelId, param);
                  })
                }
              })
            });
            }
          })
        },
        // 初始化算法列表
        initAlgList() {
          // 快速移动
          this.fastMoveTime0 = null;
            this.fastMoveTime1 = null;
            // 遗留物
            this.remainTime0 = null;
            this.remainTime1 = null;
            // 打斗
            this.struggleTime0 = null;
            this.struggleTime1 = null;
            // 倒地
            this.fallTime0 = null;
            this.fallTime1 = null;
            // 拍屏
            this.shootTime0 = null;
            this.shootTime1 = null;
            // 临时离柜
            this.cashTime0 = null;
            this.cashTime1 = null;
            // 特殊人群
            this.specialPedTime0 = null;
            this.specialPedTime1 = null;
            // 代客操作
            this.stmTime0 = null;
            this.stmTime1 = null;
            // 徘徊
            this.hoverTime0 = null;
            this.hoverTime1 = null;
            // 箱包
            this.bagTime0 = null;
            this.bagTime1 = null;
            // 摄像头移动
            this.ipcmoveTime0 = null;
            this.ipcmoveTime1 = null;
            // 睡岗
            this.sleepTime0 = null;
            this.sleepTime1 = null;
            // 广告张贴
            this.adPostTime0 = null;
            this.adPostTime1 = null;
            // 越界侦测
            // for(let j = 0; j < 4; j++){
            //   this.outOfBounds.area[j].outOfBoundsTime0 = null
            //   this.outOfBounds.area[j].outOfBoundsTime1 = null
            // }
            // 进入区域侦测
            this.enterAreaTime0 = null;
            this.enterAreaTime1 = null;
            // 离开区域侦测
            this.leaveAreaTime0 = null;
            this.leaveAreaTime1 = null;
            // 玩手机
            this.playPhoneTime0 = null;
            this.playPhoneTime1 = null;
            // 抢包
            this.grabTime0 = null;
            this.grabTime1 = null;
            // 吸烟
            this.smokingTime0 = null;
            this.smokingTime1 = null;
            // ATM柜台遗留物检查
            this.atmRemainTime0 = null;
            this.atmRemainTime1 = null;
            // 坐姿不正
            this.reclineTime0 = null;
            this.reclineTime1 = null;
            // 人体挟持
            this.hijackTime0 = null;
            this.hijackTime1 = null;
            // 箱包交接
            this.swapBagTime0 = null;
            this.swapBagTime1 = null;
            // 一日两碰箱
            this.touchBagTime0 = null;
            this.touchBagTime1 = null;
            // 当前通道的所有算法参数
            this.algoObject = this.channelList.filter(item => item.id === this.algorithm.channelId)[0];
            // 看当前通道是否在线
            this.picView = this.algoObject.online;
            // 算法列表
            this.algoList = this.algoList.length > 0 ? this.algoList : [{
                    index: 0,
                    name: "人脸",
                    algorithm: "face",
                    enabled: (this.algoObject.config.face && this.algoObject.config.face.enabled) ? this.algoObject.config.face.enabled : false,
                    newLable: "人脸                  ",
                }, {
                    index: 1,
                    name: "行人",
                    algorithm: "pedestrian",
                    enabled: (this.algoObject.config.pedestrian && this.algoObject.config.pedestrian.enabled) ? this.algoObject.config.pedestrian.enabled : false,
                    newLable: "行人                  ",
                }, {
                    index: 2,
                    name: "机动车",
                    algorithm: "vehicle",
                    enabled: (this.algoObject.config.vehicle && this.algoObject.config.vehicle.enabled) ? this.algoObject.config.vehicle.enabled : false,
                    newLable: "机动车               ",
                }, {
                    index: 3,
                    name: "非机动车",
                    algorithm: "nonmotor",
                    enabled: (this.algoObject.config.nonmotor && this.algoObject.config.nonmotor.enabled) ? this.algoObject.config.nonmotor.enabled : false,
                    newLable: "非机动车         ",
                }, {
                    index: 4,
                    name: "拍屏",
                    algorithm: "shoot",
                    enabled: (this.algoObject.config.shoot && this.algoObject.config.shoot.enabled) ? this.algoObject.config.shoot.enabled : false,
                    newLable: "拍屏                  ",
                }, {
                    index: 5,
                    name: "倒地",
                    algorithm: "fall",
                    enabled: (this.algoObject.config.fall && this.algoObject.config.fall.enabled) ? this.algoObject.config.fall.enabled : false,
                    newLable: "倒地                  ",
                }, {
                    index: 6,
                    name: "临时离柜",
                    algorithm: "cash",
                    enabled: (this.algoObject.config.cash && this.algoObject.config.cash.enabled) ? this.algoObject.config.cash.enabled : false,
                    newLable: "临时离柜         ",
                }, {
                    index: 7,
                    name: "烟雾火苗",
                    algorithm: "smogFire",
                    enabled: (this.algoObject.config.smogFire && this.algoObject.config.smogFire.enabled) ? this.algoObject.config.smogFire.enabled : false,
                    newLable: "烟雾火苗         ",
                }, {
                    index: 8,
                    name: "打斗",
                    algorithm: "struggle",
                    enabled: (this.algoObject.config.struggle && this.algoObject.config.struggle.enabled) ? this.algoObject.config.struggle.enabled : false,
                    newLable: "打斗                  ",
                }, {
                    index: 9,
                    name: "数人",
                    algorithm: "skeleton",
                    enabled: (this.algoObject.config.skeleton && this.algoObject.config.skeleton.enabled) ? this.algoObject.config.skeleton.enabled : false,
                    newLable: "数人                  ",
                }, {
                    index: 10,
                    name: "快速移动",
                    algorithm: "fastMove",
                    enabled: (this.algoObject.config.fastMove && this.algoObject.config.fastMove.enabled) ? this.algoObject.config.fastMove.enabled : false,
                    newLable: "快速移动         ",
                }, {
                    index: 11,
                    name: "遗留物",
                    algorithm: "remain",
                    enabled: (this.algoObject.config.remain && this.algoObject.config.remain.enabled) ? this.algoObject.config.remain.enabled : false,
                    newLable: "遗留物               ",
                }, {
                    index: 14,
                    name: "徘徊",
                    algorithm: "hover",
                    enabled: (this.algoObject.config.hover && this.algoObject.config.hover.enabled) ? this.algoObject.config.hover.enabled : false,
                    newLable: "徘徊                  ",
                }, {
                    index: 15,
                    name: "箱包",
                    algorithm: "bag",
                    enabled: (this.algoObject.config.bag && this.algoObject.config.bag.enabled) ? this.algoObject.config.bag.enabled : false,
                    newLable: "箱包                  ",
                }, {
                    index: 16,
                    name: "摄像头移动",
                    algorithm: "ipcmove",
                    enabled: (this.algoObject.config.ipcmove && this.algoObject.config.ipcmove.enabled) ? this.algoObject.config.ipcmove.enabled : false,
                    newLable: "摄像头移动      ",
                }, {
                    index: 17,
                    name: "睡岗",
                    algorithm: "sleep",
                    enabled: (this.algoObject.config.sleep && this.algoObject.config.sleep.enabled) ? this.algoObject.config.sleep.enabled : false,
                    newLable: "睡岗                  ",
                }, {
                  index: 19,
                  name: '越界侦测',
                  algorithm: 'outOfBounds',
                  enabled: (this.algoObject.config.outOfBounds && this.algoObject.config.outOfBounds.enabled) ? this.algoObject.config.outOfBounds.enabled : false,
                    newLable: "越界侦测         ",
                }, {
                  index: 20,
                  name: '进入区域侦测',
                  algorithm: 'enterArea',
                  enabled: (this.algoObject.config.enterArea && this.algoObject.config.enterArea.enabled) ? this.algoObject.config.enterArea.enabled : false,
                    newLable: "进入区域侦测   ",
                }, {
                  index: 21,
                  name: '离开区域侦测',
                  algorithm: 'leaveArea',
                  enabled: (this.algoObject.config.leaveArea && this.algoObject.config.leaveArea.enabled) ? this.algoObject.config.leaveArea.enabled : false,
                    newLable: "离开区域侦测   ",
                }, {
                    index: 22,
                    name: "玩手机",
                    algorithm: "playPhone",
                    enabled: (this.algoObject.config.playPhone && this.algoObject.config.playPhone.enabled) ? this.algoObject.config.playPhone.enabled : false,
                    newLable: "玩手机               ",
                }, {
                  index: 25,
                  name: "ATM遗留物",
                  algorithm: "atmRemain",
                  enabled: (this.algoObject.config.atmRemain && this.algoObject.config.atmRemain.enabled) ? this.algoObject.config.atmRemain.enabled : false,
                  newLable: "ATM遗留物        ",
                }, {
                    index: 24,
                    name: "吸烟",
                    algorithm: "smoking",
                    enabled: (this.algoObject.config.smoking && this.algoObject.config.smoking.enabled) ? this.algoObject.config.smoking.enabled : false,
                    newLable: "吸烟                  ",
                }];
            algApi.GetEnableList('0').then(res => {
              if(res.data.code == 200000 && res.data.data != false) {
                let enableList = []
                res.data.data.map(item => {
                  enableList.push(item.type)
                })
                this.algoList = this.algoList.filter(item => {
                  return enableList.includes(item.algorithm)
                })
                this.getIndex = this.algoList[0].index
                this.isHaveAlg = true
              } else if (res.data.data == false) {
                this.algoList = []
                this.getIndex = ''
                this.isHaveAlg = false
              }
            })
        },
        // 监听通道列表展示算法列表及详情
        changeChannel(e, param) {
            this.algoObject = this.channelList.filter(item => item.id === this.algorithm.channelId)[0];
            // 看当前通道是否在线
            this.picView = this.algoObject.online;
            // 如果在线
            if (this.picView) {
                // 并且不是首次默认的算法，只需获取算法详情，不许获取图片
                if (param == "second") {
                    this.getAlgoDetails();
                }
                else {
                    // 如果是切换到当前通道首次默认的算法，需获取图片
                    getChannelPic(this.algorithm.channelId).then(res => {
                        this.roiBase64 = "data:image/JPEG;base64," + res.data.data;
                        this.getRoiBase64(this.roiBase64);
                        this.getAlgoDetails();
                    }).catch(err => {
                      this.$message.error('获取图片失败')
                    })
                }
            }
            else {
                // 不在线只调用算法详情接口
                this.getAlgoDetails();
                
            }
            // 重新获取算法开关
            if (param == "cut") {
                this.getAlogEnable();
            }
            // 获取使用当前算法的通道并显示在右下角
            this.getAlgoNum();

          },
        // 将当前通道下所有算法的参数与默认参数相结合
        assignValue(val) {
            // 人脸
            val.face = val.face ? val.face : this.face;
            for (let key in this.algoParams.face) {
                if (typeof (this.algoParams.face[key]) == "string" || typeof (this.algoParams.face[key]) == "number") {
                    val.face[key] = (val.face[key] || val.face[key] === 0) ? val.face[key] : this.algoParams.face[key];
                }
            }
            val.face.bbox = val.face.bbox ? val.face.bbox : { maxSize: null, minSize: null };
            val.face.bbox.maxSize = val.face.bbox.maxSize ? val.face.bbox.maxSize : this.algoParams.face.bbox.maxSize;
            val.face.bbox.minSize = val.face.bbox.minSize ? val.face.bbox.minSize : this.algoParams.face.bbox.minSize;
            // 行人
            val.pedestrian = val.pedestrian ? val.pedestrian : this.pedestrian;
            for (let key in this.algoParams.pedestrian) {
                if (typeof (this.algoParams.pedestrian[key]) == "string" || typeof (this.algoParams.pedestrian[key]) == "number") {
                    val.pedestrian[key] = (val.pedestrian[key] || val.pedestrian[key] === 0) ? val.pedestrian[key] : this.algoParams.pedestrian[key];
                }
            }
            val.pedestrian.bbox = val.pedestrian.bbox ? val.pedestrian.bbox : {};
            val.pedestrian.bbox.maxSize = val.pedestrian.bbox.maxSize ? val.pedestrian.bbox.maxSize : this.algoParams.pedestrian.bbox.maxSize;
            val.pedestrian.bbox.minSize = val.pedestrian.bbox.minSize ? val.pedestrian.bbox.minSize : this.algoParams.pedestrian.bbox.minSize;
            // 机动车
            val.vehicle = val.vehicle ? val.vehicle : this.vehicle;
            for (let key in this.algoParams.vehicle) {
                if (typeof (this.algoParams.vehicle[key]) == "string" || typeof (this.algoParams.vehicle[key]) == "number") {
                    val.vehicle[key] = (val.vehicle[key] || val.vehicle[key] === 0) ? val.vehicle[key] : this.algoParams.vehicle[key];
                }
            }
            val.vehicle.bbox = val.vehicle.bbox ? val.vehicle.bbox : { maxSize: null, minSize: null };
            val.vehicle.bbox.maxSize = val.vehicle.bbox.maxSize ? val.vehicle.bbox.maxSize : this.algoParams.vehicle.bbox.maxSize;
            val.vehicle.bbox.minSize = val.vehicle.bbox.minSize ? val.vehicle.bbox.minSize : this.algoParams.vehicle.bbox.minSize;
            // 非机动车
            val.nonmotor = val.nonmotor ? val.nonmotor : this.nonmotor;
            for (let key in this.algoParams.nonmotor) {
                if (typeof (this.algoParams.nonmotor[key]) == "string" || typeof (this.algoParams.nonmotor[key]) == "number") {
                    val.nonmotor[key] = (val.nonmotor[key] || val.nonmotor[key] === 0) ? val.nonmotor[key] : this.algoParams.nonmotor[key];
                }
            }
            val.nonmotor.bbox = val.nonmotor.bbox ? val.nonmotor.bbox : { maxSize: null, minSize: null };
            val.nonmotor.bbox.maxSize = val.nonmotor.bbox.maxSize ? val.nonmotor.bbox.maxSize : this.algoParams.nonmotor.bbox.maxSize;
            val.nonmotor.bbox.minSize = val.nonmotor.bbox.minSize ? val.nonmotor.bbox.minSize : this.algoParams.nonmotor.bbox.minSize;
            // 拍屏
            val.shoot = val.shoot ? val.shoot : { pedConfidence: "", phoneConfidence: "", screenConfidence: "", duration: "", sensitivity: "", batchSecond: "", eventNum: "" };
            for (let key in this.algoParams.shoot) {
                if (typeof (this.algoParams.shoot[key]) == "string" || typeof (this.algoParams.shoot[key]) == "number") {
                    val.shoot[key] = (val.shoot[key] || val.shoot[key] === 0) ? val.shoot[key] : this.algoParams.shoot[key];
                }
            }
            if (val.shoot.effectiveTime) {
                if (val.shoot.effectiveTime.length == 1) {
                    this.shootTime0 = val.shoot.effectiveTime[0]
                        ? [new Date("2022-01-06 " + val.shoot.effectiveTime[0].startSection), new Date("2022-01-06 " + val.shoot.effectiveTime[0].endSection)]
                        : [new Date("2022-01-06 " + this.algoParams.shoot.effectiveTime[0].startSection), new Date("2022-01-06 " + this.algoParams.shoot.effectiveTime[0].endSection)];
                }
                else if (val.shoot.effectiveTime.length == 2) {
                    this.shootTime0 = val.shoot.effectiveTime[0]
                        ? [new Date("2022-01-06 " + val.shoot.effectiveTime[0].startSection), new Date("2022-01-06 " + val.shoot.effectiveTime[0].endSection)]
                        : [new Date("2022-01-06 " + this.algoParams.shoot.effectiveTime[0].startSection), new Date("2022-01-06 " + this.algoParams.shoot.effectiveTime[0].endSection)];
                    this.shootTime1 = val.shoot.effectiveTime?.[1]
                        ? [new Date("2022-01-06 " + val.shoot.effectiveTime[1].startSection), new Date("2022-01-06 " + val.shoot.effectiveTime[1].endSection)]
                        : [new Date("2022-01-06 " + this.algoParams.shoot.effectiveTime[1].startSection), new Date("2022-01-06 " + this.algoParams.shoot.effectiveTime[1].endSection)];
                }
            }
            // 倒地
            val.fall = val.fall ? val.fall : { pedConfidence: "", duration: "", sensitivity: "", batchSecond: "", eventNum: "" };
            for (let key in this.algoParams.fall) {
                if (typeof (this.algoParams.fall[key]) == "string" || typeof (this.algoParams.fall[key]) == "number") {
                    val.fall[key] = (val.fall[key] || val.fall[key] === 0) ? val.fall[key] : this.algoParams.fall[key];
                }
            }
            if (val.fall.effectiveTime) {
                if (val.fall.effectiveTime.length == 1) {
                    this.fallTime0 = val.fall.effectiveTime[0]
                        ? [new Date("2022-01-06 " + val.fall.effectiveTime[0].startSection), new Date("2022-01-06 " + val.fall.effectiveTime[0].endSection)]
                        : [new Date("2022-01-06 " + this.algoParams.fall.effectiveTime[0].startSection), new Date("2022-01-06 " + this.algoParams.fall.effectiveTime[0].endSection)];
                }
                else if (val.fall.effectiveTime.length == 2) {
                    this.fallTime0 = val.fall.effectiveTime[0]
                        ? [new Date("2022-01-06 " + val.fall.effectiveTime[0].startSection), new Date("2022-01-06 " + val.fall.effectiveTime[0].endSection)]
                        : [new Date("2022-01-06 " + this.algoParams.fall.effectiveTime[0].startSection), new Date("2022-01-06 " + this.algoParams.fall.effectiveTime[0].endSection)];
                    this.fallTime1 = val.fall.effectiveTime?.[1]
                        ? [new Date("2022-01-06 " + val.fall.effectiveTime[1].startSection), new Date("2022-01-06 " + val.fall.effectiveTime[1].endSection)]
                        : [new Date("2022-01-06 " + this.algoParams.fall.effectiveTime[1].startSection), new Date("2022-01-06 " + this.algoParams.fall.effectiveTime[1].endSection)];
                }
            }
            // 临时离柜
            val.cash = val.cash ? val.cash : { pedConfidence: "", cashConfidence: "", duration: "", sensitivity: "", leaveNum: "", batchSecond: "", eventNum: "" };
            for (let key in this.algoParams.cash) {
                if (typeof (this.algoParams.cash[key]) == "string" || typeof (this.algoParams.cash[key]) == "number") {
                    val.cash[key] = (val.cash[key] || val.cash[key] === 0) ? val.cash[key] : this.algoParams.cash[key];
                }
            }
            if (val.cash.effectiveTime) {
                if (val.cash.effectiveTime.length == 1) {
                    this.cashTime0 = val.cash.effectiveTime[0]
                        ? [new Date("2022-01-06 " + val.cash.effectiveTime[0].startSection), new Date("2022-01-06 " + val.cash.effectiveTime[0].endSection)]
                        : [new Date("2022-01-06 " + this.algoParams.cash.effectiveTime[0].startSection), new Date("2022-01-06 " + this.algoParams.cash.effectiveTime[0].endSection)];
                }
                else if (val.cash.effectiveTime.length == 2) {
                    this.cashTime0 = val.cash.effectiveTime[0]
                        ? [new Date("2022-01-06 " + val.cash.effectiveTime[0].startSection), new Date("2022-01-06 " + val.cash.effectiveTime[0].endSection)]
                        : [new Date("2022-01-06 " + this.algoParams.cash.effectiveTime[0].startSection), new Date("2022-01-06 " + this.algoParams.cash.effectiveTime[0].endSection)];
                    this.cashTime1 = val.cash.effectiveTime?.[1]
                        ? [new Date("2022-01-06 " + val.cash.effectiveTimae[1].startSection), new Date("2022-01-06 " + val.cash.effectiveTime[1].endSection)]
                        : [new Date("2022-01-06 " + this.algoParams.cash.effectiveTime[1].startSection), new Date("2022-01-06 " + this.algoParams.cash.effectiveTime[1].endSection)];
                }
            }
            // 烟雾
            val.smogFire = val.smogFire ? val.smogFire : { bbox: {}, smogFireMinSize: "", smogFireMaxSize: "" };
            for (let key in this.algoParams.smogFire) {
                if (typeof (this.algoParams.smogFire[key]) == "string" || typeof (this.algoParams.smogFire[key]) == "number") {
                    val.smogFire[key] = (val.smogFire[key] || val.smogFire[key] === 0) ? val.smogFire[key] : this.algoParams.smogFire[key];
                }
            }
            val.smogFire.bbox = val.smogFire.bbox ? val.smogFire.bbox : { maxSize: null, minSize: null };
            val.smogFire.bbox.maxSize = val.smogFire.bbox.maxSize ? val.smogFire.bbox.maxSize : (this.algoParams?.smogFire?.bbox?.maxSize || "");
            val.smogFire.bbox.minSize = val.smogFire.bbox.minSize ? val.smogFire.bbox.minSize : (this.algoParams?.smogFire?.bbox?.minSize || "");
            // 打斗
            val.struggle = val.struggle ? val.struggle : { pedConfidence: "", flowThreshold: "", duration: "", sensitivity: "", batchSecond: "", eventNum: "" };
            for (let key in this.algoParams.struggle) {
                if (typeof (this.algoParams.struggle[key]) == "string" || typeof (this.algoParams.struggle[key]) == "number") {
                    val.struggle[key] = (val.struggle[key] || val.struggle[key] === 0) ? val.struggle[key] : this.algoParams.struggle[key];
                }
            }
            if (val.struggle.effectiveTime) {
                if (val.struggle.effectiveTime.length == 1) {
                    this.struggleTime0 = val.struggle.effectiveTime[0]
                        ? [new Date("2022-01-06 " + val.struggle.effectiveTime[0].startSection), new Date("2022-01-06 " + val.struggle.effectiveTime[0].endSection)]
                        : [new Date("2022-01-06 " + this.algoParams.struggle.effectiveTime[0].startSection), new Date("2022-01-06 " + this.algoParams.struggle.effectiveTime[0].endSection)];
                }
                else if (val.struggle.effectiveTime.length == 2) {
                    this.struggleTime0 = val.struggle.effectiveTime[0]
                        ? [new Date("2022-01-06 " + val.struggle.effectiveTime[0].startSection), new Date("2022-01-06 " + val.struggle.effectiveTime[0].endSection)]
                        : [new Date("2022-01-06 " + this.algoParams.struggle.effectiveTime[0].startSection), new Date("2022-01-06 " + this.algoParams.struggle.effectiveTime[0].endSection)];
                    this.struggleTime1 = val.struggle.effectiveTime?.[1]
                        ? [new Date("2022-01-06 " + val.struggle.effectiveTime[1].startSection), new Date("2022-01-06 " + val.struggle.effectiveTime[1].endSection)]
                        : [new Date("2022-01-06 " + this.algoParams.struggle.effectiveTime[1].startSection), new Date("2022-01-06 " + this.algoParams.struggle.effectiveTime[1].endSection)];
                }
            }
            // 数人
            val.skeleton = val.skeleton ? val.skeleton : { confidence: "", interval: "" };
            for (let key in this.algoParams.skeleton) {
                if (typeof (this.algoParams.skeleton[key]) == "string" || typeof (this.algoParams.skeleton[key]) == "number") {
                    val.skeleton[key] = (val.skeleton[key] || val.skeleton[key] === 0) ? val.skeleton[key] : this.algoParams.skeleton[key];
                }
            }
            // 快速移动
            val.fastMove = val.fastMove ? val.fastMove : { pedConfidence: "", fastSpeed: "", duration: "", sensitivity: "", batchSecond: "", eventNum: "", };
            for (let key in this.algoParams.fastMove) {
                if (typeof (this.algoParams.fastMove[key]) == "string" || typeof (this.algoParams.fastMove[key]) == "number") {
                    // 保存更改数值
                    val.fastMove[key] = (val.fastMove[key] || val.fastMove[key] === 0) ? val.fastMove[key] : this.algoParams.fastMove[key];
                }
            }
            if (val.fastMove.effectiveTime) {
                if (val.fastMove.effectiveTime.length == 1) {
                    this.fastMoveTime0 = val.fastMove.effectiveTime[0]
                        ? [new Date("2022-01-06 " + val.fastMove.effectiveTime[0].startSection), new Date("2022-01-06 " + val.fastMove.effectiveTime[0].endSection)]
                        : [new Date("2022-01-06 " + this.algoParams.fastMove.effectiveTime[0].startSection), new Date("2022-01-06 " + this.algoParams.fastMove.effectiveTime[0].endSection)];
                }
                else if (val.fastMove.effectiveTime.length == 2) {
                    this.fastMoveTime0 = val.fastMove.effectiveTime[0]
                        ? [new Date("2022-01-06 " + val.fastMove.effectiveTime[0].startSection), new Date("2022-01-06 " + val.fastMove.effectiveTime[0].endSection)]
                        : [new Date("2022-01-06 " + this.algoParams.fastMove.effectiveTime[0].startSection), new Date("2022-01-06 " + this.algoParams.fastMove.effectiveTime[0].endSection)];
                    this.fastMoveTime1 = val.fastMove.effectiveTime?.[1]
                        ? [new Date("2022-01-06 " + val.fastMove.effectiveTime[1].startSection), new Date("2022-01-06 " + val.fastMove.effectiveTime[1].endSection)]
                        : [new Date("2022-01-06 " + this.algoParams.fastMove.effectiveTime[1].startSection), new Date("2022-01-06 " + this.algoParams.fastMove.effectiveTime[1].endSection)];
                }
            }
            // 遗留物
            val.remain = val.remain ? val.remain : { pedConfidence: "", threshold: "", duration: "", sensitivity: "", batchSecond: "", eventNum: "" };
            for (let key in this.algoParams.remain) {
                if (typeof (this.algoParams.remain[key]) == "string" || typeof (this.algoParams.remain[key]) == "number") {
                    val.remain[key] = (val.remain[key] || val.remain[key] === 0) ? val.remain[key] : this.algoParams.remain[key];
                }
            }
            if (val.remain.effectiveTime) {
                if (val.remain.effectiveTime.length == 1) {
                    this.remainTime0 = val.remain.effectiveTime[0]
                        ? [new Date("2022-01-06 " + val.remain.effectiveTime[0].startSection), new Date("2022-01-06 " + val.remain.effectiveTime[0].endSection)]
                        : [new Date("2022-01-06 " + this.algoParams.remain.effectiveTime[0].startSection), new Date("2022-01-06 " + this.algoParams.remain.effectiveTime[0].endSection)];
                }
                else if (val.remain.effectiveTime.length == 2) {
                    this.remainTime0 = val.remain.effectiveTime[0]
                        ? [new Date("2022-01-06 " + val.remain.effectiveTime[0].startSection), new Date("2022-01-06 " + val.remain.effectiveTime[0].endSection)]
                        : [new Date("2022-01-06 " + this.algoParams.remain.effectiveTime[0].startSection), new Date("2022-01-06 " + this.algoParams.remain.effectiveTime[0].endSection)];
                    this.remainTime1 = val.remain.effectiveTime?.[1]
                        ? [new Date("2022-01-06 " + val.remain.effectiveTime[1].startSection), new Date("2022-01-06 " + val.remain.effectiveTime[1].endSection)]
                        : [new Date("2022-01-06 " + this.algoParams.remain.effectiveTime[1].startSection), new Date("2022-01-06 " + this.algoParams.remain.effectiveTime[1].endSection)];
                }
            }
            // 特殊人群
            val.specialPed = val.specialPed ? val.specialPed : { pedConfidence: "", duration: "", sensitivity: "", batchSecond: "", eventNum: "" };
            for (let key in this.algoParams.specialPed) {
                if (typeof (this.algoParams.specialPed[key]) == "string" || typeof (this.algoParams.specialPed[key]) == "number") {
                    val.specialPed[key] = (val.specialPed[key] || val.specialPed[key] === 0) ? val.specialPed[key] : this.algoParams.specialPed[key];
                }
            }
            if (val.specialPed.effectiveTime) {
                if (val.specialPed.effectiveTime.length == 1) {
                    this.specialPedTime0 = val.specialPed.effectiveTime[0]
                        ? [new Date("2022-01-06 " + val.specialPed.effectiveTime[0].startSection), new Date("2022-01-06 " + val.specialPed.effectiveTime[0].endSection)]
                        : [new Date("2022-01-06 " + this.algoParams.specialPed.effectiveTime[0].startSection), new Date("2022-01-06 " + this.algoParams.specialPed.effectiveTime[0].endSection)];
                }
                else if (val.specialPed.effectiveTime.length == 2) {
                    this.specialPedTime0 = val.specialPed.effectiveTime[0]
                        ? [new Date("2022-01-06 " + val.specialPed.effectiveTime[0].startSection), new Date("2022-01-06 " + val.specialPed.effectiveTime[0].endSection)]
                        : [new Date("2022-01-06 " + this.algoParams.specialPed.effectiveTime[0].startSection), new Date("2022-01-06 " + this.algoParams.specialPed.effectiveTime[0].endSection)];
                    this.specialPedTime1 = val.specialPed.effectiveTime?.[1]
                        ? [new Date("2022-01-06 " + val.specialPed.effectiveTime[1].startSection), new Date("2022-01-06 " + val.specialPed.effectiveTime[1].endSection)]
                        : [new Date("2022-01-06 " + this.algoParams.specialPed.effectiveTime[1].startSection), new Date("2022-01-06 " + this.algoParams.specialPed.effectiveTime[1].endSection)];
                }
            }
            // 代客操作
            val.stm = val.stm ? val.stm : { pedConfidence: "", direction: "", threshold: "", duration: "", sensitivity: "", batchSecond: "", eventNum: "" };
            for (let key in this.algoParams.stm) {
                if (typeof (this.algoParams.stm[key]) == "string" || typeof (this.algoParams.stm[key]) == "number") {
                    val.stm[key] = (val.stm[key] || val.stm[key] === 0) ? val.stm[key] : this.algoParams.stm[key];
                }
            }
            if (val.stm.effectiveTime) {
                if (val.stm.effectiveTime.length == 1) {
                    this.stmTime0 = val.stm.effectiveTime[0]
                        ? [new Date("2022-01-06 " + val.stm.effectiveTime[0].startSection), new Date("2022-01-06 " + val.stm.effectiveTime[0].endSection)]
                        : [new Date("2022-01-06 " + this.algoParams.stm.effectiveTime[0].startSection), new Date("2022-01-06 " + this.algoParams.stm.effectiveTime[0].endSection)];
                }
                else if (val.stm.effectiveTime.length == 2) {
                    this.stmTime0 = val.stm.effectiveTime[0]
                        ? [new Date("2022-01-06 " + val.stm.effectiveTime[0].startSection), new Date("2022-01-06 " + val.stm.effectiveTime[0].endSection)]
                        : [new Date("2022-01-06 " + this.algoParams.stm.effectiveTime[0].startSection), new Date("2022-01-06 " + this.algoParams.stm.effectiveTime[0].endSection)];
                    this.stmTime1 = val.stm.effectiveTime?.[1]
                        ? [new Date("2022-01-06 " + val.stm.effectiveTime[1].startSection), new Date("2022-01-06 " + val.stm.effectiveTime[1].endSection)]
                        : [new Date("2022-01-06 " + this.algoParams.stm.effectiveTime[1].startSection), new Date("2022-01-06 " + this.algoParams.stm.effectiveTime[1].endSection)];
                }
            }
            // 徘徊
            val.hover = val.hover ? val.hover : { pedConfidence: "", duration: "", sensitivity: "", batchSecond: "", eventNum: "" };
            for (let key in this.algoParams.hover) {
                if (typeof (this.algoParams.hover[key]) == "string" || typeof (this.algoParams.hover[key]) == "number") {
                    val.hover[key] = (val.hover[key] || val.hover[key] === 0) ? val.hover[key] : this.algoParams.hover[key];
                }
            }
            if (val.hover.effectiveTime) {
                if (val.hover.effectiveTime.length == 1) {
                    this.hoverTime0 = val.hover.effectiveTime[0]
                        ? [new Date("2022-01-06 " + val.hover.effectiveTime[0].startSection), new Date("2022-01-06 " + val.hover.effectiveTime[0].endSection)]
                        : [new Date("2022-01-06 " + this.algoParams.hover.effectiveTime[0].startSection), new Date("2022-01-06 " + this.algoParams.hover.effectiveTime[0].endSection)];
                }
                else if (val.hover.effectiveTime.length == 2) {
                    this.hoverTime0 = val.hover.effectiveTime[0]
                        ? [new Date("2022-01-06 " + val.hover.effectiveTime[0].startSection), new Date("2022-01-06 " + val.hover.effectiveTime[0].endSection)]
                        : [new Date("2022-01-06 " + this.algoParams.hover.effectiveTime[0].startSection), new Date("2022-01-06 " + this.algoParams.hover.effectiveTime[0].endSection)];
                    this.hoverTime1 = val.hover.effectiveTime?.[1]
                        ? [new Date("2022-01-06 " + val.hover.effectiveTime[1].startSection), new Date("2022-01-06 " + val.hover.effectiveTime[1].endSection)]
                        : [new Date("2022-01-06 " + this.algoParams.hover.effectiveTime[1].startSection), new Date("2022-01-06 " + this.algoParams.hover.effectiveTime[1].endSection)];
                }
            }
            // 箱包
            val.bag = val.bag ? val.bag : { pedConfidence: "", bagConfidence: "", moneyBoxConfidence: "", duration: "", sensitivity: "" };
            for (let key in this.algoParams.bag) {
                if (typeof (this.algoParams.bag[key]) == "string" || typeof (this.algoParams.bag[key]) == "number") {
                    val.bag[key] = (val.bag[key] || val.bag[key] === 0) ? val.bag[key] : this.algoParams.bag[key];
                }
            }
            if (val.bag.effectiveTime) {
                if (val.bag.effectiveTime.length == 1) {
                    this.bagTime0 = val.bag.effectiveTime[0]
                        ? [new Date("2022-01-06 " + val.bag.effectiveTime[0].startSection), new Date("2022-01-06 " + val.bag.effectiveTime[0].endSection)]
                        : [new Date("2022-01-06 " + this.algoParams.bag.effectiveTime[0].startSection), new Date("2022-01-06 " + this.algoParams.bag.effectiveTime[0].endSection)];
                }
                else if (val.bag.effectiveTime.length == 2) {
                    this.bagTime0 = val.bag.effectiveTime[0]
                        ? [new Date("2022-01-06 " + val.bag.effectiveTime[0].startSection), new Date("2022-01-06 " + val.bag.effectiveTime[0].endSection)]
                        : [new Date("2022-01-06 " + this.algoParams.bag.effectiveTime[0].startSection), new Date("2022-01-06 " + this.algoParams.bag.effectiveTime[0].endSection)];
                    this.bagTime1 = val.bag.effectiveTime?.[1]
                        ? [new Date("2022-01-06 " + val.bag.effectiveTime[1].startSection), new Date("2022-01-06 " + val.bag.effectiveTime[1].endSection)]
                        : [new Date("2022-01-06 " + this.algoParams.bag.effectiveTime[1].startSection), new Date("2022-01-06 " + this.algoParams.bag.effectiveTime[1].endSection)];
                }
            }
            // 摄像机移动
            val.ipcmove = val.ipcmove ? val.ipcmove : { threshold: "", duration: "", sensitivity: "" };
            for (let key in this.algoParams.ipcmove) {
                if (typeof (this.algoParams.ipcmove[key]) == "string" || typeof (this.algoParams.ipcmove[key]) == "number") {
                    val.ipcmove[key] = (val.ipcmove[key] || val.ipcmove[key] === 0) ? val.ipcmove[key] : this.algoParams.ipcmove[key];
                    val.ipcmove.ipcmove_threshold = (val.ipcmove.threshold || val.ipcmove.threshold === 0) ? val.ipcmove.threshold : this.algoParams.ipcmove.threshold;
                }
            }
            if (val.ipcmove.effectiveTime) {
                if (val.ipcmove.effectiveTime.length == 1) {
                    this.ipcmoveTime0 = val.ipcmove.effectiveTime[0]
                        ? [new Date("2022-01-06 " + val.ipcmove.effectiveTime[0].startSection), new Date("2022-01-06 " + val.ipcmove.effectiveTime[0].endSection)]
                        : [new Date("2022-01-06 " + this.algoParams.ipcmove.effectiveTime[0].startSection), new Date("2022-01-06 " + this.algoParams.bipcmoveag.effectiveTime[0].endSection)];
                }
                else if (val.ipcmove.effectiveTime.length == 2) {
                    this.ipcmoveTime0 = val.ipcmove.effectiveTime[0]
                        ? [new Date("2022-01-06 " + val.ipcmove.effectiveTime[0].startSection), new Date("2022-01-06 " + val.ipcmove.effectiveTime[0].endSection)]
                        : [new Date("2022-01-06 " + this.algoParams.ipcmove.effectiveTime[0].startSection), new Date("2022-01-06 " + this.algoParams.ipcmove.effectiveTime[0].endSection)];
                    this.ipcmoveTime1 = val.ipcmove.effectiveTime?.[1]
                        ? [new Date("2022-01-06 " + val.ipcmove.effectiveTime[1].startSection), new Date("2022-01-06 " + val.ipcmove.effectiveTime[1].endSection)]
                        : [new Date("2022-01-06 " + this.algoParams.ipcmove.effectiveTime[1].startSection), new Date("2022-01-06 " + this.algoParams.ipcmove.effectiveTime[1].endSection)];
                }
            }
            // 睡岗
            val.sleep = val.sleep ? val.sleep : { pedConfidence: "", duration: "", sensitivity: "" };
            for (let key in this.algoParams.sleep) {
                if (typeof (this.algoParams.sleep[key]) == "string" || typeof (this.algoParams.sleep[key]) == "number") {
                    val.sleep[key] = (val.sleep[key] || val.sleep[key] === 0) ? val.sleep[key] : this.algoParams.sleep[key];
                }
            }
            if (val.sleep.effectiveTime) {
                if (val.sleep.effectiveTime.length == 1) {
                    this.sleepTime0 = val.sleep.effectiveTime[0]
                        ? [new Date("2022-01-06 " + val.sleep.effectiveTime[0].startSection), new Date("2022-01-06 " + val.sleep.effectiveTime[0].endSection)]
                        : [new Date("2022-01-06 " + this.algoParams.sleep.effectiveTime[0].startSection), new Date("2022-01-06 " + this.algoParams.bipcmoveag.effectiveTime[0].endSection)];
                }
                else if (val.sleep.effectiveTime.length == 2) {
                    this.sleepTime0 = val.sleep.effectiveTime[0]
                        ? [new Date("2022-01-06 " + val.sleep.effectiveTime[0].startSection), new Date("2022-01-06 " + val.sleep.effectiveTime[0].endSection)]
                        : [new Date("2022-01-06 " + this.algoParams.sleep.effectiveTime[0].startSection), new Date("2022-01-06 " + this.algoParams.sleep.effectiveTime[0].endSection)];
                    this.sleepTime1 = val.sleep.effectiveTime?.[1]
                        ? [new Date("2022-01-06 " + val.sleep.effectiveTime[1].startSection), new Date("2022-01-06 " + val.sleep.effectiveTime[1].endSection)]
                        : [new Date("2022-01-06 " + this.algoParams.sleep.effectiveTime[1].startSection), new Date("2022-01-06 " + this.algoParams.sleep.effectiveTime[1].endSection)];
                }
            }
            // 广告张贴
            val.adPost = val.adPost ? val.adPost : { pedConfidence: "", adConfidence: "", sensitivity: "" };
            for (let key in this.algoParams.adPost) {
                if (typeof (this.algoParams.adPost[key]) == "string" || typeof (this.algoParams.adPost[key]) == "number") {
                    val.adPost[key] = (val.adPost[key] || val.adPost[key] === 0) ? val.adPost[key] : this.algoParams.adPost[key];
                }
            }
            if (val.adPost.effectiveTime) {
                if (val.adPost.effectiveTime.length == 1) {
                    this.adPostTime0 = val.adPost.effectiveTime[0]
                        ? [new Date("2022-01-06 " + val.adPost.effectiveTime[0].startSection), new Date("2022-01-06 " + val.adPost.effectiveTime[0].endSection)]
                        : [new Date("2022-01-06 " + this.algoParams.adPost.effectiveTime[0].startSection), new Date("2022-01-06 " + this.algoParams.bipcmoveag.effectiveTime[0].endSection)];
                }
                else if (val.adPost.effectiveTime.length == 2) {
                    this.adPostTime0 = val.adPost.effectiveTime[0]
                        ? [new Date("2022-01-06 " + val.adPost.effectiveTime[0].startSection), new Date("2022-01-06 " + val.adPost.effectiveTime[0].endSection)]
                        : [new Date("2022-01-06 " + this.algoParams.adPost.effectiveTime[0].startSection), new Date("2022-01-06 " + this.algoParams.adPost.effectiveTime[0].endSection)];
                    this.adPostTime1 = val.adPost.effectiveTime?.[1]
                        ? [new Date("2022-01-06 " + val.adPost.effectiveTime[1].startSection), new Date("2022-01-06 " + val.adPost.effectiveTime[1].endSection)]
                        : [new Date("2022-01-06 " + this.algoParams.adPost.effectiveTime[1].startSection), new Date("2022-01-06 " + this.algoParams.adPost.effectiveTime[1].endSection)];
                }
            }
            // 越界侦测
            val.outOfBounds = val.outOfBounds ? val.outOfBounds : this.outOfBounds;
            for (let key in this.algoParams.outOfBounds) {
                if (typeof (this.algoParams.outOfBounds[key]) == "string" || typeof (this.algoParams.outOfBounds[key]) == "number") {
                    val.outOfBounds[key] = (val.outOfBounds[key] || val.outOfBounds[key] === 0) ? val.outOfBounds[key] : this.algoParams.outOfBounds[key];
                }
            }
            // 进入区域侦测
            val.enterArea = val.enterArea ? val.enterArea : this.enterArea;
            for (let key in this.algoParams.enterArea) {
                if (typeof (this.algoParams.enterArea[key]) == "string" || typeof (this.algoParams.enterArea[key]) == "number") {
                    val.enterArea[key] = (val.enterArea[key] || val.enterArea[key] === 0) ? val.enterArea[key] : this.algoParams.enterArea[key];
                }
            }
            if (val.enterArea.effectiveTime) {
                if (val.enterArea.effectiveTime.length == 1) {
                    this.enterAreaTime0 = val.enterArea.effectiveTime[0]
                        ? [new Date("2022-01-06 " + val.enterArea.effectiveTime[0].startSection), new Date("2022-01-06 " + val.enterArea.effectiveTime[0].endSection)]
                        : [new Date("2022-01-06 " + this.algoParams.enterArea.effectiveTime[0].startSection), new Date("2022-01-06 " + this.algoParams.bipcmoveag.effectiveTime[0].endSection)];
                }
                else if (val.enterArea.effectiveTime.length == 2) {
                    this.enterAreaTime0 = val.enterArea.effectiveTime[0]
                        ? [new Date("2022-01-06 " + val.enterArea.effectiveTime[0].startSection), new Date("2022-01-06 " + val.enterArea.effectiveTime[0].endSection)]
                        : [new Date("2022-01-06 " + this.algoParams.enterArea.effectiveTime[0].startSection), new Date("2022-01-06 " + this.algoParams.enterArea.effectiveTime[0].endSection)];
                    this.enterAreaTime1 = val.enterArea.effectiveTime?.[1]
                        ? [new Date("2022-01-06 " + val.enterArea.effectiveTime[1].startSection), new Date("2022-01-06 " + val.enterArea.effectiveTime[1].endSection)]
                        : [new Date("2022-01-06 " + this.algoParams.enterArea.effectiveTime[1].startSection), new Date("2022-01-06 " + this.algoParams.enterArea.effectiveTime[1].endSection)];
                }
            }
            // 离开区域侦测
            val.leaveArea = val.leaveArea ? val.leaveArea : this.leaveArea;
            for (let key in this.algoParams.leaveArea) {
                if (typeof (this.algoParams.leaveArea[key]) == "string" || typeof (this.algoParams.leaveArea[key]) == "number") {
                    val.leaveArea[key] = (val.leaveArea[key] || val.leaveArea[key] === 0) ? val.leaveArea[key] : this.algoParams.leaveArea[key];
                }
            }
            if (val.leaveArea.effectiveTime) {
                if (val.leaveArea.effectiveTime.length == 1) {
                    this.leaveAreaTime0 = val.leaveArea.effectiveTime[0]
                        ? [new Date("2022-01-06 " + val.leaveArea.effectiveTime[0].startSection), new Date("2022-01-06 " + val.leaveArea.effectiveTime[0].endSection)]
                        : [new Date("2022-01-06 " + this.algoParams.leaveArea.effectiveTime[0].startSection), new Date("2022-01-06 " + this.algoParams.bipcmoveag.effectiveTime[0].endSection)];
                }
                else if (val.leaveArea.effectiveTime.length == 2) {
                    this.leaveAreaTime0 = val.leaveArea.effectiveTime[0]
                        ? [new Date("2022-01-06 " + val.leaveArea.effectiveTime[0].startSection), new Date("2022-01-06 " + val.leaveArea.effectiveTime[0].endSection)]
                        : [new Date("2022-01-06 " + this.algoParams.leaveArea.effectiveTime[0].startSection), new Date("2022-01-06 " + this.algoParams.leaveArea.effectiveTime[0].endSection)];
                    this.leaveAreaTime1 = val.leaveArea.effectiveTime?.[1]
                        ? [new Date("2022-01-06 " + val.leaveArea.effectiveTime[1].startSection), new Date("2022-01-06 " + val.leaveArea.effectiveTime[1].endSection)]
                        : [new Date("2022-01-06 " + this.algoParams.leaveArea.effectiveTime[1].startSection), new Date("2022-01-06 " + this.algoParams.leaveArea.effectiveTime[1].endSection)];
                }
            }
            // 玩手机
            val.playPhone = val.playPhone ? val.playPhone : { crossLegDuration: "", crossLegNum: "", pedConfidence: "", phoneConfidence: "", playPhoneDuration: "", sensitivity: "", sleepDuration: "" };
            for (let key in this.algoParams.playPhone) {
                if (typeof (this.algoParams.playPhone[key]) == "string" || typeof (this.algoParams.playPhone[key]) == "number") {
                    val.playPhone[key] = (val.playPhone[key] || val.playPhone[key] === 0) ? val.playPhone[key] : this.algoParams.playPhone[key];
                }
            }
            if (val.playPhone.effectiveTime) {
                if (val.playPhone.effectiveTime.length == 1) {
                    this.playPhoneTime0 = val.playPhone.effectiveTime[0]
                        ? [new Date("2022-01-06 " + val.playPhone.effectiveTime[0].startSection), new Date("2022-01-06 " + val.playPhone.effectiveTime[0].endSection)]
                        : [new Date("2022-01-06 " + this.algoParams.playPhone.effectiveTime[0].startSection), new Date("2022-01-06 " + this.algoParams.bipcmoveag.effectiveTime[0].endSection)];
                }
                else if (val.playPhone.effectiveTime.length == 2) {
                    this.playPhoneTime0 = val.playPhone.effectiveTime[0]
                        ? [new Date("2022-01-06 " + val.playPhone.effectiveTime[0].startSection), new Date("2022-01-06 " + val.playPhone.effectiveTime[0].endSection)]
                        : [new Date("2022-01-06 " + this.algoParams.playPhone.effectiveTime[0].startSection), new Date("2022-01-06 " + this.algoParams.playPhone.effectiveTime[0].endSection)];
                    this.playPhoneTime1 = val.playPhone.effectiveTime?.[1]
                        ? [new Date("2022-01-06 " + val.playPhone.effectiveTime[1].startSection), new Date("2022-01-06 " + val.playPhone.effectiveTime[1].endSection)]
                        : [new Date("2022-01-06 " + this.algoParams.playPhone.effectiveTime[1].startSection), new Date("2022-01-06 " + this.algoParams.playPhone.effectiveTime[1].endSection)];
                }
            }
            // 抢包
            val.grab = val.grab ? val.grab : { grabConfidence: "", duration: "", sensitivity: "", batchSecond: "", eventNum: "" };
            for (let key in this.algoParams.grab) {
                if (typeof (this.algoParams.grab[key]) == "string" || typeof (this.algoParams.grab[key]) == "number") {
                    val.grab[key] = (val.grab[key] || val.grab[key] === 0) ? val.grab[key] : this.algoParams.grab[key];
                }
            }
            if (val.grab.effectiveTime) {
                if (val.grab.effectiveTime.length == 1) {
                    this.grabTime0 = val.grab.effectiveTime[0]
                        ? [new Date("2022-01-06 " + val.grab.effectiveTime[0].startSection), new Date("2022-01-06 " + val.grab.effectiveTime[0].endSection)]
                        : [new Date("2022-01-06 " + this.algoParams.grab.effectiveTime[0].startSection), new Date("2022-01-06 " + this.algoParams.bipcmoveag.effectiveTime[0].endSection)];
                }
                else if (val.grab.effectiveTime.length == 2) {
                    this.grabTime0 = val.grab.effectiveTime[0]
                        ? [new Date("2022-01-06 " + val.grab.effectiveTime[0].startSection), new Date("2022-01-06 " + val.grab.effectiveTime[0].endSection)]
                        : [new Date("2022-01-06 " + this.algoParams.grab.effectiveTime[0].startSection), new Date("2022-01-06 " + this.algoParams.grab.effectiveTime[0].endSection)];
                    this.grabTime1 = val.grab.effectiveTime?.[1]
                        ? [new Date("2022-01-06 " + val.grab.effectiveTime[1].startSection), new Date("2022-01-06 " + val.grab.effectiveTime[1].endSection)]
                        : [new Date("2022-01-06 " + this.algoParams.grab.effectiveTime[1].startSection), new Date("2022-01-06 " + this.algoParams.grab.effectiveTime[1].endSection)];
                }
            }
            else {
                this.grabTime0 = [new Date("2022-01-06 " + this.algoParams.grab.effectiveTime[0].startSection), new Date("2022-01-06 " + this.algoParams.grab.effectiveTime[0].endSection)];
            }
            // 吸烟
            val.smoking = val.smoking ? val.smoking : { smokingConfidence: "", pedConfidence: "", duration: "", sensitivity: "", batchSecond: "", eventNum: "" };
            for (let key in this.algoParams.smoking) {
                if (typeof (this.algoParams.smoking[key]) == "string" || typeof (this.algoParams.smoking[key]) == "number") {
                    val.smoking[key] = (val.smoking[key] || val.smoking[key] === 0) ? val.smoking[key] : this.algoParams.smoking[key];
                }
            }
            if (val.smoking.effectiveTime) {
                if (val.smoking.effectiveTime.length == 1) {
                    this.smokingTime0 = val.smoking.effectiveTime[0]
                        ? [new Date("2022-01-06 " + val.smoking.effectiveTime[0].startSection), new Date("2022-01-06 " + val.smoking.effectiveTime[0].endSection)]
                        : [new Date("2022-01-06 " + this.algoParams.smoking.effectiveTime[0].startSection), new Date("2022-01-06 " + this.algoParams.bipcmoveag.effectiveTime[0].endSection)];
                }
                else if (val.smoking.effectiveTime.length == 2) {
                    this.smokingTime0 = val.smoking.effectiveTime[0]
                        ? [new Date("2022-01-06 " + val.smoking.effectiveTime[0].startSection), new Date("2022-01-06 " + val.smoking.effectiveTime[0].endSection)]
                        : [new Date("2022-01-06 " + this.algoParams.smoking.effectiveTime[0].startSection), new Date("2022-01-06 " + this.algoParams.smoking.effectiveTime[0].endSection)];
                    this.smokingTime1 = val.smoking.effectiveTime?.[1]
                        ? [new Date("2022-01-06 " + val.smoking.effectiveTime[1].startSection), new Date("2022-01-06 " + val.smoking.effectiveTime[1].endSection)]
                        : [new Date("2022-01-06 " + this.algoParams.smoking.effectiveTime[1].startSection), new Date("2022-01-06 " + this.algoParams.smoking.effectiveTime[1].endSection)];
                }
            }
            // ATM柜台遗留物检查
            val.atmRemain = val.atmRemain ? val.atmRemain : { threshold: "", duration: "", sensitivity: "" };
            for (let key in this.algoParams.atmRemain) {
                if (typeof (this.algoParams.atmRemain[key]) == "string" || typeof (this.algoParams.atmRemain[key]) == "number") {
                    val.atmRemain[key] = (val.atmRemain[key] || val.atmRemain[key] === 0) ? val.atmRemain[key] : this.algoParams.atmRemain[key];
                }
            }
            if (val.atmRemain.effectiveTime) {
                if (val.atmRemain.effectiveTime.length == 1) {
                    this.atmRemainTime0 = val.atmRemain.effectiveTime[0]
                        ? [new Date("2022-01-06 " + val.atmRemain.effectiveTime[0].startSection), new Date("2022-01-06 " + val.atmRemain.effectiveTime[0].endSection)]
                        : [new Date("2022-01-06 " + this.algoParams.atmRemain.effectiveTime[0].startSection), new Date("2022-01-06 " + this.algoParams.bipcmoveag.effectiveTime[0].endSection)];
                }
                else if (val.atmRemain.effectiveTime.length == 2) {
                    this.atmRemainTime0 = val.atmRemain.effectiveTime[0]
                        ? [new Date("2022-01-06 " + val.atmRemain.effectiveTime[0].startSection), new Date("2022-01-06 " + val.atmRemain.effectiveTime[0].endSection)]
                        : [new Date("2022-01-06 " + this.algoParams.atmRemain.effectiveTime[0].startSection), new Date("2022-01-06 " + this.algoParams.atmRemain.effectiveTime[0].endSection)];
                    this.atmRemainTime1 = val.atmRemain.effectiveTime?.[1]
                        ? [new Date("2022-01-06 " + val.atmRemain.effectiveTime[1].startSection), new Date("2022-01-06 " + val.atmRemain.effectiveTime[1].endSection)]
                        : [new Date("2022-01-06 " + this.algoParams.atmRemain.effectiveTime[1].startSection), new Date("2022-01-06 " + this.algoParams.atmRemain.effectiveTime[1].endSection)];
                }
            }
            // 坐姿不雅
            val.recline = val.recline ? val.recline : { crossLegDuration: "", crossLegNum: "", pedConfidence: "", phoneConfidence: "", playPhoneDuration: "", sensitivity: "", sleepDuration: "" };
            for (let key in this.algoParams.recline) {
                if (typeof (this.algoParams.recline[key]) == "string" || typeof (this.algoParams.recline[key]) == "number") {
                    val.recline[key] = (val.recline[key] || val.recline[key] === 0) ? val.recline[key] : this.algoParams.recline[key];
                }
            }
            if (val.recline.effectiveTime) {
                if (val.recline.effectiveTime.length == 1) {
                    this.reclineTime0 = val.recline.effectiveTime[0]
                        ? [new Date("2022-01-06 " + val.recline.effectiveTime[0].startSection), new Date("2022-01-06 " + val.recline.effectiveTime[0].endSection)]
                        : [new Date("2022-01-06 " + this.algoParams.recline.effectiveTime[0].startSection), new Date("2022-01-06 " + this.algoParams.bipcmoveag.effectiveTime[0].endSection)];
                }
                else if (val.recline.effectiveTime.length == 2) {
                    this.reclineTime0 = val.recline.effectiveTime[0]
                        ? [new Date("2022-01-06 " + val.recline.effectiveTime[0].startSection), new Date("2022-01-06 " + val.recline.effectiveTime[0].endSection)]
                        : [new Date("2022-01-06 " + this.algoParams.recline.effectiveTime[0].startSection), new Date("2022-01-06 " + this.algoParams.recline.effectiveTime[0].endSection)];
                    this.reclineTime1 = val.recline.effectiveTime?.[1]
                        ? [new Date("2022-01-06 " + val.recline.effectiveTime[1].startSection), new Date("2022-01-06 " + val.recline.effectiveTime[1].endSection)]
                        : [new Date("2022-01-06 " + this.algoParams.recline.effectiveTime[1].startSection), new Date("2022-01-06 " + this.algoParams.recline.effectiveTime[1].endSection)];
                }
            }
            // 人脸聚类
            val.faceClustering = val.faceClustering ? val.faceClustering : this.faceClustering;
            for (let key in this.algoParams.faceClustering) {
                if (typeof (this.algoParams.faceClustering[key]) == "string" || typeof (this.algoParams.faceClustering[key]) == "number") {
                    val.faceClustering[key] = (val.faceClustering[key] || val.faceClustering[key] === 0) ? val.faceClustering[key] : this.algoParams.faceClustering[key];
                }
            }
            val.faceClustering.bbox = val.faceClustering.bbox ? val.faceClustering.bbox : { maxSize: null, minSize: null };
            val.faceClustering.bbox.maxSize = val.faceClustering.bbox.maxSize ? val.faceClustering.bbox.maxSize : this.algoParams.faceClustering.bbox.maxSize;
            val.faceClustering.bbox.minSize = val.faceClustering.bbox.minSize ? val.faceClustering.bbox.minSize : this.algoParams.faceClustering.bbox.minSize;
            // 人体挟持
            val.hijack = val.hijack ? val.hijack : { pedConfidence: "", duration: "", sensitivity: "" };
            for (let key in this.algoParams.hijack) {
                if (typeof (this.algoParams.hijack[key]) == "string" || typeof (this.algoParams.hijack[key]) == "number") {
                    val.hijack[key] = (val.hijack[key] || val.hijack[key] === 0) ? val.hijack[key] : this.algoParams.hijack[key];
                }
            }
            if (val.hijack.effectiveTime) {
                if (val.hijack.effectiveTime.length == 1) {
                    this.hijackTime0 = val.hijack.effectiveTime[0]
                        ? [new Date("2022-01-06 " + val.hijack.effectiveTime[0].startSection), new Date("2022-01-06 " + val.hijack.effectiveTime[0].endSection)]
                        : [new Date("2022-01-06 " + this.algoParams.hijack.effectiveTime[0].startSection), new Date("2022-01-06 " + this.algoParams.bipcmoveag.effectiveTime[0].endSection)];
                }
                else if (val.hijack.effectiveTime.length == 2) {
                    this.hijackTime0 = val.hijack.effectiveTime[0]
                        ? [new Date("2022-01-06 " + val.hijack.effectiveTime[0].startSection), new Date("2022-01-06 " + val.hijack.effectiveTime[0].endSection)]
                        : [new Date("2022-01-06 " + this.algoParams.hijack.effectiveTime[0].startSection), new Date("2022-01-06 " + this.algoParams.hijack.effectiveTime[0].endSection)];
                    this.hijackTime1 = val.hijack.effectiveTime?.[1]
                        ? [new Date("2022-01-06 " + val.hijack.effectiveTime[1].startSection), new Date("2022-01-06 " + val.hijack.effectiveTime[1].endSection)]
                        : [new Date("2022-01-06 " + this.algoParams.hijack.effectiveTime[1].startSection), new Date("2022-01-06 " + this.algoParams.hijack.effectiveTime[1].endSection)];
                }
            }
            // 箱包交接
            val.swapBag = val.swapBag ? val.swapBag : this.swapBag;
            for (let key in this.algoParams.swapBag) {
                if (typeof (this.algoParams.swapBag[key]) == "string" || typeof (this.algoParams.swapBag[key]) == "number") {
                    val.swapBag[key] = (val.swapBag[key] || val.swapBag[key] === 0) ? val.swapBag[key] : this.algoParams.swapBag[key];
                }
            }
            if (val.swapBag.effectiveTime) {
                if (val.swapBag.effectiveTime.length == 1) {
                    this.swapBagTime0 = val.swapBag.effectiveTime[0]
                        ? [new Date("2022-01-06 " + val.swapBag.effectiveTime[0].startSection), new Date("2022-01-06 " + val.swapBag.effectiveTime[0].endSection)]
                        : [new Date("2022-01-06 " + this.algoParams.swapBag.effectiveTime[0].startSection), new Date("2022-01-06 " + this.algoParams.bipcmoveag.effectiveTime[0].endSection)];
                }
                else if (val.swapBag.effectiveTime.length == 2) {
                    this.swapBagTime0 = val.swapBag.effectiveTime[0]
                        ? [new Date("2022-01-06 " + val.swapBag.effectiveTime[0].startSection), new Date("2022-01-06 " + val.swapBag.effectiveTime[0].endSection)]
                        : [new Date("2022-01-06 " + this.algoParams.swapBag.effectiveTime[0].startSection), new Date("2022-01-06 " + this.algoParams.swapBag.effectiveTime[0].endSection)];
                    this.swapBagTime1 = val.swapBag.effectiveTime?.[1]
                        ? [new Date("2022-01-06 " + val.swapBag.effectiveTime[1].startSection), new Date("2022-01-06 " + val.swapBag.effectiveTime[1].endSection)]
                        : [new Date("2022-01-06 " + this.algoParams.swapBag.effectiveTime[1].startSection), new Date("2022-01-06 " + this.algoParams.swapBag.effectiveTime[1].endSection)];
                }
            }
            // 一日两碰箱
            val.touchBag = val.touchBag ? val.touchBag : this.touchBag;
            for (let key in this.algoParams.touchBag) {
                if (typeof (this.algoParams.touchBag[key]) == "string" || typeof (this.algoParams.touchBag[key]) == "number") {
                    val.touchBag[key] = (val.touchBag[key] || val.touchBag[key] === 0) ? val.touchBag[key] : this.algoParams.touchBag[key];
                }
            }
            if (val.touchBag.effectiveTime) {
                if (val.touchBag.effectiveTime.length == 1) {
                    this.touchBagTime0 = val.touchBag.effectiveTime[0]
                        ? [new Date("2022-01-06 " + val.touchBag.effectiveTime[0].startSection), new Date("2022-01-06 " + val.touchBag.effectiveTime[0].endSection)]
                        : [new Date("2022-01-06 " + this.algoParams.touchBag.effectiveTime[0].startSection), new Date("2022-01-06 " + this.algoParams.bipcmoveag.effectiveTime[0].endSection)];
                }
                else if (val.touchBag.effectiveTime.length == 2) {
                    this.touchBagTime0 = val.touchBag.effectiveTime[0]
                        ? [new Date("2022-01-06 " + val.touchBag.effectiveTime[0].startSection), new Date("2022-01-06 " + val.touchBag.effectiveTime[0].endSection)]
                        : [new Date("2022-01-06 " + this.algoParams.touchBag.effectiveTime[0].startSection), new Date("2022-01-06 " + this.algoParams.touchBag.effectiveTime[0].endSection)];
                    this.touchBagTime1 = val.touchBag.effectiveTime?.[1]
                        ? [new Date("2022-01-06 " + val.touchBag.effectiveTime[1].startSection), new Date("2022-01-06 " + val.touchBag.effectiveTime[1].endSection)]
                        : [new Date("2022-01-06 " + this.algoParams.touchBag.effectiveTime[1].startSection), new Date("2022-01-06 " + this.algoParams.touchBag.effectiveTime[1].endSection)];
                }
            }
        },
        // 获取当前算法下的算法详情
        getAlgoDetails() {
            getChannelDet(this.algorithm.channelId).then(res => {
                // this.currentChannel主要用于保存修改的时候，获取当前id
                this.currentChannel = res.data.data;
                this.algoParams = res.data.data.config
                this.details = res.data.data.details;
                // 将当前通道下所有算法的参数与默认参数相结合
                this.assignValue(res.data.data.config);
                // 人脸 this.getIndex == 0
                this.face = res.data.data.config.face
                    ? res.data.data.config.face
                    : {};
                this.face.faceMinSize = this.face.bbox.minSize || "";
                this.face.faceMaxSize = this.face.bbox.maxSize || "";
                // 行人 this.getIndex == 1
                this.pedestrian = res.data.data.config.pedestrian
                    ? res.data.data.config.pedestrian
                    : {};
                this.pedestrian.pedestrianMinSize = this.pedestrian.bbox.minSize || "";
                this.pedestrian.pedestrianMaxSize = this.pedestrian.bbox.maxSize || "";
                // 机动车 this.getIndex == 2
                this.vehicle = res.data.data.config.vehicle
                    ? res.data.data.config.vehicle
                    : {};
                this.vehicle.vehicleMinSize = this.vehicle.bbox.minSize || "";
                this.vehicle.vehicleMaxSize = this.vehicle.bbox.maxSize || "";
                // 非机动车 this.getIndex == 3
                this.nonmotor = res.data.data.config.nonmotor
                    ? res.data.data.config.nonmotor
                    : {};
                this.nonmotor.nonmotorMinSize = this.nonmotor.bbox.minSize || "";
                this.nonmotor.nonmotorMaxSize = this.nonmotor.bbox.maxSize || "";
                // 拍屏 this.getIndex == 4
                this.shoot = res.data.data.config.shoot
                    ? res.data.data.config.shoot
                    : {};
                // 倒地 this.getIndex == 5
                this.fall = res.data.data.config.fall
                    ? res.data.data.config.fall
                    : {};
                // 临时离柜 this.getIndex == 6
                this.cash = res.data.data.config.cash
                    ? res.data.data.config.cash
                    : {};
                // 烟雾火苗 this.getIndex == 7
                this.smogFire = res.data.data.config.smogFire
                    ? res.data.data.config.smogFire
                    : {};
                this.smogFire.smogFireMinSize = this.smogFire.bbox?.minSize || "";
                this.smogFire.smogFireMaxSize = this.smogFire.bbox?.maxSize || "";
                // 打斗 this.getIndex == 8
                this.struggle = res.data.data.config.struggle
                    ? res.data.data.config.struggle
                    : {};
                // 数人 this.getIndex == 9
                this.skeleton = res.data.data.config.skeleton
                    ? res.data.data.config.skeleton
                    : {};
                // 快速移动 this.getIndex == 10
                this.fastMove = res.data.data.config.fastMove
                    ? res.data.data.config.fastMove
                    : {};
                // 遗留物 this.getIndex == 11
                this.remain = res.data.data.config.remain
                    ? res.data.data.config.remain
                    : {};
                // 特殊人群 this.getIndex == 12
                this.specialPed = res.data.data.config.specialPed
                    ? res.data.data.config.specialPed
                    : {};
                // 代客操作 this.getIndex == 13
                this.stm = res.data.data.config.stm
                    ? res.data.data.config.stm
                    : {};
                // 徘徊 this.getIndex == 14
                this.hover = res.data.data.config.hover
                    ? res.data.data.config.hover
                    : {};
                // 箱包 this.getIndex == 15
                this.bag = res.data.data.config.bag
                    ? res.data.data.config.bag
                    : {};
                // 摄像头移动 this.getIndex == 16
                this.ipcmove = res.data.data.config.ipcmove
                    ? res.data.data.config.ipcmove
                    : {};
                this.ipcmove.ipcmove_threshold = res.data.data.config.ipcmove ? res.data.data.config.ipcmove.threshold : "";
                // 睡岗 17
                this.sleep = res.data.data.config.sleep
                    ? res.data.data.config.sleep
                    : {};
                // 广告张贴 18
                this.adPost = res.data.data.config.adPost
                    ? res.data.data.config.adPost
                    : {};
                // 越界侦测 this.getIndex == 19
                this.outOfBounds.area = res.data.data.config.outOfBounds.area
                    ? res.data.data.config.outOfBounds.area
                    : [];
                this.outOfBounds.enabled = res.data.data.config.outOfBounds.enabled
                    ? res.data.data.config.outOfBounds.enabled
                    : false;
                for (let j = 0; j < 4; j++) {
                    this.outOfBounds.area[j].outOfBoundsMinSize = this.outOfBounds.area[j].bbox?.minSize || "";
                    this.outOfBounds.area[j].outOfBoundsMaxSize = this.outOfBounds.area[j].bbox?.maxSize || "";
                }
                this.outOfBounds.area[this.outOfBounds.id - 1].outAreas = this.outOfBounds.area[this.outOfBounds.id - 1].tripWire || [];
                this.outOfBounds.area[this.outOfBounds.id - 1].outPoints = this.outOfBounds.area[this.outOfBounds.id - 1].outAreas / 2 || [];
                // 进入区域侦测 this.getIndex == 20
                this.enterArea = res.data.data.config.enterArea
                    ? res.data.data.config.enterArea
                    : {};
                this.enterArea.enterAreaMinSize = this.enterArea.bbox?.minSize || "";
                this.enterArea.enterAreaMaxSize = this.enterArea.bbox?.maxSize || "";
                // 离开区域侦测 this.getIndex == 21
                this.leaveArea = res.data.data.config.leaveArea
                    ? res.data.data.config.leaveArea
                    : {};
                this.leaveArea.leaveAreaMinSize = this.leaveArea.bbox?.minSize || "";
                this.leaveArea.leaveAreaMaxSize = this.leaveArea.bbox?.maxSize || "";
                // 玩手机 22
                this.playPhone = res.data.data.config.playPhone
                    ? res.data.data.config.playPhone
                    : {};
                // 抢包 this.getIndex == 23
                this.grab = res.data.data.config.grab
                    ? res.data.data.config.grab
                    : {};
                // 吸烟 this.getIndex == 24
                this.smoking = res.data.data.config.smoking
                    ? res.data.data.config.smoking
                    : {};
                // ATM柜台遗留物检查 25
                this.atmRemain = res.data.data.config.atmRemain
                    ? res.data.data.config.atmRemain
                    : {};
                // 坐姿不雅 26
                this.recline = res.data.data.config.recline
                    ? res.data.data.config.recline
                    : {};
                // 人脸聚类 this.getIndex == 27
                this.faceClustering = res.data.data.config.faceClustering
                    ? res.data.data.config.faceClustering
                    : {};
                this.faceClustering.faceClusteringMinSize = this.faceClustering.bbox.minSize || "";
                this.faceClustering.faceClusteringMaxSize = this.faceClustering.bbox.maxSize || "";
                // 人体挟持 this.getIndex == 28
                this.hijack = res.data.data.config.hijack
                    ? res.data.data.config.hijack
                    : {};
                // 箱包交接 this.getIndex == 30
                this.swapBag = res.data.data.config.swapBag
                    ? res.data.data.config.swapBag
                    : {};
                // 一日两碰箱 this.getIndex == 31
                this.touchBag = res.data.data.config.touchBag
                    ? res.data.data.config.touchBag
                    : {};
                // 绊线 this.getIndex == 29
                this.flowAreas = res.data.data.flowAreas
                    ? res.data.data.flowAreas
                    : {};
                if (this.getIndex == 0) {
                    // 人脸
                    this.getAreas({
                        roi: this.face.roi,
                    });
                }
                else if (this.getIndex == 1) {
                    // 行人
                    this.getAreas({
                        roi: this.pedestrian.roi,
                    });
                }
                else if (this.getIndex == 2) {
                    // 机动车
                    this.getAreas({
                        roi: this.vehicle.roi,
                    });
                }
                else if (this.getIndex == 3) {
                    // 非机动车
                    this.getAreas({
                        roi: this.nonmotor.roi,
                    });
                }
                else if (this.getIndex == 4) {
                    // 拍屏
                    this.getAreas({
                        roi: this.shoot.roi,
                    });
                }
                else if (this.getIndex == 5) {
                    // 倒地
                    this.getAreas({
                        roi: this.fall.roi,
                    });
                }
                else if (this.getIndex == 6) {
                    // 临时离柜
                    this.getAreas({
                        roi: this.cash.roi
                    });
                }
                else if (this.getIndex == 7) {
                    // 烟雾
                    this.getAreas({
                        roi: this.smogFire.roi
                    });
                }
                else if (this.getIndex == 8) {
                    // 打斗
                    this.getAreas({
                        roi: this.struggle.roi
                    });
                }
                else if (this.getIndex == 9) {
                    // 数人
                    this.getAreas({
                        roi: this.skeleton.roi
                    });
                }
                else if (this.getIndex == 10) {
                    // 快速移动
                    this.getAreas({
                        roi: this.fastMove.roi
                    });
                }
                else if (this.getIndex == 11) {
                    // 遗留物
                    this.getAreas({
                        roi: this.remain.roi
                    });
                }
                else if (this.getIndex == 12) {
                    // 特殊人群
                    this.getAreas({
                        roi: this.specialPed.roi
                    });
                }
                else if (this.getIndex == 13) {
                    // 代客操作
                    this.getAreas({
                        roi: this.stm.roi,
                        screen: this.stm.screen,
                        keyboard: this.stm.keyboard,
                        keyboard: this.stm.keyboard,
                        stm: this.stm.stm
                    });
                }
                else if (this.getIndex == 14) {
                    // 徘徊
                    this.getAreas({
                        roi: this.hover.roi
                    });
                }
                else if (this.getIndex == 15) {
                    // 箱包
                    this.getAreas({
                        roi: this.bag.roi
                    });
                }
                else if (this.getIndex == 16) {
                    // 摄像头移动
                    this.getAreas({
                        roi: this.ipcmove.roi
                    });
                }
                else if (this.getIndex == 17) {
                    // 睡岗
                    this.getAreas({
                        roi: this.sleep.roi
                    });
                }
                else if (this.getIndex == 18) {
                    // 广告张贴
                    this.getAreas({
                        roi: this.adPost.roi
                    });
                }
                else if (this.getIndex == 19) {
                    // 越界侦测
                    this.outOfBounds.area[this.outOfBounds.id - 1].outAreas = JSON.parse(JSON.stringify(this.outOfBounds.area[this.outOfBounds.id - 1].tripWire));
                    if (Object.prototype.toString.call(this.outOfBounds.area[this.outOfBounds.id - 1].outAreas) === "[object Object]") {
                        this.outOfBounds.area[this.outOfBounds.id - 1].outAreas = Object.entries(this.outOfBounds.area[this.outOfBounds.id - 1].outAreas);
                    }
                    this.getOutArea();
                }
                else if (this.getIndex == 20) {
                    // 进入区域侦测
                    this.getAreas({
                        roi: this.enterArea.roi
                    });
                }
                else if (this.getIndex == 21) {
                    // 离开区域侦测
                    this.getAreas({
                        roi: this.leaveArea.roi
                    });
                }
                else if (this.getIndex == 22) {
                    // 玩手机
                    this.getAreas({
                        roi: this.playPhone.roi
                    });
                }
                else if (this.getIndex == 23) {
                    // 抢包
                    this.getAreas({
                        roi: this.grab.roi
                    });
                }
                else if (this.getIndex == 24) {
                    // 吸烟
                    this.getAreas({
                        roi: this.smoking.roi
                    });
                }
                else if (this.getIndex == 25) {
                    // ATM柜台遗留物检查
                    this.getAreas({
                        roi: this.atmRemain.roi
                    });
                }
                else if (this.getIndex == 26) {
                    // 坐姿不正
                    this.getAreas({
                        roi: this.recline.roi
                    });
                }
                else if (this.getIndex == 27) {
                    // 人脸聚类
                    this.getAreas({
                        roi: this.faceClustering.roi,
                    });
                }
                else if (this.getIndex == 28) {
                    // 人体挟持
                    this.getAreas({
                        roi: this.hijack.roi,
                    });
                }
                else if (this.getIndex == 30) {
                    // 箱包交接
                    this.getAreas({
                        roi: this.swapBag.roi,
                    });
                }
                else if (this.getIndex == 31) {
                    // 一日两碰箱
                    this.getAreas({
                        roi: this.touchBag.roi,
                    });
                }
                else if (this.getIndex == 29) {
                    // 绊线
                    this.flowAreasNew = JSON.parse(JSON.stringify(this.flowAreas));
                    if (Object.prototype.toString.call(this.flowAreasNew) === "[object Object]") {
                        this.flowAreasNew = Object.entries(this.flowAreasNew);
                    }
                    this.getTripArea();
                }
            });
        },
        // this.getIndex == 0-16
        getAreas(val) {
            this._areas = val;
            if (this._areas.roi) {
                if (this._areas.roi.length == 1 && this._areas.roi[0]?.length == 0) {
                    this._areas.roi = [];
                }
                for (let i = 0; i < this._areas.roi.length; i++) {
                    this._areas.roi[i].forEach(item => {
                        item.x = item.x / 2;
                        item.y = item.y / 2;
                    });
                }
            }
            if (this._areas.screen) {
                if (this._areas.screen.length == 1 && this._areas.screen[0]?.length == 0) {
                    this._areas.screen = [];
                }
                for (let i = 0; i < this._areas.screen.length; i++) {
                    this._areas.screen[i].forEach(item => {
                        item.x = item.x / 2;
                        item.y = item.y / 2;
                    });
                }
            }
            if (this._areas.keyboard) {
                if (this._areas.keyboard.length == 1 && this._areas.keyboard[0]?.length == 0) {
                    this._areas.keyboard = [];
                }
                for (let i = 0; i < this._areas.keyboard.length; i++) {
                    this._areas.keyboard[i].forEach(item => {
                        item.x = item.x / 2;
                        item.y = item.y / 2;
                    });
                }
            }
            if (this._areas.stm) {
                if (this._areas.stm.length == 1 && this._areas.stm[0]?.length == 0) {
                    this._areas.stm = [];
                }
                for (let i = 0; i < this._areas.stm.length; i++) {
                    this._areas.stm[i].forEach(item => {
                        item.x = item.x / 2;
                        item.y = item.y / 2;
                    });
                }
            }
            this.initCanvasDraw();
        },
        initCanvasDraw() {
            this.drawCanvasOption({
                roi: this._areas.roi,
                screen: this._areas.screen,
                keyboard: this._areas.keyboard,
                stm: this._areas.stm,
            });
        },
        drawCanvasOption(params) {
            let self = this;
            let newParam = {};
            let roiArray = [], screenArray = [], keyboardArray = [], stmArray = [];
            newParam = self.objectCopy(params);
            if (!!newParam.roi && newParam.roi.length > 0) {
                for (let i = 0; i < newParam.roi.length; i++) {
                    let roixxx = self.scalingProperty(newParam.roi[i]);
                    roiArray.push(roixxx);
                }
                newParam.roi = roiArray;
            }
            if (!!newParam.screen && newParam.screen.length > 0) {
                for (let i = 0; i < newParam.screen.length; i++) {
                    let screenxxx = self.scalingProperty(newParam.screen[i]);
                    screenArray.push(screenxxx);
                }
                newParam.screen = screenArray;
            }
            if (!!newParam.keyboard && newParam.keyboard.length > 0) {
                for (let i = 0; i < newParam.keyboard.length; i++) {
                    let keyboardxxx = self.scalingProperty(newParam.keyboard[i]);
                    keyboardArray.push(keyboardxxx);
                }
                newParam.keyboard = keyboardArray;
            }
            if (!!newParam.stm && newParam.stm.length > 0) {
                for (let i = 0; i < newParam.stm.length; i++) {
                    let stmxxx = self.scalingProperty(newParam.stm[i]);
                    stmArray.push(stmxxx);
                }
                newParam.stm = stmArray;
            }
            new Draw({
                canvas: "canvas",
                button: {
                    drawArea: "drawArea",
                    drawArea1: "drawArea1",
                    drawArea2: "drawArea2",
                    drawArea3: "drawArea3",
                    clearAll: "clearAll"
                },
                callBack: function (res) {
                    self.roisCaptrue = [];
                    for (let i = 0; i < res.capturearea.length; i++) {
                        let roisCaptrue0 = self.arrayCopy(res.capturearea[i]);
                        roisCaptrue0.map(item => {
                            item.x = item.x;
                            item.y = item.y;
                        });
                        self.roisCaptrue.push(roisCaptrue0);
                    }
                    let roisCaptrue = self.roisCaptrue;
                    self.roisScreen = [];
                    for (let i = 0; i < res.screenarea.length; i++) {
                        let roisScreen0 = self.arrayCopy(res.screenarea[i]);
                        roisScreen0.map(item => {
                            item.x = item.x;
                            item.y = item.y;
                        });
                        self.roisScreen.push(roisScreen0);
                    }
                    let roisScreen = self.roisScreen;
                    self.roisKeyboard = [];
                    for (let i = 0; i < res.keyboardarea.length; i++) {
                        let roisKeyboard0 = self.arrayCopy(res.keyboardarea[i]);
                        roisKeyboard0.map(item => {
                            item.x = item.x;
                            item.y = item.y;
                        });
                        self.roisKeyboard.push(roisKeyboard0);
                    }
                    let roisKeyboard = self.roisKeyboard;
                    self.roisStm = [];
                    for (let i = 0; i < res.stmarea.length; i++) {
                        let roisStm0 = self.arrayCopy(res.stmarea[i]);
                        roisStm0.map(item => {
                            item.x = item.x;
                            item.y = item.y;
                        });
                        self.roisStm.push(roisStm0);
                    }
                    let roisStm = self.roisStm;
                    let aaaArray = [];
                    if (!!roisCaptrue && roisCaptrue.length > 0) {
                        for (let i = 0; i < roisCaptrue.length; i++) {
                            let aaa = self.scalingProperty(roisCaptrue[i]);
                            aaaArray.push(aaa);
                        }
                        roisCaptrue = aaaArray;
                    }
                    let bbbArray = [];
                    if (!!roisScreen && roisScreen.length > 0) {
                        for (let i = 0; i < roisScreen.length; i++) {
                            let bbb = self.scalingProperty(roisScreen[i]);
                            bbbArray.push(bbb);
                        }
                        roisScreen = bbbArray;
                    }
                    let cccArray = [];
                    if (!!roisKeyboard && roisKeyboard.length > 0) {
                        for (let i = 0; i < roisKeyboard.length; i++) {
                            let bbb = self.scalingProperty(roisKeyboard[i]);
                            cccArray.push(bbb);
                        }
                        roisKeyboard = cccArray;
                    }
                    let dddArray = [];
                    if (!!roisStm && roisStm.length > 0) {
                        for (let i = 0; i < roisStm.length; i++) {
                            let bbb = self.scalingProperty(roisStm[i]);
                            dddArray.push(bbb);
                        }
                        roisStm = dddArray;
                    }
                    if (self.getIndex == 0) {
                        self.face.roi = roisCaptrue;
                    }
                    else if (self.getIndex == 1) {
                        self.pedestrian.roi = roisCaptrue;
                    }
                    else if (self.getIndex == 2) {
                        self.vehicle.roi = roisCaptrue;
                    }
                    else if (self.getIndex == 3) {
                        self.nonmotor.roi = roisCaptrue;
                    }
                    else if (self.getIndex == 4) {
                        // 拍屏
                        self.shoot.roi = roisCaptrue;
                    }
                    else if (self.getIndex == 5) {
                        // 倒地
                        self.fall.roi = roisCaptrue;
                    }
                    else if (self.getIndex == 6) {
                        // 临时离柜
                        self.cash.roi = roisCaptrue;
                    }
                    else if (self.getIndex == 7) {
                        // 烟雾
                        self.smogFire.roi = roisCaptrue;
                    }
                    else if (self.getIndex == 8) {
                        // 打斗
                        self.struggle.roi = roisCaptrue;
                    }
                    else if (self.getIndex == 9) {
                        // 数人
                        self.skeleton.roi = roisCaptrue;
                    }
                    else if (self.getIndex == 10) {
                        // 快速移动
                        self.fastMove.roi = roisCaptrue;
                    }
                    else if (self.getIndex == 11) {
                        // 遗留物
                        self.remain.roi = roisCaptrue;
                    }
                    else if (self.getIndex == 12) {
                        // 特殊人群
                        self.specialPed.roi = roisCaptrue;
                    }
                    else if (self.getIndex == 13) {
                        // 代客操作
                        self.stm.roi = roisCaptrue;
                        self.stm.screen = roisScreen;
                        self.stm.keyboard = roisKeyboard;
                        self.stm.stm = roisStm;
                    }
                    else if (self.getIndex == 14) {
                        // 徘徊
                        self.hover.roi = roisCaptrue;
                    }
                    else if (self.getIndex == 15) {
                        // 箱包
                        self.bag.roi = roisCaptrue;
                    }
                    else if (self.getIndex == 16) {
                        // 摄像头移动
                        self.ipcmove.roi = roisCaptrue;
                    }
                    else if (self.getIndex == 25) {
                        // ATM柜台遗留物检查
                        self.atmRemain.roi = roisCaptrue;
                    }
                    else if (self.getIndex == 26) {
                        // 坐姿不正
                        self.recline.roi = roisCaptrue;
                    }
                    else if (self.getIndex == 17) {
                        // 睡岗
                        self.sleep.roi = roisCaptrue;
                    }
                    else if (self.getIndex == 18) {
                        // 广告张贴
                        self.adPost.roi = roisCaptrue;
                    }
                    else if (self.getIndex == 19) {
                        // 越界侦测
                        // self.adPost.roi = roisCaptrue
                        this.outOfBounds.id = 1;
                    }
                    else if (self.getIndex == 20) {
                        // 进入区域侦测
                        self.enterArea.roi = roisCaptrue;
                    }
                    else if (self.getIndex == 21) {
                        // 离开区域侦测
                        self.leaveArea.roi = roisCaptrue;
                    }
                    else if (self.getIndex == 22) {
                        // 玩手机
                        self.playPhone.roi = roisCaptrue;
                    }
                    else if (self.getIndex == 23) {
                        // 抢包
                        self.grab.roi = roisCaptrue;
                    }
                    else if (self.getIndex == 24) {
                        // 吸烟
                        self.smoking.roi = roisCaptrue;
                    }
                    else if (self.getIndex == 27) {
                        // 人脸聚类
                        self.faceClustering.roi = roisCaptrue;
                    }
                    else if (self.getIndex == 28) {
                        // 人体挟持
                        self.hijack.roi = roisCaptrue;
                    }
                    else if (self.getIndex == 30) {
                        // 箱包交接
                        self.swapBag.roi = roisCaptrue;
                    }
                    else if (self.getIndex == 31) {
                        // 一日两碰箱
                        self.touchBag.roi = roisCaptrue;
                    }
                }
            }).init(newParam, self);
        },
        // 监听算法列表展示
        changeAlgoList(item) {
          // 切换新通道时删除以前的校验
          if (this.getIndex != 29) {
            this.$refs["form"].clearValidate();
          }
          // this.getIndex为当前算法id
          this.algoList.forEach(item => {
            if(item.index == this.getIndex) {
              this.enabled = item.enabled;
              return
            }
          })
            // 重新获取算法开关
            this.getAlogEnable();
            // 获取使用当前算法的通道并显示在右下角
            this.getAlgoNum();
            // 监听通道列表展示算法列表及详情，second表示当前通道非首次默认的算法
            this.changeChannel(this.algorithm.channelId, "second");
        },
        // 重新获取算法开关
        getAlogEnable() {
            getChannelDet(this.algorithm.channelId).then(res => {
              this.algoParams = res.data.data.config
                this.assignValue(res.data.data.config);
                // 人脸 this.getIndex == 0
                this.face = res.data.data.config.face
                    ? res.data.data.config.face
                    : {};
                this.face.faceMinSize = this.face.bbox.minSize || "";
                this.face.faceMaxSize = this.face.bbox.maxSize || "";
                // this.enabled = this.face.enabled
                // 行人 this.getIndex == 1
                this.pedestrian = res.data.data.config.pedestrian
                    ? res.data.data.config.pedestrian
                    : {};
                this.pedestrian.pedestrianMinSize = this.pedestrian.bbox.minSize || "";
                this.pedestrian.pedestrianMaxSize = this.pedestrian.bbox.maxSize || "";
                // 机动车 this.getIndex == 2
                this.vehicle = res.data.data.config.vehicle
                    ? res.data.data.config.vehicle
                    : {};
                this.vehicle.vehicleMinSize = this.vehicle.bbox.minSize || "";
                this.vehicle.vehicleMaxSize = this.vehicle.bbox.maxSize || "";
                // 非机动车 this.getIndex == 3
                this.nonmotor = res.data.data.config.nonmotor
                    ? res.data.data.config.nonmotor
                    : {};
                this.nonmotor.nonmotorMinSize = this.nonmotor.bbox.minSize || "";
                this.nonmotor.nonmotorMaxSize = this.nonmotor.bbox.maxSize || "";
                // 拍屏 this.getIndex == 4
                this.shoot = res.data.data.config.shoot
                    ? res.data.data.config.shoot
                    : {};
                // 倒地 this.getIndex == 5
                this.fall = res.data.data.config.fall
                    ? res.data.data.config.fall
                    : {};
                // 临时离柜 this.getIndex == 6
                this.cash = res.data.data.config.cash
                    ? res.data.data.config.cash
                    : {};
                // 烟雾 this.getIndex == 7
                this.smogFire = res.data.data.config.smogFire
                    ? res.data.data.config.smogFire
                    : {};
                this.smogFire.smogFireMinSize = this.smogFire.bbox?.minSize || "";
                this.smogFire.smogFireMaxSize = this.smogFire.bbox?.maxSize || "";
                // 打斗 this.getIndex == 8
                this.struggle = res.data.data.config.struggle
                    ? res.data.data.config.struggle
                    : {};
                // 数人 this.getIndex == 9
                this.skeleton = res.data.data.config.skeleton
                    ? res.data.data.config.skeleton
                    : {};
                // 快速移动 this.getIndex == 10
                this.fastMove = res.data.data.config.fastMove
                    ? res.data.data.config.fastMove
                    : {};
                // 遗留物 this.getIndex == 11
                this.remain = res.data.data.config.remain
                    ? res.data.data.config.remain
                    : {};
                // 特殊人群 this.getIndex == 12
                this.specialPed = res.data.data.config.specialPed
                    ? res.data.data.config.specialPed
                    : {};
                // 代客操作 this.getIndex == 13
                this.stm = res.data.data.config.stm
                    ? res.data.data.config.stm
                    : {};
                // 徘徊 this.getIndex == 14
                this.hover = res.data.data.config.hover
                    ? res.data.data.config.hover
                    : {};
                // 箱包 this.getIndex == 15
                this.bag = res.data.data.config.bag
                    ? res.data.data.config.bag
                    : {};
                // 摄像头移动 this.getIndex == 16
                this.ipcmove = res.data.data.config.ipcmove
                    ? res.data.data.config.ipcmove
                    : {};
                this.ipcmove.ipcmove_threshold = res.data.data.config.ipcmove ? res.data.data.config.ipcmove.ipcmove_threshold : "";
                // 睡岗 17
                this.sleep = res.data.data.config.sleep
                    ? res.data.data.config.sleep
                    : {};
                // 广告张贴 18
                this.adPost = res.data.data.config.adPost
                    ? res.data.data.config.adPost
                    : {};
                // 越界侦测 this.getIndex == 19
                this.outOfBounds.area = res.data.data.config.outOfBounds.area
                    ? res.data.data.config.outOfBounds.area
                    : [];
                this.outOfBounds.enabled = res.data.data.config.outOfBounds.enabled
                    ? res.data.data.config.outOfBounds.enabled
                    : false;
                for (let j = 0; j < 4; j++) {
                    this.outOfBounds.area[j].outOfBoundsMinSize = this.outOfBounds.area[j].bbox?.minSize || "";
                    this.outOfBounds.area[j].outOfBoundsMaxSize = this.outOfBounds.area[j].bbox?.maxSize || "";
                }
                this.outOfBounds.area[this.outOfBounds.id - 1].outAreas = this.outOfBounds.area[this.outOfBounds.id - 1].tripWire || [];
                this.outOfBounds.area[this.outOfBounds.id - 1].outPoints = this.outOfBounds.area[this.outOfBounds.id - 1].outAreas / 2 || [];
                // 进入区域侦测 this.getIndex == 20
                this.enterArea = res.data.data.config.enterArea
                    ? res.data.data.config.enterArea
                    : {};
                this.enterArea.enterAreaMinSize = this.enterArea.bbox?.minSize || "";
                this.enterArea.enterAreaMaxSize = this.enterArea.bbox?.maxSize || "";
                // 离开区域侦测 this.getIndex == 21
                this.leaveArea = res.data.data.config.leaveArea
                    ? res.data.data.config.leaveArea
                    : {};
                this.leaveArea.leaveAreaMinSize = this.leaveArea.bbox?.minSize || "";
                this.leaveArea.leaveAreaMaxSize = this.leaveArea.bbox?.maxSize || "";
                // 玩手机 this.getIndex == 22
                this.playPhone = res.data.data.config.playPhone
                    ? res.data.data.config.playPhone
                    : {};
                // 抢包 this.getIndex == 23
                this.grab = res.data.data.config.grab
                    ? res.data.data.config.grab
                    : {};
                // 吸烟 this.getIndex == 24
                this.smoking = res.data.data.config.smoking
                    ? res.data.data.config.smoking
                    : {};
                // ATM柜台遗留物检测 this.getIndex == 25
                this.atmRemain = res.data.data.config.atmRemain
                    ? res.data.data.config.atmRemain
                    : {};
                // 坐姿不雅 this.getIndex == 26
                this.recline = res.data.data.config.recline
                    ? res.data.data.config.recline
                    : {};
                // 人脸聚类 this.getIndex == 27
                this.faceClustering = res.data.data.config.faceClustering
                    ? res.data.data.config.faceClustering
                    : {};
                this.faceClustering.faceClusteringMinSize = this.faceClustering.bbox.minSize || "";
                this.faceClustering.faceClusteringMaxSize = this.faceClustering.bbox.maxSize || "";
                // 人体挟持 this.getIndex == 28
                this.hijack = res.data.data.config.hijack
                    ? res.data.data.config.hijack
                    : {};
                // 箱包交接 this.getIndex == 30
                this.swapBag = res.data.data.config.swapBag
                    ? res.data.data.config.swapBag
                    : {};
                // 一日两碰箱 this.getIndex == 31
                this.touchBag = res.data.data.config.touchBag
                    ? res.data.data.config.touchBag
                    : {};
                // 绊线 this.getIndex == 29
                this.flowAreas = res.data.data.flowAreas
                    ? res.data.data.flowAreas
                    : {};
                // 循环遍历当前通道的算法开关
                let flag = 0;
                for (let i = 0; i < this.algoList.length; i++) {
                    if (this.algoList[i].index == this.getIndex) {
                        flag = i;
                        this.flagIndex = i;
                    }
                    this.algoList[i].index === 0 ? this.algoList[i].enabled = this.face.enabled : "";
                    this.algoList[i].index === 1 ? this.algoList[i].enabled = this.pedestrian.enabled : "";
                    this.algoList[i].index === 2 ? this.algoList[i].enabled = this.vehicle.enabled : "";
                    this.algoList[i].index === 3 ? this.algoList[i].enabled = this.nonmotor.enabled : "";
                    this.algoList[i].index === 4 ? this.algoList[i].enabled = this.shoot.enabled : "";
                    this.algoList[i].index === 5 ? this.algoList[i].enabled = this.fall.enabled : "";
                    this.algoList[i].index === 6 ? this.algoList[i].enabled = this.cash.enabled : "";
                    this.algoList[i].index === 7 ? this.algoList[i].enabled = this.smogFire.enabled : "";
                    this.algoList[i].index === 8 ? this.algoList[i].enabled = this.struggle.enabled : "";
                    this.algoList[i].index === 9 ? this.algoList[i].enabled = this.skeleton.enabled : "";
                    this.algoList[i].index === 10 ? this.algoList[i].enabled = this.fastMove.enabled : "";
                    this.algoList[i].index === 11 ? this.algoList[i].enabled = this.remain.enabled : "";
                    this.algoList[i].index === 12 ? this.algoList[i].enabled = this.specialPed.enabled : "";
                    this.algoList[i].index === 13 ? this.algoList[i].enabled = this.stm.enabled : "";
                    this.algoList[i].index === 14 ? this.algoList[i].enabled = this.hover.enabled : "";
                    this.algoList[i].index === 15 ? this.algoList[i].enabled = this.bag.enabled : "";
                    this.algoList[i].index === 16 ? this.algoList[i].enabled = this.ipcmove.enabled : "";
                    this.algoList[i].index === 17 ? this.algoList[i].enabled = this.sleep.enabled : "";
                    this.algoList[i].index === 18 ? this.algoList[i].enabled = this.adPost.enabled : "";
                    this.algoList[i].index === 19 ? this.algoList[i].enabled = this.outOfBounds.enabled : "";
                    this.algoList[i].index === 20 ? this.algoList[i].enabled = this.enterArea.enabled : "";
                    this.algoList[i].index === 21 ? this.algoList[i].enabled = this.leaveArea.enabled : "";
                    this.algoList[i].index === 22 ? this.algoList[i].enabled = this.playPhone.enabled : "";
                    this.algoList[i].index === 23 ? this.algoList[i].enabled = this.grab.enabled : "";
                    this.algoList[i].index === 24 ? this.algoList[i].enabled = this.smoking.enabled : "";
                    this.algoList[i].index === 25 ? this.algoList[i].enabled = this.atmRemain.enabled : "";
                    this.algoList[i].index === 26 ? this.algoList[i].enabled = this.recline.enabled : "";
                    this.algoList[i].index === 27 ? this.algoList[i].enabled = this.faceClustering.enabled : "";
                    this.algoList[i].index === 28 ? this.algoList[i].enabled = this.hijack.enabled : "";
                    this.algoList[i].index === 29 ? this.algoList[i].enabled = (res.data.data.flowAreas && res.data.data.flowAreas.length > 0 ? true : false) : "";
                    this.algoList[i].index === 30 ? this.algoList[i].enabled = this.swapBag.enabled : "";
                    this.algoList[i].index === 31 ? this.algoList[i].enabled = this.touchBag.enabled : "";
                }
                this.enabled = this.getIndex != 29 ? this.algoList[flag].enabled : this.algoList[27].enabled;
            });
        },
        // 获取使用当前算法的通道并显示在右下角
        getAlgoNum() {
            getChannels().then(res => {
                this.tableData = res.data.data.filter(item => (item.model == "FTP" || item.model == "HTTP") ? item : item.online);
                this.algorithmNum = [];
                this.tableData.forEach((item, index) => {
                    if ((this.getIndex == 0 && item.config.face?.enabled) || (this.getIndex == 1 && item.config.pedestrian?.enabled)
                        || (this.getIndex == 2 && item.config.vehicle?.enabled) || (this.getIndex == 3 && item.config.nonmotor?.enabled)
                        || (this.getIndex == 4 && item.config.shoot?.enabled) || (this.getIndex == 5 && item.config.fall?.enabled)
                        || (this.getIndex == 6 && item.config.cash?.enabled) || (this.getIndex == 7 && item.config.smogFire?.enabled)
                        || (this.getIndex == 8 && item.config.struggle?.enabled) || (this.getIndex == 9 && item.config.skeleton?.enabled)
                        || (this.getIndex == 10 && item.config.fastMove?.enabled) || (this.getIndex == 11 && item.config.remain?.enabled)
                        || (this.getIndex == 12 && item.config.specialPed?.enabled) || (this.getIndex == 13 && item.config.stm?.enabled)
                        || (this.getIndex == 14 && item.config.hover?.enabled) || (this.getIndex == 15 && item.config.bag?.enabled)
                        || (this.getIndex == 16 && item.config.ipcmove?.enabled)
                        || (this.getIndex == 17 && item.config.sleep?.enabled) || (this.getIndex == 18 && item.config.adPost?.enabled)
                        || (this.getIndex == 19 && item.config.outOfBounds?.enabled) || (this.getIndex == 20 && item.config.enterArea?.enabled)
                        || (this.getIndex == 21 && item.config.leaveArea?.enabled) || (this.getIndex == 22 && item.config.playPhone?.enabled)
                        || (this.getIndex == 23 && item.config.grab?.enabled) || (this.getIndex == 24 && item.config.smoking?.enabled)
                        || (this.getIndex == 25 && item.config.atmRemain?.enabled) || (this.getIndex == 26 && item.config.recline?.enabled)
                        || (this.getIndex == 27 && item.config.faceClustering?.enabled) || (this.getIndex == 28 && item.config.hijack?.enabled)
                        || (this.getIndex == 30 && item.config.swapBag?.enabled) || (this.getIndex == 31 && item.config.touchBag?.enabled)) {
                        this.algorithmNum.push({
                            name: this.tableData[index].name,
                            url: this.tableData[index].ip
                        });
                    }
                });
            });
        },
        // 工具
        getRoiBase64(param) {
            if (!!param) {
                getPicSize(this.roiBase64).then(img => {
                    this.canvasSize.width = WIDTH_DRAW;
                    this.canvasSize.height = WIDTH_DRAW * CANVAS_RATIO;
                });
            }
        },
        objectCopy(oldobj) {
            let newobj = {};
            for (let key in oldobj) {
                if (oldobj.hasOwnProperty(key)) {
                    if (Object.prototype.toString.call(oldobj[key]) === "[Object object]") {
                        let obj = {};
                        for (let mm in oldobj[key]) {
                            if (oldobj[key].hasOwnProperty(mm)) {
                                obj[mm] = oldobj[key][mm];
                            }
                        }
                        newobj[key] = obj;
                    }
                    else {
                        newobj[key] = oldobj[key];
                    }
                }
            }
            return newobj;
        },
        scalingProperty(params, rota) {
            for (let i = 0, l = params.length; i < l; i++) {
                let obj = params[i];
                for (let key in obj) {
                    if (obj.hasOwnProperty(key)) {
                        obj[key] = Math.round(obj[key]);
                    }
                }
            }
            return params;
        },
        arrayCopy(oldarr) {
            let newarr = [];
            for (let i = 0, l = oldarr.length; i < l; i++) {
                let obj = {};
                for (let key in oldarr[i]) {
                    if (oldarr[i].hasOwnProperty(key)) {
                        obj[key] = oldarr[i][key];
                    }
                }
                newarr.push(obj);
            }
            return newarr;
        },
        /*************************************绊线**********************************************/
        // 画线
        drawLine(ctx, p, begin, end, color) {
            // 画端点的圆
            ctx.clearRect(0, 0, 1080, 1920);
            ctx.fillStyle = "#008000";
            ctx.beginPath();
            ctx.arc(p[begin].x, p[begin].y, 5, 0, 3 * Math.PI);
            ctx.fill();
            ctx.closePath();
            // 画边框颜色
            ctx.strokeStyle = color;
            ctx.beginPath();
            ctx.moveTo(p[begin].x, p[begin].y);
            ctx.lineTo(p[end].x, p[end].y);
            ctx.stroke();
            ctx.closePath();
        },
        drawArrow(ctx, fromX, fromY, toX, toY, theta, headlen, width, color) {
            theta = typeof (theta) != "undefined" ? theta : 30;
            headlen = typeof (theta) != "undefined" ? headlen : 10;
            width = typeof (width) != "undefined" ? width : 1;
            color = typeof (color) != "color" ? color : "#000";
            // 计算各角度和对应的P2,P3坐标
            var angle = Math.atan2(fromY - toY, fromX - toX) * 180 / Math.PI, angle1 = (angle + theta) * Math.PI / 180, angle2 = (angle - theta) * Math.PI / 180, topX = headlen * Math.cos(angle1), topY = headlen * Math.sin(angle1), botX = headlen * Math.cos(angle2), botY = headlen * Math.sin(angle2);
            ctx.save();
            ctx.beginPath();
            var arrowX = fromX - topX, arrowY = fromY - topY;
            ctx.moveTo(arrowX, arrowY);
            ctx.moveTo(fromX, fromY);
            ctx.lineTo(toX, toY);
            arrowX = toX + topX;
            arrowY = toY + topY;
            ctx.moveTo(arrowX, arrowY);
            ctx.lineTo(toX, toY);
            arrowX = toX + botX;
            arrowY = toY + botY;
            ctx.lineTo(arrowX, arrowY);
            ctx.strokeStyle = color;
            ctx.lineWidth = width;
            ctx.stroke();
            ctx.restore();
        },
        drawTripLine(ctx, p, type, lineColor, arcColor) {
            ctx.clearRect(0, 0, 1080, 1920);
            // 画端点的圆
            ctx.fillStyle = arcColor;
            ctx.beginPath();
            ctx.arc(p[0].x, p[0].y, 5, 0, 3 * Math.PI);
            ctx.fill();
            ctx.closePath();
            // 画边框颜色
            ctx.strokeStyle = lineColor;
            ctx.beginPath();
            ctx.moveTo(p[0].x, p[0].y);
            ctx.lineTo(p[1].x, p[1].y);
            ctx.stroke();
            ctx.closePath();
            // 画端点的圆
            ctx.fillStyle = arcColor;
            ctx.beginPath();
            ctx.arc(p[1].x, p[1].y, 5, 0, 3 * Math.PI);
            ctx.fill();
            ctx.closePath();
            // 画箭头
            const midX = p[0].x + (p[1].x - p[0].x) / 2;
            const midY = p[0].y + (p[1].y - p[0].y) / 2;
            const lVec = { x: p[1].x - p[0].x, y: p[1].y - p[0].y };
            // nVec法相量 nVecLen法相量长度
            var nVec = { x: lVec.y, y: -lVec.x };
            let nVecLen = Math.sqrt(Math.pow(nVec.x, 2) + Math.pow(nVec.y, 2)) / 25;
            nVec.x /= nVecLen;
            nVec.y /= nVecLen;
            if (type === 0) {
                this.drawArrow(ctx, midX, midY, midX + nVec.x, midY + nVec.y, 30, 10, 2, "#17FFFA");
                this.drawArrow(ctx, midX, midY, midX - nVec.x, midY - nVec.y, 30, 10, 2, "#17FFFA");
            }
            else if (type === 1) {
                this.drawArrow(ctx, midX, midY, midX - nVec.x, midY - nVec.y, 30, 10, 2, "#17FFFA");
            }
            else if (type === 2) {
                this.drawArrow(ctx, midX, midY, midX + nVec.x, midY + nVec.y, 30, 10, 2, "#17FFFA");
            }
        },
        drawOutLine(ctx, p, type, lineColor, arcColor) {
            ctx.clearRect(0, 0, 1080, 1920);
            // 画端点的圆
            ctx.fillStyle = arcColor;
            ctx.beginPath();
            ctx.arc(p[0].x, p[0].y, 5, 0, 3 * Math.PI);
            ctx.fill();
            ctx.closePath();
            // 画边框颜色
            ctx.strokeStyle = lineColor;
            ctx.beginPath();
            ctx.moveTo(p[0].x, p[0].y);
            ctx.lineTo(p[1].x, p[1].y);
            ctx.stroke();
            ctx.closePath();
            // 画端点的圆
            ctx.fillStyle = arcColor;
            ctx.beginPath();
            ctx.arc(p[1].x, p[1].y, 5, 0, 3 * Math.PI);
            ctx.fill();
            ctx.closePath();
            // 画箭头
            const midX = p[0].x + (p[1].x - p[0].x) / 2;
            const midY = p[0].y + (p[1].y - p[0].y) / 2;
            const lVec = { x: p[1].x - p[0].x, y: p[1].y - p[0].y };
            // nVec法相量 nVecLen法相量长度
            var nVec = { x: lVec.y, y: -lVec.x };
            let nVecLen = Math.sqrt(Math.pow(nVec.x, 2) + Math.pow(nVec.y, 2)) / 25;
            let tVex = nVecLen > 6 ? lVec.y / 5 : nVecLen > 3 ? lVec.y / 3 : lVec.y / 2;
            let tVey = nVecLen > 6 ? lVec.x / 5 : nVecLen > 3 ? lVec.x / 3 : lVec.x / 2;
            nVec.x /= nVecLen;
            nVec.y /= nVecLen;
            if (type === 3) {
                this.drawArrow(ctx, midX, midY, midX + nVec.x, midY + nVec.y, 30, 10, 2, "#17FFFA");
                this.drawArrow(ctx, midX, midY, midX - nVec.x, midY - nVec.y, 30, 10, 2, "#17FFFA");
                ctx.font = "20px Arial";
                ctx.fillStyle = "red";
                ctx.fillText("A", midX + tVex, midY - tVey);
                ctx.fillText("B", midX - tVex, midY + tVey);
            }
            else if (type === 1) {
                this.drawArrow(ctx, midX, midY, midX - nVec.x, midY - nVec.y, 30, 10, 2, "#17FFFA");
                ctx.font = "20px Arial";
                ctx.fillStyle = "red";
                ctx.fillText("B", midX - tVex, midY + tVey);
                ctx.fillText("A", midX + tVex, midY - tVey);
            }
            else if (type === 2) {
                this.drawArrow(ctx, midX, midY, midX + nVec.x, midY + nVec.y, 30, 10, 2, "#17FFFA");
                ctx.font = "20px Arial";
                ctx.fillStyle = "red";
                ctx.fillText("A", midX + tVex, midY - tVey);
                ctx.fillText("B", midX - tVex, midY + tVey);
            }
        },
        // 获取Trip roi数据
        getTripArea() {
            var c = document.getElementById("canvas5");
            var ctx = c.getContext("2d");
            ctx.clearRect(0, 0, 1080, 1920);
            // 赋值id, direction, sensitivity
            if (!this.flowAreasNew || this.flowAreasNew.length === 0 || !this.flowAreasNew.length) {
                this.curTrip.id = 1;
                this.curTrip.direction = 1;
                this.curTrip.sensitivity = 60;
            }
            else {
                this.flowAreasNew.sort((a, b) => a.id - b.id);
                const { id, direction, sensitivity, start, end } = this.flowAreasNew[0];
                this.curTrip = { id, direction, sensitivity };
                // 绘制tripRoi
                this.curTripPoints = [{ x: start.x / 2, y: start.y / 2 }, { x: end.x / 2, y: end.y / 2 }];
                this.drawTripLine(ctx, this.curTripPoints, direction, "#0AD129", "#008000");
                this.createTripDraw(true);
            }
        },
        getOutArea() {
            var c = document.getElementById("canvas5");
            var ctx = c.getContext("2d");
            ctx.clearRect(0, 0, 1080, 1920);
            // 赋值id, direction, sensitivity
            if (!this.outOfBounds.area[this.outOfBounds.id - 1].outAreas || this.outOfBounds.area[this.outOfBounds.id - 1].outAreas.length === 0 || !this.outOfBounds.area[this.outOfBounds.id - 1].outAreas.length) {
                this.outOfBounds.id = 1;
                // this.outOfBounds.direction = 1
            }
            else {
                // for(let j = 0; j < 4; j++) {
                // this.outAreas.sort((a,b) => a.id - b.id)
                // for(let j = 0; j < 4; j++) {
                const start = this.outOfBounds.area[this.outOfBounds.id - 1].outAreas[0];
                const end = this.outOfBounds.area[this.outOfBounds.id - 1].outAreas[1];
                const direction = this.outOfBounds.area[this.outOfBounds.id - 1].direction;
                // this.curTrip = { id, direction, sensitivity }
                // 绘制tripRoi
                const outPoints = this.outOfBounds.area[this.outOfBounds.id - 1].outPoints = [{ x: start.x / 2, y: start.y / 2 }, { x: end.x / 2, y: end.y / 2 }];
                this.drawOutLine(ctx, outPoints, direction, "#0AD129", "#008000");
                this.createOutDraw(true);
                // }
                // }
            }
        },
        tripIdChange(e) {
            if (this.flowAreasNew.length === 0) {
                this.curTrip.id = e;
                this.curTrip.direction = 1;
                this.curTrip.sensitivity = 60;
            }
            else {
                let isTripExist = false;
                for (let i of this.flowAreasNew) {
                    if (i.id === e) {
                        isTripExist = true;
                        var c = document.getElementById("canvas5");
                        var ctx = c.getContext("2d");
                        const { id, direction, sensitivity, start, end } = i;
                        this.curTrip = { id, direction, sensitivity };
                        // 绘制tripRoi
                        this.curTripPoints = [{ x: start.x / 2, y: start.y / 2 }, { x: end.x / 2, y: end.y / 2 }];
                        this.drawTripLine(ctx, this.curTripPoints, direction, "#0AD129", "#008000");
                        this.createTripDraw(true);
                        break;
                    }
                }
                if (!isTripExist) {
                    this.curTrip.direction = 1;
                    this.curTrip.sensitivity = 60;
                    this.deleteTripDraw();
                }
            }
        },
        outIdChange(e) {
            this.deleteOutDraw();
            // if(this.outOfBounds.area[this.outOfBounds.id - 1].outAreas.length === 0) {
            this.outOfBounds.id = e;
            this.outOfBounds.area[this.outOfBounds.id - 1].outAreas = this.outOfBounds.area[this.outOfBounds.id - 1].tripWire || [];
            // this.getOutArea()
            // this.outOfBounds.direction = 1
            // } else {
            //   // this.getOutArea()
            //   let isOutExist = false
            // for(let i of this.outAreas) {
            // if(this.outOfBounds.id === e) {
            // isOutExist = true
            var c = document.getElementById("canvas5");
            var ctx = c.getContext("2d");
            const start = this.outOfBounds.area[this.outOfBounds.id - 1].outAreas[0];
            const end = this.outOfBounds.area[this.outOfBounds.id - 1].outAreas[1];
            const direction = this.outOfBounds.area[this.outOfBounds.id - 1].direction;
            // const { id, direction, start, end } = i
            // const { id, direction, start, end } = { id: e, direction: this.outOfBounds.direction, start: this.outAreas[e - 1].start || null, end: this.outAreas[e - 1].end || null}
            // this.curTrip = { id, direction, sensitivity }
            // 绘制tripRoi
            const outPoints = this.outOfBounds.area[this.outOfBounds.id - 1].outPoints = [{ x: start.x / 2, y: start.y / 2 }, { x: end.x / 2, y: end.y / 2 }];
            this.drawOutLine(ctx, outPoints, direction, "#0AD129", "#008000");
            this.createOutDraw(true);
            // break
            // }
            // }
            // if(!isOutExist) {
            //   // this.outOfBounds.direction = 1
            //   this.deleteOutDraw()
            // }
            // }
        },
        tripDirChange(e) {
            for (let i of this.flowAreasNew) {
                if (i.id === this.curTrip.id) {
                    i.direction = e;
                    var c = document.getElementById("canvas5");
                    var ctx = c.getContext("2d");
                    this.drawTripLine(ctx, this.curTripPoints, e, "#0AD129", "#008000");
                    break;
                }
            }
        },
        outDirChange(e) {
            // for(let i of this.outAreas) {
            // if(i.id === this.outOfBounds.id) {
            this.outOfBounds.area[this.outOfBounds.id - 1].direction = e;
            var c = document.getElementById("canvas5");
            var ctx = c.getContext("2d");
            this.drawOutLine(ctx, this.outOfBounds.area[this.outOfBounds.id - 1].outPoints, e, "#0AD129", "#008000");
            // break
            // }
            // }
        },
        tripSenChange(e) {
            for (let i of this.flowAreasNew) {
                if (i.id === this.curTrip.id) {
                    i.sensitivity = e;
                    break;
                }
            }
        },
        // 绘制绊线
        createTripDraw(isLoad) {
            if (!isLoad) {
                if (this.curTripPoints.length) {
                    this.$message.error("当前区域仅支持一条绊线, 请点击清空后重新绘制");
                    return;
                }
            }
            if (!this.flowAreasNew[this.curTrip.id - 1]) {
                this.flowAreasNew[this.curTrip.id - 1] = {
                    id: this.curTrip.id,
                    direction: this.curTrip.direction,
                    sensitivity: this.curTrip.sensitivity,
                    start: {},
                    end: {}
                };
            }
            var That = this;
            var c = document.getElementById("canvas5");
            var ctx = c.getContext("2d");
            var cvsClientRect = c.getBoundingClientRect();
            var timer;
            c.onmousedown = function (event) {
                // 是否在顶点上
                if (That.curTripPoints.length < 2) {
                    That.curTripPoints.push({ x: event.pageX - cvsClientRect.x, y: event.pageY - cvsClientRect.y });
                    timer = setTimeout(function () {
                        c.onmousemove = function (e) {
                            if (That.curTripPoints.length === 1) {
                                const p = [
                                    { x: That.curTripPoints[0].x, y: That.curTripPoints[0].y },
                                    { x: e.pageX - cvsClientRect.x, y: e.pageY - cvsClientRect.y }
                                ];
                                for (let i of That.flowAreasNew) {
                                    if (i.id === That.curTrip.id) {
                                        i.start = { x: Math.floor(That.curTripPoints[0].x) * 2, y: Math.floor(That.curTripPoints[0].y) * 2 };
                                        i.end = { x: Math.floor(e.pageX - cvsClientRect.x) * 2, y: Math.floor(e.pageY - cvsClientRect.y) * 2 };
                                        break;
                                    }
                                }
                                That.drawTripLine(ctx, p, That.curTrip.direction, "#0AD129", "#008000");
                            }
                        };
                        window.clearTimeout(timer);
                    }, 50);
                }
                else if (That.curTripPoints.length == 2) {
                    That.isOnRound = That.isOnRoundCap({ x: event.pageX - cvsClientRect.x, y: event.pageY - cvsClientRect.y }, That.curTripPoints);
                    if (That.isOnRound.result) {
                        timer = setTimeout(function () {
                            c.onmousemove = function (e) {
                                That.curTripPoints[That.isOnRound.index] = { x: e.pageX - cvsClientRect.x, y: e.pageY - cvsClientRect.y };
                                for (let i of That.flowAreasNew) {
                                    if (i.id === That.curTrip.id) {
                                        if (That.isOnRound.index === 0) {
                                            i.start = { x: Math.floor(e.pageX - cvsClientRect.x) * 2, y: Math.floor(e.pageY - cvsClientRect.y) * 2 };
                                        }
                                        else if (That.isOnRound.index === 1) {
                                            i.end = { x: Math.floor(e.pageX - cvsClientRect.x) * 2, y: Math.floor(e.pageY - cvsClientRect.y) * 2 };
                                        }
                                        break;
                                    }
                                }
                                That.drawTripLine(ctx, That.curTripPoints, That.curTrip.direction, "#0AD129", "#008000");
                            };
                            window.clearTimeout(timer);
                        }, 50);
                    }
                }
                // 鼠标抬起不让移动
                c.onmouseup = function (event) {
                    That.isOnRound = { result: false, index: null };
                };
            };
        },
        createOutDraw(isLoad) {
            if (!isLoad) {
                if (this.outOfBounds.area[this.outOfBounds.id - 1].outPoints.length) {
                    this.$message.error("当前区域仅支持一条绊线, 请点击清空后重新绘制");
                    return;
                }
            }
            // if(!this.outAreas[this.outOfBounds.id - 1]) {
            //   this.outAreas[this.outOfBounds.id - 1] = {
            //     id: this.outOfBounds.id,
            //     direction: this.outOfBounds.direction,
            //     start: {},
            //     end: {}
            //   }
            // }
            var That = this;
            var c = document.getElementById("canvas5");
            var ctx = c.getContext("2d");
            var cvsClientRect = c.getBoundingClientRect();
            var timer;
            c.onmousedown = function (event) {
                // 是否在顶点上
                // for(let j = 0; j < 4; j++){
                if (That.outOfBounds.area[That.outOfBounds.id - 1].outPoints.length < 2) {
                    That.outOfBounds.area[That.outOfBounds.id - 1].outPoints.push({ x: event.pageX - cvsClientRect.x, y: event.pageY - cvsClientRect.y });
                    timer = setTimeout(function () {
                        c.onmousemove = function (e) {
                            if (That.outOfBounds.area[That.outOfBounds.id - 1].outPoints.length === 1) {
                                const p = [
                                    { x: That.outOfBounds.area[That.outOfBounds.id - 1].outPoints[0].x, y: That.outOfBounds.area[That.outOfBounds.id - 1].outPoints[0].y },
                                    { x: e.pageX - cvsClientRect.x, y: e.pageY - cvsClientRect.y }
                                ];
                                // for(let i of That.outAreas) {
                                //   if(i.id === That.outOfBounds.id) {
                                That.outOfBounds.area[That.outOfBounds.id - 1].outAreas[0] = { x: Math.floor(That.outOfBounds.area[That.outOfBounds.id - 1].outPoints[0].x) * 2, y: Math.floor(That.outOfBounds.area[That.outOfBounds.id - 1].outPoints[0].y) * 2 };
                                That.outOfBounds.area[That.outOfBounds.id - 1].outAreas[1] = { x: Math.floor(e.pageX - cvsClientRect.x) * 2, y: Math.floor(e.pageY - cvsClientRect.y) * 2 };
                                // break
                                // }
                                // }
                                That.drawOutLine(ctx, p, That.outOfBounds.area[That.outOfBounds.id - 1].direction, "#0AD129", "#008000");
                            }
                        };
                        window.clearTimeout(timer);
                    }, 50);
                }
                else if (That.outOfBounds.area[That.outOfBounds.id - 1].outPoints.length == 2) {
                    That.isOnRound = That.isOnRoundCap({ x: event.pageX - cvsClientRect.x, y: event.pageY - cvsClientRect.y }, That.outOfBounds.area[That.outOfBounds.id - 1].outPoints);
                    if (That.isOnRound.result) {
                        timer = setTimeout(function () {
                            c.onmousemove = function (e) {
                                That.outOfBounds.area[That.outOfBounds.id - 1].outPoints[That.isOnRound.index] = { x: e.pageX - cvsClientRect.x, y: e.pageY - cvsClientRect.y };
                                // for(let i of That.outAreas) {
                                //   if(i.id === That.outOfBounds.id) {
                                if (That.isOnRound.index === 0) {
                                    That.outOfBounds.area[That.outOfBounds.id - 1].outAreas[0] = { x: Math.floor(e.pageX - cvsClientRect.x) * 2, y: Math.floor(e.pageY - cvsClientRect.y) * 2 };
                                }
                                else if (That.isOnRound.index === 1) {
                                    That.outOfBounds.area[That.outOfBounds.id - 1].outAreas[1] = { x: Math.floor(e.pageX - cvsClientRect.x) * 2, y: Math.floor(e.pageY - cvsClientRect.y) * 2 };
                                }
                                // break
                                //   }
                                // }
                                That.drawOutLine(ctx, That.outOfBounds.area[That.outOfBounds.id - 1].outPoints, That.outOfBounds.area[That.outOfBounds.id - 1].direction, "#0AD129", "#008000");
                            };
                            window.clearTimeout(timer);
                        }, 50);
                    }
                }
                // 鼠标抬起不让移动
                c.onmouseup = function (event) {
                    That.isOnRound = { result: false, index: null };
                };
                // }
            };
        },
        // 是否在顶点上
        isOnRoundCap(pt, poly) {
            for (var i = 0; i < poly.length; i++) {
                var x1 = Math.pow(pt.x - poly[i].x, 2), y1 = Math.pow(pt.y - poly[i].y, 2);
                if (x1 - 0 + (y1 - 0) <= 25) {
                    return { result: true, index: i };
                }
            }
            return { result: false, index: null };
        },
        deleteTripDraw() {
            var c = document.getElementById("canvas5");
            var ctx = c.getContext("2d");
            ctx.clearRect(0, 0, 1080, 1920);
            this.curTripPoints = [];
            for (let i of this.flowAreasNew) {
                if (i.id === this.curTrip.id) {
                    i.start = {};
                    i.end = {};
                    i.direction = 1;
                    i.sensitivity = 60;
                    break;
                }
            }
            this.flowAreas = [];
            this.flowAreasNew = [];
        },
        deleteOutDraw() {
            var c = document.getElementById("canvas5");
            var ctx = c.getContext("2d");
            ctx.clearRect(0, 0, 1080, 1920);
            this.outOfBounds.area[this.outOfBounds.id - 1].outPoints = [];
            // for(let i of this.outAreas) {
            //   if(i.id === this.outOfBounds.id) {
            // i.start = {}
            // i.end = {}
            // i.direction = 1
            // break
            //   }
            // }
            this.outOfBounds.area[this.outOfBounds.id - 1].outAreas = [];
        },
        submitHandler() {
            // 人脸
            if (this.face.roi) {
                for (let i = 0; i < this.face.roi.length; i++) {
                    this.face.roi[i].forEach(item => {
                        item.x = item.x * 2;
                        item.y = item.y * 2;
                    });
                }
            }
            this.face.bbox.minSize = this.face.faceMinSize || "";
            this.face.bbox.maxSize = this.face.faceMaxSize || "";
            // 行人
            if (this.pedestrian.roi) {
                for (let i = 0; i < this.pedestrian.roi.length; i++) {
                    this.pedestrian.roi[i].forEach(item => {
                        item.x = item.x * 2;
                        item.y = item.y * 2;
                    });
                }
            }
            this.pedestrian.bbox.minSize = this.pedestrian.pedestrianMinSize || "";
            this.pedestrian.bbox.maxSize = this.pedestrian.pedestrianMaxSize || "";
            // 机动车
            if (this.vehicle.roi) {
                for (let i = 0; i < this.vehicle.roi.length; i++) {
                    this.vehicle.roi[i].forEach(item => {
                        item.x = item.x * 2;
                        item.y = item.y * 2;
                    });
                }
            }
            this.vehicle.bbox.minSize = this.vehicle.vehicleMinSize || "";
            this.vehicle.bbox.maxSize = this.vehicle.vehicleMaxSize || "";
            // 非机动车
            if (this.nonmotor.roi) {
                for (let i = 0; i < this.nonmotor.roi.length; i++) {
                    this.nonmotor.roi[i].forEach(item => {
                        item.x = item.x * 2;
                        item.y = item.y * 2;
                    });
                }
            }
            this.nonmotor.bbox.minSize = this.nonmotor.nonmotorMinSize || "";
            this.nonmotor.bbox.maxSize = this.nonmotor.nonmotorMaxSize || "";
            // 拍屏
            if (this.shoot?.roi) {
                for (let i = 0; i < this.shoot.roi.length; i++) {
                    this.shoot.roi[i].forEach(item => {
                        item.x = item.x * 2;
                        item.y = item.y * 2;
                    });
                }
            }
            // 倒地
            if (this.fall?.roi) {
                for (let i = 0; i < this.fall.roi.length; i++) {
                    this.fall.roi[i].forEach(item => {
                        item.x = item.x * 2;
                        item.y = item.y * 2;
                    });
                }
            }
            // 临时离柜
            if (this.cash?.roi) {
                for (let i = 0; i < this.cash.roi.length; i++) {
                    this.cash.roi[i].forEach(item => {
                        item.x = item.x * 2;
                        item.y = item.y * 2;
                    });
                }
            }
            // 烟雾
            if (this.smogFire?.roi) {
                for (let i = 0; i < this.smogFire.roi.length; i++) {
                    this.smogFire.roi[i].forEach(item => {
                        item.x = item.x * 2;
                        item.y = item.y * 2;
                    });
                }
            }
            this.smogFire.bbox = {};
            this.smogFire.bbox.minSize = this.smogFire.smogFireMinSize || "";
            this.smogFire.bbox.maxSize = this.smogFire.smogFireMaxSize || "";
            // 打斗
            if (this.struggle?.roi) {
                for (let i = 0; i < this.struggle.roi.length; i++) {
                    this.struggle.roi[i].forEach(item => {
                        item.x = item.x * 2;
                        item.y = item.y * 2;
                    });
                }
            }
            // 数人
            if (this.skeleton?.roi) {
                for (let i = 0; i < this.skeleton.roi.length; i++) {
                    this.skeleton.roi[i].forEach(item => {
                        item.x = item.x * 2;
                        item.y = item.y * 2;
                    });
                }
            }
            // 快速移动
            if (this.fastMove?.roi) {
                for (let i = 0; i < this.fastMove.roi.length; i++) {
                    this.fastMove.roi[i].forEach(item => {
                        item.x = item.x * 2;
                        item.y = item.y * 2;
                    });
                }
            }
            // 遗留物
            if (this.remain?.roi) {
                for (let i = 0; i < this.remain.roi.length; i++) {
                    this.remain.roi[i].forEach(item => {
                        item.x = item.x * 2;
                        item.y = item.y * 2;
                    });
                }
            }
            // 特殊人群
            if (this.specialPed?.roi) {
                for (let i = 0; i < this.specialPed.roi.length; i++) {
                    this.specialPed.roi[i].forEach(item => {
                        item.x = item.x * 2;
                        item.y = item.y * 2;
                    });
                }
            }
            // 代客操作
            if (this.stm?.roi) {
                for (let i = 0; i < this.stm.roi.length; i++) {
                    this.stm.roi[i].forEach(item => {
                        item.x = item.x * 2;
                        item.y = item.y * 2;
                    });
                }
            }
            if (this.stm?.screen) {
                for (let i = 0; i < this.stm.screen.length; i++) {
                    this.stm.screen[i].forEach(item => {
                        item.x = item.x * 2;
                        item.y = item.y * 2;
                    });
                }
            }
            if (this.stm?.keyboard) {
                for (let i = 0; i < this.stm.keyboard.length; i++) {
                    this.stm.keyboard[i].forEach(item => {
                        item.x = item.x * 2;
                        item.y = item.y * 2;
                    });
                }
            }
            if (this.stm?.stm) {
                for (let i = 0; i < this.stm.stm.length; i++) {
                    this.stm.stm[i].forEach(item => {
                        item.x = item.x * 2;
                        item.y = item.y * 2;
                    });
                }
            }
            // 徘徊
            if (this.hover?.roi) {
                for (let i = 0; i < this.hover.roi.length; i++) {
                    this.hover.roi[i].forEach(item => {
                        item.x = item.x * 2;
                        item.y = item.y * 2;
                    });
                }
            }
            // 箱包
            if (this.bag?.roi) {
                for (let i = 0; i < this.bag.roi.length; i++) {
                    this.bag.roi[i].forEach(item => {
                        item.x = item.x * 2;
                        item.y = item.y * 2;
                    });
                }
            }
            // 摄像头移动
            if (this.ipcmove?.roi) {
                for (let i = 0; i < this.ipcmove.roi.length; i++) {
                    this.ipcmove.roi[i].forEach(item => {
                        item.x = item.x * 2;
                        item.y = item.y * 2;
                    });
                }
            }
            // 睡岗
            if (this.sleep?.roi) {
                for (let i = 0; i < this.sleep.roi.length; i++) {
                    this.sleep.roi[i].forEach(item => {
                        item.x = item.x * 2;
                        item.y = item.y * 2;
                    });
                }
            }
            // 广告张贴
            if (this.adPost?.roi) {
                for (let i = 0; i < this.adPost.roi.length; i++) {
                    this.adPost.roi[i].forEach(item => {
                        item.x = item.x * 2;
                        item.y = item.y * 2;
                    });
                }
            }
            // 越界侦测
            for (let j = 0; j < 4; j++) {
                this.outOfBounds.area[j].bbox.minSize = this.outOfBounds.area[j].outOfBoundsMinSize || "";
                this.outOfBounds.area[j].bbox.maxSize = this.outOfBounds.area[j].outOfBoundsMaxSize || "";
            }
            this.outOfBounds.area[this.outOfBounds.id - 1].tripWire = this.outOfBounds.area[this.outOfBounds.id - 1].outAreas || [];
            // 进入区域侦测
            if (this.enterArea?.roi) {
                for (let i = 0; i < this.enterArea.roi.length; i++) {
                    this.enterArea.roi[i].forEach(item => {
                        item.x = item.x * 2;
                        item.y = item.y * 2;
                    });
                }
            }
            this.enterArea.bbox.minSize = this.enterArea.enterAreaMinSize || "";
            this.enterArea.bbox.maxSize = this.enterArea.enterAreaMaxSize || "";
            // 离开区域侦测
            if (this.leaveArea?.roi) {
                for (let i = 0; i < this.leaveArea.roi.length; i++) {
                    this.leaveArea.roi[i].forEach(item => {
                        item.x = item.x * 2;
                        item.y = item.y * 2;
                    });
                }
            }
            this.leaveArea.bbox.minSize = this.leaveArea.leaveAreaMinSize || "";
            this.leaveArea.bbox.maxSize = this.leaveArea.leaveAreaMaxSize || "";
            // 玩手机
            if (this.playPhone?.roi) {
                for (let i = 0; i < this.playPhone.roi.length; i++) {
                    this.playPhone.roi[i].forEach(item => {
                        item.x = item.x * 2;
                        item.y = item.y * 2;
                    });
                }
            }
            // 抢包
            if (this.grab?.roi) {
                for (let i = 0; i < this.grab.roi.length; i++) {
                    this.grab.roi[i].forEach(item => {
                        item.x = item.x * 2;
                        item.y = item.y * 2;
                    });
                }
            }
            // 吸烟
            if (this.smoking?.roi) {
                for (let i = 0; i < this.smoking.roi.length; i++) {
                    this.smoking.roi[i].forEach(item => {
                        item.x = item.x * 2;
                        item.y = item.y * 2;
                    });
                }
            }
            // ATM柜台遗留物检查
            if (this.atmRemain?.roi) {
                for (let i = 0; i < this.atmRemain.roi.length; i++) {
                    this.atmRemain.roi[i].forEach(item => {
                        item.x = item.x * 2;
                        item.y = item.y * 2;
                    });
                }
            }
            // 坐姿不雅
            if (this.recline?.roi) {
                for (let i = 0; i < this.recline.roi.length; i++) {
                    this.recline.roi[i].forEach(item => {
                        item.x = item.x * 2;
                        item.y = item.y * 2;
                    });
                }
            }
            // 人脸聚类
            if (this.faceClustering.roi) {
                for (let i = 0; i < this.faceClustering.roi.length; i++) {
                    this.faceClustering.roi[i].forEach(item => {
                        item.x = item.x * 2;
                        item.y = item.y * 2;
                    });
                }
            }
            this.faceClustering.bbox.minSize = this.faceClustering.faceClusteringMinSize || "";
            this.faceClustering.bbox.maxSize = this.faceClustering.faceClusteringMaxSize || "";
            // 人体挟持
            if (this.hijack.roi) {
                for (let i = 0; i < this.hijack.roi.length; i++) {
                    this.hijack.roi[i].forEach(item => {
                        item.x = item.x * 2;
                        item.y = item.y * 2;
                    });
                }
            }
            // 箱包交接
            if (this.swapBag.roi) {
                for (let i = 0; i < this.swapBag.roi.length; i++) {
                    this.swapBag.roi[i].forEach(item => {
                        item.x = item.x * 2;
                        item.y = item.y * 2;
                    });
                }
            }
            // 一日两碰箱
            if (this.touchBag.roi) {
                for (let i = 0; i < this.touchBag.roi.length; i++) {
                    this.touchBag.roi[i].forEach(item => {
                        item.x = item.x * 2;
                        item.y = item.y * 2;
                    });
                }
            }
        },
        submit(form) {
            if (this.getIndex != 29) {
                if (this.getIndex == 19) {
                    if (this.outOfBounds.area[this.outOfBounds.id - 1].pedestrian || this.outOfBounds.area[this.outOfBounds.id - 1].vehicle) {
                        if (((Number(this.outOfBounds.area[this.outOfBounds.id - 1].outOfBoundsMinSize) >= 48) && (Number(this.outOfBounds.area[this.outOfBounds.id - 1].outOfBoundsMinSize) <= Number(this.outOfBounds.area[this.outOfBounds.id - 1].outOfBoundsMaxSize)) && (Number(this.outOfBounds.area[this.outOfBounds.id - 1].outOfBoundsMaxSize) <= 1080)) &&
                            ((Number(this.outOfBounds.area[this.outOfBounds.id - 1].quality) >= 0.5) && Number(this.outOfBounds.area[this.outOfBounds.id - 1].quality) <= 1) &&
                            (Number(this.outOfBounds.area[this.outOfBounds.id - 1].confidence) >= 0.3 && Number(this.outOfBounds.area[this.outOfBounds.id - 1].confidence) <= 1) &&
                            (Number(this.outOfBounds.area[this.outOfBounds.id - 1].detectTime) >= 0 && Number(this.outOfBounds.area[this.outOfBounds.id - 1].detectTime) <= 10) &&
                            (Number(this.outOfBounds.area[this.outOfBounds.id - 1].sensitivity) >= 0 && Number(this.outOfBounds.area[this.outOfBounds.id - 1].sensitivity) <= 100)) {
                            this.submitPri();
                            this.$message.success('参数配置成功')
                            return;
                        }
                        else if (!(Number(this.outOfBounds.area[this.outOfBounds.id - 1].outOfBoundsMinSize) >= 48 && Number(this.outOfBounds.area[this.outOfBounds.id - 1].outOfBoundsMinSize) <= Number(this.outOfBounds.area[this.outOfBounds.id - 1].outOfBoundsMaxSize) && Number(this.outOfBounds.area[this.outOfBounds.id - 1].outOfBoundsMaxSize) <= 1080)) {
                            this.$message.warning("请输入正确的目标范围");
                            this.btnDisabled = true;
                            setTimeout(() => {
                                this.btnDisabled = false;
                            }, 1000);
                        }
                        else if (!(Number(this.outOfBounds.area[this.outOfBounds.id - 1].quality) >= 0.5 && Number(this.outOfBounds.area[this.outOfBounds.id - 1].quality) <= 1)) {
                            this.$message.warning("请输入正确的目标质量");
                            this.btnDisabled = true;
                            setTimeout(() => {
                                this.btnDisabled = false;
                            }, 1000);
                        }
                        else if (!(Number(this.outOfBounds.area[this.outOfBounds.id - 1].confidence) >= 0.3 && Number(this.outOfBounds.area[this.outOfBounds.id - 1].confidence) <= 1)) {
                            this.$message.warning("请输入正确的目标置信度");
                            this.btnDisabled = true;
                            setTimeout(() => {
                                this.btnDisabled = false;
                            }, 1000);
                        }
                        else if (!(Number(this.outOfBounds.area[this.outOfBounds.id - 1].sensitivity) >= 0 && Number(this.outOfBounds.area[this.outOfBounds.id - 1].sensitivity) <= 100)) {
                            this.$message.warning("请输入正确的算法识别灵敏度");
                            this.btnDisabled = true;
                            setTimeout(() => {
                                this.btnDisabled = false;
                            }, 1000);
                        }
                        else if (!(Number(this.outOfBounds.area[this.outOfBounds.id - 1].detectTime) >= 0 && Number(this.outOfBounds.area[this.outOfBounds.id - 1].detectTime) <= 10)) {
                            this.$message.warning("请输入正确的时间阈值");
                            this.btnDisabled = true;
                            setTimeout(() => {
                                this.btnDisabled = false;
                            }, 1000);
                        }
                    }
                    else {
                        this.$message.warning("请选择检测目标");
                        this.btnDisabled = true;
                        setTimeout(() => {
                            this.btnDisabled = false;
                        }, 1000);
                    }
                }
                else if (this.getIndex == 20) {
                    this.enterArea.checkArr = Array.from(document.getElementsByClassName("el-checkbox__input is-checked"));
                    if (this.enterArea.checkArr.length > 0) {
                        this.$refs[form].validate(valid => {
                            if (valid) {
                                this.submitPri();
                            this.$message.success('参数配置成功')
                            }
                            else {
                                this.btnDisabled = true;
                                setTimeout(() => {
                                    this.btnDisabled = false;
                                }, 1000);
                            }
                        });
                    }
                    else {
                        this.$message.warning("请选择检测目标");
                        this.btnDisabled = true;
                        setTimeout(() => {
                            this.btnDisabled = false;
                        }, 1000);
                    }
                }
                else if (this.getIndex == 21) {
                    this.leaveArea.checkArr = Array.from(document.getElementsByClassName("el-checkbox__input is-checked"));
                    if (this.leaveArea.checkArr.length > 0) {
                        this.$refs[form].validate(valid => {
                            if (valid) {
                                this.submitPri();
                            this.$message.success('参数配置成功')
                            }
                            else {
                                this.btnDisabled = true;
                                setTimeout(() => {
                                    this.btnDisabled = false;
                                }, 1000);
                            }
                        });
                    }
                    else {
                        this.$message.warning("请选择检测目标");
                        this.btnDisabled = true;
                        setTimeout(() => {
                            this.btnDisabled = false;
                        }, 1000);
                    }
                }
                else {
                    this.$refs[form].validate(valid => {
                        if (valid) {
                            this.submitPri();
                            this.$message.success('参数配置成功')
                        }
                        else {
                            this.btnDisabled = true;
                            setTimeout(() => {
                                this.btnDisabled = false;
                            }, 1000);
                        }
                    });
                }
            }
            else {
                this.submitPri();
            }
        },
        submitPri() {
            // this.saveAlarm()
            this.btnDisabled = true;
            const id = this.currentChannel.id;
            this.submitHandler();
            let params = {};
            if (this.getIndex == 0) {
                // 人脸
                this.face.enabled = this.enabled;
                params = {
                    config: {
                        face: this.face
                    }
                };
            }
            else if (this.getIndex == 1) {
                // 行人
                this.pedestrian.enabled = this.enabled;
                params = {
                    config: {
                        pedestrian: this.pedestrian
                    }
                };
            }
            else if (this.getIndex == 2) {
                // 机动车
                this.vehicle.enabled = this.enabled;
                params = {
                    config: {
                        vehicle: this.vehicle
                    }
                };
            }
            else if (this.getIndex == 3) {
                // 非机动车
                this.nonmotor.enabled = this.enabled;
                params = {
                    config: {
                        nonmotor: this.nonmotor
                    }
                };
            }
            else if (this.getIndex == 4) {
                // 拍屏
                this.shoot.enabled = this.enabled;
                if ((this.shootTime0 && !this.shootTime1) || (this.shootTime1 && !this.shootTime0)) {
                    this.shoot.effectiveTime = [
                        {
                            startSection: this.moment(this.shootTime0 ? this.shootTime0[0] : this.shootTime1[0]).format("HH:mm:ss"),
                            endSection: this.moment(this.shootTime0 ? this.shootTime0[1] : this.shootTime1[1]).format("HH:mm:ss")
                        }
                    ];
                }
                if (this.shootTime0 && this.shootTime1) {
                    this.shoot.effectiveTime = [
                        {
                            startSection: this.moment(this.shootTime0[0]).format("HH:mm:ss"),
                            endSection: this.moment(this.shootTime0[1]).format("HH:mm:ss")
                        },
                        {
                            startSection: this.moment(this.shootTime1[0]).format("HH:mm:ss"),
                            endSection: this.moment(this.shootTime1[1]).format("HH:mm:ss")
                        }
                    ];
                }
                params = {
                    config: {
                        shoot: this.shoot
                    }
                };
            }
            else if (this.getIndex == 5) {
                // 倒地
                this.fall.enabled = this.enabled;
                if ((this.fallTime0 && !this.fallTime1) || (this.fallTime1 && !this.fallTime0)) {
                    this.fall.effectiveTime = [
                        {
                            startSection: this.moment(this.fallTime0 ? this.fallTime0[0] : this.fallTime1[0]).format("HH:mm:ss"),
                            endSection: this.moment(this.fallTime0 ? this.fallTime0[1] : this.fallTime1[1]).format("HH:mm:ss")
                        }
                    ];
                }
                if (this.fallTime0 && this.fallTime1) {
                    this.fall.effectiveTime = [
                        {
                            startSection: this.moment(this.fallTime0[0]).format("HH:mm:ss"),
                            endSection: this.moment(this.fallTime0[1]).format("HH:mm:ss")
                        },
                        {
                            startSection: this.moment(this.fallTime1[0]).format("HH:mm:ss"),
                            endSection: this.moment(this.fallTime1[1]).format("HH:mm:ss")
                        }
                    ];
                }
                params = {
                    config: {
                        // fall: Object.assign({}, ...this.fall)
                        fall: this.fall
                    }
                };
            }
            else if (this.getIndex == 6) {
                // 临时离柜
                this.cash.enabled = this.enabled;
                if ((this.cashTime0 && !this.cashTime1) || (this.cashTime1 && !this.cashTime0)) {
                    this.cash.effectiveTime = [
                        {
                            startSection: this.moment(this.cashTime0 ? this.cashTime0[0] : this.cashTime1[0]).format("HH:mm:ss"),
                            endSection: this.moment(this.cashTime0 ? this.cashTime0[1] : this.cashTime1[1]).format("HH:mm:ss")
                        }
                    ];
                }
                if (this.cashTime0 && this.cashTime1) {
                    this.cash.effectiveTime = [
                        {
                            startSection: this.moment(this.cashTime0[0]).format("HH:mm:ss"),
                            endSection: this.moment(this.cashTime0[1]).format("HH:mm:ss")
                        },
                        {
                            startSection: this.moment(this.cashTime1[0]).format("HH:mm:ss"),
                            endSection: this.moment(this.cashTime1[1]).format("HH:mm:ss")
                        }
                    ];
                }
                params = {
                    config: {
                        cash: this.cash
                    }
                };
            }
            else if (this.getIndex == 7) {
                // 烟雾
                this.smogFire.enabled = this.enabled;
                params = {
                    config: {
                        smogFire: this.smogFire
                    }
                };
            }
            else if (this.getIndex == 8) {
                // 打斗
                this.struggle.enabled = this.enabled;
                if ((this.struggleTime0 && !this.struggleTime1) || (this.struggleTime1 && !this.struggleTime0)) {
                    this.struggle.effectiveTime = [
                        {
                            startSection: this.moment(this.struggleTime0 ? this.struggleTime0[0] : this.struggleTime1[0]).format("HH:mm:ss"),
                            endSection: this.moment(this.struggleTime0 ? this.struggleTime0[1] : this.struggleTime1[1]).format("HH:mm:ss")
                        }
                    ];
                }
                if (this.struggleTime0 && this.struggleTime1) {
                    this.struggle.effectiveTime = [
                        {
                            startSection: this.moment(this.struggleTime0[0]).format("HH:mm:ss"),
                            endSection: this.moment(this.struggleTime0[1]).format("HH:mm:ss")
                        },
                        {
                            startSection: this.moment(this.struggleTime1[0]).format("HH:mm:ss"),
                            endSection: this.moment(this.struggleTime1[1]).format("HH:mm:ss")
                        }
                    ];
                }
                params = {
                    config: {
                        struggle: this.struggle
                    }
                };
            }
            else if (this.getIndex == 9) {
                // 数人
                this.skeleton.enabled = this.enabled;
                params = {
                    config: {
                        skeleton: this.skeleton
                    }
                };
            }
            else if (this.getIndex == 10) {
                // 快速移动
                this.fastMove.enabled = this.enabled;
                if ((this.fastMoveTime0 && !this.fastMoveTime1) || (this.fastMoveTime1 && !this.fastMoveTime0)) {
                    this.fastMove.effectiveTime = [
                        {
                            startSection: this.moment(this.fastMoveTime0 ? this.fastMoveTime0[0] : this.fastMoveTime1[0]).format("HH:mm:ss"),
                            endSection: this.moment(this.fastMoveTime0 ? this.fastMoveTime0[1] : this.fastMoveTime1[1]).format("HH:mm:ss")
                        }
                    ];
                }
                if (this.fastMoveTime0 && this.fastMoveTime1) {
                    this.fastMove.effectiveTime = [
                        {
                            startSection: this.moment(this.fastMoveTime0[0]).format("HH:mm:ss"),
                            endSection: this.moment(this.fastMoveTime0[1]).format("HH:mm:ss")
                        },
                        {
                            startSection: this.moment(this.fastMoveTime1[0]).format("HH:mm:ss"),
                            endSection: this.moment(this.fastMoveTime1[1]).format("HH:mm:ss")
                        }
                    ];
                }
                params = {
                    config: {
                        fastMove: this.fastMove
                    }
                };
            }
            else if (this.getIndex == 11) {
                // 遗留物
                this.remain.enabled = this.enabled;
                if ((this.remainTime0 && !this.remainTime1) || (this.remainTime1 && !this.remainTime0)) {
                    this.remain.effectiveTime = [
                        {
                            startSection: this.moment(this.remainTime0 ? this.remainTime0[0] : this.remainTime1[0]).format("HH:mm:ss"),
                            endSection: this.moment(this.remainTime0 ? this.remainTime0[1] : this.remainTime1[1]).format("HH:mm:ss")
                        }
                    ];
                }
                if (this.remainTime0 && this.remainTime1) {
                    this.remain.effectiveTime = [
                        {
                            startSection: this.moment(this.remainTime0[0]).format("HH:mm:ss"),
                            endSection: this.moment(this.remainTime0[1]).format("HH:mm:ss")
                        },
                        {
                            startSection: this.moment(this.remainTime1[0]).format("HH:mm:ss"),
                            endSection: this.moment(this.remainTime1[1]).format("HH:mm:ss")
                        }
                    ];
                }
                params = {
                    config: {
                        remain: this.remain
                    }
                };
            }
            else if (this.getIndex == 12) {
                // 特殊人群
                this.specialPed.enabled = this.enabled;
                if ((this.specialPedTime0 && !this.specialPedTime1) || (this.specialPedTime0 && !this.specialPedTime1)) {
                    this.specialPed.effectiveTime = [
                        {
                            startSection: this.moment(this.specialPedTime0 ? this.specialPedTime0[0] : this.specialPedTime1[0]).format("HH:mm:ss"),
                            endSection: this.moment(this.specialPedTime0 ? this.specialPedTime0[1] : this.specialPedTime1[1]).format("HH:mm:ss")
                        }
                    ];
                }
                if (this.specialPedTime0 && this.specialPedTime1) {
                    this.specialPed.effectiveTime = [
                        {
                            startSection: this.moment(this.specialPedTime0[0]).format("HH:mm:ss"),
                            endSection: this.moment(this.specialPedTime0[1]).format("HH:mm:ss")
                        },
                        {
                            startSection: this.moment(this.specialPedTime1[0]).format("HH:mm:ss"),
                            endSection: this.moment(this.specialPedTime1[1]).format("HH:mm:ss")
                        }
                    ];
                }
                params = {
                    config: {
                        specialPed: this.specialPed
                    }
                };
            }
            else if (this.getIndex == 13) {
                // 代客操作
                this.stm.enabled = this.enabled;
                if ((this.stmTime0 && !this.stmTime1) || (this.stmTime1 && !this.stmTime0)) {
                    this.stm.effectiveTime = [
                        {
                            startSection: this.moment(this.stmTime0 ? this.stmTime0[0] : this.stmTime1[0]).format("HH:mm:ss"),
                            endSection: this.moment(this.stmTime0 ? this.stmTime0[1] : this.stmTime1[1]).format("HH:mm:ss")
                        }
                    ];
                }
                if (this.stmTime0 && this.stmTime1) {
                    this.stm.effectiveTime = [
                        {
                            startSection: this.moment(this.stmTime0[0]).format("HH:mm:ss"),
                            endSection: this.moment(this.stmTime0[1]).format("HH:mm:ss")
                        },
                        {
                            startSection: this.moment(this.stmTime1[0]).format("HH:mm:ss"),
                            endSection: this.moment(this.stmTime1[1]).format("HH:mm:ss")
                        }
                    ];
                }
                params = {
                    config: {
                        stm: this.stm
                    }
                };
            }
            else if (this.getIndex == 14) {
                // 徘徊
                this.hover.enabled = this.enabled;
                if ((this.hoverTime0 && !this.hoverTime1) || (this.hoverTime1 && !this.hoverTime0)) {
                    this.hover.effectiveTime = [
                        {
                            startSection: this.moment(this.hoverTime0 ? this.hoverTime0[0] : this.hoverTime1[0]).format("HH:mm:ss"),
                            endSection: this.moment(this.hoverTime0 ? this.hoverTime0[1] : this.hoverTime1[1]).format("HH:mm:ss")
                        }
                    ];
                }
                if (this.hoverTime0 && this.hoverTime1) {
                    this.hover.effectiveTime = [
                        {
                            startSection: this.moment(this.hoverTime0[0]).format("HH:mm:ss"),
                            endSection: this.moment(this.hoverTime0[1]).format("HH:mm:ss")
                        },
                        {
                            startSection: this.moment(this.hoverTime1[0]).format("HH:mm:ss"),
                            endSection: this.moment(this.hoverTime1[1]).format("HH:mm:ss")
                        }
                    ];
                }
                params = {
                    config: {
                        hover: this.hover
                    }
                };
            }
            else if (this.getIndex == 15) {
                // 箱包
                this.bag.enabled = this.enabled;
                if ((this.bagTime0 && !this.bagTime1) || (this.bagTime1 && !this.bagTime0)) {
                    this.bag.effectiveTime = [
                        {
                            startSection: this.moment(this.bagTime0 ? this.bagTime0[0] : this.bagTime1[0]).format("HH:mm:ss"),
                            endSection: this.moment(this.bagTime0 ? this.bagTime0[1] : this.bagTime1[1]).format("HH:mm:ss")
                        }
                    ];
                }
                if (this.bagTime0 && this.bagTime1) {
                    this.bag.effectiveTime = [
                        {
                            startSection: this.moment(this.bagTime0[0]).format("HH:mm:ss"),
                            endSection: this.moment(this.bagTime0[1]).format("HH:mm:ss")
                        },
                        {
                            startSection: this.moment(this.bagTime1[0]).format("HH:mm:ss"),
                            endSection: this.moment(this.bagTime1[1]).format("HH:mm:ss")
                        }
                    ];
                }
                params = {
                    config: {
                        bag: this.bag
                    }
                };
            }
            else if (this.getIndex == 16) {
                // 摄像头移动
                this.ipcmove.enabled = this.enabled;
                if ((this.ipcmoveTime0 && !this.ipcmoveTime1) || (this.ipcmoveTime1 && !this.ipcmoveTime0)) {
                    this.ipcmove.effectiveTime = [
                        {
                            startSection: this.moment(this.ipcmoveTime0 ? this.ipcmoveTime0[0] : this.ipcmoveTime1[0]).format("HH:mm:ss"),
                            endSection: this.moment(this.ipcmoveTime0 ? this.ipcmoveTime0[1] : this.ipcmoveTime1[1]).format("HH:mm:ss")
                        }
                    ];
                }
                if (this.ipcmoveTime0 && this.ipcmoveTime1) {
                    this.ipcmove.effectiveTime = [
                        {
                            startSection: this.moment(this.ipcmoveTime0[0]).format("HH:mm:ss"),
                            endSection: this.moment(this.ipcmoveTime0[1]).format("HH:mm:ss")
                        },
                        {
                            startSection: this.moment(this.ipcmoveTime1[0]).format("HH:mm:ss"),
                            endSection: this.moment(this.ipcmoveTime1[1]).format("HH:mm:ss")
                        }
                    ];
                }
                this.ipcmove.threshold = this.ipcmove.ipcmove_threshold;
                params = {
                    config: {
                        ipcmove: this.ipcmove
                    }
                };
            }
            else if (this.getIndex == 17) {
                // 睡岗
                this.sleep.enabled = this.enabled;
                if ((this.sleepTime0 && !this.sleepTime1) || (this.sleepTime1 && !this.sleepTime0)) {
                    this.sleep.effectiveTime = [
                        {
                            startSection: this.moment(this.sleepTime0 ? this.sleepTime0[0] : this.sleepTime1[0]).format("HH:mm:ss"),
                            endSection: this.moment(this.sleepTime0 ? this.sleepTime0[1] : this.sleepTime1[1]).format("HH:mm:ss")
                        }
                    ];
                }
                if (this.sleepTime0 && this.sleepTime1) {
                    this.sleep.effectiveTime = [
                        {
                            startSection: this.moment(this.sleepTime0[0]).format("HH:mm:ss"),
                            endSection: this.moment(this.sleepTime0[1]).format("HH:mm:ss")
                        },
                        {
                            startSection: this.moment(this.sleepTime1[0]).format("HH:mm:ss"),
                            endSection: this.moment(this.sleepTime1[1]).format("HH:mm:ss")
                        }
                    ];
                }
                params = {
                    config: {
                        sleep: this.sleep
                    }
                };
            }
            else if (this.getIndex == 18) {
                // 广告张贴
                this.adPost.enabled = this.enabled;
                if ((this.adPostTime0 && !this.adPostTime1) || (this.adPostTime1 && !this.adPostTime0)) {
                    this.adPost.effectiveTime = [
                        {
                            startSection: this.moment(this.adPostTime0 ? this.adPostTime0[0] : this.adPostTime1[0]).format("HH:mm:ss"),
                            endSection: this.moment(this.adPostTime0 ? this.adPostTime0[1] : this.adPostTime1[1]).format("HH:mm:ss")
                        }
                    ];
                }
                if (this.adPostTime0 && this.adPostTime1) {
                    this.adPost.effectiveTime = [
                        {
                            startSection: this.moment(this.adPostTime0[0]).format("HH:mm:ss"),
                            endSection: this.moment(this.adPostTime0[1]).format("HH:mm:ss")
                        },
                        {
                            startSection: this.moment(this.adPostTime1[0]).format("HH:mm:ss"),
                            endSection: this.moment(this.adPostTime1[1]).format("HH:mm:ss")
                        }
                    ];
                }
                params = {
                    config: {
                        adPost: this.adPost
                    }
                };
            }
            else if (this.getIndex == 19) {
                // 越界侦测
                this.outOfBounds.enabled = this.enabled;
                for (let j = 0; j < 4; j++) {
                    this.outOfBounds.area[j].tripWire = this.outOfBounds.area[j].outAreas;
                }
                params = {
                    config: {
                        outOfBounds: this.outOfBounds
                    }
                };
            }
            else if (this.getIndex == 20) {
                // 进入区域侦测
                this.enterArea.enabled = this.enabled;
                if ((this.enterAreaTime0 && !this.enterAreaTime1) || (this.enterAreaTime1 && !this.enterAreaTime0)) {
                    this.enterArea.effectiveTime = [
                        {
                            startSection: this.moment(this.enterAreaTime0 ? this.enterAreaTime0[0] : this.enterAreaTime1[0]).format("HH:mm:ss"),
                            endSection: this.moment(this.enterAreaTime0 ? this.enterAreaTime0[1] : this.enterAreaTime1[1]).format("HH:mm:ss")
                        }
                    ];
                }
                if (this.enterAreaTime0 && this.enterAreaTime1) {
                    this.enterArea.effectiveTime = [
                        {
                            startSection: this.moment(this.enterAreaTime0[0]).format("HH:mm:ss"),
                            endSection: this.moment(this.enterAreaTime0[1]).format("HH:mm:ss")
                        },
                        {
                            startSection: this.moment(this.enterAreaTime1[0]).format("HH:mm:ss"),
                            endSection: this.moment(this.enterAreaTime1[1]).format("HH:mm:ss")
                        }
                    ];
                }
                params = {
                    config: {
                        enterArea: this.enterArea
                    }
                };
            }
            else if (this.getIndex == 21) {
                // 离开区域侦测
                this.leaveArea.enabled = this.enabled;
                if ((this.leaveAreaTime0 && !this.leaveAreaTime1) || (this.leaveAreaTime1 && !this.leaveAreaTime0)) {
                    this.leaveArea.effectiveTime = [
                        {
                            startSection: this.moment(this.leaveAreaTime0 ? this.leaveAreaTime0[0] : this.leaveAreaTime1[0]).format("HH:mm:ss"),
                            endSection: this.moment(this.leaveAreaTime0 ? this.leaveAreaTime0[1] : this.leaveAreaTime1[1]).format("HH:mm:ss")
                        }
                    ];
                }
                if (this.leaveAreaTime0 && this.leaveAreaTime1) {
                    this.leaveArea.effectiveTime = [
                        {
                            startSection: this.moment(this.leaveAreaTime0[0]).format("HH:mm:ss"),
                            endSection: this.moment(this.leaveAreaTime0[1]).format("HH:mm:ss")
                        },
                        {
                            startSection: this.moment(this.leaveAreaTime1[0]).format("HH:mm:ss"),
                            endSection: this.moment(this.leaveAreaTime1[1]).format("HH:mm:ss")
                        }
                    ];
                }
                params = {
                    config: {
                        leaveArea: this.leaveArea
                    }
                };
            }
            else if (this.getIndex == 22) {
                // 玩手机
                this.playPhone.enabled = this.enabled;
                if ((this.playPhoneTime0 && !this.playPhoneTime1) || (this.playPhoneTime1 && !this.playPhoneTime0)) {
                    this.playPhone.effectiveTime = [
                        {
                            startSection: this.moment(this.playPhoneTime0 ? this.playPhoneTime0[0] : this.playPhoneTime1[0]).format("HH:mm:ss"),
                            endSection: this.moment(this.playPhoneTime0 ? this.playPhoneTime0[1] : this.playPhoneTime1[1]).format("HH:mm:ss")
                        }
                    ];
                }
                if (this.playPhoneTime0 && this.playPhoneTime1) {
                    this.playPhone.effectiveTime = [
                        {
                            startSection: this.moment(this.playPhoneTime0[0]).format("HH:mm:ss"),
                            endSection: this.moment(this.playPhoneTime0[1]).format("HH:mm:ss")
                        },
                        {
                            startSection: this.moment(this.playPhoneTime1[0]).format("HH:mm:ss"),
                            endSection: this.moment(this.playPhoneTime1[1]).format("HH:mm:ss")
                        }
                    ];
                }
                params = {
                    config: {
                        playPhone: this.playPhone
                    }
                };
            }
            else if (this.getIndex == 23) {
                // 抢包
                this.grab.enabled = this.enabled;
                if ((this.grabTime0 && !this.grabTime1) || (this.grabTime1 && !this.grabTime0)) {
                    this.grab.effectiveTime = [
                        {
                            startSection: this.moment(this.grabTime0 ? this.grabTime0[0] : this.grabTime1[0]).format("HH:mm:ss"),
                            endSection: this.moment(this.grabTime0 ? this.grabTime0[1] : this.grabTime1[1]).format("HH:mm:ss")
                        }
                    ];
                }
                if (this.grabTime0 && this.grabTime1) {
                    this.grab.effectiveTime = [
                        {
                            startSection: this.moment(this.grabTime0[0]).format("HH:mm:ss"),
                            endSection: this.moment(this.grabTime0[1]).format("HH:mm:ss")
                        },
                        {
                            startSection: this.moment(this.grabTime1[0]).format("HH:mm:ss"),
                            endSection: this.moment(this.grabTime1[1]).format("HH:mm:ss")
                        }
                    ];
                }
                params = {
                    config: {
                        grab: this.grab
                    }
                };
            }
            else if (this.getIndex == 24) {
                // 吸烟
                this.smoking.enabled = this.enabled;
                if ((this.smokingTime0 && !this.smokingTime1) || (this.smokingTime1 && !this.smokingTime0)) {
                    this.smoking.effectiveTime = [
                        {
                            startSection: this.moment(this.smokingTime0 ? this.smokingTime0[0] : this.smokingTime1[0]).format("HH:mm:ss"),
                            endSection: this.moment(this.smokingTime0 ? this.smokingTime0[1] : this.smokingTime1[1]).format("HH:mm:ss")
                        }
                    ];
                }
                if (this.smokingTime0 && this.smokingTime1) {
                    this.smoking.effectiveTime = [
                        {
                            startSection: this.moment(this.smokingTime0[0]).format("HH:mm:ss"),
                            endSection: this.moment(this.smokingTime0[1]).format("HH:mm:ss")
                        },
                        {
                            startSection: this.moment(this.smokingTime1[0]).format("HH:mm:ss"),
                            endSection: this.moment(this.smokingTime1[1]).format("HH:mm:ss")
                        }
                    ];
                }
                params = {
                    config: {
                        smoking: this.smoking
                    }
                };
            }
            else if (this.getIndex == 25) {
                // ATM柜台遗留物检测
                this.atmRemain.enabled = this.enabled;
                if ((this.atmRemainTime0 && !this.atmRemainTime1) || (this.atmRemainTime1 && !this.atmRemainTime0)) {
                    this.atmRemain.effectiveTime = [
                        {
                            startSection: this.moment(this.atmRemainTime0 ? this.atmRemainTime0[0] : this.atmRemainTime1[0]).format("HH:mm:ss"),
                            endSection: this.moment(this.atmRemainTime0 ? this.atmRemainTime0[1] : this.atmRemainTime1[1]).format("HH:mm:ss")
                        }
                    ];
                }
                if (this.atmRemainTime0 && this.atmRemainTime1) {
                    this.atmRemain.effectiveTime = [
                        {
                            startSection: this.moment(this.atmRemainTime0[0]).format("HH:mm:ss"),
                            endSection: this.moment(this.atmRemainTime0[1]).format("HH:mm:ss")
                        },
                        {
                            startSection: this.moment(this.atmRemainTime1[0]).format("HH:mm:ss"),
                            endSection: this.moment(this.atmRemainTime1[1]).format("HH:mm:ss")
                        }
                    ];
                }
                params = {
                    config: {
                        atmRemain: this.atmRemain
                    }
                };
            }
            else if (this.getIndex == 26) {
                // 坐姿不雅
                this.recline.enabled = this.enabled;
                if ((this.reclineTime0 && !this.reclineTime1) || (this.reclineTime1 && !this.reclineTime0)) {
                    this.recline.effectiveTime = [
                        {
                            startSection: this.moment(this.reclineTime0 ? this.reclineTime0[0] : this.reclineTime1[0]).format("HH:mm:ss"),
                            endSection: this.moment(this.reclineTime0 ? this.reclineTime0[1] : this.reclineTime1[1]).format("HH:mm:ss")
                        }
                    ];
                }
                if (this.reclineTime0 && this.reclineTime1) {
                    this.recline.effectiveTime = [
                        {
                            startSection: this.moment(this.reclineTime0[0]).format("HH:mm:ss"),
                            endSection: this.moment(this.reclineTime0[1]).format("HH:mm:ss")
                        },
                        {
                            startSection: this.moment(this.reclineTime1[0]).format("HH:mm:ss"),
                            endSection: this.moment(this.reclineTime1[1]).format("HH:mm:ss")
                        }
                    ];
                }
                params = {
                    config: {
                        recline: this.recline
                    }
                };
            }
            else if (this.getIndex == 27) {
                // 人脸聚类
                this.faceClustering.enabled = this.enabled;
                params = {
                    config: {
                        faceClustering: this.faceClustering
                    }
                };
            }
            else if (this.getIndex == 28) {
                // 人体挟持
                this.hijack.enabled = this.enabled;
                if ((this.hijackTime0 && !this.hijackTime1) || (this.hijackTime1 && !this.hijackTime0)) {
                    this.hijack.effectiveTime = [
                        {
                            startSection: this.moment(this.hijackTime0 ? this.hijackTime0[0] : this.hijackTime1[0]).format("HH:mm:ss"),
                            endSection: this.moment(this.hijackTime0 ? this.hijackTime0[1] : this.hijackTime1[1]).format("HH:mm:ss")
                        }
                    ];
                }
                if (this.hijackTime0 && this.hijackTime1) {
                    this.hijack.effectiveTime = [
                        {
                            startSection: this.moment(this.hijackTime0[0]).format("HH:mm:ss"),
                            endSection: this.moment(this.hijackTime0[1]).format("HH:mm:ss")
                        },
                        {
                            startSection: this.moment(this.hijackTime1[0]).format("HH:mm:ss"),
                            endSection: this.moment(this.hijackTime1[1]).format("HH:mm:ss")
                        }
                    ];
                }
                params = {
                    config: {
                        hijack: this.hijack
                    }
                };
            }
            else if (this.getIndex == 30) {
                // 人体挟持
                this.swapBag.enabled = this.enabled;
                if ((this.swapBagTime0 && !this.swapBagTime1) || (this.swapBagTime1 && !this.swapBagTime0)) {
                    this.swapBag.effectiveTime = [
                        {
                            startSection: this.moment(this.swapBagTime0 ? this.swapBagTime0[0] : this.swapBagTime1[0]).format("HH:mm:ss"),
                            endSection: this.moment(this.swapBagTime0 ? this.swapBagTime0[1] : this.swapBagTime1[1]).format("HH:mm:ss")
                        }
                    ];
                }
                if (this.swapBagTime0 && this.swapBagTime1) {
                    this.swapBag.effectiveTime = [
                        {
                            startSection: this.moment(this.swapBagTime0[0]).format("HH:mm:ss"),
                            endSection: this.moment(this.swapBagTime0[1]).format("HH:mm:ss")
                        },
                        {
                            startSection: this.moment(this.swapBagTime1[0]).format("HH:mm:ss"),
                            endSection: this.moment(this.swapBagTime1[1]).format("HH:mm:ss")
                        }
                    ];
                }
                params = {
                    config: {
                        swapBag: this.swapBag
                    }
                };
            }
            else if (this.getIndex == 31) {
                // 人体挟持
                this.touchBag.enabled = this.enabled;
                if ((this.touchBagTime0 && !this.touchBagTime1) || (this.touchBagTime1 && !this.touchBagTime0)) {
                    this.touchBag.effectiveTime = [
                        {
                            startSection: this.moment(this.touchBagTime0 ? this.touchBagTime0[0] : this.touchBagTime1[0]).format("HH:mm:ss"),
                            endSection: this.moment(this.touchBagTime0 ? this.touchBagTime0[1] : this.touchBagTime1[1]).format("HH:mm:ss")
                        }
                    ];
                }
                if (this.touchBagTime0 && this.touchBagTime1) {
                    this.touchBag.effectiveTime = [
                        {
                            startSection: this.moment(this.touchBagTime0[0]).format("HH:mm:ss"),
                            endSection: this.moment(this.touchBagTime0[1]).format("HH:mm:ss")
                        },
                        {
                            startSection: this.moment(this.touchBagTime1[0]).format("HH:mm:ss"),
                            endSection: this.moment(this.touchBagTime1[1]).format("HH:mm:ss")
                        }
                    ];
                }
                params = {
                    config: {
                        touchBag: this.touchBag
                    }
                };
            }
            else if (this.getIndex == 29) {
                this.flowAreasNew.forEach(item => { item.type = 1; });
                let flowAreas = this.flowAreasNew.filter(item => (item.start.x || item.end.y));
                params = { flowAreas: flowAreas };
            }
            putChannelTask(id, this.formDataObj).then(res => {

            })
            putChannels(id, params).then(res => {
              // this.$Msg(this.$t("algoSuccess"), "success");
              // 直接这样更新会有重复点击保存按钮点的坐标*2的bug
              // this.changeAlgoList(this.algoList[this.getIndex])
              // 调用算法详情接口
              this.getAlgoDetails();
                // 重新获取算法开关
                // this.getAlogEnable()
                let flag = 0;
                for (let i = 0; i < this.algoList.length; i++) {
                    if (this.algoList[i].index == this.getIndex) {
                        flag = i;
                        this.flagIndex = i;
                    }
                    this.algoList[i].index === 0 ? this.algoList[i].enabled = this.face.enabled : "";
                    this.algoList[i].index === 1 ? this.algoList[i].enabled = this.pedestrian.enabled : "";
                    this.algoList[i].index === 2 ? this.algoList[i].enabled = this.vehicle.enabled : "";
                    this.algoList[i].index === 3 ? this.algoList[i].enabled = this.nonmotor.enabled : "";
                    this.algoList[i].index === 4 ? this.algoList[i].enabled = this.shoot.enabled : "";
                    this.algoList[i].index === 5 ? this.algoList[i].enabled = this.fall.enabled : "";
                    this.algoList[i].index === 6 ? this.algoList[i].enabled = this.cash.enabled : "";
                    this.algoList[i].index === 7 ? this.algoList[i].enabled = this.smogFire.enabled : "";
                    this.algoList[i].index === 8 ? this.algoList[i].enabled = this.struggle.enabled : "";
                    this.algoList[i].index === 9 ? this.algoList[i].enabled = this.skeleton.enabled : "";
                    this.algoList[i].index === 10 ? this.algoList[i].enabled = this.fastMove.enabled : "";
                    this.algoList[i].index === 11 ? this.algoList[i].enabled = this.remain.enabled : "";
                    this.algoList[i].index === 12 ? this.algoList[i].enabled = this.specialPed.enabled : "";
                    this.algoList[i].index === 13 ? this.algoList[i].enabled = this.stm.enabled : "";
                    this.algoList[i].index === 14 ? this.algoList[i].enabled = this.hover.enabled : "";
                    this.algoList[i].index === 15 ? this.algoList[i].enabled = this.bag.enabled : "";
                    this.algoList[i].index === 16 ? this.algoList[i].enabled = this.ipcmove.enabled : "";
                    this.algoList[i].index === 17 ? this.algoList[i].enabled = this.sleep.enabled : "";
                    this.algoList[i].index === 18 ? this.algoList[i].enabled = this.adPost.enabled : "";
                    this.algoList[i].index === 19 ? this.algoList[i].enabled = this.outOfBounds.enabled : "";
                    this.algoList[i].index === 20 ? this.algoList[i].enabled = this.enterArea.enabled : "";
                    this.algoList[i].index === 21 ? this.algoList[i].enabled = this.leaveArea.enabled : "";
                    this.algoList[i].index === 22 ? this.algoList[i].enabled = this.playPhone.enabled : "";
                    this.algoList[i].index === 23 ? this.algoList[i].enabled = this.grab.enabled : "";
                    this.algoList[i].index === 24 ? this.algoList[i].enabled = this.smoking.enabled : "";
                    this.algoList[i].index === 25 ? this.algoList[i].enabled = this.atmRemain.enabled : "";
                    this.algoList[i].index === 26 ? this.algoList[i].enabled = this.recline.enabled : "";
                    this.algoList[i].index === 27 ? this.algoList[i].enabled = this.faceClustering.enabled : "";
                    this.algoList[i].index === 28 ? this.algoList[i].enabled = this.hijack.enabled : "";
                    this.algoList[i].index === 29 ? this.algoList[i].enabled = (this.flowAreasNew && this.flowAreasNew.length > 0 ? true : false) : "";
                    this.algoList[i].index === 30 ? this.algoList[i].enabled = this.swapBag.enabled : "";
                    this.algoList[i].index === 31 ? this.algoList[i].enabled = this.touchBag.enabled : "";
                }
                this.enabled = this.getIndex != 29 ? this.algoList[flag].enabled : this.algoList[27].enabled;
                // 获取使用当前算法的通道并显示在右下角
                this.getAlgoNum();
                setTimeout(() => {
                    this.btnDisabled = false;
                    let relatedType = localStorage.getItem("relatedType");
                    if (relatedType == 2)
                        this.reload();
                }, 1000);
            }).catch(_ => { this.btnDisabled = false; });
        },
        formData(val) {
          this.formDataObj = val
        },
    },
    watch: {
        enabled(value) {
            this.channelEnabledList = this.channelList.filter(item => {
                return item.enabled;
            });
            let algorithmName = this.algoList[this.flagIndex].algorithm;
            this.channelEnabledCheckedList = this.channelEnabledList.map(item => {
                if (item.id == this.algorithm.channelId) {
                    item.config[algorithmName].enabled = value;
                }
                return item.config[algorithmName].enabled;
            });
        },
        'algorithm.channelId'() {
          this.$nextTick(() => {
            this.$refs.channelIdInit && this.$refs.channelIdInit.getTask(this.algorithm.channelId)
          })
          if(!(this.getIndex == 1 || this.getIndex == 3 || this.getIndex == 9)) {
            this.$nextTick(() => {
              this.$refs.channelIdInitDef && this.$refs.channelIdInitDef.initDef(this.algorithm.channelId, this.getIndex, this.channelList, this.alName)
            })
          }
        },
        getIndex(value) {
          if(value == 0 || value == 2) {
            this.$nextTick(() => {
              this.$refs.channelIdInit && this.$refs.channelIdInit.getTask(this.algorithm.channelId)
            })
          }
          if((value == 1 || value == 3 || value == 9) && this.flag) {
            this.activeName = 'first'
          }
          if(!(value == 1 || value == 3 || value == 9)) {
            this.$nextTick(() => {
              this.$refs.channelIdInitDef && this.$refs.channelIdInitDef.initDef(this.algorithm.channelId, this.getIndex, this.channelList, this.alName)
            })
          }
          bus.$emit('getIndexTime',this.getIndex)
        },
    },
    components: { Deployment, SmartLib }
}
</script>

<style lang="less" scoped>
.algo::-webkit-scrollbar {
  // display: none;
}
.nothing {
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 16px;
  font-weight: bold;
  width: 100%;
}
#systemBox .algo{
  scrollbar-width: none;
  font-size: 12px;
  overflow: auto; 
  height: calc(100vh - 128px);
  color: #666;
  margin: -20px;
  padding: 20px;
  padding-right: 0;
  padding-left: 0;
  .algo-canvas {
    user-select: none;
  }
  &_top{
    margin-top: -3px;
    padding-left: 20px;
    margin-bottom: -3px;
    .paramSelect {
      /deep/ .el-select-dropdown__item {
        font-size: 12px;
        color: #999;
      }
    }
  }
  .gap_line {
    height: 15px;
    background: #EBEEF2;
  }
  &_bottom{
    display: flex;
    height: 90%;
    //overflow: auto;
    
    &_right{
      display: flex;
      flex-direction: column;
      width: 100%;
      padding-left: 20px;
      .smart-tab {
        /deep/ .el-tabs__nav-scroll {
          padding-left: 0;
          margin-top: 25px;

        }
        /deep/ .el-tabs--card>.el-tabs__header .el-tabs__nav {
          border: none;
        }
        /deep/ .el-tabs__item {
          font-size: 13px;
          width: 186px;
          border-left: none;
          text-align: center;
          color: #747474;
        }
        /deep/ .el-tabs__item:nth-child(1) {
          margin-right: -25px;
          background: url('imgs/params_bg1.png');
        }
        /deep/ .el-tabs__item:nth-child(1).is-active {
          margin-right: -25px;
          color: #fff;
          background: url('imgs/params_bg.png');
        }
        /deep/ .el-tabs__item:nth-child(2) {
          background: url('imgs/deploy_bg.png');
        }
        /deep/ .el-tabs__item:nth-child(2).is-active {
          background: url('imgs/deploy_bg1.png');
          color: #fff;
        }       
        .el-tabs__content {
          overflow: hidden;
        }
      }
      &_top{
        display: flex;
        width: 100%;
        height: 41px;
        line-height: 41px;
        border-bottom: 1px solid rgb(235, 238, 245);
        background-color: #3A74FF0D;
      }
      &_bottom{
        display: flex;
        // width: 100%;
        height: calc(100% - 41px);
        &_title {
          color: #333;
          font-size: 13px;
          display: inline-block;
          font-weight: 500;
        }
        &_left{
          width: 55%;
          min-width: 650px;
          height: calc(100% - 20px);;
          display: flex;
          flex-direction: column;
          border-right: 1px solid rgb(235, 238, 245);
          padding-top: 20px;
          &_top{
            width: 640px;
            height: 360px;
            position: relative;
            margin-top: 10px;
            margin:0 auto;
          }
          .but_con {
            margin: 10px;
            display: flex;
            color: #2178C8;
            font-size: 13px;
            .identifyClass {
              width: 96px;
              height: 28px;
              display: flex;
              justify-content: center;
              align-items: center;
              background: #FFFFFF;
              border-radius: 2px;
              border: 1px solid #E4E4E4;
              cursor: pointer;
            }
            .identifyClass1 {
              margin-left: 20px;
              width: 72px;
            }
            .identifyClass:hover {
              background: #EEF7FF;
            }
            .description {
              margin-left: 10px;
              height: 28px;
              line-height: 28px;
              color: #999;
            }
          }
          &_bottom{
            height: calc(100% - 380px);
            display: flex;
            margin:10px;
            font-size: 13px;
            .con {
              width:100%;
              .total {
                color: #333;
                font-weight: 500;
              }
              .title {
                margin: 10px 10px 0 0;
                width: 100%;
                height: 34px;
                line-height: 34px;
                background: #F3F5F9;
                border-radius: 2px;
                color: #333;
                display: flex;
                .title1 {
                  width: 50%;
                  margin-left: 20px;
                }
              }
              .channelTable {
                background: #FCFDFF;
                color: #666;
                width: 100%;
                display: flex;
                .ellipsis {
                  width: 50%;
                  margin-left: 20px;
                }
              }
            }
          }
        }
        &_right{
          width: 45%;
          min-width: 410px;
          height: 100%;
          .enable {
            color: #333;
            font-weight: 500;
            margin-left: 20px;
            margin-top: -10px;
            margin-bottom: -10px;
            .switch {
              margin-left: 10px;
            }
          }
          .con {
            .title {
              height:28px;
              line-height:28px;
              margin-left:20px;
              color: #333;
              font-weight: 500;
            }
            .lib {
              margin-top: 20px;
              .title1 {
                margin-left:20px;
                color: #333;
                font-weight: 500;
              }
              .lib_con {
                margin-top: 20px;
              }
              /deep/ .el-form-item {
                margin-bottom: 0;
              }
            }
          }
        }
        .save {
          margin-left: 20px;
          width: 78px;
          height: 30px;
          background: #2178C8;
          border-radius: 2px;
          color: #fff;
          border: none;
          font-size: 12px;
          cursor: pointer;
        }
      }
    }
  }
  .inputLab {
    margin-top: -12px;
  }
  .input {
    height: 23px;
    font-size: 12px;
    width: 100px;
    border: 1px solid #dcdfe6;
    padding-left: 6px;
  }
  .el-input__icon {
    line-height: 30px;
  }
  .typeface {
    color:#909399;
    font-size:12px
  }
  .inputWidth {
    width:75px
  }
  .el-col-12 {
    width: 47%;
  }
  ::-webkit-scrollbar {
    /*隐藏滚轮*/
    // display: none;
    width: 0;
  }
}
/deep/ .el-input__icon {
  height: fit-content !important;
}
/deep/ .el-checkbox__label {
  color: #909399;
  font-size: 12px !important;
}
.showDetail:hover {
  cursor: pointer;
  color:#17FFFA
}
.mustIcon::before {
  content: '*';
  color: #F56C6C;
  margin-right: 4px;
}
/deep/.el-checkbox__input.is-checked + .el-checkbox__label {
  color: #909399 !important;
}
/deep/.el-checkbox__input.is-checked .el-checkbox__inner, .el-checkbox__input.is-indeterminate .el-checkbox__inner {
  background-color: #909399 !important;
}
/deep/.el-checkbox__input.is-checked .el-checkbox__inner, .el-checkbox__input.is-indeterminate .el-checkbox__inner {
  border-color: #909399 !important;
  background-color: #909399 !important;
}
.batchApp /deep/ .el-dialog__body{
  margin: 15px;
}
.batchApp /deep/ .el-dialog__body > label{
  display: block;
  margin: 10px auto;
}
.batchApp /deep/ .el-dialog__body .el-checkbox{
  margin: 10px;
}
.batchApp /deep/ .el-dialog__body .el-checkbox-group{
  display: flex;
  justify-content: flex-start;
  flex-wrap: wrap;
  width: 100%;
}
.batchApp /deep/ .el-dialog__body .el-checkbox-group .el-checkbox{
  flex: 1;
  // height: 200px;
  /*设置最小宽度，才会让元素排不下，导致换行排列*/
  min-width: calc((100% - 50px) / 2);
}
.batchApp /deep/.el-checkbox__input.is-checked + .el-checkbox__label {
  color: #0e0f0f !important;
  // font-size: 14px !important;
}
.batchApp /deep/.el-checkbox__input.is-checked .el-checkbox__inner, .el-checkbox__input.is-indeterminate .el-checkbox__inner {
  background-color: #409EFF !important;
}
.batchApp /deep/.el-checkbox__input.is-checked .el-checkbox__inner, .el-checkbox__input.is-indeterminate .el-checkbox__inner {
  border-color: #409EFF !important;
  background-color: #409EFF !important;
}
.batchApp .buttons {
  display: flex;
  justify-content: center;
}
/deep/ .el-tabs__nav-scroll {
  padding-left: 5px; 
  font-size: 14px; 
  border-radius: 0 5px 5px 0;
}
/deep/ .el-form-item__label {
  font-size: 12px;
}
/deep/ .el-input__inner {
  height: 28px;
  line-height: 28px;
  border-radius: 2px;
  border: 1px solid #EBEEF5;
}
/deep/ .el-date-editor .el-range-separator {
  line-height: 21px;
  font-size: 12px;
}
/deep/ .el-date-editor--timerange.el-input__inner {
    width: 266px;
}
/deep/ .el-tabs__content {
  overflow: auto;
}
/deep/ .el-icon-question {
  color: #000;
}
</style>
