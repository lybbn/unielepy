<template>
	<view class="about">
		<view class="box">
			<image class="logoImg" :src="about.logo"></image>
			<text class="tip appName">{{about.appName}}</text>
			<text class="tip">{{about.slogan}}</text>
			<view @click="download" id="download">
				<image v-if="isIos" class="icon" src="@/static/unielepystatic/img/download-app/ios.png" mode="widthFix"></image>
				<image v-else class="icon" src="@/static/unielepystatic/img/download-app/android.png" mode="widthFix"></image>
				<text class="download-text">下载</text>
			</view>
			<text class="tip">version {{about.version}}</text>
		</view>
		<view class="copyright">
			<text class="hint">{{about.company}}</text>
		</view>
		<view class="mask" v-if="showMask">
			<image src="../../static/unielepystatic/img/download-app/openImg.png" mode="widthFix"></image>
		</view>
	</view>
</template>
<script>
	import { isWeixinBrowser, isH5Ios, isIos as appIos } from '@/utils/platform.js'
	export default {
		data() {
			return {
				about: {
					company:"unielepy",
					logo:"../../static/unielepystatic/logo.png",
					appName:"unielepy",
					slogan:"快速开发，开箱即用",
					version:"1.0.0",
				},
				code: "",
				isIos: false,
				isWeixin: false,
				showMask: false,
				downloadUrl: {
					"ios": "",
					"android": ""
				}
			};
		},
		created() {
			this.year = (new Date).getFullYear()
			// 跨端安全判断：H5 用 userAgent，App/小程序用系统信息
			this.isWeixin = isWeixinBrowser()
			// #ifdef H5
			this.isIos = isH5Ios()
			// #endif
			// #ifndef H5
			this.isIos = appIos
			// #endif
		},
		onLoad({code}) {
			this.code = code
		},
		methods: {
			download() {
				// 复制邀请码
				if (this.code) {
					uni.setClipboardData({
						data: this.code,
						success: () => {
							this.$common.showToast('邀请码已复制')
						}
					})
				}

				// H5 端：浏览器下载/微信引导
				// #ifdef H5
				if (this.isIos) {
					window.location.href = this.downloadUrl.ios
				} else {
					if (this.isWeixin) {
						this.showMask = true
					} else {
						window.location.href = this.downloadUrl.android
					}
				}
				// #endif

				// App 端：用 plus.runtime.openURL 打开下载地址
				// #ifdef APP-PLUS
				const url = this.isIos ? this.downloadUrl.ios : this.downloadUrl.android
				if (url) {
					plus.runtime.openURL(url)
				} else {
					this.$common.showToast('暂无下载地址')
				}
				// #endif

				// 小程序端：不支持直接下载，引导浏览器打开
				// #ifdef MP-WEIXIN
				this.$common.showToast('请复制链接到浏览器打开下载')
				// #endif
			},
		}
	}
</script>
<style lang="scss" scoped>
	/* #ifndef APP-NVUE */
	view {
		display: flex;
		box-sizing: border-box;
		flex-direction: column;
	}

	/* #endif */
	.about {
		width: 750rpx;
		flex-direction: column;
	}

	.box {
		margin-top: 100px;
		flex-direction: column;
		justify-content: center;
		align-items: center;
	}

	.logoImg {
		margin-bottom: 10upx;
		width: 160upx;
		height: 160upx;
		border-radius: 15px;
	}

	.tip {
		font-size: 24rpx;
		margin-top: 10px;
	}

	.appName {
		margin-top: 20px;
		font-size: 42rpx;
		font-weight: 500;
	}

	.copyright {
		width: 750upx;
		font-size: 32rpx;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		bottom: 20px;
		left: 0;
		position: fixed;
	}

	.hint {
		color: #999999;
		font-size: 26rpx;
	}

	.icon {
		width: 34rpx;
	}

	#download {
		background-color: #4f9cff;
		color: #FFFFFF;
		margin: 55rpx;
		padding: 5px;
		height: 30px;
		width: 160rpx;
		border-radius: 100px;
		flex-direction: row;
		align-items: center;
		justify-content: center;
	}

	.download-text {
		font-size: 32rpx;
	}

	.mask {
		position: fixed;
		top: 0;
		left: 0;
		width: 750rpx;
		height: 100vh;
		flex-direction: row;
		justify-content: flex-end;
		background-color: rgba(0, 0, 0, 0.6);
	}

	.mask image {
		width: 600rpx;
	}
</style>
