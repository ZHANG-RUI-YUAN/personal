// 所有图片路径数组（按时间顺序）
const allImages = [
    // 少年时期 - 舞蹈
    'images/少年舞蹈写真.jpg',
    'images/少年舞蹈写真1.jpg',
    'images/少年舞蹈写真2.jpg',
    'images/少年舞蹈写真3.jpg',
    // 少年时期 - 音乐
    'images/少年音乐写真.jpg',
    'images/少年音乐写真1.jpg',
    'images/少年音乐写真2.jpg',
    // 钢琴学习
    'images/钢琴演奏1.jpg',
    // 大学时期
    // 'images/高考专业成绩.png',
    'images/中国传媒大学开幕式.jpg',
    'images/中国传媒大学开幕式1.jpg',
    'images/中国传媒大学开幕式2.jpg',
    'images/大学舞蹈活动.jpg',
    // 专业发展
    'images/商演现场.jpg',
    'images/商演现场1.jpg'
    // 'images/在香港.jpg'
];

let currentImageIndex = 0;

// ==================== Canvas 音频波形动画 ====================
class WaveAnimation {
    constructor(canvas) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.waves = [];
        this.animationId = null;
        this.resize();
        this.initWaves();
        window.addEventListener('resize', () => this.resize());
    }

    resize() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
    }

    initWaves() {
        const colors = [
            { r: 168, g: 85, b: 247 },   // 紫色
            { r: 236, g: 72, b: 153 },   // 粉色
            { r: 59, g: 130, b: 246 }    // 蓝色
        ];

        for (let i = 0; i < 3; i++) {
            this.waves.push({
                y: this.canvas.height * (0.6 + i * 0.1),
                amplitude: 50 + i * 20,
                frequency: 0.005 + i * 0.002,
                speed: 0.02 + i * 0.01,
                phase: i * Math.PI / 3,
                color: colors[i],
                opacity: 0.3 - i * 0.08
            });
        }
    }

    drawWave(wave, time) {
        const { ctx, canvas } = this;
        ctx.beginPath();
        ctx.moveTo(0, canvas.height);

        for (let x = 0; x <= canvas.width; x += 2) {
            const y = wave.y + 
                Math.sin(x * wave.frequency + time * wave.speed + wave.phase) * wave.amplitude +
                Math.sin(x * wave.frequency * 2 + time * wave.speed * 1.5) * (wave.amplitude * 0.3);
            ctx.lineTo(x, y);
        }

        ctx.lineTo(canvas.width, canvas.height);
        ctx.closePath();

        const gradient = ctx.createLinearGradient(0, wave.y - wave.amplitude, 0, canvas.height);
        gradient.addColorStop(0, `rgba(${wave.color.r}, ${wave.color.g}, ${wave.color.b}, ${wave.opacity})`);
        gradient.addColorStop(1, `rgba(${wave.color.r}, ${wave.color.g}, ${wave.color.b}, 0)`);
        
        ctx.fillStyle = gradient;
        ctx.fill();
    }

    animate(time = 0) {
        const { ctx, canvas } = this;
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // 绘制波形
        this.waves.forEach(wave => this.drawWave(wave, time));

        // 绘制粒子效果
        this.drawParticles(time);

        this.animationId = requestAnimationFrame((t) => this.animate(t * 0.001));
    }

    drawParticles(time) {
        const { ctx, canvas } = this;
        const particleCount = 30;

        for (let i = 0; i < particleCount; i++) {
            const x = (Math.sin(time * 0.5 + i * 0.5) * 0.5 + 0.5) * canvas.width;
            const y = (Math.cos(time * 0.3 + i * 0.7) * 0.5 + 0.5) * canvas.height;
            const size = Math.sin(time + i) * 2 + 3;
            const opacity = Math.sin(time * 0.5 + i) * 0.3 + 0.2;

            ctx.beginPath();
            ctx.arc(x, y, size, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(168, 85, 247, ${opacity})`;
            ctx.fill();
        }
    }

    start() {
        this.animate();
    }

    stop() {
        if (this.animationId) {
            cancelAnimationFrame(this.animationId);
        }
    }
}

// 初始化波形动画
let waveAnimation = null;
document.addEventListener('DOMContentLoaded', () => {
    const canvas = document.getElementById('waveCanvas');
    if (canvas) {
        waveAnimation = new WaveAnimation(canvas);
        waveAnimation.start();
    }
});

// 导航栏滚动效果
window.addEventListener('scroll', () => {
    const navbar = document.querySelector('.navbar');
    if (window.scrollY > 50) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
    
    // 更新导航链接高亮
    updateActiveNavLink();
});

// 更新导航链接高亮状态
function updateActiveNavLink() {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-link');
    
    let currentSection = '';
    sections.forEach(section => {
        const sectionTop = section.offsetTop - 100;
        if (window.scrollY >= sectionTop) {
            currentSection = section.getAttribute('id');
        }
    });
    
    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${currentSection}`) {
            link.classList.add('active');
        }
    });
}

