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

// 地图功能 - 使用高德地图API
function loadAddress() {
    // 等待高德地图API加载完成
    if (typeof AMap === 'undefined') {
        setTimeout(loadAddress, 100);
        return;
    }
    
    // 跳转到高德地图app的函数
    function openAmapApp(lng, lat, name, address) {
        // 检测设备类型
        const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
        const isAndroid = /Android/.test(navigator.userAgent);
        
        let appUrl = '';
        if (isIOS) {
            // iOS高德地图URI Scheme
            appUrl = `iosamap://navi?sourceApplication=wedding&poiname=${encodeURIComponent(name)}&lat=${lat}&lon=${lng}&dev=0`;
        } else if (isAndroid) {
            // Android高德地图URI Scheme
            appUrl = `androidamap://navi?sourceApplication=wedding&poiname=${encodeURIComponent(name)}&lat=${lat}&lon=${lng}&dev=0`;
        } else {
            // PC端使用网页版高德地图
            appUrl = `https://uri.amap.com/search?query=${encodeURIComponent(address)}`;
        }
        
        // 尝试打开app，如果失败则打开网页版
        const link = document.createElement('a');
        link.href = appUrl;
        link.target = '_blank';
        link.click();
        
        // 如果app没有安装，3秒后打开网页版
        setTimeout(() => {
            if (isIOS || isAndroid) {
                window.open(`https://uri.amap.com/search?query=${encodeURIComponent(address)}`, '_blank');
            }
        }, 3000);
    }
    
    // 初始化出阁之喜地点地图（深圳）
    const chugeMapContainer = document.getElementById('map-container-chuge');
    if (chugeMapContainer) {
        const chugeLng = 113.946533;
        const chugeLat = 22.540503;
        const chugeName = '圣丰城酒家（南山科技园店）';
        const chugeAddress = '广东省深圳市南山区讯美科技广场圣丰城酒家（南山科技园店）';
        
        const chugeMap = new AMap.Map('map-container-chuge', {
            zoom: 16,
            center: [chugeLng, chugeLat], // 深圳圣丰城酒家坐标
            viewMode: '3D',
            // 禁用所有交互
            dragEnable: false,           // 禁用拖拽
            scrollWheelZoom: false,      // 禁用滚轮缩放
            doubleClickZoom: false,       // 禁用双击缩放
            keyboardEnable: false,        // 禁用键盘操作
            zoomEnable: false,            // 禁用缩放控件
            rotateEnable: false,          // 禁用旋转
            pitchEnable: false,           // 禁用俯仰
            mapStyle: 'amap://styles/normal' // 使用标准样式
        });
        
        // 添加标记
        const chugeMarker = new AMap.Marker({
            position: [chugeLng, chugeLat],
            title: chugeName
        });
        chugeMap.add(chugeMarker);
        
        // 添加信息窗体
        const chugeInfoWindow = new AMap.InfoWindow({
            content: `<div style="padding: 10px;"><h3>${chugeName}</h3><p>${chugeAddress}</p><p style="margin-top: 10px; color: #1890ff; cursor: pointer;" onclick="window.open('https://uri.amap.com/search?query=${encodeURIComponent(chugeAddress)}', '_blank')">点击查看地图</p></div>`
        });
        
        // 标记点击事件
        chugeMarker.on('click', () => {
            chugeInfoWindow.open(chugeMap, chugeMarker.getPosition());
        });
        
        // 地图容器点击事件 - 跳转到高德地图app
        chugeMapContainer.style.cursor = 'pointer';
        chugeMapContainer.addEventListener('click', (e) => {
            e.stopPropagation();
            openAmapApp(chugeLng, chugeLat, chugeName, chugeAddress);
        });
        
        // 地图点击事件
        chugeMap.on('click', () => {
            openAmapApp(chugeLng, chugeLat, chugeName, chugeAddress);
        });
    }
    
    // 初始化婚典之约地点地图（海口）
    const hunyanMapContainer = document.getElementById('map-container-hunyan');
    if (hunyanMapContainer) {
        const hunyanLng = 110.330802;
        const hunyanLat = 20.022071;
        const hunyanName = '宝华海景大酒店（龙华店）';
        const hunyanAddress = '海南省海口市龙华区滨海大道宝华海景大酒店（龙华店）';
        
        const hunyanMap = new AMap.Map('map-container-hunyan', {
            zoom: 16,
            center: [hunyanLng, hunyanLat], // 海口宝华海景大酒店坐标
            viewMode: '3D',
            // 禁用所有交互
            dragEnable: false,           // 禁用拖拽
            scrollWheelZoom: false,      // 禁用滚轮缩放
            doubleClickZoom: false,       // 禁用双击缩放
            keyboardEnable: false,        // 禁用键盘操作
            zoomEnable: false,            // 禁用缩放控件
            rotateEnable: false,          // 禁用旋转
            pitchEnable: false,           // 禁用俯仰
            mapStyle: 'amap://styles/normal' // 使用标准样式
        });
        
        // 添加标记
        const hunyanMarker = new AMap.Marker({
            position: [hunyanLng, hunyanLat],
            title: hunyanName
        });
        hunyanMap.add(hunyanMarker);
        
        // 添加信息窗体
        const hunyanInfoWindow = new AMap.InfoWindow({
            content: `<div style="padding: 10px;"><h3>${hunyanName}</h3><p>${hunyanAddress}</p><p style="margin-top: 10px; color: #1890ff; cursor: pointer;" onclick="window.open('https://uri.amap.com/search?query=${encodeURIComponent(hunyanAddress)}', '_blank')">点击查看地图</p></div>`
        });
        
        // 标记点击事件
        hunyanMarker.on('click', () => {
            hunyanInfoWindow.open(hunyanMap, hunyanMarker.getPosition());
        });
        
        // 地图容器点击事件 - 跳转到高德地图app
        hunyanMapContainer.style.cursor = 'pointer';
        hunyanMapContainer.addEventListener('click', (e) => {
            e.stopPropagation();
            openAmapApp(hunyanLng, hunyanLat, hunyanName, hunyanAddress);
        });
        
        // 地图点击事件
        hunyanMap.on('click', () => {
            openAmapApp(hunyanLng, hunyanLat, hunyanName, hunyanAddress);
        });
    }
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
    
    // 直接设置背景图片
    introBg.style.backgroundImage = `url('${bgUrl}')`;
}

