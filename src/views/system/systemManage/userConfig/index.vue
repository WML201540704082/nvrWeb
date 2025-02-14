<template>
    <div class="userConfig">
        <el-tabs v-model="activeName" @tab-click="handleClick">
            <el-tab-pane label="用户管理" name="first">
                <el-button size="mini" @click="onAddEditUser(null)">添加</el-button>
                <el-table
                    size="mini"
                    :data="userData"
                    tooltip-effect="dark"
                    style="width: 100%;min-height: 300px;max-height: calc(100vh - 200px);overflow-y: auto;margin-top: 8px;">
                    <el-table-column
                        type="index"
                        label="序号"
                        width="55">
                    </el-table-column>
                    <el-table-column
                        prop="userName"
                        label="用户名">
                    </el-table-column>
                    <el-table-column
                        label="用户组">
                        <template slot-scope="scope">
                            {{scope.row.role.name == 'admin' ? '管理员' : scope.row.role.name == 'operator' ? '操作员': scope.row.role.name == 'ordinary' ? '普通用户': ''}}
                        </template>
                    </el-table-column>
                    <el-table-column
                        label="权限">
                        <template slot-scope="scope">
                            <span @click="jurisdictionView(scope.row.id,'view')" style="cursor: pointer;">
                                <svg-icon icon="eye_black"></svg-icon>
                            </span>
                        </template>
                    </el-table-column>
                    <el-table-column
                        label="编辑权限">
                        <template slot-scope="scope">
                            <span @click="onAddEditUser(scope.row.id,scope.row.userName,scope.row.role.name)" style="cursor: pointer;">
                                <svg-icon icon="edit_black"></svg-icon>
                            </span>
                        </template>
                    </el-table-column>
                    <el-table-column
                        label="删除">
                        <template slot-scope="scope">
                            <span @click="deleteUser(scope.row.id,scope.row.userName)" v-if="scope.row.userName !== 'admin'" style="cursor: pointer;">
                                <svg-icon icon="delete_black"></svg-icon>
                            </span>
                        </template>
                    </el-table-column>
                    <el-table-column
                        label="重置密码">
                        <template slot-scope="scope">
                            <span @click="resetPassword(scope.row.id,scope.row.userName,scope.row.role.name)" v-if="scope.row.userName !== 'admin'" style="cursor: pointer;">
                                <svg-icon icon="lock_black"></svg-icon>
                            </span>
                        </template>
                    </el-table-column>
                </el-table>
            </el-tab-pane>
            <el-tab-pane label="用户组管理" name="second">
                <el-table
                    size="mini"
                    :data="userGroupData"
                    tooltip-effect="dark"
                    style="width: 100%;min-height: 300px;">
                    <el-table-column
                        type="index"
                        label="序号"
                        width="55">
                    </el-table-column>
                    <el-table-column
                        prop="name"
                        label="用户组名">
                    </el-table-column>
                    <el-table-column
                        prop="description"
                        label="备注名">
                        <template slot-scope="scope">
                            {{scope.row.description == 'admin' ? '管理员' : scope.row.description == 'operator' ? '操作员': scope.row.description == 'ordinary' ? '普通用户': ''}}
                        </template>
                    </el-table-column>
                    <el-table-column
                        label="查看本地权限">
                        <template slot-scope="scope">
                            <span @click="jurisdictionView(null,'local',scope.row.name)" style="cursor: pointer;">
                                <svg-icon icon="jurisdiction"></svg-icon>
                            </span>
                        </template>
                    </el-table-column>
                    <el-table-column
                        label="查看远程权限">
                        <template slot-scope="scope">
                            <span @click="jurisdictionView(null,'remote',scope.row.name)" style="cursor: pointer;">
                                <svg-icon icon="jurisdiction"></svg-icon>
                            </span>
                        </template>
                    </el-table-column>
                </el-table>
            </el-tab-pane>
            <el-tab-pane label="用户状态" name="third">
                <el-table
                    size="mini"
                    :data="onlineUserList"
                    tooltip-effect="dark"
                    style="width: 100%;min-height: 300px;max-height: calc(100vh - 160px);overflow-y: auto;">
                    <el-table-column
                        type="index"
                        label="序号"
                        width="55">
                    </el-table-column>
                    <el-table-column
                        prop="userID"
                        label="用户ID">
                    </el-table-column>
                    <el-table-column
                        prop="userName"
                        label="用户名">
                    </el-table-column>
                    <el-table-column
                        prop="ipAddr"
                        label="用户IP">
                    </el-table-column>
                    <el-table-column
                        label="断开连接">
                        <template slot-scope="scope">
                            <span @click="disconnect(scope.row.userID,scope.row.ipAddr)" style="cursor: pointer;">
                                <svg-icon icon="delete_black"></svg-icon>
                            </span>
                        </template>
                    </el-table-column>
                </el-table>
            </el-tab-pane>
        </el-tabs>
        <new-user ref="new-user" @refreshUserList="getUserList"></new-user>
        <jurisdiction ref="jurisdiction"></jurisdiction>
        <reset ref="reset"></reset>
    </div>