// 平滑滚动到锚点
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            const offsetTop = target.offsetTop - 80;
            window.scrollTo({
                top: offsetTop,
                behavior: 'smooth'
            });
        }
    });
});

// 灯箱功能
function openLightbox(imageSrc) {
    const lightbox = document.getElementById('lightbox');
    const lightboxImg = document.getElementById('lightbox-img');
    
    currentImageIndex = allImages.indexOf(imageSrc);
    
    lightboxImg.src = imageSrc;
    lightbox.classList.add('active');
    document.body.style.overflow = 'hidden';
}

function closeLightbox() {
    const lightbox = document.getElementById('lightbox');
    lightbox.classList.remove('active');
    document.body.style.overflow = 'auto';
}

function changeImage(direction) {
    currentImageIndex += direction;
    
    if (currentImageIndex < 0) {
        currentImageIndex = allImages.length - 1;
    } else if (currentImageIndex >= allImages.length) {
        currentImageIndex = 0;
    }
    
    const lightboxImg = document.getElementById('lightbox-img');
    lightboxImg.style.opacity = '0';
    
    setTimeout(() => {
        lightboxImg.src = allImages[currentImageIndex];
        lightboxImg.style.opacity = '1';
    }, 200);
}

// 键盘导航
document.addEventListener('keydown', (e) => {
    const lightbox = document.getElementById('lightbox');
    if (lightbox.classList.contains('active')) {
        if (e.key === 'Escape') {
            closeLightbox();
        } else if (e.key === 'ArrowLeft') {
            changeImage(-1);
        } else if (e.key === 'ArrowRight') {
            changeImage(1);
        }
    }
});

// 图片懒加载效果
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px 50px 0px'
};

const imageObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '0';
            entry.target.style.transform = 'translateY(20px)';
            
            setTimeout(() => {
                entry.target.style.transition = 'all 0.6s ease';
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }, 100);
            
            imageObserver.unobserve(entry.target);
        }
    });
}, observerOptions);

// 观察所有照片项
document.addEventListener('DOMContentLoaded', () => {
    const photoItems = document.querySelectorAll('.photo-item');
    photoItems.forEach(item => imageObserver.observe(item));
    
    const videoItems = document.querySelectorAll('.video-item');
    videoItems.forEach(item => imageObserver.observe(item));
    
    // 时间线项动画
    const timelineItems = document.querySelectorAll('.timeline-item');
    const timelineObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '0';
                entry.target.style.transform = 'translateX(-30px)';
                
                setTimeout(() => {
                    entry.target.style.transition = 'all 0.6s ease';
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateX(0)';
                }, 100);
                
                timelineObserver.unobserve(entry.target);
            }
        });
    }, observerOptions);
    
    timelineItems.forEach(item => timelineObserver.observe(item));
});

// 视频播放控制
document.addEventListener('DOMContentLoaded', () => {
    const videos = document.querySelectorAll('video');
    
    videos.forEach(video => {
        // 当一个视频开始播放时，暂停其他所有视频
        video.addEventListener('play', () => {
            videos.forEach(otherVideo => {
                if (otherVideo !== video) {
                    otherVideo.pause();
                }
            });
        });
        
        // 视频进入视口时添加特效
        const videoObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (!entry.isIntersecting) {
                    entry.target.pause();
                }
            });
        }, { threshold: 0.5 });
        
        videoObserver.observe(video);
    });
});

// 添加页面加载动画
window.addEventListener('load', () => {
    document.body.style.opacity = '0';
    setTimeout(() => {
        document.body.style.transition = 'opacity 0.5s ease';
        document.body.style.opacity = '1';
    }, 100);
});

// 汉堡菜单功能
document.addEventListener('DOMContentLoaded', () => {
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');
    
    if (hamburger && navMenu) {
        hamburger.addEventListener('click', () => {
            hamburger.classList.toggle('active');
            navMenu.classList.toggle('active');
        });
        
        // 点击导航链接后关闭菜单
        document.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', () => {
                hamburger.classList.remove('active');
                navMenu.classList.remove('active');
            });
        });
    }
});

// 滚动入场动画
const scrollAnimationObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('animate-in');
            scrollAnimationObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

document.addEventListener('DOMContentLoaded', () => {
    // 为需要动画的元素添加观察
    const animateElements = document.querySelectorAll('.service-card, .timeline-block, .photo-item, .video-item, .contact-card, .intro-section');
    animateElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        scrollAnimationObserver.observe(el);
    });
});

// 添加动画类的CSS效果
const style = document.createElement('style');
style.textContent = `
    .animate-in {
        animation: slideInUp 0.6s ease forwards;
    }
    
    @keyframes slideInUp {
        from {
            opacity: 0;
            transform: translateY(30px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }
`;
document.head.appendChild(style);