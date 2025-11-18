import { url } from './url'
import common from '@/api/common.js'

function gettoken(){
	var token= 'nulltoken'//初始token
	//普通用户token
	const tempuserlogininfo = common.getData("nuserlogininfo")
	if (tempuserlogininfo && typeof tempuserlogininfo === 'object'){
		token = tempuserlogininfo.access
	}
	return token
}

function ajax(opt,method,filePath){
	var token= gettoken()
	// var token= ''
	// uni.getStorage({
	// 	key: 'token',
	// 	success: function (res) {
	// 	   token=res.data
	// 	},
	// 	fail:function (res) {
	// 		console.log(res.data,'fail');
	// 	},
	// });
	// const tempuserlogininfo = common.getJson("userlogininfo")
	// if (tempuserlogininfo instanceof Object){
	// 	token = tempuserlogininfo.access
	// }
	var params;
	if(opt.params){
		if (Object.prototype.toString.call(opt.params) != '[object FormData]') {
		  // 不是formdata类型
		  params = JSON.parse(JSON.stringify(opt.params));
		}else{//formdata类型
		  params= opt.params
		}
		if(method=='GET') {
			params={
			...params,
			// 't':timestamp
			}
		}
	}else{
		params={}
	}
  
	for (let key in params){
		if(params[key]==null || params[key] == 'undefined'){
			delete params[key]
		}
	}
	if(method == 'PUT' || method == 'DELETE') {
      var config={
          url: url + opt.url,
          method: method,
          header:{
              'Authorization': 'JWT ' + token,
          },
		  data: params
      }
      method==="PUT"&&(config.params=params);
		return new Promise((resolve,reject)=>{
			uni.request({
				...config,
				success: function(res) {
					if(res.data.code == 4001) {
						// uni.removeStorageSync.clear()
						// common.clear()
						// uni.reLaunch({
						// 	url:'/pages/login/login'
						// })
						common.clearUser()
						common.showToast("请先登录")
						// reject(res.data)
						resolve(res.data)
					}else{
						resolve(res.data)
					}
				},
				fail: function(res) {
					uni.showToast({
						mask:true,
						icon:'none',
						title:'请求失败',//JSON.stringify(res)
					})
					reject(res)
				},
			});
		})
	} else {
		var config={
			url: url + opt.url,
			method: method,
			header:{
				'Authorization': 'JWT ' + token,
			}
		}
		
		method==="GET"&&(config.data=params);
		method==="POST"&&(config.data=params);
		method==="PATCH"&&(config.data=params);
		return new Promise((resolve,reject)=>{
			uni.request({
				...config,
				success: function(res) {
					console.log(res.data);
					if(res.data.code == 4001) {
						// uni.removeStorageSync.clear()
						// uni.reLaunch({
						// 	url:'/pages/login/login.vue'
						// })
						common.clearUser()
						common.showToast("请先登录")
						// reject(res.data)
						resolve(res.data)
					}else{
						resolve(res.data)
					}
				},
				fail: function(res) {
					uni.showToast({
						mask:true,
						icon:'none',
						title:'请求失败',//JSON.stringify(res)
					})
					reject(res)
				},
			});
		})
	}
}



export function ajaxGet (opt) {
    return ajax(opt,"GET")
}
export function ajaxPut (opt) {
    return ajax(opt,"PUT")
}
export function ajaxDelete (opt) {
    return ajax(opt,"DELETE")
}
export function ajaxPost (opt) {
  return ajax(opt,"POST")
}
export function ajaxPatch (opt) {
  return ajax(opt,"PATCH")
}
export const baseUrl=url

/******************单张图片上传*********************/
// 选择图片
const uniChooseImage = (param) => {
	let sourcetype = ['album','camera']
	if(param){
		sourcetype = param
	}
	return new Promise((resolve, rejct) => {
		uni.chooseImage({
			// 从本地相册选择图片或使用相机拍照。
			count: 1, //默认选择1张图片
			sizeType: ['original', 'compressed'], //original 原图，compressed 压缩图，默认二者都有
			// sourceType: ['album','camera'], //从相册选择
			sourceType:sourcetype, //从相册选择
			success: res1 => {
				console.log(res1.tempFilePaths[0],"选择了一张照片")
				resolve(res1.tempFilePaths[0]);
			}
		});
	});
}
//选择相片并上传图片
export const chooseUploadImg = async (param) => {
	var token= gettoken()
	let promise;
	await uniChooseImage(param.params).then(filePath => {
		console.log(filePath,"传递过来的图片")
		promise = new Promise((resolve, rejct) => {
			uni.showLoading({
				title: '上传中..'
			})
			uni.uploadFile({
			   	url: baseUrl + param.url, //仅为示例，非真实的接口地址
			   	filePath: filePath, //因为只有一张图片， 输出下标[0]， 直接输出地址
			   	header: {
					// "Content-Type": "multipart/form-data",
			   		Authorization: "JWT " + token
			   	},
				formData: {
					'uploadimg': "lybbn-unielepy",
				},
			   	name: "file",
			   	success: res => {
			   		uni.hideLoading();
			   		if (res.statusCode == 200){
			   			var data = res.data ? JSON.parse(res.data) : {};
			   			if (data.code == 2000) {
			   				resolve(data)
			   			} else if (data.code == 4001) {
							uni.showToast({
								icon:"none",
								title: '认证信息过期或不正确'
							});
						}else {
							reject('上传失败');
						}
			   		}else{
						uni.showToast({
							icon:"none",
							title: '请求错误：'+res.statusCode
						});
					}
			   	},
			   	fail: res => {
			   		uni.showToast({
						icon:"none",
			   			title: '上传图片失败'
			   		});
			   		uni.hideLoading();
			   	}
			});
		});
	})
	return promise;
 
}
/******************单张图片上传*********************/

//单张图片上传
export const uploadImg = async (param) => {
	var filePath = param.params
	var token= gettoken()
	let promise;
	promise = new Promise((resolve, rejct) => {
		// uni.showLoading({
		// 	title: '上传中..'
		// })
		uni.uploadFile({
			url: baseUrl + param.url, //仅为示例，非真实的接口地址
			filePath: filePath, //因为只有一张图片， 输出下标[0]， 直接输出地址
			header: {
				// "Content-Type": "multipart/form-data",
				Authorization: "JWT " + token
			},
			formData: {
				'uploadimg': "lybbn-unielepy",
			},
			name: "file",
			success: res => {
				// uni.hideLoading();
				if (res.statusCode == 200){
					var data = res.data ? JSON.parse(res.data) : {};
					if (data.code == 2000) {
						resolve(data)
					}else if (data.code == 4001) {
						uni.showToast({
							icon:"none",
							title: '认证信息过期或不正确'
						});
					} else {
						resolve(data)
					}
				}else{
					uni.showToast({
						icon:"none",
						title: '请求错误：'+res.statusCode
					});
				}
			},
			fail: res => {
				uni.showToast({
					icon:"none",
					title: '上传图片失败'
				});
				// uni.hideLoading();
			}
		});
	});
	return promise;
 
}