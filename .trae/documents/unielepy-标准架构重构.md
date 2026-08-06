# unielepy UniApp 标准架构重构

## Context（背景）

`D:\laoyansoft\python\unielepy` 是 UniApp（Vue2 + uview-ui）跨端项目（微信小程序/App/H5）。当前代码存在大量架构与 Bug 问题：无状态管理（store 空目录）、无环境配置分离、`api/common.js` 是 481 行上帝模块、`request.js` 有多个致命 Bug（4001 错误 resolve 而非 reject、reject 参数拼写错误导致 ReferenceError、PUT/DELETE 与 GET/POST 重复代码）、`pages/invite/invite.vue` 跨端崩溃（navigator/document 未 `#ifdef H5`）、`pages/index/index.vue` 九宫格入口全失效（tabclick 未传索引）、`pages/login/login.vue` 标签不匹配、`api/init.js` 真实响应被 mock 覆盖、无 `package.json`、`main.js` 残留 Vue3 死分支等。

本次按 UniApp 业界标准架构完整重构：引入 Vuex3、分离环境配置、拆分 utils、统一 request 封装、统一设计令牌、修复全部关键 Bug，同时通过 facade 模式保证未迁移页面零改动可运行。

## 目标目录结构

```
unielepy/
├── package.json                    # 新增：vuex@3 依赖声明
├── manifest.json                   # 修改：补 mp-weixin.appid
├── pages.json                      # 修改：统一配色
├── App.vue                         # 修改：onLaunch 恢复登录态 + 全局错误兜底
├── main.js                         # 修改：删 Vue3 死分支、修 uView 挂载顺序、挂 store/$util/$common
├── uni.scss                        # 修改：业务令牌 + 覆盖 $u-* theme
├── api/
│   ├── api.js                      # 修改：补 userMobileLogin/userRegister/getUserInfo 端点
│   ├── request.js                  # 重写：统一封装、修 4001 reject、修 reject 拼写、合并重复代码
│   ├── url.js                      # 降级：从 config/env re-export
│   ├── common.js                   # 降级：facade 指向 utils，保留 $common 旧 API
│   └── init.js                     # 修改：删 mock 覆盖、守卫缺失组件引入
├── config/
│   └── env.js                      # 新增：baseUrl/timeout/tokenKey，dev/prod 分离，prod 强制 HTTPS
├── store/
│   ├── index.js                    # 新增：Vuex3 入口
│   └── modules/user.js             # 新增：token/userInfo/isLogin，restoreFromStorage 兼容旧 key
├── utils/
│   ├── index.js                    # 新增：聚合入口 → $util，方法名对齐旧 common.js
│   ├── date.js                     # 新增：dateFormats/getHoursT/timeago（修 getHoursT 裸调用）
│   ├── validate.js                 # 新增：手机号/身份证/车牌/金额/正整数校验
│   ├── storage.js                  # 新增：setData/getData/setJson/getJson/remove/clear/clearUser
│   ├── nav.js                      # 新增：linkjump/reloadPage/navTo/navBack/redirect/switchTab
│   ├── platform.js                 # 新增：isH5/isMpWeixin/isApp/isIos/isAndroid + H5 userAgent 安全访问
│   ├── feedback.js                 # 新增：showLoading/hideLoading/showToast
│   ├── download.js                 # 新增：downloadFile/renameFileName（修 this.downloadUlr 未定义）
│   ├── sku.js                      # 新增：selectGoodsSKU
│   ├── stopRepeatClick.js          # 保留
│   └── sdk/                        # 保留
├── components/ly-send-sms-code/    # 保留
├── pages/                          # 逐页修 bug
└── static/
```

## 实施步骤（按依赖顺序）

### 阶段一：基础设施（纯增量，零行为变更）

