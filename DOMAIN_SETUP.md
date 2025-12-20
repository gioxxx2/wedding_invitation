# 自定义域名配置说明

## 问题诊断

您的 GitHub Pages 显示已部署，但使用自定义域名 `stillstruggle.com`。如果无法访问，可能是以下原因：

## 解决方案

### 方案一：使用默认 GitHub Pages URL（推荐，立即可用）

**直接访问：**
```
https://gioxxx2.github.io/wedding_invitation/
```

这个 URL 应该可以立即访问，不需要任何额外配置。

### 方案二：配置自定义域名（需要 DNS 设置）

如果您想使用 `stillstruggle.com/wedding_invitation/`，需要完成以下步骤：

#### 1. DNS 配置

在您的域名服务商（如阿里云、腾讯云、GoDaddy 等）的 DNS 管理中添加以下记录：

**选项 A：使用 CNAME 记录（推荐）**
```
类型: CNAME
主机记录: @ 或 www
记录值: gioxxx2.github.io
TTL: 600 或默认
```

**选项 B：使用 A 记录**
```
类型: A
主机记录: @
记录值: 185.199.108.153
记录值: 185.199.109.153
记录值: 185.199.110.153
记录值: 185.199.111.153
```

#### 2. 子目录配置（如果使用 stillstruggle.com/wedding_invitation/）

如果您的域名根目录已经有其他网站，需要使用子目录：

1. **在 GitHub Pages 设置中：**
   - 自定义域名填写：`stillstruggle.com`
   - 保存设置

2. **在域名 DNS 中添加：**
   - 如果使用子目录，可能需要配置反向代理或使用 GitHub Pages 的路径映射

#### 3. 等待 DNS 传播

- DNS 更改通常需要 10 分钟到 48 小时才能生效
- 可以使用 [DNS Checker](https://dnschecker.org/) 检查 DNS 是否已生效

#### 4. 启用 HTTPS

DNS 生效后，在 GitHub Pages 设置中：
- 勾选 "Enforce HTTPS"
- 等待 SSL 证书自动配置（通常几分钟）

## 当前状态检查

1. **检查默认 URL 是否可用：**
   ```
   https://gioxxx2.github.io/wedding_invitation/
   ```

2. **检查 DNS 配置：**
   ```bash
   # 在终端运行
   nslookup stillstruggle.com
   # 或
   dig stillstruggle.com
   ```

3. **检查 GitHub Pages 构建状态：**
   - 访问：`https://github.com/gioxxx2/wedding_invitation/actions`
   - 查看是否有构建错误

## 常见问题

### Q: 为什么显示 "Enforce HTTPS" 不可用？
A: 因为自定义域名还没有正确配置 DNS，GitHub 无法验证域名所有权。

### Q: 可以使用子路径吗（如 stillstruggle.com/wedding_invitation/）？
A: GitHub Pages 默认不支持子路径。如果域名根目录已有其他内容，建议：
- 使用子域名：`wedding.stillstruggle.com`
- 或使用默认的 GitHub Pages URL

### Q: 如何设置子域名？
A: 如果使用 `wedding.stillstruggle.com`：
1. 在 DNS 中添加 CNAME 记录：
   ```
   类型: CNAME
   主机记录: wedding
   记录值: gioxxx2.github.io
   ```
2. 在 GitHub Pages 设置中，自定义域名填写：`wedding.stillstruggle.com`
3. 更新 CNAME 文件内容为：`wedding.stillstruggle.com`

## 推荐做法

**最简单的方式：**
1. 先使用默认 URL：`https://gioxxx2.github.io/wedding_invitation/`
2. 如果需要自定义域名，配置子域名：`wedding.stillstruggle.com`
3. 在请柬中分享子域名链接，更专业且易记

## 测试步骤

1. ✅ 已创建 CNAME 文件
2. ⏳ 等待您配置 DNS
3. ⏳ 等待 DNS 传播
4. ⏳ 在 GitHub Pages 设置中验证域名
5. ⏳ 启用 HTTPS

