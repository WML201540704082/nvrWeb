<template>
  <div ref="expdlg">
    <el-dialog 
        :title="isFileImport ? '文件导入' : '导出'"    
        :width=dialogWidth
        :append-to-body="true"
        :close-on-click-modal="false"
        :visible.sync="exportVis" >
        <div class="rowStart" style="height: 425px;">
            <div>
                <el-form size="mini" ref="ruleForm"  :model="form" label-width="140px" style="margin-top: -20px;">
                    <el-form-item label="设备名称">
                        <el-select v-model="form.devName" style="width: 340px" @change="onDevChange" @click.native="onDevClick">
                            <el-option v-for="item in devList" :label="item.name" :key="item.name" :value="item.path"></el-option>
                        </el-select>
                        <span style="margin-left: 10px; cursor: pointer; font-size: 16px;" @click="getDiskList"><i class="el-icon-refresh"></i></span>
                    </el-form-item>
                    <el-form-item label="路径">
                        <el-input placeholder="挂载路径" style="width: 340px;" disabled="disabled" type="text" v-model="form.devPath" ></el-input>
                    </el-form-item>
                </el-form> 
            </div>
            <div style="float: left;font-size: 12px; font-weight: 200;" class="fm">
                <div><span style="margin-left: 10px; cursor: pointer; font-size: 13px;font-weight: 500;" @click="onMenuClick(1)"><i class="el-icon-folder-add" style="margin-right: 4px;"></i>新建文件夹</span></div>
                <el-table
                    ref="multipleTable"
                    v-loading="loading1"
                    element-loading-text="正在加载中"
                    :data="fileList"
                    tooltip-effect="dark"
                    stripe
                    height="280"
                    highlight-current-row
                    :row-style="{height:'24px'}"
                    :cell-style="{padding:'0px'}"
                    :header-row-style="{height: '20px'}"
                    style="font-weight:400; font-size: 12px;width:560px; height:280px; overflow: auto;margin-top: 6px;"
                    @cell-dblclick="onCellDBClick"
                    @cell-click="onCellDBClick"
                    @row-contextmenu="onRightClick"
                    @row-click="onRowClick"
                    @sort-change="onSortChange"
                    @selection-change="handleSelectionChange"
                    >
                    <el-table-column
                        v-if="fileType === 'image' && !isSingle"
                        :selectable="checkSelectable"
                        type="selection"
                        width="55">
                    </el-table-column>
                    <el-table-column sortable="custom" prop="name" label="名称" :width=240 :show-overflow-tooltip="true">
                        <template slot-scope="scope">
                            <el-input v-if="scope.row.name != '..' && editRow && scope.row.index == editRow.index "
                                :ref="'input' + scope.row.index"
                                class="rename-input a1"
                                v-model="scope.row.name"
                                @blur="menuInputBlur"
                                @keyup.enter.native="$event.target.blur()"
                                auto-complete="off"
                                ></el-input>
                            <span v-else-if="scope.row.type=='D' || scope.row.name=='..'"><i class="el-icon-folder-opened" style="color:darkorange;margin-right: 4px;"></i>{{scope.row.name}}</span>
                            <span v-else-if="scope.row.type=='F' && (scope.row.ext=='ZIP' || scope.row.ext=='TAR' || scope.row.ext=='GZ' || scope.row.ext=='RAR')"><i class="el-icon-collection" style="color:darkblue;margin-right: 4px;"></i>{{scope.row.name}}</span>
                            <span v-else-if="scope.row.type=='F' && (scope.row.ext=='MP4' || scope.row.ext=='H264' || scope.row.ext=='WMV' || scope.row.ext=='AVI')"><i class="el-icon-video-camera" style="color:darkviolet;margin-right: 4px;"></i>{{scope.row.name}}</span>
                            <span v-else-if="scope.row.type=='F' && (scope.row.ext=='JPG' || scope.row.ext=='JPEG' || scope.row.ext=='PNG' || scope.row.ext=='BMP')"><i class="el-icon-picture" style="color:cadetblue;margin-right: 4px;"></i>{{scope.row.name}}</span>
                            <span v-else><i class="el-icon-document" style="margin-right: 4px;"></i>{{scope.row.name}}</span>
                        </template>
                    </el-table-column>
                    <el-table-column sortable="custom" prop="size" label="大小" :width=90></el-table-column>
                    <el-table-column sortable="custom" prop="type" label="类型" :width=70>
                        <template slot-scope="scope">
                            <template v-if="scope.row.type">
                                <template v-if="scope.row.type == 'D'">
                                    文件夹
                                </template>
                                <template v-else>
                                    文件
                                </template>
                            </template>
                        </template>
                    </el-table-column>
                    <el-table-column sortable="custom" prop="updatedAt" label="修改日期" :width=150></el-table-column>
                </el-table>
            </div>
            <div style="margin-top: 10px;">
                <span style="float:left;margin-top: 6px;margin-left: 2px;font-size: 13px;">剩余空间：{{available}}</span>
                <el-button type="primary" size="medium" @click="onSave" style="float:right;margin-top: 10px;" :disabled="form.devPath==''">保存</el-button>
                <el-button size="medium" @click="onCancel" style="float:right;margin-top: 10px;margin-right: 6px;">取消</el-button>
            </div>
        </div>
        <div id="menu" class="menuDiv">
            <ul class="menuUl">
                <li v-for="(item, index) in menus[menuRole]" :key="index" @click.stop="onMenuClick(item.operType)">
                {{ item.name }}
                </li>
            </ul>
        </div>
    </el-dialog>
  </div>
