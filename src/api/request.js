import axios from 'axios';
import { Message } from 'element-ui'
import router from '@/router'
const CancelToken = axios.CancelToken;
export let source = CancelToken.source();
export function refreshSource() {
    source = axios.CancelToken.source()
}
export const request = (config) => {
    const http = axios.create({
        baseURL: '/api',
        timeout: 150 * 1000,
        headers: {
            'Content-Type': 'application/json; charset=utf-8'
        }
    });
    const user = window.localStorage.getItem('user')
    const token = JSON.parse(user)?.token || null
    if (token) {
        http.defaults.headers.common["Authorization"] = token
    }
    // 请求拦截
    http.interceptors.request.use(
        (config) => {
            return config;
        },
        (error) => {
            return Promise.reject(error)
        }
    );

    // 响应拦截
    http.interceptors.response.use(
        (res) => {
            if (res.headers['refresh-token'] && !JSON.parse(window.localStorage.getItem('isLocal'))) {
                let newToken = {
                    ...JSON.parse(user),
                    token: res.headers['refresh-token']
                }
                window.localStorage.setItem('user', JSON.stringify(newToken))   
            }
            return res
        },
        (error) => {
            console.log('error===',error.response);
            switch (error.response?.data?.code) {
                case 400000:
                    error.message = '请求错误';
                    break;
                case 400101:
                    error.message = '用户名已存在';
                    Message.error(error.message);
                    break;
                case 401000:
                    if(error.response.config.url === 'nvr/permision' && error.response.data.data.indexOf('wait') !== -1) {
                        Message.error('您已被强制下线，请一分钟后重试');
                    } else if(error.response.config.url === '/login' && error.response.data.data.indexOf('wait') !== -1) {
                        Message.error('账号被锁定，请一分钟后重试');
                    }
                    window.localStorage.setItem('loginOut',true)
                    window.localStorage.removeItem('user')
                    window.localStorage.removeItem('change-preview')
                    router.push('/login')
                case 403000:
                    if(error.response.config.url.indexOf('nvr/auth/user') !== -1 && error.response.data.data.indexOf('Bad UserName or Password') !== -1) {
                        Message.error('原密码输入错误');
                    } else if (error.response.data.data == 'admin role is forbidden') {
                        Message.error('管理员角色被禁止');
                    } else if (error.response.data.data == 'Password incorrect') {
                        Message.error('原始密码不正确');
                    } else {
                        Message.error(error.response.data?.data);
                    }
                    break;
                case 403301:
                    error.message = '通道通道添加数已超过授权总数'
                    Message.error(error.message);
                    break;
                case 403303:
                    Message.error('录像通道未设置存储位置')
                    break;
                case 403304:
                    Message.error('存储正在录像中，请先关闭通道录像计划')
                    break;
                case 403305:
                    Message.error('存储分组未设置存储位置')
                    break;
                case 403201:
                    Message.error('没有权限')
                    break;
                case 403901:
                    error.message = '当前版本不允许的操作';
                    Message.error(error.message);
                    break;
                case 404000:
                    error.message = '请求不存在';
                    Message.error(error.message);
                    break;
                case 500000:
                  error.message = '请求服务器出错';
                  break;
                case 502901:
                    if(error.response.config.url.indexOf('/nvr/record/lock') !== -1 && error.response.data.data === 'RPC_ERR_TIMEOUT') {
                        Message.error('锁定超时');
                    } else {
                        error.message = '接口调用出错';
                    }
                  break;
                case 400305:
                    error.message = '该通道已离线';
                    break; 
                case 400306:
                    error.message = '该通道不支持此项功能';
                    Message.closeAll()
                    Message.error(error.message);
                    break;
                case 400307:
                    error.message = '获取参数失败';
                    break;
                case 400308:
                    error.message = '设置参数失败';
                    break;
                case 400309:
                    error.message = '最多添加4个遮盖区域,重叠区域单独计算';
                    Message.error(error.message);
                    break;
                case 400310:
                    error.message = '创建失败，请检查上传文件的格式';
                    Message.error(error.message);
                    break;
                case 403103:
                    error.message = '用户名或密码错误！三次错误账户将被锁定';
                    // Message.error(error.message);
                    Message({type:'error',showClose:true,message:error.message,duration:2000})
                    break;
                case 403104:
                    error.message = '用户名或密码错误！三次错误账户将被锁定';
                    // Message.error(error.message);
                    Message({type:'error',showClose:true,message:error.message,duration:2000})
                    break;
                case 429601:
                    break
                default:
                    // Message.error(error.response?.data?.data)
                    error.message = `连接出错(${error.response?.data?.code})!`;
            }
            return Promise.reject(error);
        }
    );

    return http(config)
}