// 导航菜单平滑滚动
document.querySelectorAll('.nav-item').forEach(item => {
    item.addEventListener('click', (e) => {
        e.preventDefault();
        const targetId = item.getAttribute('href');
        const targetSection = document.querySelector(targetId);
        
        if (targetSection) {
            targetSection.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
            
            // 更新活动状态
            document.querySelectorAll('.nav-item').forEach(nav => nav.classList.remove('active'));
            item.classList.add('active');
        }
    });
});

// 监听滚动，更新导航菜单活动状态
window.addEventListener('scroll', () => {
    const sections = document.querySelectorAll('.section');
    const navItems = document.querySelectorAll('.nav-item');
    
    let current = '';
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;
        if (window.pageYOffset >= sectionTop - 200) {
            current = section.getAttribute('id');
        }
    });
    
    navItems.forEach(item => {
        item.classList.remove('active');
        if (item.getAttribute('href') === `#${current}`) {
            item.classList.add('active');
        }
    });
});

// 照片展示功能 - 从七牛云CDN加载
const photoGallery = document.getElementById('photo-gallery');

// GitHub仓库配置（支持HTTPS，避免CORS问题）
const GITHUB_USER = 'gioxxx2';
const GITHUB_REPO = 'wedding_invitation';
const GITHUB_BRANCH = 'main';
// GitHub Pages地址（与网站同源，避免CORS问题）
const GITHUB_PAGES_BASE = `https://${GITHUB_USER}.github.io/${GITHUB_REPO}`;
// GitHub raw链接（备用方案）
const GITHUB_RAW_BASE = `https://raw.githubusercontent.com/${GITHUB_USER}/${GITHUB_REPO}/${GITHUB_BRANCH}`;

// 检测是否是本地环境
function isLocalEnvironment() {
    return window.location.protocol === 'file:' || 
           window.location.hostname === 'localhost' || 
           window.location.hostname === '127.0.0.1';
}

// 获取资源URL（本地环境使用相对路径，线上使用GitHub Pages）
function getResourceUrl(path) {
    if (isLocalEnvironment()) {
        // 本地环境使用相对路径
        return `./${path}`;
    }
    // 线上环境使用GitHub Pages（与网站同源，避免CORS问题）
    return `${GITHUB_PAGES_BASE}/${path}`;
}

// 获取备用资源URL（GitHub raw链接）
function getFallbackResourceUrl(path) {
    if (isLocalEnvironment()) {
        // 本地环境使用相对路径
        return `./${path}`;
    }
    // 备用方案使用GitHub raw链接
    return `${GITHUB_RAW_BASE}/${path}`;
}

// 按顺序展示的图片（使用腾讯云COS）
const selectedPhotos = [
    'https://wedding-1303923554.cos.ap-guangzhou.myqcloud.com/wedding_invitation/1.jpg',
    'https://wedding-1303923554.cos.ap-guangzhou.myqcloud.com/wedding_invitation/2.jpg',
    'https://wedding-1303923554.cos.ap-guangzhou.myqcloud.com/wedding_invitation/3.jpg'
];

// 从GitHub仓库加载照片
function loadPhotos() {
    if (!photoGallery) return;
    
    selectedPhotos.forEach((photoUrl, index) => {
        addPhotoToGallery(photoUrl);
    });
}

// 保存照片到本地存储
function savePhotos() {
    const photos = [];
    document.querySelectorAll('.photo-item img').forEach(img => {
        photos.push(img.src);
    });
    localStorage.setItem('weddingPhotos', JSON.stringify(photos));
}

