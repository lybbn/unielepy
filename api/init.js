/*
*unielepy应用初始化文件
*author:lybbn
*source code:https://gitee.com/lybbn/unielepy
*program:unielepy
*/
import {upgradeApp} from '@/api/api.js'
const PACKAGE_UPDATE_KEY = '__unielepy_package_update__'
const PACKAGE_INFO_KEY = '__unielepy_package_info__'
const is_check_app_upgrade = false //是否检查APP更新
const is_silently = false //app的wgt更新是否静默安装
const is_mandatory = false //app更新是否强制更新
// #ifdef APP-PLUS
// 守卫：原引入的组件路径不存在，用 try/catch 动态加载避免 App 端构建/启动崩溃
let interceptorChooseImage = null
try {
	interceptorChooseImage = require('@/components/json-interceptor-chooseImage/js_sdk/main.js').default
} catch (e) {
	console.warn('json-interceptor-chooseImage 组件缺失，已跳过相册权限拦截')
}
// #endif
export default async function() {
	//应用初始化
	// #ifdef APP-PLUS
	plus.screen.lockOrientation('portrait-primary'); //竖屏正方向锁定
	if(is_check_app_upgrade){
		//热更新
		const updated = uni.getStorageSync(PACKAGE_UPDATE_KEY); // 尝试读取storage
		console.log("正在检测app版本更新...")
		if (updated.completed === true) {
			// 如果上次刚更新过
			// 删除安装包及安装记录
			console.log('安装记录被删除，更新成功');
			uni.removeSavedFile({
				filePath: updated.packgePath,
				success: res => {
					uni.removeStorageSync(PACKAGE_UPDATE_KEY);
				}
			});
		} else if (updated.completed === false) {
			uni.removeStorageSync(PACKAGE_UPDATE_KEY);
			plus.runtime.install(updated.packgePath, {
				force: true
			});
			uni.setStorage({
				key: PACKAGE_UPDATE_KEY,
				data: {
					completed: true,
					packgePath: updated.packgePath
				},
				success: res => {
					console.log('成功安装上次的更新，应用需要重启才能继续完成');
				}
			});
			uni.showModal({
				title: '提示',
				content: '应用将重启以完成更新',
				showCancel: false,
				complete: () => {
					plus.runtime.restart();
				}
			});
		}else{
			// 初始化appVersion（检查当前版本信息并尝试更新--仅app生效）
			initAppVersion();
		}
	}

	// 实现，路由拦截。当应用无访问摄像头/相册权限，引导跳到设置界面
	try {
		if (interceptorChooseImage) interceptorChooseImage()
	} catch (e) {
		console.warn('interceptorChooseImage 调用失败：', e)
	}

	// 监听并提示设备网络状态变化
	uni.onNetworkStatusChange(res => {
		console.log(res.isConnected);
		console.log(res.networkType);
		if (res.networkType != 'none') {
			uni.showToast({
				title: '当前网络类型：' + res.networkType,
				icon: 'none',
				duration: 3000
			})
		} else {
			uni.showToast({
				title: '网络类型：' + res.networkType,
				icon: 'none',
				duration: 3000
			})
		}
	});
	// #endif
}
/**
 * // 初始化appVersion并尝试更新版本
 */
function initAppVersion() {
	// #ifdef APP-PLUS
	let appid = plus.runtime.appid;
	plus.runtime.getProperty(appid, (wgtInfo) => {
		let appVersion = plus.runtime;//appVersion.version为基座版本如：13.4.14，wgtInfo.version为app版本号：如1.0.0
		let currentVersion = wgtInfo.version;
		getApp().globalData.appVersion = currentVersion
		let platform = plus.os.name.toLowerCase() === 'android' ? 'android' : 'ios'
		var formdata = {
			appid:appid,
			version:currentVersion,
			platform:platform,
		}
		// 检查服务器端版本号（修复：原真实 res 被 mock 数据覆盖，版本检测形同虚设）
		upgradeApp().then(res => {
			if (res.code == 2000 && res.data) {
				checkVersionToUgrade(res.data.version, currentVersion, res.data)
			} else {
				console.log("获取app版本信息失败")
			}
		}).catch(e => {
			console.error('upgradeApp error:', e)
		})
	});
	// 检查更新
	// #endif
}

/**
 * 对比版本号,并更新app
 * @param {Object} server_version 服务器端最新的版本号
 * @param {Object} current_version 当前应用的版本号
 * @param {Object} data 服务器返回的数据
 */