document.addEventListener('DOMContentLoaded', () => {
    // 设置封面背景图片
    setIntroBackground();
    // 从GitHub仓库加载图片和视频
    loadPhotos();
    loadVideo();
    loadAddress();
    
    // 为"查看地图"链接添加跳转到高德地图app的功能
    const mapLinks = document.querySelectorAll('.map-link');
    mapLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const href = this.getAttribute('href');
            const query = href.split('query=')[1];
            if (query) {
                const address = decodeURIComponent(query);
                // 根据地址判断是哪个地点
                let lng, lat, name;
                if (address.includes('深圳') || address.includes('圣丰城')) {
                    lng = 113.946533;
                    lat = 22.540503;
                    name = '圣丰城酒家（南山科技园店）';
                } else if (address.includes('海口') || address.includes('宝华海景')) {
                    lng = 110.330802;
                    lat = 20.022071;
                    name = '宝华海景大酒店（龙华店）';
                } else {
                    // 如果无法识别，直接打开网页版
                    window.open(href, '_blank');
                    return;
                }
                
                // 检测设备类型
                const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
                const isAndroid = /Android/.test(navigator.userAgent);
                
                let appUrl = '';
                if (isIOS) {
                    appUrl = `iosamap://navi?sourceApplication=wedding&poiname=${encodeURIComponent(name)}&lat=${lat}&lon=${lng}&dev=0`;
                } else if (isAndroid) {
                    appUrl = `androidamap://navi?sourceApplication=wedding&poiname=${encodeURIComponent(name)}&lat=${lat}&lon=${lng}&dev=0`;
                } else {
                    window.open(href, '_blank');
                    return;
                }
                
                // 尝试打开app
                const link = document.createElement('a');
                link.href = appUrl;
                link.target = '_blank';
                link.click();
                
                // 如果app没有安装，3秒后打开网页版
                setTimeout(() => {
                    window.open(href, '_blank');
                }, 3000);
            } else {
                window.open(href, '_blank');
            }
        });
    });
    
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
const rsvpForm = document.getElementById('rsvp-form');
const danmakuContainer = document.getElementById('danmaku-container');

