<template>
	<view class="mypage">
		<view class="lyheader">
			<!-- <view class="lynavbar">我的</view> -->
			<u-navbar title="个人中心" :titleStyle='{color:"black",fontWeight:"700",fontSize:"32rpx"}' :autoBack="false" bgColor="transparent" leftIcon=" "></u-navbar>
			<view class="lyuser" @click="navTo('/pages/my/myinfo')">
				<view class="lyuser-left">
					<image class="lyavatar" src="/static/unielepystatic/img/lycenter/defaultAvatarUrlgrey.png"></image>
					<text class="lynickname">{{userinfo.nickname}}</text>
				</view>
				<u-icon name="arrow-right" size="20"></u-icon>
			</view>
		</view>
		<view class="lylist">
			<view class="lyli">
				<view class="lycommon" @click="navTo('/pages/message/notice')">
					<view class="pic">
						<u-icon name="bell"  size="26"></u-icon>
						<!-- <image src="../../static/cy-my/qianbao.png" style="width: 40rpx;" mode="widthFix"></image> -->
					</view>
					<view class="txt">
						<text>我的消息</text>
					</view>
				</view>
			</view>
			<view class="lyli">
				<view class="lycommon" @click="navTo('')">
					<view class="pic">
						<u-icon name="setting"  size="26"></u-icon>
						<!-- <image src="../../static/cy-my/dingdan.png" style="width: 35rpx;" mode="widthFix"></image> -->
					</view>
					<view class="txt">
						<text>系统设置</text>
					</view>
				</view>
			</view>
			<view class="lyli">
				<view class="lycommon" @click="navTo('')">
					<view class="pic">
						<u-icon name="info-circle"  size="26"></u-icon>
						<!-- <image src="../../static/cy-my/dingdan.png" style="width: 35rpx;" mode="widthFix"></image> -->
					</view>
					<view class="txt">
						<text>关于我们</text>
					</view>
				</view>
			</view>
			<view class="lyli2">
				<view class="lycommon" @click="logout">
					<view class="pic">
						<u-icon name="share-square"  size="26"></u-icon>
						<!-- <image src="../../static/cy-my/dingdan.png" style="width: 35rpx;" mode="widthFix"></image> -->
					</view>
					<view class="txt">
						<text>退出登录</text>
					</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	import {getUserInfo} from '@/api/api.js'
	export default {
		data() {
			return {
				title: 'Hello',
			}
		},
		computed: {
			// 从 store 读取用户信息，默认占位
			userinfo() {
				return this.$store.getters['user/userInfo'] || { avatar: '', nickname: '未登录' }
			}
		},
		onLoad() {

		},
		onShow() {
			// 已登录时刷新用户信息
			if (this.$store.getters['user/isLogin']) {
				this.getData()
			}
		},
		methods: {
			// 统一跳转路由
			navTo(url) {
				uni.navigateTo({ url });
			},
			logout(){
				uni.showModal({
					title: '提示',
					content: '确定退出登录吗？',
					success: res => {
						if (res.confirm) {
							this.$store.dispatch('user/logout')
							this.$common.showToast('已退出登录')
							setTimeout(() => {
								this.$common.linkjump('/pages/index/index', true)
							}, 800)
						}
					}
				})
			},
			async getData() {
				try {
					const res = await getUserInfo()
					if (res.code == 2000) {
						this.$store.commit('user/SET_USER_INFO', res.data || (res.data && res.data.data))
					}
				} catch (e) {
					console.error('getUserInfo error:', e)
				}
			},
		}
	}
</script>
<style>
	page{
		background-color: #fff;
	}
</style>
<style scoped>
	.mypage{
		
	}
	.lycommon{
		display: flex;
		align-items: center;
	}
	.lyheader{
		height: 400rpx;
		background: linear-gradient(55deg, rgba(244,249,249,0.45), rgba(215,234,252,0.45), rgba(41,121,255,0.45));
	}
	.lynavbar{
		text-align: center;
		font-size: 34rpx;
		font-family: Source Han Sans CN;
		font-weight: bold;
		color: #202020;
		background-color: transparent;
		height: 88rpx;
		line-height: 88rpx;
	}
	.lyuser{
		margin-top: 130rpx;
		display: flex;
		align-items: center;
		justify-content: space-between;
		padding: 40rpx 16rpx 40rpx 40rpx;
	}
	.lyuser-left{
		display: flex;
		align-items: center;
		
	}
	.lyavatar{
		width: 160rpx;
		height: 160rpx;
		background: #DCDCDC;
		border: 2rpx solid #FFFFFF;
		border-radius: 50%;
	}
	.lynickname{
		font-size: 34rpx;
		font-family: Source Han Sans CN;
		font-weight: bold;
		color: #333333;
		margin-left: 30rpx;
	}
	.lylist {
		overflow: hidden;
		padding: 0 30rpx;
		padding-top: 10rpx;
		padding-bottom: 100rpx;
	}

	.lylist .lyli {
		padding: 30rpx 0;
		overflow: hidden;
		position: relative;
		border-bottom: 1px solid rgb(242, 242, 242);
	}
	.lylist .lyli2 {
		padding: 30rpx 0;
		overflow: hidden;
		position: relative;
		border-bottom: 1px solid rgb(242, 242, 242);
	}

	.lylist .lyli .pic {
		float: left;
		margin-right: 30rpx;
	}
	.lylist .lyli2 .pic {
		float: left;
		margin-right: 30rpx;
	}
	.lylist .lyli2 .txt {
		overflow: hidden;
		font-size: 32rpx;
		font-family: Source Han Sans CN;
		font-weight: 400;
		color: #333333;
		padding-bottom: 6rpx;
		/* border-bottom: 1px solid rgb(242, 242, 242); */
	}

	.lylist .lyli .txt {
		overflow: hidden;
		font-size: 32rpx;
		font-family: Source Han Sans CN;
		font-weight: 400;
		color: #333333;
		padding-bottom: 6rpx;
		/* border-bottom: 1px solid rgb(242, 242, 242); */
	}

	.lylist .lyli::after {
		content: '';
		position: absolute;
		border-top: 3rpx solid rgb(179, 179, 179);
		border-left: 3rpx solid rgb(179, 179, 179);
		width: 16rpx;
		height: 16rpx;
		right: 5rpx;
		top: 40%;
		transform: rotate(135deg);
	}
	
</style>
