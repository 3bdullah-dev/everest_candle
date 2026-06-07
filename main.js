// تشغيل مكتبة الانيميشن AOS وإصلاح مشاكل التمرير الجانبي
AOS.init({
  duration: 1000,
  once: true,
  mirror: false,
  anchorPlacement: "top-bottom",
  // هذا السطر يمنع حركات اليمين واليسار المسببة للمشاكل على الموبايل إذا لزم الأمر
  disable: window.innerWidth < 768,
});

// البرمجة الخاصة بالقائمة الجانبية للموبايل (Hamburger Menu)
const menuIcon = document.getElementById("menu-icon");
const navBar = document.getElementById("nav-bar");

menuIcon.addEventListener("click", (e) => {
  e.stopPropagation();
  navBar.classList.toggle("mobile-open");
  menuIcon.classList.toggle("fa-bars");
  menuIcon.classList.toggle("fa-times");
});

document.querySelectorAll("nav ul li a").forEach((link) => {
  link.addEventListener("click", () => {
    navBar.classList.remove("mobile-open");
    menuIcon.classList.add("fa-bars");
    menuIcon.classList.remove("fa-times");
  });
});

document.addEventListener("click", (e) => {
  if (!navBar.contains(e.target) && !menuIcon.contains(e.target)) {
    navBar.classList.remove("mobile-open");
    menuIcon.classList.add("fa-bars");
    menuIcon.classList.remove("fa-times");
  }
});

// تغيير خلفية الـ Navbar عند عمل سكرول
window.addEventListener("scroll", () => {
  const header = document.querySelector("header");
  if (window.scrollY > 50) {
    header.style.boxShadow = "0 10px 30px rgba(0,0,0,0.05)";
    header.style.background = "rgba(252, 251, 250, 0.95)";
  } else {
    header.style.boxShadow = "none";
    header.style.background = "rgba(252, 251, 250, 0.85)";
  }
});

// تفعيل التنقل النشط (Active Link) - تم تعديل pageYOffset بـ window.scrollY لدعم الموبايل
const sections = document.querySelectorAll("section");
const navLinks = document.querySelectorAll("nav ul li a");

window.addEventListener("scroll", () => {
  let current = "";
  const scrollY = window.scrollY;

  sections.forEach((section) => {
    const sectionTop = section.offsetTop;
    if (scrollY >= sectionTop - 220) {
      current = section.getAttribute("id");
    }
  });

  navLinks.forEach((a) => {
    a.classList.remove("active");
    if (a.getAttribute("href").includes(current)) {
      a.classList.add("active");
    }
  });
});

// كود تشغيل الحركة الذكي وانتقال الصور تلقائياً
const isTouchDevice = "ontouchstart" in window || navigator.maxTouchPoints > 0;

document.querySelectorAll(".product-card").forEach((card) => {
  const images = card.querySelectorAll(".product-img img");
  if (images.length <= 1) return;

  let intervalId = null;
  let currentIndex = 0;

  const startSlider = () => {
    if (intervalId) return;
    intervalId = setInterval(() => {
      images[currentIndex].classList.remove("active-slide");
      currentIndex = (currentIndex + 1) % images.length;
      images[currentIndex].classList.add("active-slide");
    }, 2800);
  };

  const stopSlider = () => {
    clearInterval(intervalId);
    intervalId = null;
    images.forEach((img) => img.classList.remove("active-slide"));
    currentIndex = 0;
    images[0].classList.add("active-slide");
  };

  if (!isTouchDevice) {
    card.addEventListener("mouseenter", startSlider);
    card.addEventListener("mouseleave", stopSlider);
  } else {
    const observerOptions = {
      root: null,
      threshold: 0.6,
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
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

let totalSeconds = 0;
let isTabActive = true;
let ipDataCached = null;
// ⚠️ ضع هنا رابط الـ Web App الخاص بك والناتج عن سكريبت شيت المحدث (6 أعمدة)
const GOOGLE_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbxRMT_T0ck--12waetnAT0s-hhTtFjfc6txswP4REa9_r5QJkvE6gJ7xHCOsfx8_idX/exec";

// 1. لقط بيانات الـ IP والموقع فور الدخول وتخزينها في الذاكرة
fetch('https://ipapi.co/json/')
    .then(res => res.json())
    .then(data => { ipDataCached = data; })
    .catch(err => console.log("خطأ الـ IP:", err));

document.addEventListener('visibilitychange', function() {
    isTabActive = !document.hidden;
});

setInterval(() => { if (isTabActive) totalSeconds++; }, 1000);

function formatTime(seconds) {
    if (seconds < 60) return seconds + " ثانية";
    let mins = Math.floor(seconds / 60);
    let secs = seconds % 60;
    return mins + " دقيقة و " + secs + " ثانية";
}

// 2. الطرد النهائي المضمون عند قفل الصفحة أو مغادرتها
window.addEventListener('pagehide', function () {
    if (!ipDataCached || totalSeconds < 2) return;

    // تمييز جهاز الكمبيوتر الخاص بك
    let deviceName = window.innerWidth > 1024 ? "Desktop (كمبيوتر)" : "Mobile (موبايل)";
    if (localStorage.getItem('is_owner') === 'true' && window.innerWidth > 1024) {
        deviceName = "👑 المطور عبد الله (PC)";
    }

    const payload = {
        timestamp: new Date().toLocaleString('ar-EG'),
        country: ipDataCached.country_name || "Unknown",
        city: ipDataCached.city || "Unknown",
        ip: ipDataCached.ip || "Unknown", // شحن الـ IP صراحة إلى السيرفر
        timeSpent: formatTime(totalSeconds),
        device: deviceName
    };

    fetch(GOOGLE_SCRIPT_URL, {
        method: 'POST',
        mode: 'no-cors',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
        keepalive: true
    });
});
