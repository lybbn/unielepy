<template>
	<view>
		<web-view :webview-styles="webviewStyles" :src="weburl"></web-view>
	</view>
</template>
<script>
	export default {
		data() {
			return {
				webviewStyles: {
					progress: {
						color: '#ff6a6c'
					}
				},
				// 路径地址
				weburl: '',
				title: 'unielepy',
			}
		},
		onLoad(e) {
			if (e.url) {
				if(e.url.substring(0, 4) != 'http'){
					uni.showModal({
						title:"错误",
						content: '不是一个有效的网站链接,'+'"'+url+'"',
						showCancel: false,
						confirmText:"知道了",
						complete: () => {
							uni.navigateBack()
						}
					});
					e.title = "页面路径错误"
				}else{
					this.weburl = e.url;
				}
			}
			if (e.title) {
				uni.setNavigationBarTitle({
					title: e.title
				});
			}
		},
		methods: {}
	}
</script>

<style lang="scss" scoped>
</style>
