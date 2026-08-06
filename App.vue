<script>
	export default {
		//全局变量（过渡期保留，富文本传递建议改用 store）
		globalData:{
			richcontent:"",//富文本临时传递存储
			appVersion: "",//当前app版本号
		},
		onLaunch: function() {
			console.log('unielepy已启动')
			// 从 storage 恢复登录态到 store（含旧 key nuserlogininfo 无感迁移）
			try {
				this.$store.dispatch('user/restoreFromStorage')
			} catch (e) {
				console.error('restoreFromStorage error:', e)
			}
			// App 端初始化：版本检测/热更新/网络监听（按需启用）
			// #ifdef APP-PLUS
			try {
				const initApp = require('@/api/init.js').default
				initApp()
			} catch (e) {
				console.error('initApp error:', e)
			}
			// #endif
		},
		onShow: function() {
			console.log('App Show')
		},
		onHide: function() {
			console.log('App Hide')
		},
		// 全局错误兜底，避免白屏
		onError(err) {
			console.error('App onError:', err)
		},
		onUnhandledRejection(res) {
			console.error('App unhandled rejection:', res)
		}
	}
</script>

<style lang="scss">
	/*每个页面公共css */
	@import '@/uni_modules/uni-scss/index.scss';
	@import "@/uni_modules/uview-ui/index.scss";  
	@import '@/static/unielepystatic/css/common.scss';
	// 设置整个项目的背景色
	page {
		background-color:$uni-bg-color;
	}
	//使用iconfont图标
	@import '@/static/unielepystatic/font/iconfont.css'; 
</style>
