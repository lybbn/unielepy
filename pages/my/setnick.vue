<template>
	<view>
		<view class="lygap20-bg"></view>
		<view class="info-container">
			<!-- 修复：u--input 是 Vue3 写法，Vue2 应使用 u-input -->
			<u-input placeholder="请输入昵称" v-model="nickname" border="none"></u-input>
		</view>
		<button type="primary" class="btnSave" @click="setnickname">完成</button>
	</view>
</template>

<script>
	import {setNickname} from '@/api/api.js'
	export default{
		data(){
			return{
				bgColor:'#F6F6F6',
				nickname:"",
			}
		},
		onLoad(e) {
			this.nickname = e.nickname
		},
		methods:{
			setnickname(){
				if(this.nickname==""){
					this.$common.showToast("昵称不能为空")
					return
				}
				setNickname({nickname:this.nickname}).then(res=>{
					if(res.code == 2000){
						// 同步更新 store 中的昵称
						const newInfo = { ...this.$store.getters['user/userInfo'], nickname: this.nickname }
						this.$store.commit('user/SET_USER_INFO', newInfo)
						this.$common.showToast("设置成功")
						setTimeout(()=>{
							uni.navigateBack({ delta: 1 })
						},1000)
					}else{
						this.$common.showToast(res.msg || '设置失败')
					}
				}).catch(e => {
					console.error('setnickname error:', e)
				})
			}
		}
	}
</script>

<style scoped>
	.info-container{
		background: #FFFFFF;
		height: 52rpx;
		padding: 20rpx;
		font-size: 30rpx;
	}
	.btnSave{
		border-radius: 45rpx;
		height: 90rpx;
		line-height: 90rpx;
		margin: 130rpx 40rpx 0 40rpx;
		font-size: 32rpx;
		font-family: Source Han Sans CN;
		font-weight: 500;
		color: #FFFFFF;
		font-size: 30rpx;
	}
</style>
