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
});