</template>

<script>
import { explorerMng,explorerMng9 } from '@/api';
import bus from '@/utils/eventBus'
export default {
  name: 'Export',
  data() {
    return {
        dialogWidth: '600px',
        exportVis: false,
        devList: [],
        fileList:[],
        form: {
            devIndex: -1,
            devName: "",
            devPath: "",
        },
        available: "",
        loading1: false,
        isFileImport: false,
        //右键菜单
        menus: [
            [
                { name: '创建目录', operType: 1 },
                { name: '创建目录并进入', operType: 2 },
                { name: '刷新', operType: 3 },
                { name: '重命名', operType: 4 },
                { name: '删除', operType: 5 }
            ],
            [
                { name: '创建目录', operType: 1 },
                { name: '创建目录并进入', operType: 2 },
                { name: '刷新', operType: 3 },
            ]
        ],
        menuRole: 0,
        editOldName: "",
        editRow: null,
        multipleSelection: [],
        fileType: '',
        isSingle: false,
    }
  },
    created() {
        this.getDiskList()
    },
    mounted() {
        document.addEventListener("click", (e) => {
            let menu = document.querySelector("#menu");
            if (menu&&menu.style.display != "none") {
                if (!this.$refs.expdlg.contains(e.target)) {
                    menu.style.display = "none";
                }
            }
        })
        document.addEventListener('contextmenu', this.onContextmenu)
    },
    methods: {
        init(exportVis, isFileImport = false, fileType = '', isSingle = false){
            this.isFileImport = isFileImport
            this.fileType = fileType
            this.exportVis = exportVis
            this.isSingle = isSingle
            if (exportVis && this.form.devPath) {
                //this.getDiskList()
                this.getFileList(this.form.devPath)
            }
        },
        handleSelectionChange(val) {
            this.multipleSelection = val;
        },
        checkSelectable(row) {
            return row.name.slice(-4) === '.jpg' || row.name.slice(-4) === '.jpeg' || 
                    row.name.slice(-4) === '.png' || row.name.slice(-4) === '.bmp'
        },
        getDiskList() {
            let obj = {}
            explorerMng("1", obj).then((res) => {
                if (res.data.code === 200000) {
                    let arr = res.data.data || []
                    this.devList = arr
                    if (this.devList.length > 0) {
                        this.form = {
                            devIndex: 0,
                            devName: this.devList[0].name,
                            devPath: this.devList[0].path
                        }
                        this.getDiskFree(this.devList[0].path)
                        this.getFileList(this.devList[0].path)
                    } else {
                        this.form = {
                            devIndex: -1,
                            devName: "",
                            devPath: ""
                        }
                        this.available = ""
                        this.fileList = []
                    }
                }
            }).catch(err=> {
                console.log("获取外接硬盘失败",err)
            });
        },
        refreshFileList(arr) {
            this.fileList = []
            if (this.form.devPath != this.devList[this.form.devIndex].path) {
                this.fileList.push({
                    index: -1,
                    name: "..",
                    size: "",
                    type: "",
                    updatedAt: "",
                    ext: ""
                })
            }
            let i = 0
            arr.forEach(item=> {
                let index= item.name.lastIndexOf(".");
                let ext = ""
                if (index > 0) {
                    ext = item.name.substr(index+1)
                }
                this.fileList.push({
                    index: i++,
                    ...item,
                    ext: ext.toUpperCase()
                })
            })
        },
        getDiskFree(path) {
            let obj = {"curPath": path}
            explorerMng("6", obj).then((res) => {
                if (res.data.code === 200000) {
                    this.available = res.data.data[0].free 
                }
            }).catch(err=> {
                console.log("获取磁盘空间失败",err)
            });
        },
        getFileList(path) {
            let obj = {"curPath": path}
            this.loading1 = true
            explorerMng("2", obj).then((res) => {
                this.loading1 = false
                if (res.data.code === 200000) {
                    if(this.isFileImport) {
                        if(!this.fileType) {
                            res.data.data = res.data.data.filter(item => {
                                return item.name.slice(-7) === '.tar.gz' || item.type === 'D'
                            })
                        } else if(this.fileType === 'image') {
                            res.data.data = res.data.data.filter(item => {
                                return item.name.slice(-4) === '.jpg' || item.name.slice(-4) === '.jpeg' || 
                                        item.name.slice(-4) === '.png' || item.name.slice(-4) === '.bmp' || item.type === 'D'
                            })
                        } else if (this.fileType === 'excel') {
                            res.data.data = res.data.data.filter(item => {
                                return item.name.slice(-5) === '.xlsx' || item.name.slice(-5) === '.xlsb' || 
                                        item.name.slice(-5) === '.xlsm' || item.name.slice(-5) === '.xltx' || item.type === 'D'
                            })
                        }
                    }
                    this.refreshFileList(res.data.data || [])
                }
            }).catch(err=> {
                this.loading1 = false
                console.log("获取文件列表失败",err)
            });
        },
        onSortChange(column) {
            let fieldName = column.prop;
            let sortingType = column.order;
            let tableData = [];
            let fixRow = null;
            this.fileList.map((item) => {
                if (item.name == "..") {
                    fixRow = item;
                }
            });
            this.fileList.forEach((item, index) => {
                if (item.name == "..") {
                    this.fileList.splice(index, 1);
                }
                return item;
            });
            if (sortingType == "ascending") {
                this.fileList = this.fileList.sort((a, b) => a[fieldName] > b[fieldName] ? 1 : a[fieldName] == b[fieldName] ? 0 : -1);
            } else if (sortingType == "descending") {
                this.fileList = this.fileList.sort((a, b) => a[fieldName] < b[fieldName] ? 1 : a[fieldName] == b[fieldName] ? 0 : -1);
            }
            if (fixRow != null) {
                tableData.push(fixRow,...this.fileList)
                this.fileList = tableData
            }
        },
        onDevClick(){
            let menu = document.querySelector("#menu");
            menu.style.display = "none";
        },
        onDevChange(e) {
            let Index = this.devList.findIndex(item=> {
                return e == item.path
            })
            let obj = this.devList[Index]
            this.form = {
                devIndex: Index,
                devName: obj.name,
                devPath: obj.path
            }
            this.getDiskFree(obj.path)
            this.getFileList(obj.path)
        },
        onCellDBClick(row) {
            if(this.isFileImport) {
                if (row.type == 'D') {
                    if(this.form.devPath.includes('.tar.gz')) {
                        this.form.devPath = this.form.devPath.substring(0, this.form.devPath.lastIndexOf('/'))
                    }
                    this.form.devPath = this.form.devPath + "/" + row.name
                    this.getFileList(this.form.devPath)
                } else if (row.name == "..") {
                    let parentPath = this.form.devPath.substring(0, this.form.devPath.lastIndexOf('/'));
                    this.form.devPath = parentPath
                    this.getFileList(parentPath)
                } else if(row.type == 'F' && this.isFileImport) {
                    if(this.form.devPath.includes('.tar.gz')) {
                        this.form.devPath = this.form.devPath.substring(0, this.form.devPath.lastIndexOf('/'))
                    }
                    let isFile = this.form.devPath.includes('.jpg') || this.form.devPath.includes('.jpeg') || 
                                this.form.devPath.includes('.png') || this.form.devPath.includes('.bmp') || this.form.devPath.includes('.xlsx') ||
                                this.form.devPath.includes('.xlsb') || this.form.devPath.includes('.xlsm') || this.form.devPath.includes('.xltx')
                    this.form.devPath = isFile ? this.form.devPath.split('/').slice(0, -1).join('/') + "/" + row.name : this.form.devPath + "/" + row.name
                    this.getFileList(this.form.devPath)
                }
            } else {
                this.onRowClick()
            }
        },
        onSave() {
            if(this.fileType == 'image') {
                if(this.multipleSelection.length > 0) {
                    for(let i in this.multipleSelection) {
                        let curPathList = this.multipleSelection[i].path.split('/')
                        let curPath = curPathList.slice(0, -1).join('/')
                        let obj = {
                            curPath,
                            fileName: this.multipleSelection[i].name
                        }
                        let That = this
                        explorerMng9("9", obj).then((res) => {
                            let reader = new FileReader()
                            reader.readAsDataURL(res.data)
                            reader.onload = function(e) {
                                let faceImage = e.target.result
                                That.multipleSelection[i].faceImage = faceImage
                                That.exportVis = false
                                bus.$emit('closed',{ok: true, path: That.form.devPath, list: That.multipleSelection});
                            }
                        })
                    }
                } else {
                    let curPathList = this.form.devPath.split('/')
                    let curPath = curPathList.slice(0, -1).join('/')
                    let fileName = curPathList.slice(-1).join('')
                    let obj = {
                        curPath,
                        fileName,
                    }
                    let That = this
                    explorerMng9("9", obj).then((res) => {
                        let reader = new FileReader()
                        reader.readAsDataURL(res.data)
                        reader.onload = function(e) {
                            let faceImage = e.target.result
                            That.exportVis = false
                            let file = {
                                name: fileName,
                                raw: faceImage
                            }
                            bus.$emit('closed',{ok: true, path: That.form.devPath, file: file});
                        }
                    })
                }
            } else if (this.fileType === 'excel') {
                let curPathList = this.form.devPath.split('/')
                let curPath = curPathList.slice(0, -1).join('/')
                let fileName = curPathList.slice(-1).join('')
                let obj = {
                    curPath,
                    fileName,
                }
                let That = this
                explorerMng9("9", obj).then((res) => {
                    let excelFile = {
                        file: res.data
                    }
                    this.exportVis = false
                    bus.$emit('closed',{ok: true, path: this.form.devPath, excelFile: excelFile});
                })
            } else {
                if(this.isFileImport) {
                    if( !this.fileType && !this.form.devPath.includes('.tar.gz')) {
                        this.$message.error('请确定导入的文件类型为.tar.gz')
                        return
                    }
                }
                this.exportVis = false
                this.$emit('closed',{ok: true, path: this.form.devPath});
            }
        },
        onCancel() {
            this.exportVis = false
            this.$emit('closed',{ok: false});
        },
        onContextmenu(event) {
            let tableBody = document.querySelector("div.fm div.el-table__body-wrapper");
            if (tableBody == event.target) {
                this.menuRole = 1
                let menu = document.querySelector("#menu");
                event.preventDefault();
                menu.style.left = event.clientX - 465 + "px";
                menu.style.top = event.clientY - 106 + "px";
                menu.style.display = "block";
                menu.style.zIndex = 999999;
                this.selectedRow = null
            }     
        },
        onRightClick(row, column, event) {
            if (row.name == "..") {
                return
            }
            this.menuRole = 0
            let menu = document.querySelector("#menu");
            event.preventDefault();
            menu.style.left = event.clientX - 465 + "px";
            menu.style.top = event.clientY - 106 + "px";
            menu.style.display = "block";
            menu.style.zIndex = 999999;
            this.selectedRow = row
        },
        onRowClick(row, column, event) {
            // this.$refs.multipleTable.toggleRowSelection(row)
            let menu = document.querySelector("#menu");
            menu.style.display = "none";
        },
        menuInputBlur() {
	        let oldName = this.editOldName
            let newName = this.editRow.name
            this.editOldName = "";
            this.editRow = null;
            if (oldName == newName) {
                return
            }
            this.loading1 = true
            let obj = {"curPath": this.form.devPath, "oldName": oldName, "newName": newName}
            explorerMng("4", obj).then((res) => {
                this.loading1 = false
                if (res.data.code === 200000) {
                    this.refreshFileList(res.data.data || [])
                }
            }).catch(err=> {
                this.loading1 = false
                this.$message({showClose: true,message: '重命名文件失败',type: "error"})
            }); 
	    },
        onMenuClick(index) {
            if (index === 1) {
                this.loading1 = true
                let obj = {"curPath": this.form.devPath, "newDir": "NewFolder", "enter": false}
                explorerMng("3", obj).then((res) => {
                    this.loading1 = false
                    if (res.data.code === 200000) {
                        this.refreshFileList(res.data.data || [])
                    }
                }).catch(err=> {
                    this.loading1 = false
                    this.$message({showClose: true, message: '新建文件夹失败',type: "error"})
                }); 
            } else if (index === 2) {
                this.loading1 = true
                let obj = {"curPath": this.form.devPath, "newDir": "NewFolder", "enter": true}
                explorerMng("3", obj).then((res) => {
                    this.loading1 = false
                    if (res.data.code === 200000) {
                        this.form.devPath = this.form.devPath + "/NewFolder"
                        this.refreshFileList(res.data.data || [])
                    }
                }).catch(err=> {
                    this.loading1 = false
                    this.$message({showClose: true,message: '新建文件夹失败',type: "error"})
                }); 
            } else if (index === 3) {
                this.getDiskFree(this.form.devPath)
                this.getFileList(this.form.devPath) 
            } else if (index === 4) {
                this.editOldName = this.selectedRow.name
                this.editRow = this.selectedRow
                this.$nextTick(() => {
                    this.$refs["input"+this.selectedRow.index].focus()
                })
            } else if (index === 5) {
                this.loading1 = true
                let obj = {"curPath": this.form.devPath, "fileName": this.selectedRow.name, "isDir": this.selectedRow.type == "D"}
                explorerMng("5", obj).then((res) => {
                    this.loading1 = false
                    if (res.data.code === 200000) {
                        this.refreshFileList(res.data.data || [])
                    }
                }).catch(err=> {
                    this.loading1 = false
                    this.$message({showClose: true,message: '删除文件失败',type: "error"})
                }); 
            }
            let menu = document.querySelector("#menu");
            menu.style.display = "none";
        },
    }
}
</script>