</template>
<script>
import { userList, userGroupList, deleteUser, userGroupDetails, getOnlineUser, deleteOnlineUser} from '@/api';
import newUser from './components/newUser'
import jurisdiction from './components/jurisdiction'
import reset from './components/reset'
export default {
    name: 'userConfig',
    data(){
        return {
            activeName: 'first',
            userData: [],
            userGroupData: [],
            onlineUserList: []
        }
    },
    created() {
    },
    components: {
        newUser,jurisdiction,reset
    },
    mounted(){
        this.getUserList()
        this.getUserGroupList()
        this.getOnlineUser()
    },
    methods: {
        handleClick(){},
        // 获取用户管理列表
        getUserList(){
            userList().then(res => {
                if(res.data.code === 200000) {
                    this.userData = res.data.data
                }
            })
        },
        // 获取用户组管理列表
        getUserGroupList() {
            userGroupList().then(res => {
                if(res.data.code === 200000) {
                    this.userGroupData = res.data.data
                }
            })
        },
        // 用户状态
        getOnlineUser() {
            getOnlineUser().then(res=>{
                this.onlineUserList = res.data.data
                this.onlineUserList = this.onlineUserList.filter(item => {
                    return (item.ipAddr !== '127.0.0.1' && item.ipAddr !== '::1')
                })
            })
        },
        // 新增-编辑用户
        onAddEditUser(id,userName,group) {
            if (!id && this.userData.length === 32) {
                this.$message.warning('用户数已达最大')
                return
            } else {
                this.$nextTick(() => {
                    this.$refs['new-user'].init(id,userName,group)
                })
            }
        },
        // 查看权限
        jurisdictionView(id,type,name) {
            userGroupDetails(name === 'admin' ? 1 : name === 'operator' ? 2 : 3).then(res => {
                if(res.data.code === 200000) {
                    this.$nextTick(() => {
                        this.$refs['jurisdiction'].init(id,type,res.data.data.rights)
                    })
                }
            })
        },
        deleteUser(id,userName) {
            this.$easyConfirm.show({
                title: '提示',
                content: `是否确定删除用户${userName}？`,
                confirm: async () => {
                    const { data } = await deleteUser(id)
                    if (data.code === 200000) {
                        this.$easyConfirm.hide()
                        this.$message.success('用户删除成功！')
                        this.getUserList()
                        this.getOnlineUser()
                    } else {
                        this.$message.error(data.message)
                        this.$easyConfirm.hide()
                    }
                }
            })
        },
        // 重置密码
        resetPassword(id,userName,roleName) {
            this.$nextTick(() => {
                this.$refs['reset'].init(id,userName,roleName)
            })
        },
        // 断开连接
        disconnect(id,ip) {
            this.$easyConfirm.show({
                title: '提示',
                content: '所选用户IP将强制下线,断开网络连接,请确认是否继续?',
                confirm: async () => {
                    const { data } = await deleteOnlineUser(id,ip)
                    if (data.code === 200000) {
                        this.$easyConfirm.hide()
                        this.$message.success('用户IP下线成功！')
                        this.getOnlineUser()
                    } else {
                        this.$message.error(data.message)
                        this.$easyConfirm.hide()
                    }
                }
            })
        },
    }
}
</script>
<style scoped>
.userConfig{
    height: 100%;
}
</style>
