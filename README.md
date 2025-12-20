# 电子请柬 - Wedding Invitation

一个精美的电子婚礼邀请函项目，包含介绍、照片展示、视频播放和婚礼地址地图功能。

## 功能特点

- 🎨 **精美的设计** - 现代化的UI设计，适合婚礼主题
- 📸 **照片上传** - 支持多张照片上传和展示
- 🎬 **视频上传** - 支持视频上传和播放
- 📍 **地图导航** - 集成地图功能，方便宾客找到婚礼地点
- 📱 **响应式设计** - 完美适配手机、平板和电脑
- 💾 **本地存储** - 上传的内容会保存在浏览器本地

## 使用方法

1. 打开 `index.html` 文件即可在浏览器中查看
2. 双击地址信息可以编辑婚礼地点和时间
3. 点击上传按钮可以添加照片和视频
4. 点击照片可以查看大图
5. 使用底部导航菜单可以快速跳转到不同部分

## 部署到 GitHub Pages

1. 将代码推送到 GitHub 仓库
2. 在 GitHub 仓库设置中，找到 "Pages" 选项
3. 选择 "main" 分支作为源
4. 保存后，GitHub Pages 会自动生成网站链接

访问地址格式：`https://你的用户名.github.io/wedding_invitation/`

## 自定义内容

### 修改新人姓名和日期

编辑 `index.html` 文件中的以下部分：
```html
<span class="name">新郎</span>
<span class="name">新娘</span>
<p class="date">2024年XX月XX日</p>
```

### 修改婚礼地址

1. 在页面上双击地址信息进行编辑
2. 或者编辑 `script.js` 文件中的 `defaultAddress` 对象

### 修改地图

编辑 `script.js` 文件中的地图URL，可以使用：
- 百度地图
- 高德地图
- Google Maps（需要科学上网）

## 技术栈

- HTML5
- CSS3
- JavaScript (原生)
- LocalStorage API

## 浏览器支持

- Chrome
- Firefox
- Safari
- Edge

## 许可证

MIT License

