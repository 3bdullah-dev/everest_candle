 // تشغيل مكتبة الانيميشن AOS
 AOS.init({
    duration: 1000,
    once: true,      
    mirror: false,   
    anchorPlacement: 'top-bottom',
});

// البرمجة الخاصة بالقائمة الجانبية للموبايل (Hamburger Menu)
const menuIcon = document.getElementById('menu-icon');
const navBar = document.getElementById('nav-bar');

menuIcon.addEventListener('click', (e) => {
    e.stopPropagation();
    navBar.classList.toggle('mobile-open');
    menuIcon.classList.toggle('fa-bars');
    menuIcon.classList.toggle('fa-times'); 
});

document.querySelectorAll('nav ul li a').forEach(link => {
    link.addEventListener('click', () => {
        navBar.classList.remove('mobile-open');
        menuIcon.classList.add('fa-bars');
        menuIcon.classList.remove('fa-times');
    });
});

document.addEventListener('click', (e) => {
    if (!navBar.contains(e.target) && !menuIcon.contains(e.target)) {
        navBar.classList.remove('mobile-open');
        menuIcon.classList.add('fa-bars');
        menuIcon.classList.remove('fa-times');
    }
});

// تغيير خلفية الـ Navbar عند عمل سكرول
window.addEventListener('scroll', () => {
    const header = document.querySelector('header');
    if (window.scrollY > 50) {
        header.style.boxShadow = '0 10px 30px rgba(0,0,0,0.05)';
        header.style.background = 'rgba(252, 251, 250, 0.95)';
    } else {
        header.style.boxShadow = 'none';
        header.style.background = 'rgba(252, 251, 250, 0.85)';
    }
});

// تفعيل التنقل النشط (Active Link)
const sections = document.querySelectorAll('section');
const navLinks = document.querySelectorAll('nav ul li a');

window.addEventListener('scroll', () => {
    let current = '';
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        if (pageYOffset >= (sectionTop - 200)) {
            current = section.getAttribute('id');
        }
    });

    navLinks.forEach(a => {
        a.classList.remove('active');
        if (a.getAttribute('href').includes(current)) {
            a.classList.add('active');
        }
    });
});

// =========================================================
// [تم الإصلاح بنجاح] كود تشغيل الحركة الذكي وانتقال الصور تلقائياً
// =========================================================
const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;

document.querySelectorAll('.product-card').forEach(card => {
    const images = card.querySelectorAll('.product-img img');
    if (images.length <= 1) return;

    let intervalId = null;
    let currentIndex = 0;

    const startSlider = () => {
        if (intervalId) return;
        intervalId = setInterval(() => {
            images[currentIndex].classList.remove('active-slide');
            currentIndex = (currentIndex + 1) % images.length;
            images[currentIndex].classList.add('active-slide');
        }, 2800);
    };

    const stopSlider = () => {
        clearInterval(intervalId);
        intervalId = null;
        images.forEach(img => img.classList.remove('active-slide'));
        currentIndex = 0;
        images[0].classList.add('active-slide'); // تم إصلاح السينتكس هنا ليعمل بنجاح
    };

    if (!isTouchDevice) {
        card.addEventListener('mouseenter', startSlider);
        card.addEventListener('mouseleave', stopSlider);
    } else {
        const observerOptions = {
            root: null,
            threshold: 0.6
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    startSlider();
                } else {
                    stopSlider();
                }
            });
        }, observerOptions);

        observer.observe(card);
    }
});