<template>
    <el-dialog
        title="权限配置"
        :close-on-click-modal="false"
        :close-on-press-escape="false"
        :visible.sync="visible"
		width="70%"
        append-to-body>
        <el-tabs v-model="configActiveName" style="margin-top: -20px" @tab-click="changeTab">
            <el-tab-pane label="本地配置" name="first" v-if="type !== 'remote'">
                <el-checkbox :disabled="localDisabled" :indeterminate="isLocalIndeterminate" :checked="isLocalIndeterminate" v-model="localCheckAll" @change="handleLocalCheckAllChange" v-if="type === 'add' || type === 'edit'">全选</el-checkbox>
                <el-checkbox disabled :indeterminate="isLocalIndeterminate" :checked="isLocalIndeterminate" v-model="localCheckAll" @change="handleLocalCheckAllChange" v-else>全选</el-checkbox>
                <div style="margin: 15px 0;"></div>
                <el-checkbox-group v-model="checkedLocal" @change="handleLocalCheckedChange" v-if="type === 'add' || type === 'edit'">
                    <el-checkbox :disabled="localDisabledConfig.includes(item.value)" v-for="(item,index) in localConfig" :label="item.value" :key="index" style="width: 150px;margin-bottom:8px">{{item.name}}</el-checkbox>
                </el-checkbox-group>
                <el-checkbox-group v-model="checkedLocal" @change="handleLocalCheckedChange" v-else>
                    <el-checkbox disabled v-for="(item,index) in localConfig" :label="item.value" :key="index" style="width: 150px;margin-bottom:8px">{{item.name}}</el-checkbox>
                </el-checkbox-group>
                <el-tabs v-model="localActiveName" @tab-click="changeLocalTab">
                    <el-tab-pane :disabled="localDisabledTabs.includes(item.value)" v-for="(item,index) of localTabs" :label="item.label" :name="item.name" :key="index">
                        <el-checkbox :indeterminate="isLocalChannelIndeterminate" v-model="localChannelChecklAll" @change="handleLocalChannelCheckAllChange" v-if="type === 'add' || type === 'edit'">全选</el-checkbox>
                        <el-checkbox disabled :indeterminate="isLocalChannelIndeterminate" v-model="localChannelChecklAll" @change="handleLocalChannelCheckAllChange" v-else>全选</el-checkbox>
                        <div style="margin: 15px 0;"></div>
                        <el-checkbox-group v-model="localChannelArray[item.name]" @change="handleLocalChannelCheckedChange" v-if="type === 'add' || type === 'edit'">
                            <el-checkbox v-for="item in localChannelList" :label="item" :key="item" style="width: 50px;margin-bottom:8px">{{item}}</el-checkbox>
                        </el-checkbox-group>
                        <el-checkbox-group v-model="localChannelArray[item.name]" @change="handleLocalChannelCheckedChange" v-else>
                            <el-checkbox disabled v-for="item in localChannelList" :label="item" :key="item" style="width: 50px;margin-bottom:8px">{{item}}</el-checkbox>
                        </el-checkbox-group>
                    </el-tab-pane>
                </el-tabs>
            </el-tab-pane>
            <el-tab-pane label="远程配置" name="second" v-if="type !== 'local'">
                <el-checkbox :disabled="remoteDisabled" :indeterminate="isRemoteIndeterminate" :checked="isRemoteIndeterminate" v-model="remoteCheckAll" @change="handleRemoteCheckAllChange" v-if="type === 'add' || type === 'edit'">全选</el-checkbox>
                <el-checkbox disabled :indeterminate="isRemoteIndeterminate" :checked="isRemoteIndeterminate" v-model="remoteCheckAll" @change="handleRemoteCheckAllChange" v-else>全选</el-checkbox>
                <div style="margin: 15px 0;"></div>
                <el-checkbox-group v-model="checkedRemote" @change="handleRemoteCheckedChange" v-if="type === 'add' || type === 'edit'">
                    <el-checkbox :disabled="remoteDisabledConfig.includes(item.value)" v-for="(item,index) in remoteConfig" :label="item.value" :key="index" style="width: 150px;margin-bottom:8px">{{item.name}}</el-checkbox>
                </el-checkbox-group>
                <el-checkbox-group v-model="checkedRemote" @change="handleRemoteCheckedChange" v-else>
                    <el-checkbox disabled v-for="(item,index) in remoteConfig" :label="item.value" :key="index" style="width: 150px;margin-bottom:8px">{{item.name}}</el-checkbox>
                </el-checkbox-group>
                <el-tabs v-model="remoteActiveName" @tab-click="changeRemoteTab">
                    <el-tab-pane :disabled="remoteDisabledTabs.includes(item.value)" v-for="(item,index) of remoteTabs" :label="item.label" :name="item.name" :key="index">
                        <el-checkbox :indeterminate="isRemoteChannelIndeterminate" :checked="isRemoteChannelIndeterminate" v-model="remoteChanneChecklAll" @change="handleRemoteChannelCheckAllChange" v-if="type === 'add' || type === 'edit'">全选</el-checkbox>
                        <el-checkbox disabled :indeterminate="isRemoteChannelIndeterminate" :checked="isRemoteChannelIndeterminate" v-model="remoteChanneChecklAll" @change="handleRemoteChannelCheckAllChange" v-else>全选</el-checkbox>
                        <div style="margin: 15px 0;"></div>
                        <el-checkbox-group v-model="remoteChannelArray[item.name]" @change="handleRemoteChannelCheckedChange" v-if="type === 'add' || type === 'edit'">
                            <el-checkbox v-for="item in remoteChannelList" :label="item" :key="item" style="width: 50px;margin-bottom:8px">{{item}}</el-checkbox>
                        </el-checkbox-group>
                        <el-checkbox-group v-model="remoteChannelArray[item.name]" @change="handleRemoteChannelCheckedChange" v-else>
                            <el-checkbox disabled v-for="item in remoteChannelList" :label="item" :key="item" style="width: 50px;margin-bottom:8px">{{item}}</el-checkbox>
                        </el-checkbox-group>
                    </el-tab-pane>
                </el-tabs>
            </el-tab-pane>
        </el-tabs>
        <div style="padding: 15px 0 0px 30px" v-if="type === 'add' || type === 'edit'">
            <el-button  size="small" @click="onSave">保存</el-button>
        </div>
    </el-dialog>
