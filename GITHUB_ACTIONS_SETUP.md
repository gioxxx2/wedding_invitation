# GitHub Actions 自动部署到腾讯云COS配置指南

## 配置步骤

### 第一步：在GitHub仓库中配置Secrets

1. 进入您的GitHub仓库：https://github.com/gioxxx2/wedding_invitation
2. 点击 **Settings**（设置）
3. 在左侧菜单中找到 **Secrets and variables** → **Actions**
4. 点击 **New repository secret**（新建仓库密钥）

#### 添加第一个Secret：TENCENT_SECRET_ID
- **Name**：`TENCENT_SECRET_ID`
- **Secret**：`您的腾讯云SecretId`（请替换为实际的SecretId）
- 点击 **Add secret**

#### 添加第二个Secret：TENCENT_SECRET_KEY
- **Name**：`TENCENT_SECRET_KEY`
- **Secret**：`您的腾讯云SecretKey`（请替换为实际的SecretKey）
- 点击 **Add secret**

### 第二步：验证工作流文件

工作流文件已创建在：`.github/workflows/deploy-to-tencent-cos.yml`

该文件会在以下情况自动触发：
- ✅ 推送到 `main` 分支时
- ✅ 手动触发（在Actions页面点击"Run workflow"）

### 第三步：测试部署

1. **提交并推送代码**：
```bash
git add .github/workflows/deploy-to-tencent-cos.yml
git commit -m "添加GitHub Actions自动部署到腾讯云COS"
git push origin main
```

2. **查看部署状态**：
   - 进入GitHub仓库
   - 点击 **Actions** 标签
   - 查看工作流运行状态
   - 绿色✅表示成功，红色❌表示失败

3. **验证部署结果**：
   访问：https://wedding-1303923554.cos-website.ap-guangzhou.myqcloud.com
   应该能看到最新的网站内容

## 工作流说明

### 自动执行的操作

1. **检出代码**：从GitHub仓库拉取最新代码
2. **安装COS CLI**：下载并安装腾讯云COS命令行工具
3. **配置COS CLI**：使用Secrets中的密钥配置
4. **同步文件**：
   - HTML文件（设置正确的Content-Type）
   - CSS文件
   - JavaScript文件
   - 图片文件夹（picture/）
   - 视频文件夹（video/）
   - 数据文件夹（data/）

### 文件Content-Type设置

工作流会自动为文件设置正确的Content-Type：
- HTML：`text/html; charset=utf-8`
- CSS：`text/css; charset=utf-8`
- JavaScript：`application/javascript; charset=utf-8`
- 图片：自动识别（image/jpeg, image/png等）
- 视频：自动识别（video/mp4等）

## 手动触发部署

如果需要手动触发部署：

1. 进入GitHub仓库
2. 点击 **Actions** 标签
3. 在左侧选择 **Deploy to Tencent Cloud COS**
4. 点击 **Run workflow**
5. 选择分支（通常是 `main`）
6. 点击 **Run workflow** 按钮

## 故障排查

### 问题1：部署失败，提示认证错误

**原因**：Secrets配置不正确

**解决**：
1. 检查Secrets名称是否正确：
   - `TENCENT_SECRET_ID`
   - `TENCENT_SECRET_KEY`
2. 检查Secret值是否正确（注意不要有多余的空格）
3. 重新添加Secrets

### 问题2：文件上传成功但无法访问

**原因**：Content-Type未正确设置或静态网站未开启

**解决**：
1. 检查腾讯云COS控制台 → 静态网站是否已开启
2. 检查文件的Content-Type是否正确
3. 工作流会自动设置Content-Type，如果还有问题，检查文件详情

### 问题3：部分文件未上传

**原因**：文件路径或格式不匹配

**解决**：
1. 检查文件是否存在于仓库中
2. 检查文件扩展名是否在include列表中
3. 查看Actions日志，找到具体错误信息

## 安全注意事项

⚠️ **重要**：
- ✅ Secrets已配置在GitHub仓库的加密存储中
- ✅ 工作流日志中不会显示Secret值
- ❌ 不要在代码中硬编码Secret值
- ❌ 不要将Secret提交到仓库

## 更新部署配置

如果需要修改部署配置（如存储桶名称、区域等），编辑：
`.github/workflows/deploy-to-tencent-cos.yml`

修改后提交并推送，下次部署时会使用新配置。

## 部署日志

每次部署的详细日志可以在GitHub Actions页面查看：
1. 进入仓库 → **Actions**
2. 点击对应的部署记录
3. 查看每个步骤的详细日志

## 下一步

配置完成后：
1. ✅ 推送代码到main分支
2. ✅ 查看Actions页面确认部署成功
3. ✅ 访问网站验证内容是否正确
4. ✅ 测试所有功能是否正常

