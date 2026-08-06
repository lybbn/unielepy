/**
 * 下载与文件保存工具
 * 迁移自旧 common.js，修复 renameFileName 的 this.downloadUlr 未定义 bug
 * 跨端分支保留：APP-PLUS 用 plus，MP-WEIXIN 用 wx FileSystemManager
 */
import { showToast, showLoading } from './feedback.js'

// 下载图片/视频/文件并保存到本地相册或文件系统
export function downloadFile(url) {
  if (!url) return
  uni.downloadFile({
    url,
    success: res => {
      if (res.statusCode !== 200) {
        showToast('下载失败')
        return
      }
      const temppath = res.tempFilePath
      const suffix = url.split('.')[url.split('.').length - 1]
      const isVideo = /MP4|mp4|flv|FLV/.test(suffix)
      const isImage = /jpg|JPG|png|jpeg|PNG|gif|GIF/.test(suffix)

      if (isVideo) {
        showLoading('正在保存中')
        uni.saveVideoToPhotosAlbum({
          filePath: temppath,
          success: () => showToast('保存成功', true, 2000),
          fail: () => showToast('保存失败'),
          complete: () => uni.hideLoading()
        })
      } else if (isImage) {
        uni.saveImageToPhotosAlbum({
          filePath: temppath,
          success: () => showToast('保存成功', true, 2000),
          fail: () => showToast('保存失败')
        })
      } else {
        // 非图片视频文件
        const sFileName = url.split('/')[url.split('/').length - 1]
        // #ifdef APP-PLUS
        uni.saveFile({
          tempFilePath: temppath,
          success: res1 => {
            const savedFilePath = res1.savedFilePath
            const osname = plus.os.name
            if (osname === 'Android') {
              showToast('保存成功', true, 1000)
              renameFileName(savedFilePath, url, sFileName)
            }
            setTimeout(() => {
              uni.openDocument({
                filePath: savedFilePath,
                fail: () => {}
              })
            }, 1000)
          },
          fail: () => {}
        })
        // #endif
        // #ifdef MP-WEIXIN
        const FileSystemManager = wx.getFileSystemManager()
        FileSystemManager.saveFile({
          tempFilePath: temppath,
          filePath: wx.env.USER_DATA_PATH + '/' + sFileName,
          success(res2) {
            if (res2.errMsg === 'saveFile:ok') {
              if (uni.getSystemInfoSync().platform === 'android') {
                uni.showModal({
                  title: '保存地址为',
                  content: '手机存储/Android/data/com.tencent.mm/MicroMsg/lybbn-uniapp'
                })
              } else {
                showToast('请转移APP下载')
              }
            } else {
              showToast('下载失败')
            }
          },
          fail() {
            showToast('下载失败')
          }
        })
        // #endif
      }
    },
    fail: () => showToast('下载失败')
  })
}

// 给下载的文件重命名（仅 App 端）
// 修复旧版 this.downloadUlr 未定义 bug：改为接收 url 参数
// #ifdef APP-PLUS
export function renameFileName(sFilePath, downloadUrl, sFileName) {
  const fileName = sFileName.split('/')[sFileName.split('/').length - 1]
  const dtask = plus.downloader.createDownload(
    downloadUrl,
    {
      filename: 'file://storage/emulated/0/lybbn-uniapp/' + fileName
    },
    (d, status) => {
      if (status !== 200) {
        plus.downloader.clear()
      }
    }
  )
  dtask.start()
}
// #endif