// 添加照片到画廊
function addPhotoToGallery(photoSrc) {
    if (!photoGallery) return;
    
    const photoItem = document.createElement('div');
    photoItem.className = 'photo-item';
    
    const img = document.createElement('img');
    // Gitee raw链接不支持CORS，不使用crossOrigin属性
    img.src = photoSrc;
    img.alt = '婚礼照片';
    img.loading = 'lazy'; // 懒加载优化
    
    // 图片加载中显示占位符
    img.onload = function() {
        this.classList.add('loaded');
        photoItem.classList.add('loaded');
    };
    
    // 如果图片已经缓存，立即显示
    if (img.complete && img.naturalHeight !== 0) {
        img.classList.add('loaded');
        photoItem.classList.add('loaded');
    }
    
    // 图片加载错误处理
    img.onerror = function() {
        console.error('图片加载失败:', photoSrc);
        // 尝试使用备用方案：直接使用Gitee raw链接
        const path = photoSrc.split('/').slice(-2).join('/'); // 获取 picture/1.jpg 这样的路径
        const fallbackUrl = getFallbackResourceUrl(path);
        console.log('尝试备用URL (GitHub raw):', fallbackUrl);
        // GitHub raw链接支持跨域，但为了兼容性不使用crossOrigin
        img.src = fallbackUrl;
        // 如果备用URL也失败，显示占位图
        img.onerror = function() {
            console.error('备用URL也失败:', fallbackUrl);
            photoItem.innerHTML = `
                <div class="photo-placeholder-error">
                    <div class="placeholder-icon">📷</div>
                    <p class="placeholder-text">图片加载失败</p>
                </div>
            `;
        };
    };
    
    // 点击照片查看大图
    photoItem.addEventListener('click', () => {
        if (img.complete && img.naturalHeight !== 0) {
            showPhotoModal(photoSrc);
        }
    });
    
    photoItem.appendChild(img);
    photoGallery.appendChild(photoItem);
}

// 显示照片占位符
function showPhotoPlaceholder() {
    if (!photoGallery.querySelector('.photo-placeholder')) {
        const placeholder = document.createElement('div');
        placeholder.className = 'photo-placeholder';
        placeholder.innerHTML = `
            <div class="placeholder-icon">📸</div>
            <p class="placeholder-text">点击上方按钮上传照片</p>
            <p class="placeholder-hint">支持多张照片，建议上传横版或竖版照片</p>
        `;
        photoGallery.appendChild(placeholder);
    }
}