<style>
    .fm .el-table__body .el-table__row td {
        border-bottom: none;
    } 

    .fm .el-table::before{
        width: 0;
    }

    .fm .el-table{
        border: 1px solid #ccc;
    }

    .fm .el-table__header th {
        padding: 0;
        height: 30px;
        line-height: 30px;
    }

    .menuDiv {
        display: none;
        position: absolute;
    }
    
    .menuDiv .menuUl {
            height: auto;
            width: auto;
            font-size: 14px;
            text-align: left;
            border-radius: 3px;
            border: none;
            background-color: lightgray;
            color: rgba(14, 14, 14, 0.738);
            list-style: none;
            /* padding: 0 10px; */
            padding-top: 6px;
            padding-bottom: 6px;
    }

    .menuDiv .menuUl li {
        width: 140px;
        height: 30px;
        line-height: 30px;
        cursor: pointer;
        /* border-bottom: 1px solid rgba(255, 255, 255, 0.47); */
        padding-left: 10px;
        padding-right: 10px;
        font-size: 13px;
        
    }

    .menuDiv .menuUl li:hover {
        /* color: rgb(54, 138, 175); */
        background-color: rgb(150, 195, 226);
    }

    .rename-input .el-input__inner {
        font-size: 12px;
        height: 20px;
        line-height: 20px;
    }
</style>
