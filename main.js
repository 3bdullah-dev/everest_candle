// تشغيل مكتبة الانيميشن AOS وإصلاح مشاكل التمرير الجانبي
AOS.init({
  duration: 1000,
  once: true,
  mirror: false,
  anchorPlacement: "top-bottom",
  disable: window.innerWidth < 768,
});

// البرمجة الخاصة بالقائمة الجانبية للموبايل (Hamburger Menu)
const menuIcon = document.getElementById("menu-icon");
const navBar = document.getElementById("nav-bar");

if (menuIcon && navBar) {
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
}

// تغيير خلفية الـ Navbar عند عمل سكرول
window.addEventListener("scroll", () => {
  const header = document.querySelector("header");
  if (header) {
    if (window.scrollY > 50) {
      header.style.boxShadow = "0 10px 30px rgba(0,0,0,0.05)";
      header.style.background = "rgba(252, 251, 250, 0.95)";
    } else {
      header.style.boxShadow = "none";
      header.style.background = "rgba(252, 251, 250, 0.85)";
    }
  }
});

// تفعيل التنقل النشط (Active Link)
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

// ========================================================
// 🛑 نظام التتبع الذكي الآمن والأخير (جلسات + حماية اللوكال وجيت هاب)
// ========================================================

const GOOGLE_SCRIPT_URL =
  "https://script.google.com/macros/s/AKfycbyHR6IS8vTpQj-i-mobdvTvnZfatsqCxptD-GYh5plmR_8KKtJAfvAtYIgxpMyDnSGH/exec";

function getDeviceName() {
  let deviceName =
    window.innerWidth > 1024 ? "Desktop (كمبيوتر)" : "Mobile (موبايل)";
  if (localStorage.getItem("is_owner") === "true" && window.innerWidth > 1024) {
    deviceName = "👑 المطور عبد الله (PC)";
  }
  return deviceName;
}

// فحص الجلسة الحالية
if (!sessionStorage.getItem("visit_sent")) {
  fetch("https://ip-api.com/json/?lang=ar")
    .then((res) => {
      if (!res.ok) throw new Error("Network response was not ok");
      return res.json();
    })
    .then((data) => {
      const payload = {
        timestamp: new Date().toLocaleString("ar-EG"),
        country: data.country || "Unknown",
        city: data.regionName || "Unknown",
        ip: data.query || "Unknown",
        device: getDeviceName(),
      };

      // إرسال البيانات بشكل آمن ومضمون
      fetch(GOOGLE_SCRIPT_URL, {
        method: "POST",
        mode: "no-cors",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
        keepalive: true,
      })
        .then(() => {
          // حجز علامة الجلسة فقط عند نجاح إرسال الطلب لمنع تكراره
          sessionStorage.setItem("visit_sent", "true");
          console.log("تم رصد الزيارة بنجاح وإرسالها إلى الرادار.");
        })
        .catch((e) => console.log("فشل طرد البيانات للسيرفر:", e));
    })
    .catch((err) => console.log("خطأ جلب بيانات الـ IP للزائر:", err));
} else {
  console.log("الزيارة مسجلة مسبقاً في هذه الجلسة، تم منع التكرار الفوري.");
}
