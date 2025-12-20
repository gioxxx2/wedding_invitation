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

// 照片上传功能
const photoUpload = document.getElementById('photo-upload');
const photoGallery = document.getElementById('photo-gallery');

// 从本地存储加载照片
function loadPhotos() {
    const savedPhotos = localStorage.getItem('weddingPhotos');
    if (savedPhotos) {
        const photos = JSON.parse(savedPhotos);
        photos.forEach(photoData => {
            addPhotoToGallery(photoData);
        });
    }
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
    // 移除占位符
    const placeholder = photoGallery.querySelector('.photo-placeholder');
    if (placeholder) {
        placeholder.remove();
    }
    
    const photoItem = document.createElement('div');
    photoItem.className = 'photo-item';
    
    const img = document.createElement('img');
    img.src = photoSrc;
    img.alt = '婚礼照片';
    
    const deleteBtn = document.createElement('button');
    deleteBtn.className = 'delete-btn';
    deleteBtn.innerHTML = '×';
    deleteBtn.onclick = () => {
        photoItem.remove();
        savePhotos();
        // 如果没有照片了，显示占位符
        if (photoGallery.querySelectorAll('.photo-item').length === 0) {
            showPhotoPlaceholder();
        }
    };
    
    photoItem.appendChild(img);
    photoItem.appendChild(deleteBtn);
    
    // 点击照片查看大图
    photoItem.addEventListener('click', (e) => {
        if (e.target !== deleteBtn && e.target !== deleteBtn.firstChild) {
            showPhotoModal(photoSrc);
        }
    });
    
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

// 处理照片上传
photoUpload.addEventListener('change', (e) => {
    const files = e.target.files;
    
    Array.from(files).forEach(file => {
        if (file.type.startsWith('image/')) {
            const reader = new FileReader();
            reader.onload = (e) => {
                addPhotoToGallery(e.target.result);
                savePhotos();
            };
            reader.readAsDataURL(file);
        }
    });
    
    // 清空input，允许重复上传同一文件
    e.target.value = '';
});

// 视频上传功能
const videoUpload = document.getElementById('video-upload');
const videoContainer = document.getElementById('video-container');

// 从本地存储加载视频
function loadVideo() {
    const savedVideo = localStorage.getItem('weddingVideo');
    if (savedVideo) {
        addVideoToContainer(savedVideo);
    } else {
        showVideoPlaceholder();
    }
}

// 保存视频到本地存储
function saveVideo(videoSrc) {
    localStorage.setItem('weddingVideo', videoSrc);
}

// 添加视频到容器
function addVideoToContainer(videoSrc) {
    // 清除现有视频和占位符
    videoContainer.innerHTML = '';
    
    const videoItem = document.createElement('div');
    videoItem.className = 'video-item';
    
    const video = document.createElement('video');
    video.src = videoSrc;
    video.controls = true;
    video.style.cssText = 'width: 100%; height: 100%;';
    
    const deleteBtn = document.createElement('button');
    deleteBtn.className = 'delete-btn';
    deleteBtn.innerHTML = '×';
    deleteBtn.onclick = () => {
        videoContainer.innerHTML = '';
        localStorage.removeItem('weddingVideo');
        showVideoPlaceholder();
    };
    
    videoItem.appendChild(video);
    videoItem.appendChild(deleteBtn);
    videoContainer.appendChild(videoItem);
}

// 显示视频占位符
function showVideoPlaceholder() {
    if (!videoContainer.querySelector('.video-placeholder')) {
        const placeholder = document.createElement('div');
        placeholder.className = 'video-placeholder';
        placeholder.innerHTML = `
            <div class="placeholder-icon">🎥</div>
            <p class="placeholder-text">点击上方按钮上传视频</p>
            <p class="placeholder-hint">支持 MP4、MOV 等常见视频格式</p>
        `;
        videoContainer.appendChild(placeholder);
    }
}

// 处理视频上传
videoUpload.addEventListener('change', (e) => {
    const file = e.target.files[0];
    
    if (file && file.type.startsWith('video/')) {
        const reader = new FileReader();
        reader.onload = (e) => {
            addVideoToContainer(e.target.result);
            saveVideo(e.target.result);
        };
        reader.readAsDataURL(file);
    }
    
    // 清空input
    e.target.value = '';
});

// 地图功能
const mapLink = document.getElementById('map-link');
const mapIframe = document.getElementById('map-iframe');

// 默认地址（可以修改）
const defaultAddress = {
    name: '婚礼酒店名称',
    address: 'XX省XX市XX区XX路XX号',
    time: '2024年XX月XX日 XX:XX',
    // 使用百度地图或高德地图的嵌入URL
    // 这里使用百度地图作为示例，您需要替换为实际地址的坐标
    mapUrl: 'https://map.baidu.com/?newmap=1&ie=utf-8&s=s%26wd%3D%E5%8C%97%E4%BA%AC%E5%B8%82'
};

// 更新地址信息
function updateAddressInfo(address) {
    const venueName = document.querySelector('.venue-name');
    const addressText = document.querySelector('.address');
    const timeText = document.querySelector('.time');
    
    if (venueName) venueName.textContent = address.name;
    if (addressText) addressText.textContent = `详细地址：${address.address}`;
    if (timeText) timeText.textContent = `时间：${address.time}`;
    
    // 更新地图链接（使用百度地图搜索）
    if (mapLink) {
        mapLink.href = `https://map.baidu.com/search/${encodeURIComponent(address.address)}`;
    }
    
    // 更新地图iframe（使用百度地图嵌入）
    if (mapIframe) {
        // 注意：实际使用时需要获取准确的经纬度坐标
        // 这里使用百度地图的搜索URL作为示例
        mapIframe.src = `https://map.baidu.com/?newmap=1&ie=utf-8&s=s%26wd%3D${encodeURIComponent(address.address)}`;
    }
}

// 从本地存储加载地址信息
function loadAddress() {
    const savedAddress = localStorage.getItem('weddingAddress');
    if (savedAddress) {
        const address = JSON.parse(savedAddress);
        updateAddressInfo(address);
    } else {
        updateAddressInfo(defaultAddress);
    }
}

// 保存地址信息
function saveAddress(address) {
    localStorage.setItem('weddingAddress', JSON.stringify(address));
}

// 允许用户编辑地址信息（双击编辑）
document.querySelectorAll('.address-card p').forEach(p => {
    if (p.classList.contains('venue-name') || p.classList.contains('address') || p.classList.contains('time')) {
        p.addEventListener('dblclick', () => {
            const currentText = p.textContent;
            const newText = prompt('请输入新内容：', currentText);
            if (newText && newText.trim()) {
                p.textContent = newText;
                // 保存更新后的地址信息
                const address = {
                    name: document.querySelector('.venue-name').textContent,
                    address: document.querySelector('.address').textContent.replace('详细地址：', ''),
                    time: document.querySelector('.time').textContent.replace('时间：', '')
                };
                saveAddress(address);
                updateAddressInfo(address);
            }
        });
    }
});

// 页面加载时初始化
document.addEventListener('DOMContentLoaded', () => {
    const savedPhotos = localStorage.getItem('weddingPhotos');
    if (savedPhotos) {
        const photos = JSON.parse(savedPhotos);
        if (photos.length > 0) {
            loadPhotos();
        } else {
            showPhotoPlaceholder();
        }
    } else {
        showPhotoPlaceholder();
    }
    
    loadVideo();
    loadAddress();
    
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
    
    // 尝试保存到GitHub（如果配置了token）
    await saveToGitHub(guests);
}

// 保存数据到GitHub
async function saveToGitHub(guests) {
    const githubToken = localStorage.getItem('githubToken');
    if (!githubToken) {
        // 如果没有配置token，只保存到本地
        return;
    }
    
    try {
        const repo = 'gioxxx2/wedding';
        const filePath = 'data/guests.json';
        const content = JSON.stringify(guests, null, 2);
        const encodedContent = btoa(unescape(encodeURIComponent(content)));
        
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
            } else if (getResponse.status === 404) {
                // 文件不存在，继续创建新文件
                console.log('文件不存在，将创建新文件');
            } else {
                const errorText = await getResponse.text();
                console.error('获取文件失败:', getResponse.status, errorText);
            }
        } catch (e) {
            console.error('获取文件出错:', e);
        }
        
        // 创建或更新文件
        const response = await fetch(`https://api.github.com/repos/${repo}/contents/${filePath}`, {
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
        });
        
        if (response.ok) {
            const result = await response.json();
            console.log('✅ 数据已保存到GitHub:', result.commit.html_url);
            // 显示成功提示
            showGitHubSaveSuccess();
        } else {
            const errorText = await response.text();
            console.error('❌ 保存到GitHub失败:', response.status, errorText);
            // 显示错误提示
            showGitHubSaveError(response.status, errorText);
        }
    } catch (error) {
        console.error('保存到GitHub出错:', error);
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
    
    const headers = ['姓名', '电话', '参加人数', '祝福语', '提交时间'];
    const rows = guests.map(guest => [
        guest.name,
        guest.phone,
        guest.count,
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

