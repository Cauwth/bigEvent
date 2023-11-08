import request from '@/utils/request'

// 注册接口： 调用请求函数，并接收（接收内容看后端接口文档
export const userRegisterService = ({ username, password, repassword }) =>
  request.post('/api/reg', { username, password, repassword }) // axios实例instance 的request

// 登录接口:
export const userLoginService = ({ username, password }) =>
  request.post('/api/login', { username, password })

// 获取用户信息
export const userGetInfoService = () => request.get('/my/userinfo')
// 修改用户信息
export const userUpdateInfoService = (data) => request.put('/my/userinfo', data)
// 修改用户头像
export const userUploadAvatarService = (avatar) =>
  request.patch('/my/update/avatar', { avatar })
// 更新密码
export const userUpdatePassService = ({ old_pwd, new_pwd, re_pwd }) =>
  request.patch('/my/updatepwd', { old_pwd, new_pwd, re_pwd })