// 显示照片大图模态框
function showPhotoModal(photoSrc) {
    const modal = document.createElement('div');
    modal.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.9);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 10000;
        cursor: pointer;
    `;
    
    const img = document.createElement('img');
    img.src = photoSrc;
    img.style.cssText = `
        max-width: 90%;
        max-height: 90%;
        object-fit: contain;
    `;
    
    modal.appendChild(img);
    modal.addEventListener('click', () => modal.remove());
    document.body.appendChild(modal);
}

// 照片从GitHub仓库加载，不需要上传功能

// 视频展示功能
const videoContainer = document.getElementById('video-container');

// 从腾讯云COS加载视频
function loadVideo() {
    if (!videoContainer) return;
    
    // 使用腾讯云COS地址
    const videoUrl = 'https://wedding-1303923554.cos.ap-guangzhou.myqcloud.com/wedding_invitation/%E5%BE%90%E6%99%BA%E8%AF%B7%E6%9F%AC%E6%97%A0%E6%B0%B4%E5%8D%B0%EF%BC%882%EF%BC%89.mp4';
    
    const videoItem = document.createElement('div');
    videoItem.className = 'video-item';
    
    const video = document.createElement('video');
    // Gitee raw链接不支持CORS，不使用crossOrigin属性
    video.src = videoUrl;
    video.controls = true;
    video.playsInline = true; // 移动端内联播放
    video.style.cssText = 'width: 100%; height: 100%;';
    
    // 视频加载错误处理
    video.onerror = function() {
        console.error('视频加载失败:', videoUrl);
        // 腾讯云COS地址，如果失败直接显示错误
        videoContainer.innerHTML = '<div class="video-placeholder"><p>视频加载失败，请稍后重试</p><p style="font-size: 0.8rem; margin-top: 5px; color: #999;">请检查腾讯云COS配置</p></div>';
    };
    
    videoItem.appendChild(video);
    videoContainer.appendChild(videoItem);
}


// 微信浏览器检测和兼容性处理
function isWeChatBrowser() {
    const ua = navigator.userAgent.toLowerCase();
    return ua.indexOf('micromessenger') !== -1;
}

// 微信浏览器兼容性修复
if (isWeChatBrowser()) {
    // 禁用微信浏览器的默认行为
    document.addEventListener('WeixinJSBridgeReady', function() {
        // 微信 JS-SDK 准备就绪
    }, false);
    
    // 确保页面可见
    document.body.style.visibility = 'visible';
}

// 页面加载时初始化
// 设置封面背景图片（使用腾讯云COS）
function setIntroBackground() {
    const introBg = document.querySelector('.intro-background-cover');
    if (!introBg) return;
    
    // 使用腾讯云COS地址
    const bgUrl = 'https://wedding-1303923554.cos.ap-guangzhou.myqcloud.com/wedding_invitation/4.jpg';
    
    // 预加载图片，确保图片加载完成后再显示
    const img = new Image();
    img.onload = function() {
        introBg.style.backgroundImage = `url('${bgUrl}')`;
        // 直接设置为1，不使用过渡，避免快速滚动时闪烁
        introBg.style.opacity = '1';
    };
    img.onerror = function() {
        // 如果加载失败，保持默认背景
        console.warn('背景图片加载失败，使用默认背景');
        introBg.style.opacity = '1';
    };
    img.src = bgUrl;
    
    // 设置初始透明度为1，避免闪烁
    introBg.style.opacity = '1';
}

document.addEventListener('DOMContentLoaded', () => {
    // 设置封面背景图片
    setIntroBackground();
    // 从GitHub仓库加载图片和视频
    loadPhotos();
    loadVideo();
    
    // 添加平滑滚动效果
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
    
    // 添加故事时间线动画
    const storyItems = document.querySelectorAll('.story-item');
    const observerOptions = {
        threshold: 0.2,
        rootMargin: '0px 0px -100px 0px'
    };
    
    const storyObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);
    
    storyItems.forEach(item => {
        item.style.opacity = '0';
        item.style.transform = 'translateY(30px)';
        item.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        storyObserver.observe(item);
    });
    
    // 初始化来宾信息收集
    initRSVP();
});

// 来宾信息收集功能
const danmakuContainer = document.getElementById('danmaku-container');

// 初始化RSVP功能
function initRSVP() {
    // 加载已保存的来宾信息
    loadGuestData();
    
    // 检查是否是管理员（有GitHub Token的用户）
    checkAdminStatus();
    
    // 问卷按钮点击处理
    const surveyBtn = document.getElementById('survey-btn');
    if (surveyBtn) {
        surveyBtn.addEventListener('click', () => {
            // 获取腾讯问卷链接（优先使用配置的，否则使用默认链接）
            const surveyUrl = localStorage.getItem('tencentSurveyUrl') || 'https://wj.qq.com/s2/25294690/4365/';
            // 跳转到腾讯问卷（新窗口打开）
            window.open(surveyUrl, '_blank');
        });
    }
}

// 检查管理员状态
function checkAdminStatus() {
    const githubToken = localStorage.getItem('githubToken');
    const adminActions = document.getElementById('admin-actions');
    
    // 如果有GitHub Token，显示管理按钮
    if (githubToken && adminActions) {
        adminActions.style.display = 'flex';
    } else if (adminActions) {
        adminActions.style.display = 'none';
    }
}

// 保存到本地存储（用于弹幕和本地查看）
function saveGuestDataLocal(guestData) {
    let guests = JSON.parse(localStorage.getItem('weddingGuests') || '[]');
    guests.push(guestData);
    localStorage.setItem('weddingGuests', JSON.stringify(guests));
    console.log('✅ 数据已保存到本地存储，共', guests.length, '条记录');
}

// 显示弹幕
function showDanmaku(blessing, name) {
    const danmaku = document.createElement('div');
    danmaku.className = 'danmaku-item';
    danmaku.textContent = `${name}: ${blessing}`;
    
    // 随机高度
    const top = Math.random() * 80 + 10; // 10% 到 90% 之间
    danmaku.style.top = `${top}%`;
    
    // 随机速度
    const duration = 12 + Math.random() * 8; // 12-20秒
    danmaku.style.animationDuration = `${duration}s`;
    
    // 随机颜色
    const colors = [
        'rgba(212, 165, 116, 0.9)',
        'rgba(200, 159, 127, 0.9)',
        'rgba(255, 182, 193, 0.9)',
        'rgba(255, 192, 203, 0.9)',
        'rgba(221, 160, 221, 0.9)'
    ];
    const randomColor = colors[Math.floor(Math.random() * colors.length)];
    danmaku.style.background = `linear-gradient(135deg, ${randomColor}, ${randomColor.replace('0.9', '0.7')})`;
    
    danmakuContainer.appendChild(danmaku);
    
    // 点击弹幕可以关闭
    danmaku.addEventListener('click', () => {
        danmaku.remove();
    });
    
    // 动画结束后移除
    setTimeout(() => {
        if (danmaku.parentNode) {
            danmaku.remove();
        }
    }, duration * 1000);
}

// 显示成功提示
function showSuccessMessage(customMessage) {
    const message = document.createElement('div');
    message.className = 'success-message';
    const displayMessage = customMessage || '感谢您的确认！';
    message.innerHTML = `
        <div class="success-icon">✅</div>
        <div class="success-text">${displayMessage}</div>
        <button class="close-btn" onclick="this.parentElement.remove()">确定</button>
    `;
    document.body.appendChild(message);
    
    // 3秒后自动关闭（如果有自定义消息，2秒后关闭）
    setTimeout(() => {
        if (message.parentNode) {
            message.remove();
        }
    }, customMessage ? 2000 : 3000);
}

// 设置腾讯问卷链接
function setTencentSurveyUrl() {
    const defaultUrl = 'https://wj.qq.com/s2/25294690/4365/';
    const currentUrl = localStorage.getItem('tencentSurveyUrl') || defaultUrl;
    const url = prompt('请输入腾讯问卷链接：\n\n例如：https://wj.qq.com/s2/1234567/ab3d/', currentUrl);
    
    if (url) {
        // 验证URL格式
        if (url.startsWith('https://wj.qq.com/') || url.startsWith('http://wj.qq.com/')) {
            localStorage.setItem('tencentSurveyUrl', url);
            alert('✅ 腾讯问卷链接已设置！\n\n提交表单后，将自动跳转到腾讯问卷。');
            console.log('✅ 腾讯问卷链接已保存:', url);
        } else {
            alert('❌ 请输入有效的腾讯问卷链接（应以 https://wj.qq.com/ 开头）');
        }
    }
}

// 请求队列，避免并发冲突
let saveQueue = [];
let isSaving = false;

// 保存来宾信息到本地存储和GitHub
async function saveGuestData(guestData) {
    // 先保存到本地存储
    let guests = JSON.parse(localStorage.getItem('weddingGuests') || '[]');
    guests.push(guestData);
    localStorage.setItem('weddingGuests', JSON.stringify(guests));
    console.log('✅ 数据已保存到本地存储，共', guests.length, '条记录');
    
    // 尝试保存到GitHub（如果配置了token）
    const githubToken = localStorage.getItem('githubToken');
    if (githubToken) {
        console.log('🔑 检测到GitHub Token，开始同步到GitHub...');
        // 将保存任务加入队列
        saveQueue.push(guests);
        // 如果当前没有正在保存的任务，开始处理队列
        if (!isSaving) {
            processSaveQueue();
        }
    } else {
        console.warn('⚠️ 未设置GitHub Token，数据只保存到本地。点击"🔑 设置GitHub保存"按钮可启用GitHub同步。');
    }
}

// 处理保存队列
async function processSaveQueue() {
    if (saveQueue.length === 0) {
        isSaving = false;
        return;
    }
    
    isSaving = true;
    const guests = saveQueue[saveQueue.length - 1]; // 取最新的数据
    saveQueue = []; // 清空队列，只保留最新的
    
    try {
        if (isWeChatBrowser()) {
            console.log('📱 微信浏览器环境，使用异步保存（不阻塞）');
            // 微信浏览器中异步保存，不阻塞用户操作
            await saveToGitHubWithRetry(guests);
        } else {
            await saveToGitHubWithRetry(guests);
        }
    } catch (err) {
        console.error('保存到GitHub失败:', err);
        // 在微信中，即使失败也不显示错误，避免影响用户体验
        if (!isWeChatBrowser()) {
            showGitHubSaveError('保存失败', err.message);
        }
    } finally {
        // 继续处理队列中的下一个任务
        setTimeout(() => {
            processSaveQueue();
        }, 1000); // 延迟1秒，避免请求过于频繁
    }
}

// 带重试机制的保存函数
async function saveToGitHubWithRetry(guests, maxRetries = 3) {
    for (let attempt = 1; attempt <= maxRetries; attempt++) {
        try {
            console.log(`📤 尝试保存到GitHub (第 ${attempt}/${maxRetries} 次)...`);
            await saveToGitHub(guests);
            console.log('✅ 保存成功！');
            return; // 成功则退出
        } catch (error) {
            console.error(`❌ 第 ${attempt} 次尝试失败:`, error.message);
            if (attempt < maxRetries) {
                // 等待后重试，等待时间递增（1秒、2秒、3秒）
                const waitTime = attempt * 1000;
                console.log(`⏳ ${waitTime/1000}秒后重试...`);
                await new Promise(resolve => setTimeout(resolve, waitTime));
            } else {
                // 所有重试都失败，抛出错误
                throw new Error(`保存失败：已重试 ${maxRetries} 次，最后错误：${error.message}`);
            }
        }
    }
}

// 保存数据到GitHub
async function saveToGitHub(guests) {
    const githubToken = localStorage.getItem('githubToken');
    if (!githubToken) {
        // 如果没有配置token，只保存到本地
        console.warn('⚠️ 未设置GitHub Token，跳过GitHub同步');
        return;
    }
    
    const repo = 'gioxxx2/wedding_invitation';
    const filePath = 'data/guests.json';
    const content = JSON.stringify(guests, null, 2);
    const encodedContent = btoa(unescape(encodeURIComponent(content)));
    
    console.log('📤 准备保存', guests.length, '条记录到GitHub...');
    
    // 先获取文件SHA（如果存在）
    let sha = null;
    try {
        const getResponse = await fetchWithTimeout(
            `https://api.github.com/repos/${repo}/contents/${filePath}`,
            {
                headers: {
                    'Authorization': `Bearer ${githubToken}`,
                    'Accept': 'application/vnd.github.v3+json'
                }
            },
            15000 // 15秒超时
        );
        
        if (getResponse.ok) {
            const fileData = await getResponse.json();
            sha = fileData.sha;
            console.log('📋 获取到现有文件的SHA:', sha.substring(0, 10) + '...');
        } else if (getResponse.status === 404) {
            // 文件不存在，继续创建新文件
            console.log('📄 文件不存在，将创建新文件');
        } else {
            const errorText = await getResponse.text();
            throw new Error(`获取文件失败 (${getResponse.status}): ${errorText}`);
        }
    } catch (e) {
        if (e.name === 'TimeoutError') {
            throw new Error('获取文件超时，请检查网络连接');
        }
        throw new Error(`获取文件出错: ${e.message}`);
    }
    
    // 创建或更新文件
    console.log('💾 正在上传到GitHub...');
    
    const fetchOptions = {
        method: 'PUT',
        headers: {
            'Authorization': `Bearer ${githubToken}`,
            'Accept': 'application/vnd.github.v3+json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            message: `更新来宾信息 - ${new Date().toLocaleString('zh-CN')}`,
            content: encodedContent,
            sha: sha
        })
    };
    
    try {
        const response = await fetchWithTimeout(
            `https://api.github.com/repos/${repo}/contents/${filePath}`,
            fetchOptions,
            20000 // 20秒超时
        );
        
        if (response.ok) {
            const result = await response.json();
            console.log('✅ 数据已保存到GitHub:', result.commit.html_url);
            // 显示成功提示
            if (!isWeChatBrowser()) {
                showGitHubSaveSuccess();
            }
        } else {
            const errorText = await response.text();
            let errorMessage = errorText;
            try {
                const errorJson = JSON.parse(errorText);
                errorMessage = errorJson.message || errorText;
            } catch (e) {
                // 如果不是JSON，直接使用原文本
            }
            throw new Error(`保存失败 (${response.status}): ${errorMessage}`);
        }
    } catch (error) {
        if (error.name === 'TimeoutError') {
            throw new Error('上传超时，请检查网络连接');
        }
        throw error;
    }
}