</template>

<script>
import { userDetails } from '@/api'
export default {
    name: 'jurisdiction',
    data () {
        return {
            localDisabled: false,
            remoteDisabled: false,
            type: null,
            id: null,
            visible: false,
            configActiveName: 'first',
            /**本地配置 */
            localCheckAll: false,
            checkedLocal: [],
            localDisabledConfig: [],
            localNoDisabledConfig: [],
            localConfig: [{
                name: '本地通道配置',
                value: 'PermChanMng',
            },{
                name: '本地事件管理',
                value: "PermEventMng",
            },{
                name: '本地录像管理',
                value: "PermRecordMng",
            },{
                name: '本地存储管理',
                value: "PermStoreMng",
            },{
                name: '本地网络管理',
                value: "PermNetMng",
            },{
                name: '本地系统管理',
                value: "PermSysMng",
            },{
                name: '本地智能分析',
                value: "PermSmart",
            },{
                name: '本地产品维护',
                value: "PermSysMaintain",
            },{
                name: '本地用户管理',
                value: 'PermUserMng'
            },{
                name: '本地硬盘管理',
                value: "PermHardDiskMng",
            // },{
            //     name: '本地升级管理',
            //      value: 'PermUpgradeMng'
            // },{
            //     name: '本地关机/重启/注销',
            //     value: "PermDeviceReboot",
            // },{
            //     name: '本地恢复出厂设置',
            //     value: "PermRestoreSettings",
            // },{
            //     name: '本地报警清除',
            //     value: "PermAlarmClear",
            }],
            isLocalIndeterminate: true,
            localDisabledTabs: [],
            localNoDisabledTabs: [],
            localTabs: [{
                label: '本地预览',
                value: 'PermChsLive',
                name: 'first'
            },{
                label: '遮盖预览',
                value: 'PermChsMaskLive',
                name: 'second'
            },{
                label: '本地回放',
                value: 'PermChsPlayback',
                name: 'three'
            },{
                label: '遮盖回放',
                value: 'PermChsMaskPlayback',
                name: 'four'
            }],
            localActiveName: 'first',
            localChannelList: [],
            localChannelArray: {
                first: [],
                second: [],
                three: [],
                four: [],
            },
            localChannelChecklAll: false,
            isLocalChannelIndeterminate: true,

            /**远程配置 */
            remoteCheckAll: false,
            checkedRemote: [],
            remoteDisabledConfig: [],
            remoteNoDisabledConfig: [],
            remoteConfig: [{
                name: '远程通道配置',
                value: 'PermChanMng',
            },{
                name: '远程事件管理',
                value: "PermEventMng",
            },{
                name: '远程录像管理',
                value: "PermRecordMng",
            },{
                name: '远程存储管理',
                value: "PermStoreMng",
            },{
                name: '远程网络管理',
                value: "PermNetMng",
            },{
                name: '远程系统管理',
                value: "PermSysMng",
            },{
                name: '远程智能分析',
                value: "PermSmart",
            },{
                name: '远程产品维护',
                value: "PermSysMaintain",
            },{
                name: '远程用户管理',
                value: 'PermUserMng'
            },{
                name: '远程硬盘管理',
                value: "PermHardDiskMng",
            // },{
            //     name: '本地升级管理',
            //      value: 'PermUpgradeMng'
            // },{
            //     name: '本地关机/重启/注销',
            //     value: "PermDeviceReboot",
            // },{
            //     name: '本地恢复出厂设置',
            //     value: "PermRestoreSettings",
            // },{
            //     name: '本地报警清除',
            //     value: "PermAlarmClear",
            }],
            isRemoteIndeterminate: true,
            remoteDisabledTabs: [],
            remoteNoDisabledTabs: [],
            remoteTabs: [{
                label: '远程预览',
                value: 'PermChsLive',
                name: 'first'
            },{
                label: '遮盖预览',
                value: 'PermChsMaskLive',
                name: 'second'
            },{
                label: '远程回放',
                value: 'PermChsPlayback',
                name: 'three'
            },{
                label: '遮盖回放',
                value: 'PermChsMaskPlayback',
                name: 'four'
            }],
            remoteActiveName: 'first',
            remoteChannelList: [],
            remoteChannelArray: {
                first: [],
                second: [],
                three: [],
                four: [],
            },
            remoteChanneChecklAll: false,
            isRemoteChannelIndeterminate: true,
        }
    },
    methods: {
        async init (id,type,rightsRule,newSelect) {
            this.nvrRd = Number(localStorage.getItem('nvrRd'))
            this.nvrRdList = Array.from({length:this.nvrRd}, (v,k) => k+1);
            this.localDisabledConfig = []
            this.localNoDisabledConfig = []
            this.remoteDisabledConfig = []
            this.remoteNoDisabledConfig = []
            this.id = id
            this.type = type
            if (type === 'remote') {
                this.configActiveName = 'second'
            } else {
                this.configActiveName = 'first'
            }
            this.rightsRule = rightsRule
            this.visible = true
            this.localTab = 'first'
            this.remoteTab = 'first'
            if (id) {
                // 从列表中查看权限或者编辑
                this.localChannelList = this.nvrRdList
                this.remoteChannelList = this.nvrRdList
                userDetails(id).then(res => {
                    if(res.data.code === 200000) {
                        // 本地配置
                        this.localChannelArray = {
                            first:  (newSelect ? newSelect : res.data.data.rights).local.chPermList.PermChsLive || [],
                            second: (newSelect ? newSelect : res.data.data.rights).local.chPermList.PermChsMaskLive || [],
                            three: (newSelect ? newSelect : res.data.data.rights).local.chPermList.PermChsPlayback || [],
                            four: (newSelect ? newSelect : res.data.data.rights).local.chPermList.PermChsMaskPlayback || [],
                        }
                        this.isLocalChannelIndeterminate = (newSelect ? newSelect : res.data.data.rights).local.chPermList.PermChsLive?.length === 32 ? false : true
                        this.localChannelChecklAll = (newSelect ? newSelect : res.data.data.rights).local.chPermList.PermChsLive?.length === 32 ? true : false
                        /* 本地配置 */
                        for (let i = 0; i < this.localConfig.length; i++) {
                            if (!rightsRule.local.permisions.find(item => item === this.localConfig[i].value)) {
                                this.localDisabledConfig.push(this.localConfig[i].value)
                            }
                            if (rightsRule.local.permisions.find(item => item === this.localConfig[i].value)) {
                                this.localNoDisabledConfig.push(this.localConfig[i].value)
                            }
                        }
                        this.localDisabled = this.localDisabledConfig.length === 8 ? true : false
                        this.isLocalIndeterminate = this.localDisabledConfig.length === 8 ? true : false
                        /* 本地回放等tab */
                        for (let j = 0; j < this.localTabs.length; j++) {
                            if (!rightsRule.local.permisions.find(item => item === this.localTabs[j].value)) {
                                this.localDisabledTabs.push(this.localTabs[j].value)
                            }
                            if (rightsRule.local.permisions.find(item => item === this.localTabs[j].value)) {
                                this.localNoDisabledTabs.push(this.localTabs[j].value)
                            }
                        }
                        /* 远程配置 */
                        for (let m = 0; m < this.remoteConfig.length; m++) {
                            if (!rightsRule.remote.permisions.find(item => item === this.remoteConfig[m].value)) {
                                this.remoteDisabledConfig.push(this.remoteConfig[m].value)
                            }
                            if (rightsRule.remote.permisions.find(item => item === this.remoteConfig[m].value)) {
                                this.remoteNoDisabledConfig.push(this.remoteConfig[m].value)
                            }
                        }
                        this.remoteDisabled = this.remoteDisabledConfig.length === 8 ? true : false
                        this.isRemoteIndeterminate = this.remoteDisabledConfig.length === 8 ? true : false
                        /* 远程预览等tab */
                        for (let n = 0; n < this.remoteTabs.length; n++) {
                            if (!res.data.data.rights.remote.permisions.find(item => item === this.remoteTabs[n].value)) {
                                this.remoteDisabledTabs.push(this.remoteTabs[n].value)
                            }
                            if (res.data.data.rights.remote.permisions.find(item => item === this.remoteTabs[n].value)) {
                                this.remoteNoDisabledTabs.push(this.remoteTabs[n].value)
                            }
                        }
                        // 远程配置
                        this.remoteChannelArray = {
                            first: (newSelect ? newSelect : res.data.data.rights).remote.chPermList.PermChsLive || [],
                            second: (newSelect ? newSelect : res.data.data.rights).remote.chPermList.PermChsMaskLive || [],
                            three: (newSelect ? newSelect : res.data.data.rights).remote.chPermList.PermChsPlayback || [],
                            four: (newSelect ? newSelect : res.data.data.rights).remote.chPermList.PermChsMaskPlayback || [],
                        }
                        this.isRemoteChannelIndeterminate = (newSelect ? newSelect : res.data.data.rights).remote.chPermList.PermChsLive?.length === 32 ? false : true
                        this.remoteChanneChecklAll = (newSelect ? newSelect : res.data.data.rights).remote.chPermList.PermChsLive?.length === 32 ? true : false

                        // 解决设置全选问题
                        let localConfigNames = []
                        this.localConfig.map(item => {
                            localConfigNames.push(item.value)
                        })
                        let checkedLocalValue = (newSelect ? newSelect : res.data.data.rights).local.permisions
                        for (let k = 0; k < this.localTabs.length; k++) {
                            checkedLocalValue = checkedLocalValue.filter(val => val !== this.localTabs[k].value)
                            .filter(item => {
                                return localConfigNames.includes(item)
                            })
                        }
                        this.checkedLocal = checkedLocalValue
                        this.isLocalIndeterminate = this.checkedLocal.length === this.localNoDisabledConfig.length ? false : true
                        this.localCheckAll = this.checkedLocal.length === this.localNoDisabledConfig.length ? true : false
                        
                        
                        let remoteConfigNames = []
                        this.remoteConfig.map(item => {
                            remoteConfigNames.push(item.value)
                        })
                        let checkedRemoteValue = (newSelect ? newSelect : res.data.data.rights).remote.permisions
                        for (let k = 0; k < this.remoteTabs.length; k++) {
                            checkedRemoteValue = checkedRemoteValue.filter(val => val !== this.remoteTabs[k].value)
                            .filter(item => {
                                return remoteConfigNames.includes(item)
                            })
                        }
                        this.checkedRemote = checkedRemoteValue
                        this.isRemoteIndeterminate = this.checkedRemote.length === this.remoteNoDisabledConfig.length ? false : true
                        this.remoteCheckAll = this.checkedRemote.length === this.remoteNoDisabledConfig.length ? true : false
                    }
                })
            } else {
                // 新增用户权限
                /* 本地设置 */
                this.handleLocalCheckAllChange(true)
                this.isLocalIndeterminate = false
                this.localCheckAll = true
                for (let i = 0; i < this.localConfig.length; i++) {
                    if (!rightsRule.local.permisions.find(item => item === this.localConfig[i].value)) {
                        this.localDisabledConfig.push(this.localConfig[i].value)
                    }
                    if (rightsRule.local.permisions.find(item => item === this.localConfig[i].value)) {
                        this.localNoDisabledConfig.push(this.localConfig[i].value)
                    }
                }
                this.localDisabled = this.localNoDisabledConfig.length === 0
                this.isLocalIndeterminate = false;
                /* 本地回放等tab */
                for (let j = 0; j < this.localTabs.length; j++) {
                    if (!Object.keys(rightsRule.local.chPermList).find(item => item === this.localTabs[j].value)) {
                        this.localDisabledTabs.push(this.localTabs[j].value)
                    }
                    if (Object.keys(rightsRule.local.chPermList).find(item => item === this.localTabs[j].value)) {
                        this.localNoDisabledTabs.push(this.localTabs[j].value)
                    }
                }
                this.localChannelList = rightsRule.local.chPermList['PermChsLive']
                /* 远程设置 */
                this.handleRemoteCheckAllChange(true)
                this.isRemoteIndeterminate = false
                this.remoteCheckAll = true
                for (let m = 0; m < this.remoteConfig.length; m++) {
                    if (!rightsRule.remote.permisions.find(item => item === this.remoteConfig[m].value)) {
                        this.remoteDisabledConfig.push(this.remoteConfig[m].value)
                    }
                    if (rightsRule.remote.permisions.find(item => item === this.remoteConfig[m].value)) {
                        this.remoteNoDisabledConfig.push(this.remoteConfig[m].value)
                    }
                }
                this.remoteDisabled = this.remoteNoDisabledConfig.length === 0
                this.isRemoteIndeterminate = false;
                /* 远程预览等tab */
                for (let n = 0; n < this.remoteTabs.length; n++) {
                    if (!Object.keys(rightsRule.remote.chPermList).find(item => item === this.remoteTabs[n].value)) {
                        this.remoteDisabledTabs.push(this.remoteTabs[n].value)
                    }
                    if (Object.keys(rightsRule.remote.chPermList).find(item => item === this.remoteTabs[n].value)) {
                        this.remoteNoDisabledTabs.push(this.remoteTabs[n].value)
                    }
                }
                this.remoteChannelList = rightsRule.remote.chPermList['PermChsLive']

                /* 用户组管理 */
                if (type === 'local' || type === 'remote') {
                    // 本地
                    this.handleLocalChannelCheckAllChange(true)
                    this.isLocalChannelIndeterminate = false
                    this.localChannelChecklAll = true
                    // 远程
                    this.handleRemoteChannelCheckAllChange(true)
                    this.isRemoteChannelIndeterminate = false
                    this.remoteChanneChecklAll = true
                }
                // 新增用户--用户权限保存侯再进去编辑
                if (newSelect) {
                    let localConfigNames = []
                    this.localConfig.map(item => {
                        localConfigNames.push(item.value)
                    })
                    let checkedLocalValue = newSelect.local.permisions
                    for (let k = 0; k < this.localTabs.length; k++) {
                        checkedLocalValue = checkedLocalValue.filter(val => val !== this.localTabs[k].value)
                        .filter(item => {
                            return localConfigNames.includes(item)
                        })
                    }
                    this.checkedLocal = checkedLocalValue
                    this.isLocalIndeterminate = this.checkedLocal.length === this.localNoDisabledConfig.length ? false : true
                    this.localCheckAll = this.checkedLocal.length === this.localNoDisabledConfig.length ? true : false

                    let remoteConfigNames = []
                    this.remoteConfig.map(item => {
                        remoteConfigNames.push(item.value)
                    })
                    let checkedRemoteValue = newSelect.remote.permisions
                    for (let k = 0; k < this.remoteTabs.length; k++) {
                        checkedRemoteValue = checkedRemoteValue.filter(val => val !== this.remoteTabs[k].value)
                        .filter(item => {
                            return remoteConfigNames.includes(item)
                        })
                    }
                    this.checkedRemote = checkedRemoteValue
                    this.isRemoteIndeterminate = this.checkedRemote.length === this.remoteNoDisabledConfig.length ? false : true
                    this.remoteCheckAll = this.checkedRemote.length === this.remoteNoDisabledConfig.length ? true : false
                }
                if (!id) {
                    // 本地
                    this.isLocalChannelIndeterminate = false
                    this.localChannelChecklAll = true
                    this.localChannelArray = {
                        first: newSelect ? newSelect.local.chPermList.PermChsLive : this.nvrRdList,
                        second: newSelect ? newSelect.local.chPermList.PermChsMaskLive : this.nvrRdList,
                        three: newSelect ? newSelect.local.chPermList.PermChsPlayback : this.nvrRdList,
                        four: newSelect ? newSelect.local.chPermList.PermChsMaskPlayback : this.nvrRdList,
                    }
                    // 远程
                    this.isRemoteChannelIndeterminate = false
                    this.remoteChanneChecklAll = true
                    this.remoteChannelArray = {
                        first: newSelect ? newSelect.remote.chPermList.PermChsLive : this.nvrRdList,
                        second: newSelect ? newSelect.remote.chPermList.PermChsMaskLive : this.nvrRdList,
                        three: newSelect ? newSelect.remote.chPermList.PermChsPlayback : this.nvrRdList,
                        four: newSelect ? newSelect.remote.chPermList.PermChsMaskPlayback : this.nvrRdList,
                    }
                }
            }
        },
        changeTab() {
            // console.log(this.remoteTabs)
        },
        /* 本地配置 */
        // 全选
        handleLocalCheckAllChange(val) {
            this.checkedLocal = val ? this.localNoDisabledConfig : [];
            this.isLocalIndeterminate = false;
        },
        // 单选
        handleLocalCheckedChange(value) {
            let checkedCount = value.length;
            this.localCheckAll = checkedCount === this.localNoDisabledConfig.length;
            this.isLocalIndeterminate = checkedCount > 0 && checkedCount < this.localNoDisabledConfig.length;
        },
        // 本地回放等tab -- 切换tab
        changeLocalTab(value) {
            this.localTab = value.name
            this.localChannelList = this.id ? this.nvrRdList : 
                                    this.rightsRule.local.chPermList[value.name === 'first' ? 'PermChsLive' : value.name === 'second' ? 'PermChsMaskLive' : 
                                                                     value.name === 'three' ? 'PermChsPlayback' :  value.name === 'four' ? 'PermChsMaskPlayback' : '']
            this.isLocalChannelIndeterminate = this.localChannelArray[this.localTab].length === 32 ? false : true
            this.localChannelChecklAll = this.localChannelArray[this.localTab].length === 32 ? true : false
            
            /* 用户组管理 */
            if (this.type === 'local' || this.type === 'remote') {
                this.handleLocalChannelCheckAllChange(true)
                this.isLocalChannelIndeterminate = false
                this.localChannelChecklAll = true
            }
        },
        // 本地回放等tab -- 全选
        handleLocalChannelCheckAllChange(val) {
            this.localChannelArray[this.localTab] = val ? this.localChannelList : [];
            this.isLocalChannelIndeterminate = false;
        },
        // 本地回放等tab -- 单选
        handleLocalChannelCheckedChange(value) {
            let checkedCount = value.length;
            this.localChannelChecklAll = checkedCount === this.localChannelList.length;
            this.isLocalChannelIndeterminate = checkedCount > 0 && checkedCount < this.localChannelList.length;
        },

        /* 远程配置 */
        // 全选
        handleRemoteCheckAllChange(val) {
            this.checkedRemote = val ? this.remoteNoDisabledConfig : [];
            this.isRemoteIndeterminate = false;
        },
        // 单选
        handleRemoteCheckedChange(value) {
            let checkedCount = value.length;
            this.remoteCheckAll = checkedCount === this.remoteNoDisabledConfig.length;
            this.isRemoteIndeterminate = checkedCount > 0 && checkedCount < this.remoteNoDisabledConfig.length;
        },
        // 远程预览等tab -- 切换tab
        changeRemoteTab(value) {
            this.remoteTab = value.name
            this.remoteChannelList = this.id ? this.nvrRdList : 
                                     this.rightsRule.remote.chPermList[value.name === 'first' ? 'PermChsLive' : value.name === 'second' ? 'PermChsMaskLive' : value.name === 'three' ? 'PermChsPlayback' : 
                                                           value.name === 'four' ? 'PermChsMaskPlayback' : '']
            this.isRemoteChannelIndeterminate = this.remoteChannelArray[this.remoteTab].length === 32 ? false : true
            this.remoteChanneChecklAll = this.remoteChannelArray[this.remoteTab].length === 32 ? true : false
            
            /* 用户组管理 */
            if (this.type === 'local' || this.type === 'remote') {
                this.handleRemoteChannelCheckAllChange(true)
                this.isRemoteChannelIndeterminate = false
                this.remoteChanneChecklAll = true
            }
        },
        // 远程预览等tab -- 全选
        handleRemoteChannelCheckAllChange(val) {
            this.remoteChannelArray[this.remoteTab] = val ? this.remoteChannelList : [];
            this.isRemoteChannelIndeterminate = false;
        },
        // 远程预览等tab -- 单选
        handleRemoteChannelCheckedChange(value) {
            let checkedCount = value.length;
            this.remoteChanneChecklAll = checkedCount === this.remoteChannelList.length;
            this.isRemoteChannelIndeterminate = checkedCount > 0 && checkedCount < this.remoteChannelList.length;
        },
        // 保存
        onSave() {
            // console.log(this.checkedLocal)
            // console.log(this.localNoDisabledTabs)
            // console.log(this.localChannelArray[this.localTab])
            // debugger
            let rights = {
                local: {
                    permisions: this.checkedLocal.concat(this.localNoDisabledTabs),
                    chPermList: {
                        PermChsLive: this.localChannelArray.first,
                        PermChsMaskLive: this.localChannelArray.second,
                        PermChsPlayback:  this.localChannelArray.three,
                        PermChsMaskPlayback: this.localChannelArray.four,
                    }
                },
                remote: {
                    permisions: this.checkedRemote.concat(this.remoteNoDisabledTabs),
                    chPermList: {
                        PermChsLive: this.remoteChannelArray.first,
                        PermChsMaskLive: this.remoteChannelArray.second,
                        PermChsPlayback:  this.remoteChannelArray.three,
                        PermChsMaskPlayback: this.remoteChannelArray.four,
                    }
                },
            }
            this.$emit('refRights',rights)
            this.visible = false
        },
    }
}
</script>
<style lang="less" scoped>
</style>

