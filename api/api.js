import {ajaxGet,ajaxPost,ajaxDelete,ajaxPut,ajaxPatch,chooseUploadImg,uploadImg} from './request';

// app检测更新
export const upgradeApp = params => ajaxPost({url: `app/checkversion/`,params})

// 用户注册
export const userRegister = params => ajaxPost({url: `xcx/register/`,params})

// 获取当前用户信息
export const getUserInfo = params => ajaxGet({url: `xcx/userinfo/`,params})

// 用户微信手机号登录
export const xcxMobilelogin = params => ajaxPost({url: `xcx/mobilelogin/`,params})

//发送短信验证码
export const sendSMS = params => ajaxPost({url: `xcx/sendsms/`,params})

// 获取轮播图
export const getRotationimgs = params => ajaxGet({url: `getrotationimgs/`,params})

// 获取其他设置
export const getOtherSettings = params => ajaxGet({url: `getothersettings/`,params})

// 消息列表
export const xcxUsermessages = params => ajaxGet({url: `xcx/usermessages/`,params})

// 消息列表删除/已读
export const xcxUsermessagesOperate = params => ajaxPost({url: `xcx/usermessages/`,params})

// 平台公告
export const xcxUsermessagesnotice = params => ajaxGet({url: `xcx/usermessagesnotice/`,params})

// 选择并图像上传
export const xcxChooseUploadimage = params => chooseUploadImg({url: `xcx/uploadimage/`,params})

// 直接图像上传
export const uploadImage = params => uploadImg({url: `app/uploadimage/`,params})

// 提交意见反馈
export const xcxFeeckbackAdd = params => ajaxPost({url: `xcx/feeckback/`,params})

//我的地址-获取省市区所有数据
export const getProvinceAreaAllList = params => ajaxGet({url: `app/getallareaslist/`,params})

//我的地址-获取我的地址列表
export const getAddresslist = params => ajaxGet({url: `xcx/getaddress/`,params})

//我的地址-删除地址
export const delAddress = params => ajaxGet({url: `xcx/deladdress/`,params})

//我的地址-设置为默认地址
export const setdefaultAddress = params => ajaxPost({url: `xcx/setdefaultaddress/`,params})

//我的地址-新增地址\编辑地址
export const addeditAddress = params => ajaxPost({url: `xcx/addeditaddress/`,params})

// 选择并图像上传(直接上传头像)
export const xcxChooseUploadAvatar = params => chooseUploadImg({url: `xcx/changeavatar/`,params})

// 修改昵称
export const setNickname = params => ajaxPost({url: `xcx/setnickname/`,params})