// 初始化RSVP功能
function initRSVP() {
    // 加载已保存的来宾信息
    loadGuestData();
    
    // 检查是否是管理员（有GitHub Token的用户）
    checkAdminStatus();
    
    // 表单提交处理
    if (rsvpForm) {
        rsvpForm.addEventListener('submit', handleRSVPSubmit);
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

// 处理表单提交
function handleRSVPSubmit(e) {
    e.preventDefault();
    
    const formData = new FormData(rsvpForm);
    const guestData = {
        name: formData.get('name'),
        phone: formData.get('phone'),
        count: formData.get('count'),
        location: formData.get('location'),
        blessing: formData.get('blessing') || '',
        timestamp: new Date().toISOString()
    };
    
    // 保存来宾信息（异步，但不阻塞）
    saveGuestData(guestData).catch(err => {
        console.error('保存数据出错:', err);
    });
    
    // 如果有祝福语，显示弹幕
    if (guestData.blessing.trim()) {
        showDanmaku(guestData.blessing, guestData.name);
    }
    
    // 显示成功提示
    showSuccessMessage();
    
    // 重置表单
    rsvpForm.reset();
    
    // 数据已保存，如果设置了GitHub Token会自动同步到GitHub
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
function showSuccessMessage() {
    const message = document.createElement('div');
    message.className = 'success-message';
    message.innerHTML = `
        <div class="success-icon">✅</div>
        <div class="success-text">感谢您的确认！</div>
        <button class="close-btn" onclick="this.parentElement.remove()">确定</button>
    `;
    document.body.appendChild(message);
    
    // 3秒后自动关闭
    setTimeout(() => {
        if (message.parentNode) {
            message.remove();
        }
    }, 3000);
}

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
        await saveToGitHub(guests);
    } else {
        console.warn('⚠️ 未设置GitHub Token，数据只保存到本地。点击"🔑 设置GitHub保存"按钮可启用GitHub同步。');
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
    
    try {
        const repo = 'gioxxx2/wedding_invitation';
        const filePath = 'data/guests.json';
        const content = JSON.stringify(guests, null, 2);
        const encodedContent = btoa(unescape(encodeURIComponent(content)));
        
        console.log('📤 准备保存', guests.length, '条记录到GitHub...');
        
        // 先获取文件SHA（如果存在）
        let sha = null;
        try {
            const getResponse = await fetch(`https://api.github.com/repos/${repo}/contents/${filePath}`, {
                headers: {
                    'Authorization': `Bearer ${githubToken}`,
                    'Accept': 'application/vnd.github.v3+json'
                }
            });
            if (getResponse.ok) {
                const fileData = await getResponse.json();
                sha = fileData.sha;
                console.log('📋 获取到现有文件的SHA:', sha.substring(0, 10) + '...');
            } else if (getResponse.status === 404) {
                // 文件不存在，继续创建新文件
                console.log('📄 文件不存在，将创建新文件');
            } else {
                const errorText = await getResponse.text();
                console.error('❌ 获取文件失败:', getResponse.status, errorText);
                showGitHubSaveError(getResponse.status, `获取文件失败: ${errorText}`);
                return;
            }
        } catch (e) {
            console.error('❌ 获取文件出错:', e);
            showGitHubSaveError('网络错误', `获取文件出错: ${e.message}`);
            return;
        }
        
        // 创建或更新文件
        console.log('💾 正在上传到GitHub...');
        
        // 微信浏览器特殊处理：添加超时和重试机制
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
        
        // 如果是微信浏览器，添加超时控制
        if (isWeChatBrowser()) {
            console.log('📱 检测到微信浏览器，使用特殊处理');
            // 使用Promise.race实现超时
            const timeoutPromise = new Promise((_, reject) => {
                setTimeout(() => reject(new Error('请求超时')), 30000); // 30秒超时
            });
            
            const fetchPromise = fetch(`https://api.github.com/repos/${repo}/contents/${filePath}`, fetchOptions);
            var response = await Promise.race([fetchPromise, timeoutPromise]);
        } else {
            var response = await fetch(`https://api.github.com/repos/${repo}/contents/${filePath}`, fetchOptions);
        }
        
        if (response.ok) {
            const result = await response.json();
            console.log('✅ 数据已保存到GitHub:', result.commit.html_url);
            // 显示成功提示
            showGitHubSaveSuccess();
        } else {
            const errorText = await response.text();
            console.error('❌ 保存到GitHub失败:', response.status, errorText);
            let errorMessage = errorText;
            try {
                const errorJson = JSON.parse(errorText);
                errorMessage = errorJson.message || errorText;
            } catch (e) {
                // 如果不是JSON，直接使用原文本
            }
            // 显示错误提示
            showGitHubSaveError(response.status, errorMessage);
        }
    } catch (error) {
        console.error('❌ 保存到GitHub出错:', error);
        showGitHubSaveError('网络错误', error.message);
    }
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

