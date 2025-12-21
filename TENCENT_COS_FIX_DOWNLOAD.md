# 腾讯云COS静态网站 - 解决下载HTML文件问题

## 问题现象

访问 `https://wedding-1303923554.cos-website.ap-guangzhou.myqcloud.com` 时，浏览器下载HTML文件而不是显示网页。

## 原因分析

这个问题通常是因为：
1. **静态网站功能未正确开启**
2. **文件Content-Type未正确设置**
3. **索引文档未配置**

## 解决方案

### 方案1：检查并开启静态网站功能（最重要）

1. 登录腾讯云控制台
2. 进入 **对象存储 COS** → 找到您的存储桶 `wedding-1303923554`
3. 点击存储桶名称进入详情
4. 进入 **基础配置** → **静态网站**
5. **确保以下配置**：
   - ✅ **状态**：已开启
   - ✅ **索引文档**：`index.html`
   - ✅ **错误文档**：`index.html`（可选）
6. 点击 **保存**

### 方案2：检查文件Content-Type

1. 进入存储桶的 **文件列表**
2. 找到 `index.html` 文件
3. 点击文件右侧的 **详情** 或 **设置**
4. 检查 **Content-Type**：
   - 应该是 `text/html` 或 `text/html; charset=utf-8`
   - 如果不是，需要修改

**修改Content-Type**：
1. 点击文件右侧的 **更多** → **修改元数据**
2. 找到 **Content-Type**
3. 设置为 `text/html; charset=utf-8`
4. 点击 **保存**

### 方案3：重新上传文件（推荐）

如果修改Content-Type不方便，可以重新上传文件：

1. **删除现有文件**（可选，但推荐）
2. **重新上传文件**，确保：
   - 文件上传时自动识别Content-Type
   - 或者手动设置Content-Type

**使用COS CLI重新上传**：
```bash
# 设置正确的Content-Type上传
coscli cp index.html cos://wedding-1303923554/index.html \
  --meta Content-Type:text/html;charset=utf-8
```

### 方案4：批量设置文件Content-Type

如果需要批量设置多个文件的Content-Type：

**HTML文件**：
```bash
coscli cp index.html cos://wedding-1303923554/index.html \
  --meta Content-Type:text/html;charset=utf-8

coscli cp data-viewer.html cos://wedding-1303923554/data-viewer.html \
  --meta Content-Type:text/html;charset=utf-8
```

**CSS文件**：
```bash
coscli cp styles.css cos://wedding-1303923554/styles.css \
  --meta Content-Type:text/css;charset=utf-8
```

**JavaScript文件**：
```bash
coscli cp script.js cos://wedding-1303923554/script.js \
  --meta Content-Type:application/javascript;charset=utf-8
```

**JSON文件**：
```bash
coscli cp data/guests.json cos://wedding-1303923554/data/guests.json \
  --meta Content-Type:application/json;charset=utf-8
```

### 方案5：使用控制台批量设置（最简单）

1. 进入存储桶的 **文件列表**
2. 选择所有需要设置的文件（或逐个设置）
3. 点击 **批量操作** → **修改元数据**
4. 设置 **Content-Type**：
   - HTML文件：`text/html; charset=utf-8`
   - CSS文件：`text/css; charset=utf-8`
   - JS文件：`application/javascript; charset=utf-8`
   - JSON文件：`application/json; charset=utf-8`
   - JPG图片：`image/jpeg`
   - PNG图片：`image/png`
   - MP4视频：`video/mp4`
5. 点击 **确定**

## 完整检查清单

### ✅ 步骤1：确认静态网站已开启
- [ ] 进入存储桶 → **基础配置** → **静态网站**
- [ ] 确认状态为 **已开启**
- [ ] 确认索引文档为 `index.html`

### ✅ 步骤2：检查文件Content-Type
- [ ] `index.html` → `text/html; charset=utf-8`
- [ ] `styles.css` → `text/css; charset=utf-8`
- [ ] `script.js` → `application/javascript; charset=utf-8`
- [ ] 图片文件 → `image/jpeg` 或 `image/png`
- [ ] 视频文件 → `video/mp4`

### ✅ 步骤3：测试访问
- [ ] 访问 `https://wedding-1303923554.cos-website.ap-guangzhou.myqcloud.com`
- [ ] 应该显示网页而不是下载文件

## 快速修复脚本

如果您使用COS CLI，可以使用以下脚本：

```bash
#!/bin/bash

BUCKET="wedding-1303923554"
REGION="ap-guangzhou"

# 设置HTML文件
coscli cp index.html cos://$BUCKET/index.html \
  --meta Content-Type:text/html;charset=utf-8

coscli cp data-viewer.html cos://$BUCKET/data-viewer.html \
  --meta Content-Type:text/html;charset=utf-8

# 设置CSS文件
coscli cp styles.css cos://$BUCKET/styles.css \
  --meta Content-Type:text/css;charset=utf-8

# 设置JS文件
coscli cp script.js cos://$BUCKET/script.js \
  --meta Content-Type:application/javascript;charset=utf-8

# 设置JSON文件（如果存在）
if [ -f "data/guests.json" ]; then
  coscli cp data/guests.json cos://$BUCKET/data/guests.json \
    --meta Content-Type:application/json;charset=utf-8
fi

echo "文件Content-Type已设置完成！"
```

## 常见文件Content-Type对照表

| 文件类型 | Content-Type |
|---------|-------------|
| HTML | `text/html; charset=utf-8` |
| CSS | `text/css; charset=utf-8` |
| JavaScript | `application/javascript; charset=utf-8` |
| JSON | `application/json; charset=utf-8` |
| JPG | `image/jpeg` |
| PNG | `image/png` |
| MP4 | `video/mp4` |
| SVG | `image/svg+xml` |

## 验证方法

修复后，通过以下方式验证：

1. **浏览器访问**：
   ```
   https://wedding-1303923554.cos-website.ap-guangzhou.myqcloud.com
   ```
   应该显示网页，而不是下载文件

2. **检查响应头**：
   使用浏览器开发者工具（F12）→ Network → 查看响应头
   - 应该看到 `Content-Type: text/html; charset=utf-8`
   - 不应该看到 `Content-Disposition: attachment`

## 如果仍然无法解决

1. **清除浏览器缓存**：Ctrl+F5 强制刷新
2. **检查存储桶权限**：确保是"公有读"
3. **检查静态网站域名**：确保使用的是静态网站域名（`cos-website`），不是普通域名
4. **联系腾讯云客服**：如果以上方法都不行

## 注意事项

- 静态网站域名格式：`<bucket-name>.cos-website.<region>.myqcloud.com`
- 普通域名格式：`<bucket-name>.cos.<region>.myqcloud.com`（不支持静态网站）
- 确保使用正确的静态网站域名访问

