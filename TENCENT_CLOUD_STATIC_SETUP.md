# 腾讯云静态网站托管配置指南

## 概述

将GitHub Pages迁移到腾讯云静态网站托管，可以获得：
- ✅ 国内访问速度快
- ✅ 可以使用自定义域名
- ✅ 可以在微信公众平台验证域名
- ✅ 解决微信分享被屏蔽问题

## 前置准备

1. **腾讯云账号**：https://cloud.tencent.com/
2. **域名**（可选，但推荐）：用于自定义域名和微信验证
3. **GitHub仓库**：现有的代码仓库

## 配置步骤

### 第一步：开通静态网站托管服务

1. 登录腾讯云控制台：https://console.cloud.tencent.com/
2. 进入 **对象存储 COS** 服务
3. 点击 **存储桶列表** → **创建存储桶**
4. 配置存储桶：
   - **名称**：例如 `wedding-invitation-1303923554`
   - **所属地域**：选择离您最近的区域（如：广州）
   - **访问权限**：选择 **公有读私有写**
   - **静态网站**：开启
5. 点击 **创建**

### 第二步：配置静态网站

1. 在存储桶列表中，点击创建的存储桶
2. 进入 **基础配置** → **静态网站**
3. 配置静态网站：
   - **索引文档**：`index.html`
   - **错误文档**：`index.html`（可选，用于SPA）
   - **错误码重定向**：`404` → `index.html`（可选）
4. 点击 **保存**

### 第三步：上传网站文件

#### 方法1：通过控制台上传（适合首次部署）

1. 进入存储桶的 **文件列表**
2. 点击 **上传文件**
3. 上传以下文件：
   - `index.html`
   - `styles.css`
   - `script.js`
   - `data-viewer.html`
   - `picture/` 文件夹（包含所有图片）
   - `video/` 文件夹（包含视频）
   - `data/` 文件夹（如果存在）
4. 确保文件结构正确

#### 方法2：通过GitHub Actions自动部署（推荐）

创建 `.github/workflows/deploy-to-tencent-cos.yml`：

```yaml
name: Deploy to Tencent Cloud COS

on:
  push:
    branches:
      - main

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout
        uses: actions/checkout@v3

      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'

      - name: Install COS CLI
        run: |
          npm install -g coscli
          coscli config init

      - name: Deploy to COS
        env:
          SECRET_ID: ${{ secrets.TENCENT_SECRET_ID }}
          SECRET_KEY: ${{ secrets.TENCENT_SECRET_KEY }}
          REGION: ap-guangzhou
          BUCKET: wedding-invitation-1303923554
        run: |
          coscli sync . cos://$BUCKET/ --include "*.html,*.css,*.js,*.json,picture/**,video/**,data/**" --delete
```

**配置GitHub Secrets**：
1. 进入GitHub仓库 → **Settings** → **Secrets and variables** → **Actions**
2. 添加以下Secrets：
   - `TENCENT_SECRET_ID`：腾讯云SecretId
   - `TENCENT_SECRET_KEY`：腾讯云SecretKey

**获取腾讯云密钥**：
1. 登录腾讯云控制台
2. 进入 **访问管理** → **API密钥管理**
3. 创建密钥，获取 `SecretId` 和 `SecretKey`

#### 方法3：使用COS CLI工具（本地部署）

1. **安装COS CLI**：
```bash
# macOS
brew install coscli

# 或下载二进制文件
# https://cloud.tencent.com/document/product/436/63143
```

2. **配置COS CLI**：
```bash
coscli config init
# 输入 SecretId、SecretKey、Region、Bucket
```

3. **同步文件**：
```bash
# 同步所有文件到COS
coscli sync . cos://wedding-invitation-1303923554/ \
  --include "*.html,*.css,*.js,*.json,picture/**,video/**,data/**" \
  --delete
```

### 第四步：配置自定义域名（可选但推荐）

