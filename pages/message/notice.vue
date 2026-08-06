<template>
	<view class="container">
		<view class="lygap20-bg"></view>
		<ul class="mess-list">
			<li v-for="(item,index) in tableData" :key="index" @click="jumptoNoticeDetail(item)">
				<view class="leftnotice">
					<image :src="tipsImages" class="img"></image>
					<text>{{item.msg_title}}</text>
				</view>
				<text class="lytimes">{{item.create_datetime}}</text>
			</li>
		</ul>
		<!--下拉加载更多-->
		<u-loadmore :status="lstatus" :loading-text="loadingText" :loadmore-text="loadmoreText" :nomore-text="nomoreText" />
	</view>
</template>

<script>
	import common from '@/api/common.js'
	import {xcxUsermessagesnotice} from '@/api/api'
	export default {
		data() {
			return {
				formInline:{
					page:1,
					limit:15
				},
				pageparm: {
					page: 1,
					limit: 15,
					total: 0,
					totalpage:0,
				},
				lstatus: 'loadmore',//加载前值为loadmore，加载中为loading，没有数据为nomore
				loadingText: '努力加载中',
				loadmoreText: '上拉显示更多',
				nomoreText: '没有更多数据了',
				tipsImages:'/static/unielepystatic/img/message/noticetips.png',
				tableData:[
					{id:1,msg_title:'小程序全新升级啦，快来体验吧！',msg_content:'消息内容',create_datetime:'2022.03.10'},
					{id:1,msg_title:'小程序全新升级啦，快来体验吧！',msg_content:'消息内容',create_datetime:'2022.03.10'},
					{id:1,msg_title:'小程序全新升级啦，快来体验吧！',msg_content:'消息内容',create_datetime:'2022.03.10'},
					{id:1,msg_title:'小程序全新升级啦，快来体验吧！',msg_content:'消息内容',create_datetime:'2022.03.10'},
					{id:1,msg_title:'小程序全新升级啦，快来体验吧！',msg_content:'消息内容',create_datetime:'2022.03.10'},
				],
			}
		},
		onLoad() {
			//网络请求去掉下面的注释
			// this.tableData = []
			// this.getData()
		},
		onPullDownRefresh(){
			this.tableData = []
			this.formInline.page=1
			this.getData()
			uni.stopPullDownRefresh()
		},
		onReachBottom(){
			if(this.formInline.page >= this.pageparm.totalpage) return;
			this.lstatus = 'loading';
			this.formInline.page = ++ this.formInline.page
			this.getData()
			if(this.formInline.page >= this.pageparm.totalpage) this.lstatus = 'nomore';
			else this.lstatus = 'loading';
		},
		methods:{
			jumptoNoticeDetail(item){
				if (item) {
					getApp().globalData.richcontent= item; //修改全局变量
					uni.navigateTo({
						url: `/pages/message/noticedetail`
					});
				} 
			},
			getData() {
				//网络请求去掉下面的注释
				// xcxUsermessagesnotice(this.formInline).then(res=>{
				// 	if(res.code == 2000) {
				// 		res.data.data.forEach(e=>{
				// 			this.tableData.push(e)
				// 		})
				// 		this.pageparm.page = res.data.page;
				// 		this.pageparm.limit = res.data.limit;
				// 		this.pageparm.total = res.data.total;
				// 		this.pageparm.totalpage = Math.ceil(res.data.total/res.data.limit)
				// 		if(this.tableData.length<=0 || this.pageparm.totalpage==1){
				// 			this.lstatus = 'nomore'
				// 		}
				// 	}else{
				// 		this.lstatus = 'nomore'
				// 		common.showToast(res.msg)
				// 	}
				// })
			},
		},
	}
</script>
<style>
	page {
		background-color: #fff;
	}
</style>
<style lang="scss" scoped>
	.container{
		background: #FFFFFF;
	}
	.mess-list{
		padding: 10rpx;
		li{
			display: flex;
			align-items: center;
			justify-content: space-between;
			padding: 20rpx;
			font-size: 28rpx;
			font-weight: 400;
			color: #666666;
			border-bottom: 2rpx solid #EEEEEE;
			text-overflow: ellipsis;  //省略号
			overflow: hidden; //超出部分隐藏
			white-space: nowrap; //不换行
			.leftnotice{
				display: flex;
				align-items: center;
				text{
					width: calc(100vw - 160px);
					text-overflow: ellipsis;  //省略号
					overflow: hidden; //超出部分隐藏
					white-space: nowrap; //不换行
				}
			}
			.lytimes{
				font-size: 28rpx;
				font-family: Source Han Sans CN;
				font-weight: 400;
				color: #999999;
			}
			.img{
				width: 60rpx;
				height: 60rpx;	
				margin-right: 20rpx;
			}
		}
	}
</style>