// 带超时的 fetch 函数
function fetchWithTimeout(url, options, timeout = 30000) {
    return Promise.race([
        fetch(url, options),
        new Promise((_, reject) => {
            setTimeout(() => {
                const timeoutError = new Error('请求超时');
                timeoutError.name = 'TimeoutError';
                reject(timeoutError);
            }, timeout);
        })
    ]);
}

// 显示GitHub保存成功提示
function showGitHubSaveSuccess() {
    const message = document.createElement('div');
    message.className = 'success-message';
    message.style.maxWidth = '400px';
    message.innerHTML = `
        <div class="success-icon">✅</div>
        <div class="success-text">数据已同步到GitHub！</div>
        <button class="close-btn" onclick="this.parentElement.remove()">确定</button>
    `;
    document.body.appendChild(message);
    setTimeout(() => {
        if (message.parentNode) {
            message.remove();
        }
    }, 3000);
}

// 显示GitHub保存错误提示
function showGitHubSaveError(status, errorText) {
    let errorMsg = '保存失败';
    if (status === 401) {
        errorMsg = 'Token 无效或已过期，请重新设置';
    } else if (status === 403) {
        errorMsg = 'Token 权限不足，请确保有 repo 权限';
    } else if (status === 404) {
        errorMsg = '仓库不存在，请检查仓库名称';
    } else {
        errorMsg = `保存失败 (${status})`;
    }
    
    const message = document.createElement('div');
    message.className = 'success-message';
    message.style.maxWidth = '400px';
    message.style.background = '#fee';
    message.innerHTML = `
        <div class="success-icon">❌</div>
        <div class="success-text">${errorMsg}</div>
        <div style="font-size: 0.8rem; color: #666; margin-top: 0.5rem;">数据已保存在本地，不会丢失</div>
        <button class="close-btn" onclick="this.parentElement.remove()">确定</button>
    `;
    document.body.appendChild(message);
    setTimeout(() => {
        if (message.parentNode) {
            message.remove();
        }
    }, 5000);
}

