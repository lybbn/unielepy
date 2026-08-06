<template>
	<view class="container">
		<view class="home-swiper">
			<swiper :indicator-dots="indicatorDots" :indicator-color="indicatorDotsColor" :indicator-active-color="indicatorActiveColor" :autoplay="autoplay" :interval="interval" :duration="duration">
				<swiper-item v-for="(item,index) in swiperDatas" :key="index">
					<image mode="aspectFill" @click.stop="jumptopage(item)" :src="item.image"></image>
				</swiper-item>
			</swiper>
		</view>
		<view class="lytabgrid">
			<view class="idx-title">
				<span>功能展示</span>
			</view>
			<u-grid :border="false" col="4">
				<u-grid-item v-for="(listItem,listIndex) in tabList" :key="listIndex" @click="tabclick(listIndex)">
					<u-icon
						:customStyle="{paddingTop:20+'rpx'}"
						:name="listItem.name"
						:size="26"
					></u-icon>
					<text class="lygrid-text">{{listItem.title}}</text>
				</u-grid-item>
			</u-grid>
		</view>
		<u-toast ref="lyToast" />
	</view>
</template>

<script>
	import {getOtherSettings,getRotationimgs} from '@/api/api'
	export default {
		components:{
		},
		data() {
			return {
				indicatorDots:true,
				indicatorDotsColor: 'rgba(255,255,255,.5)',
				indicatorActiveColor: 'rgba(255,255,255,1)',
				autoplay: true,
				interval: 5000,
				duration: 500,
				swiperDatas:[
					{id:1,image:'../../static/unielepystatic/logo.png',link:'https://www.baidu.com'},
					{id:2,image:'../../static/unielepystatic/logo.png',link:'https://www.baidu.com'},
					{id:3,image:'../../static/unielepystatic/logo.png',link:'https://www.baidu.com'},
				],//轮播图
				formInline:{
					page:1,
					limit:10
				},
				tabList: [{
						name: 'account',
						title: '登录/注册'
					},
					{
						name: 'lock',
						title: '密码重置'
					},
					{
						name: 'download',
						title: '邀请下载'
					},
					{
						name: 'bell',
						title: '公告通知'
					},
					{
						name: 'home',
						title: '首页'
					},
					{
						name: 'level',
						title: '个人中心'
					},
				],
				
			}
		},
		// 监听页面加载
		onLoad() {
		},
		//分享此页给好友
		onShareAppMessage() {
		},
		created() {
		},
		// 监听页面显示。页面每次出现在屏幕上都触发，包括从下级页面点返回露出当前页面
		onShow() {
			this.getData()
		},
		// 监听用户下拉刷新
		onPullDownRefresh() {
			this.getData()
			uni.stopPullDownRefresh()
		},
		methods: {
			tabclick(index) {
				// 修复：原 tabclick 未接收索引导致 6 个入口全部失效
				if(index == 0){
					this.$common.linkjump("/pages/login/login?showBack=true")
				}else if(index == 1){
					this.$common.linkjump("/pages/login/pwdreset/pwdreset")
				}else if(index == 2){
					this.$common.linkjump("/pages/invite/invite")
				}else if(index == 3){
					this.$common.linkjump("/pages/message/notice")
				}else if(index == 4){
					// 首页（当前页），无操作
				}else if(index == 5){
					this.$common.linkjump("/pages/my/index",true)
				}
				// this.$refs.lyToast.success(`点击了第${index}个`)
			},
			//轮播图获取数据
			getLunBo() {
				var params = {
					type:1
				}
				getRotationimgs(params).then(res=>{
					if(res.code == 2000) {
						let data = res.data.data
						console.log(data)
						this.swiperDatas = data
					}
					//  else {
					// 	uni.showToast({
					// 		icon:'none',
					// 		mask:true,
					// 		title:res.msg || '请求失败'
					// 	})
					// }
				})
			},
			// 跳转页面
			jumptopage(item) {
				if (item && (item.link.indexOf("http://") != -1 || item.link.indexOf("https://") != -1)) {
					uni.navigateTo({
						url: `/pages/content/webview?url=${item.link}`
					});
				} else if (item && item.link.indexOf("/pages/") != -1) {
					uni.navigateTo({
						url: `${item.link}`
					});
				}
			},
			getData() {
				this.getLunBo()
			},
		},
	}
</script>

<style lang="scss" scoped>
	.home-logo{
		
	}
	.container {
		font-size: 14px;
		line-height: 24px;
	}
	.home-swiper{
		swiper{
			height: 380rpx;
		}
		image{
			width: 100%;
			height: 100%;
		}
	}
	.home-swiper ::v-deep .swiper-dot{
		background: rgba(255,255,255,.5) !important;
	}
	.home-swiper ::v-deep .swiper-dot-active{
		background: rgba(255,255,255,1) !important;
	}
	.lytabgrid{
		margin-top: 20rpx;
		background: #fff;
	}
	.lygrid-text {
		font-size: 14px;
		color: #909399;
		padding: 10rpx 0 20rpx 0rpx;
		/* #ifndef APP-PLUS */
		box-sizing: border-box;
		/* #endif */
	}
</style>