function checkVersionToUgrade(server_version, current_version,res) {
	//如果有更新
	const has_new = compare(server_version,current_version)
	if(has_new==1){
		//服务器返回更新内容
		const upgrade_result = {
			title:"升级标题", // 标题
			contents:"升级内容", // 升级内容
			is_mandatory:true, // 是否强制更新
			url:"http://www.lybbn.cn", // 安装包下载地址
			platform:"android", // 安装包平台
			type:"wgt", // 安装包类型
		}
		// 静默更新，只有wgt有
		if (is_silently) {
			uni.downloadFile({
				url: upgrade_result.url,
				success: res => {
					if (res.statusCode == 200) {
						// 下载好直接安装，下次启动生效
						plus.runtime.install(res.tempFilePath, {
							force: false
						});
					}
				}
			});
			return;
		}
		/**
		 * 提示升级一
		 * 使用 uni.showModal
		 */
		// return updateUseModal(upgrade_result)
		/**
		 * 提示升级二
		 * 官方适配的升级弹窗，可自行替换资源适配UI风格
		 */
		uni.setStorageSync(PACKAGE_INFO_KEY, upgrade_result)
		uni.navigateTo({
			url: `/pages/upgradeapp/upgrade-popup?local_storage_key=${PACKAGE_INFO_KEY}`,
			fail: (err) => {
				console.error('更新弹框跳转失败', err)
				uni.removeStorageSync(PACKAGE_INFO_KEY)
			}
		})
		
	}
}

/**
 * 对比版本号，如需要，请自行修改判断规则
 * 支持比对	("3.0.0.0.0.1.0.1", "3.0.0.0.0.1")	("3.0.0.1", "3.0")	("3.1.1", "3.1.1.1") 之类的
 * @param {Object} v1
 * @param {Object} v2
 * v1 > v2 return 1
 * v1 < v2 return -1
 * v1 == v2 return 0
 */
function compare(v1 = '0', v2 = '0') {
	v1 = String(v1).split('.')
	v2 = String(v2).split('.')
	const minVersionLens = Math.min(v1.length, v2.length);

	let result = 0;
	for (let i = 0; i < minVersionLens; i++) {
		const curV1 = Number(v1[i])
		const curV2 = Number(v2[i])

		if (curV1 > curV2) {
			result = 1
			break;
		} else if(curV1 < curV2) {
			result = -1
			break;
		}
	}

	if (result === 0 && (v1.length !== v2.length)) {
		const v1BiggerThenv2 = v1.length > v2.length;
		const maxLensVersion = v1BiggerThenv2 ? v1 : v2;
		for (let i = minVersionLens; i < maxLensVersion.length; i++) {
			const curVersion = Number(maxLensVersion[i])
			if (curVersion > 0) {
				v1BiggerThenv2 ? result = 1 : result = -1
				break;
			}
		}
	}
	return result;
}

/**
 * 使用 uni.showModal 升级
 */
function updateUseModal(packageInfo) {
	const {
		title, // 标题
		contents, // 升级内容
		is_mandatory, // 是否强制更新
		url, // 安装包下载地址
		platform, // 安装包平台
		type // 安装包类型
	} = packageInfo;

	let isWGT = type === 'wgt'
	let isiOS = !isWGT ? platform.includes('ios') : false;
	let confirmText = isiOS ? '立即跳转更新' : '立即下载更新'

	return uni.showModal({
		title,
		content: contents,
		showCancel: !is_mandatory,
		confirmText,
		success: res => {
			if (res.cancel) return;

			// 安装包下载
			if (isiOS) {
				plus.runtime.openURL(url);
				return;
			}

			uni.showToast({
				title: '后台下载中……',
				duration: 1000
			});

			// wgt 和 安卓下载更新
			downloadTask = uni.downloadFile({
				url,
				success: res => {
					if (res.statusCode !== 200) {
						console.error('下载安装包失败', err);
						return;
					}
					// 下载好直接安装，下次启动生效
					plus.runtime.install(res.tempFilePath, {
						force: false
					}, () => {
						if (is_mandatory) {
							//更新完重启app
							plus.runtime.restart();
							return;
						}
						uni.showModal({
							title: '安装成功是否重启？',
							success: res => {
								if (res.confirm) {
									//更新完重启app
									plus.runtime.restart();
								}
							}
						});
					}, err => {
						uni.showModal({
							title: '更新失败',
							content: err
								.message,
							showCancel: false
						});
					});
				}
			});
		}
	});
}
