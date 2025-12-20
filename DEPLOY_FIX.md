# 部署问题修复步骤

## 问题：ERR_EMPTY_RESPONSE

`stillstruggle.com` 无法访问，显示 ERR_EMPTY_RESPONSE。

## 原因

1. GitHub Pages 不支持子路径（`stillstruggle.com/wedding_invitation/`）
2. 自定义域名 DNS 配置不正确
3. GitHub Pages 设置中可能还配置了自定义域名

## 立即修复步骤

### 步骤 1：删除 GitHub Pages 中的自定义域名

1. **访问 GitHub Pages 设置：**
   ```
   https://github.com/gioxxx2/wedding_invitation/settings/pages
   ```

2. **找到 "Custom domain" 部分**

3. **完全删除自定义域名：**
   - 清空输入框中的所有内容（包括 `stillstruggle.com`）
   - 点击 **"Save"** 按钮
   - 如果 **"Remove"** 按钮可用，也点击它

4. **等待 2-3 分钟**

5. **刷新页面，确认：**
   - Custom domain 输入框完全为空
   - 网站地址应该变成：`https://gioxxx2.github.io/wedding_invitation/`

### 步骤 2：访问正确的 URL

**不要使用：** `http://stillstruggle.com/wedding_invitation/` ❌

**使用这个：** `https://gioxxx2.github.io/wedding_invitation/` ✅

### 步骤 3：验证网站是否正常

访问以下 URL 测试：

1. **主页面：**
   ```
   https://gioxxx2.github.io/wedding_invitation/
   ```

2. **数据查看页面：**
   ```
   https://gioxxx2.github.io/wedding_invitation/data-viewer.html
   ```

3. **如果还是不行，尝试：**
   ```
   https://gioxxx2.github.io/wedding_invitation/index.html
   ```

### 步骤 4：检查构建状态

1. **访问 Actions 页面：**
   ```
   https://github.com/gioxxx2/wedding_invitation/actions
   ```

2. **确认最新的构建是否成功**
   - 如果失败，查看错误日志
   - 如果成功，等待几分钟后重试访问

## 如果还是无法访问

### 检查清单

- [ ] 已删除 GitHub Pages 设置中的自定义域名
- [ ] 已等待 5-10 分钟让 GitHub Pages 重新构建
- [ ] 已清除浏览器缓存（或使用无痕模式）
- [ ] 已检查 Actions 页面，确认构建成功
- [ ] 使用的是正确的 URL：`https://gioxxx2.github.io/wedding_invitation/`

### 强制重新部署

如果删除自定义域名后还是不行，可以：

1. **做一个小的更改来触发重新部署：**
   ```bash
   # 在项目目录下
   echo " " >> README.md
   git add README.md
   git commit -m "触发重新部署"
   git push origin main
   ```

2. **等待 2-5 分钟**

3. **再次访问：** `https://gioxxx2.github.io/wedding_invitation/`

## 关于自定义域名

### 如果以后想使用 stillstruggle.com：

**必须使用根域名或子域名，不能使用子路径：**

❌ **不支持：** `stillstruggle.com/wedding_invitation/`
✅ **支持：** `stillstruggle.com/`（根域名）
✅ **支持：** `wedding.stillstruggle.com/`（子域名）

**配置步骤：**
1. 在域名服务商配置 DNS（A 记录或 CNAME）
2. 在 GitHub Pages 设置自定义域名为根域名或子域名
3. 等待 DNS 传播和 HTTPS 证书生成

## 当前应该使用的 URL

**主页面：**
```
https://gioxxx2.github.io/wedding_invitation/
```

**数据查看页面：**
```
https://gioxxx2.github.io/wedding_invitation/data-viewer.html
```

## 测试命令

在浏览器控制台（F12）运行：

```javascript
// 测试网站是否可访问
fetch('https://gioxxx2.github.io/wedding_invitation/')
  .then(r => console.log('状态:', r.status, r.statusText))
  .catch(e => console.log('错误:', e));
```