// 设置GitHub Token
function setGitHubToken() {
    const currentToken = localStorage.getItem('githubToken') || '';
    const token = prompt('请输入GitHub Personal Access Token（用于自动保存数据到GitHub）:\n\n注意：Token需要有repo权限\n留空则只保存到本地', currentToken);
    if (token && token.trim()) {
        localStorage.setItem('githubToken', token.trim());
        alert('GitHub Token已设置！数据将自动保存到GitHub。');
        // 显示管理按钮
        checkAdminStatus();
    } else if (token === '') {
        localStorage.removeItem('githubToken');
        alert('GitHub Token已清除，数据将只保存到本地。');
        // 隐藏管理按钮
        checkAdminStatus();
    }
}

// 加载来宾信息
function loadGuestData() {
    const guests = JSON.parse(localStorage.getItem('weddingGuests') || '[]');
    return guests;
}

// 导出为CSV
function exportToCSV() {
    const guests = loadGuestData();
    if (guests.length === 0) {
        alert('暂无来宾信息');
        return;
    }
    
    const headers = ['姓名', '电话', '参加人数', '参加地点', '祝福语', '提交时间'];
    const rows = guests.map(guest => [
        guest.name,
        guest.phone,
        guest.count,
        guest.location || '',
        guest.blessing || '',
        new Date(guest.timestamp).toLocaleString('zh-CN')
    ]);
    
    const csvContent = [
        headers.join(','),
        ...rows.map(row => row.map(cell => `"${cell}"`).join(','))
    ].join('\n');
    
    const blob = new Blob(['\uFEFF' + csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `来宾信息_${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
}

// 数据已自动保存到本地存储和GitHub（如果设置了Token）

// 待同步队列
let syncQueue = [];

// 添加到同步队列
function addToSyncQueue(guestData) {
    syncQueue.push(guestData);
    localStorage.setItem('syncQueue', JSON.stringify(syncQueue));
    
    // 尝试批量同步
    tryBatchSync();
}

// 尝试批量同步
async function tryBatchSync() {
    if (syncQueue.length === 0) return;
    
    // 这里可以尝试使用各种方法同步数据
    // 例如：通过第三方服务、Webhook等
    
    // 目前先保存到本地，用户可以手动导出
    console.log('待同步数据:', syncQueue);
}

// 加载同步队列
function loadSyncQueue() {
    const saved = localStorage.getItem('syncQueue');
    if (saved) {
        syncQueue = JSON.parse(saved);
    }
}


// 在页面加载时显示已有的祝福语弹幕
window.addEventListener('load', () => {
    const guests = loadGuestData();
    // 显示最近5条祝福语弹幕
    const recentBlessings = guests
        .filter(g => g.blessing && g.blessing.trim())
        .slice(-5);
    
    recentBlessings.forEach((guest, index) => {
        setTimeout(() => {
            showDanmaku(guest.blessing, guest.name);
        }, index * 2000); // 每条弹幕间隔2秒
    });
});

// 页面加载时加载同步队列
loadSyncQueue();

// 添加导出功能到页面（可选，可以通过控制台调用）
window.exportGuestData = exportToCSV;
window.setGitHubToken = setGitHubToken;