1. 在存储桶中，进入 **域名与传输管理** → **自定义源站域名**
2. 点击 **添加域名**
3. 配置域名：
   - **域名**：输入您的域名（如：`wedding.yourdomain.com`）
   - **源站类型**：选择 **静态网站源站**
   - **HTTPS证书**：选择 **自动配置**（腾讯云会自动申请免费证书）
4. 点击 **保存**

5. **配置DNS解析**：
   - 在您的域名DNS管理中添加CNAME记录
   - **主机记录**：`wedding`（或您想要的子域名）
   - **记录类型**：`CNAME`
   - **记录值**：腾讯云提供的CNAME地址（如：`wedding-invitation-1303923554.cos-website.ap-guangzhou.myqcloud.com`）

### 第五步：更新代码中的URL

修改 `index.html` 中的分享URL：

```html
<!-- 修改前 -->
<meta property="og:url" content="https://gioxxx2.github.io/wedding_invitation/">

<!-- 修改后（使用自定义域名） -->
<meta property="og:url" content="https://wedding.yourdomain.com/">

<!-- 或使用腾讯云默认域名 -->
<meta property="og:url" content="https://wedding-invitation-1303923554.cos-website.ap-guangzhou.myqcloud.com/">
```

### 第六步：在微信公众平台验证域名

1. 登录微信公众平台：https://mp.weixin.qq.com/
2. 进入 **设置与开发** → **公众号设置** → **功能设置**
3. 找到 **JS接口安全域名**
4. 添加您的域名（如：`wedding.yourdomain.com`）
5. 下载验证文件，上传到网站根目录
6. 确保验证文件可以通过 `https://wedding.yourdomain.com/MP_verify_xxxxx.txt` 访问
7. 点击 **确认**

## 访问地址

配置完成后，可以通过以下方式访问：

1. **腾讯云默认域名**：
   ```
   https://wedding-invitation-1303923554.cos-website.ap-guangzhou.myqcloud.com/
   ```

2. **自定义域名**（如果配置了）：
   ```
   https://wedding.yourdomain.com/
   ```

## 成本说明

### 免费额度
- **存储空间**：50GB/月免费
- **流量**：10GB/月免费
- **请求次数**：100万次/月免费

### 超出后费用
- **存储**：约 0.118元/GB/月
- **流量**：约 0.5元/GB
- **请求**：约 0.01元/万次

**对于婚礼邀请函项目，通常不会超出免费额度。**

## 注意事项

1. **文件权限**：确保所有文件设置为 **公有读**
2. **HTTPS**：腾讯云会自动配置HTTPS证书
3. **缓存**：可以配置CDN加速（需要额外费用）
4. **更新**：每次更新代码后，需要重新上传文件

## 与GitHub Pages的对比

| 特性 | GitHub Pages | 腾讯云静态网站 |
|------|-------------|---------------|
| 国内访问速度 | 慢 | 快 |
| 自定义域名 | 支持 | 支持 |
| 微信验证域名 | 可能受限 | 完全支持 |
| 自动部署 | 支持 | 需要配置 |
| 成本 | 免费 | 免费（在额度内） |
| HTTPS | 自动 | 自动 |

## 故障排查

### 问题1：文件上传后无法访问
- **检查**：文件权限是否为"公有读"
- **检查**：静态网站功能是否已开启

### 问题2：自定义域名无法访问
- **检查**：DNS解析是否正确
- **检查**：CNAME记录是否生效（等待DNS传播，通常几分钟到几小时）

### 问题3：HTTPS证书未生效
- **等待**：证书申请通常需要几分钟到几小时
- **检查**：域名是否已正确解析

## 推荐工作流程

1. **开发阶段**：继续使用GitHub Pages进行测试
2. **生产环境**：使用腾讯云静态网站托管
3. **自动部署**：配置GitHub Actions，推送到main分支时自动部署到腾讯云

## 下一步

配置完成后：
1. ✅ 更新 `index.html` 中的 `og:url`
2. ✅ 在微信公众平台验证域名
3. ✅ 测试分享功能
4. ✅ 测试访问速度