1. **`package.json`** — `dependencies: { "vuex": "^3.6.2" }`。Vue2 必须用 Vuex3。HBuilderX IDE 模式下起依赖锁定作用，CLI 构建再补 @dcloudio/*。
2. **`config/env.js`** — 导出 `env` 对象：`baseUrl`、`timeout:15000`、`uploadTimeout`、`tokenKey`、`userInfoKey`、`isDev`。`process.env.NODE_ENV` 区分 dev/prod，**dev 与 prod 不同地址**（修 url.js 同址问题），prod 强制 HTTPS。同时导出 `baseUrl` 和 `url` 别名兼容。
3. **`utils/storage.js`** — 封装 `setData/getData/setJson/getJson/remove/clear`，签名与旧 common.js 一致。集中 key 常量：`TOKEN_KEY`、`USER_INFO_KEY`、`LEGACY_USER_KEY='nuserlogininfo'`。提供 `clearUser()`。纯函数不依赖 this。
4. **`utils/date.js`** — 迁移 `dateFormats/getHoursT/timeago`。**修 getHoursT 裸调用 dateFormats 的 bug**（改 import 同模块函数）。
5. **`utils/validate.js`** — 迁移校验函数。手机号正则更新为 `^1[3-9]\d{9}$`（原正则过窄）。
6. **`utils/nav.js`** — 迁移 `linkjump/reloadPage`，补 `navTo/navBack/redirect/switchTab`。
7. **`utils/platform.js`**（跨端关键）— 基于 `uni.getSystemInfoSync()` 提供 `isH5/isMpWeixin/isApp/isIos/isAndroid`，全端安全。`isWeixinBrowser()`/`getH5UserAgent()` 内部 `#ifdef H5` 包裹 navigator。
8. **`utils/feedback.js`** — `showLoading/hideLoading/showToast`，签名对齐旧 common.js。
9. **`utils/download.js`** — 迁移 `downloadFile`，`#ifdef APP-PLUS`/`#ifdef MP-WEIXIN` 分支保留。**修 renameFileName 的 `this.downloadUlr` 未定义 bug**（改接收 url 参数），加 `#ifdef APP-PLUS`。
10. **`utils/sku.js`** — 迁移 `selectGoodsSKU`，纯函数。
11. **`utils/index.js`** — 聚合上述模块为单一 `util` 对象 default 导出，方法名与旧 common.js 完全对齐。`copyData` 内部改 import feedback.showToast（不再用 this）。
12. **`store/index.js`** — `Vue.use(Vuex)`，聚合 `modules:{user}`，`strict:isDev`。
13. **`store/modules/user.js`**（核心）— state:token/userInfo；getters:token/userInfo/isLogin（token 非空且非 'nulltoken'）；mutations:SET_TOKEN/SET_USER_INFO/CLEAR_AUTH（同步写 storage）；actions:login/logout/restoreFromStorage。**restoreFromStorage 优先读新 key，回退读旧 key `nuserlogininfo` 解析 `.access`，老用户无感迁移**。
14. **`uni.scss`** — 保留 import uni-scss/variables 和 uview-ui/theme.scss。**覆盖 `$u-*` 必须在 import theme.scss 之后**（如 `$u-primary:#2979ff`）。新增语义令牌：`$brand-color/$text-primary/$text-secondary/$bg-page/$border-color`。仅放变量不放假样式。

### 阶段二：核心接线（改核心但保持对外接口）

15. **`api/request.js`**（重写，核心）—
    - `gettoken()` 改 `store.getters.token || 'nulltoken'`。
    - **合并 PUT/DELETE 与 GET/POST/PATCH 两段重复代码**为单一 `ajax(opt,method)`：统一构造 config（url=env.baseUrl+opt.url、method、header:{Authorization:'JWT '+token}、timeout:env.timeout），GET/POST/PUT/PATCH/DELETE 统一 `data=params`，清理 null/undefined。
    - success：`code==4001` → `store.dispatch('user/logout')` + showToast('请先登录') + **`reject(res.data)`**（修原 resolve bug）；否则 resolve。
    - fail：showToast('请求失败') + reject。
    - **修 chooseUploadImg 的 `reject('上传失败')` ReferenceError**（Promise 参数是 rejct）→ 统一改参数名 reject，重写为 async 消除 await .then() 混用。uploadImg/uniChooseImage 同步修 rejct 拼写。
    - **导出名严格保持** `ajaxGet/ajaxPut/ajaxDelete/ajaxPost/ajaxPatch/baseUrl` + `chooseUploadImg/uploadImg`，确保 api.js 零改动。
16. **`api/common.js`**（降级 facade）— `module.exports = require('@/utils').default`。方法名与旧 common.js 100% 对齐，未迁移页面零改动。`checkLogin` 改查 `store.getters.isLogin`，`clearUser` 改 `store.dispatch('user/logout')`。
17. **`api/url.js`** — `import { baseUrl } from '@/config/env'; export const url = baseUrl;`，保持 `import { url } from '@/api/url'` 可用。
18. **`main.js`**（重写）— **删整段 `#ifdef VUE3` 死分支**。**修 uView 挂载顺序**：先 `import uView; Vue.use(uView)` 再 `new Vue`。挂 `Vue.prototype.$store/$util/$common/$stopRepeatClick`。`new Vue({ store, ...App }).$mount()`。可选 `Vue.config.errorHandler`。
19. **`App.vue`** — onLaunch 调 `this.$store.dispatch('user/restoreFromStorage')`；`// #ifdef APP-PLUS` 内 `try{ require('@/api/init').default() }catch(e){ console.error(e) }`。新增 `onError`/`onUnhandledRejection` 兜底。globalData.richcontent 过渡期保留。

### 阶段三：页面 Bug 修复（依赖 store/$util 就绪）

20. **`pages/index/index.vue`** — L15 `@click="tabclick"` → `@click="tabclick(listIndex)"`；tabclick 按索引分支，补 index 4（首页）处理；硬编码色替换令牌。
21. **`pages/login/login.vue`** — 删 L58 孤立 `</button>`；toLogin/toRegister 接真实接口（成功后 `this.$store.dispatch('user/login', res.data)` 跳首页）；硬编码 #2979ff → $u-primary。
22. **`pages/my/index.vue`** — logout 删 `getApp().globalData.userinfo=""`，改 `this.$store.dispatch('user/logout')` 后 switchTab 首页；userinfo 改 computed 从 store 读；取消 getUserInfo 注释并调用，结果 dispatch SET_USER_INFO；硬编码色替换。
23. **`pages/invite/invite.vue`**（跨端崩溃重点）— created() 用 `utils/platform` 的 `getH5UserAgent()/isWeixinBrowser()/isIos` 替代裸 navigator；download() 中 `document.getElementById/window.location.href` 整段 `#ifdef H5` 包裹（注：原 `getElementById("#clipboard")` 选择器写法也错且元素不存在）；非 H5 端 download 分支：APP 用 `plus.runtime.openURL`，MP 提示"请在浏览器打开"。
24. **`api/init.js`** — **删 L103-111 mock 覆盖**用真实 res；守卫 L14 不存在组件 `json-interceptor-chooseImage` 的引入与 L64 调用（`#ifdef APP-PLUS` + try/catch 或移除）；版本比对逻辑保留。

### 阶段四：收尾

25. **`api/api.js`** — 补 `userMobileLogin/userRegister/getUserInfo` 端点。
26. **`pages.json`** — 统一配色（JSON 不支持变量，hex 对齐 uni.scss 令牌）。
27. **`manifest.json`** — 补 `mp-weixin.appid`（占位或真实，发布前用户填真实值）。

## 风险点与兼容策略

1. **未迁移页面依赖 `$common`**：common.js facade 保证方法名 100% 对齐，未迁移页面零改动可运行，可逐页独立迁移。
2. **api/api.js 依赖 request 导出名**：request.js 重写后严格保留导出名，api.js 不动。
3. **api/url.js 被直接 import**：re-export env.baseUrl，保持 `import { url }` 可用。
4. **老用户 token 在旧 key `nuserlogininfo`**：restoreFromStorage 回退读旧 key 迁移，避免强制登出。
5. **4001 由 resolve 改 reject 是行为变更**：实施前 grep 排查所有 `.then` 中对 4001 的处理点，若有页面靠 then 处理需改 catch 或 then 内判断 code。重点排查 my/login/index 等页。
6. **uView Vue.use 顺序修正**：原顺序"碰巧能跑"，修正后回归验证 uView 组件渲染和 `this.$u` 可用。
7. **init.js 缺失组件引入**：当前 App 端构建可能因找不到模块报错，阶段二先守卫。
8. **invite 跨端**：修复前小程序/App 进 invite 必崩，修复后三端实测。
9. **分阶段验证**：每阶段结束 H5+MP+App 烟测，确保不引入回归。

## 验证方法（端到端）

1. **启动**：三端正常启动，控制台无报错；已登录用户 `store.getters.token` 有值（旧 key 迁移生效）。
2. **鉴权流**：登录成功 → token 写 store+storage，跳转正常；构造 4001 → 调用方 `.catch` 触发（验证 reject 修复），store 自动登出。
3. **首页九宫格**：6 入口点击均跳转正确页面（验证 tabclick 修复）。
4. **上传图片**：构造上传失败，不再抛 ReferenceError（验证 reject 拼写修复）。
5. **invite 页**：微信小程序与 App 端进入不崩溃，H5 端下载/微信浏览器引导正常。
6. **uView 主题**：uView 组件主色与 uni.scss `$u-primary` 一致。
7. **兼容性**：在某未迁移页面调 `$common.linkjump/getData/showToast`，确认 facade 可用。
8. **Vuex 持久化**：刷新 H5 / 重开小程序，登录态保持（store 从 storage 恢复）。
9. **全局错误**：人为抛错验证 onError 兜底不白屏。
10. **App 热更新**：阶段三后验证 init.js 真实版本检测不再被 mock 覆盖（仅 APP-PLUS）。

## 关键文件

- `api/request.js`（重写）
- `store/modules/user.js`（新增）
- `utils/index.js`（新增聚合）
- `main.js`（重写）
- `api/common.js`（降级 facade）
- `config/env.js`（新增）
- `pages/invite/invite.vue`（跨端修复）
- `pages/index/index.vue`（tabclick 修复）
- `uni.scss`（令牌化）
