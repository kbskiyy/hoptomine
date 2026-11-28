const body = document.body;

const cookieNotice = document.getElementById('cookieNotice');
const cookieAcceptBtn = document.getElementById('cookieAcceptBtn');

function setCookie(name, value, days) {
  const d = new Date();
  d.setTime(d.getTime() + (days * 24 * 60 * 60 * 1000));
  const expires = "expires=" + d.toUTCString();
  document.cookie = name + "=" + value + ";" + expires + ";path=/;SameSite=Lax";
}

function getCookie(name) {
  const nameEQ = name + "=";
  const ca = document.cookie.split(';');
  for (let i = 0; i < ca.length; i++) {
    let c = ca[i];
    while (c.charAt(0) === ' ') c = c.substring(1, c.length);
    if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length, c.length);
  }
  return null;
}

function setLocalStorageWithExpiry(key, value, days) {
  try {
    const now = new Date();
    const item = {
      value: value,
      expiry: now.getTime() + (days * 24 * 60 * 60 * 1000)
    };
    localStorage.setItem(key, JSON.stringify(item));
  } catch (e) {}
}

function getLocalStorageWithExpiry(key) {
  try {
    const itemStr = localStorage.getItem(key);
    if (!itemStr) return null;

    const item = JSON.parse(itemStr);
    const now = new Date();

    if (now.getTime() > item.expiry) {
      localStorage.removeItem(key);
      return null;
    }
    return item.value;
  } catch (e) {
    return null;
  }
}

function checkCookieConsent() {
  if (getCookie('cookieAccepted') === 'true') {
    return true;
  }

  return false;
}

function initCookieNotice() {
  if (!cookieNotice) return;
  if (!checkCookieConsent()) {
    cookieNotice.classList.add('show');
  } else {
    cookieNotice.classList.remove('show');
  }
}

window.addEventListener('pageshow', () => {
  initCookieNotice();
});

if (cookieAcceptBtn) {
  cookieAcceptBtn.addEventListener('click', () => {
    setCookie('cookieAccepted', 'true', 182);
    if (cookieNotice) {
      cookieNotice.classList.remove('show');
    }
  });
}

const menuBtn = document.getElementById('menuBtn');
const sideMenu = document.getElementById('sideMenu');

if (menuBtn && sideMenu) {
  menuBtn.addEventListener('click', () => {
    const isOpen = menuBtn.classList.toggle('toggle');

    sideMenu.classList.toggle('open', isOpen);
  });

  document.addEventListener('click', (e) => {
    if (
      !sideMenu.contains(e.target) &&
      !menuBtn.contains(e.target)
    ) {
      sideMenu.classList.remove('open');
      menuBtn.classList.remove('toggle');
    }
  });
}

const banner = document.querySelector('.top-banner img');
if (banner) {
  banner.addEventListener('contextmenu', e => e.preventDefault());
  banner.addEventListener('dragstart', e => e.preventDefault());
}

const aulogo = document.querySelector(".aulogo");
if (aulogo) {
  aulogo.addEventListener('contextmenu', e => e.preventDefault());
  aulogo.addEventListener('dragstart', e => e.preventDefault());
}

const hmstamp = document.querySelector(".hmstamp");
if (hmstamp) {
  hmstamp.addEventListener('contextmenu', e => e.preventDefault());
  hmstamp.addEventListener('dragstart', e => e.preventDefault());
}

const dots = document.getElementById('dots');
const loader = document.getElementById('page-loader');

if (dots && loader) {
  let dotsCount = 0;

  const dotsAnimation = setInterval(() => {
    dotsCount++;

    dots.textContent = '.'.repeat(dotsCount);

    if (dotsCount >= 3) {
      clearInterval(dotsAnimation);

      loader.classList.add('hide');

      setTimeout(() => {
        loader.remove();
      }, 800);
    }
  }, 600);
}

const aboutus = document.querySelector(".aboutus");
let aboutUsOffsetY = 0;

function updateAboutUsPosition() {
  const notifyContainer = document.getElementById('notify-container');
  if (!notifyContainer || !aboutus) return;
  if (notifyContainer.children.length > 0) {
    let totalHeight = 0;
    Array.from(notifyContainer.children).forEach(child => {
      totalHeight += child.offsetHeight + 10;
    });
    aboutUsOffsetY = totalHeight;
    aboutus.style.transform = `translateY(${aboutUsOffsetY}px)`;
  } else {
    aboutUsOffsetY = 0;
    aboutus.style.transform = "translateY(0px)";
  }
}

const asdiv = document.querySelector(".antispamdiv");
const pr = document.querySelector(".pr");
let timeras;
let prpr = 0;
let intv;

let antispam = 0;

function showNotify() {
  if (asdiv.style.display !== "flex") {
    clearTimeout(timeras);
    timeras = setTimeout(() => {
      antispam = 0;
    }, 4000);

    antispam += 1;

    if (antispam >= 3) {
      asdiv.style.display = "flex";
      prpr = 0;
      pr.style.width = "0%";
      clearInterval(intv);
      setTimeout(() => {
        asdiv.style.opacity = "1";
        asdiv.style.transform = " translateX(-50%) translateY(0)";

        intv = setInterval(() => {
          if (prpr < 100) {
            prpr += 1;
            if (prpr > 100) prpr = 100;
            pr.style.width = `${prpr}%`;
          }
          if (prpr >= 100) {
            clearInterval(intv);
            asdiv.style.transform = " translateX(-50%) translateY(-200px)";
            asdiv.style.opacity = "0";
            setTimeout(() => {
              asdiv.style.display = "none";
              antispam = 0;
            }, 200);
          }
        }, 100);
      }, 200);
      return;
    }
  }

  if (asdiv.style.display === "flex") {
    return;
  }

  const notifyContainer = document.getElementById('notify-container');
  if (!notifyContainer) return;
  const isRootOr404 = window.location.pathname === '/' || window.location.pathname === '' || window.location.pathname.includes('404');
  const imgSrc = isRootOr404 ? 'img/error.png' : '../img/error.png';
  const notify = document.createElement('div');
  notify.className = 'notify';
  notify.innerHTML = `
    <div class="notify-content">
      <img src="${imgSrc}" alt="Ошибка">
      <div>
        <h3>Ошибка...</h3>
        <p>Проект остановлен...</p>
      </div>
    </div>
  `;
  notifyContainer.appendChild(notify);

  setTimeout(() => {
    setTimeout(() => {
      notify.classList.add('show');
    }, 200);
    updateAboutUsPosition();
  }, 50);

  setTimeout(() => {
    notify.classList.remove('show');
    setTimeout(() => {
      notify.remove();
      updateAboutUsPosition();
    }, 350);
  }, 3000);
}

const ultradramSlider = document.getElementById('ultradramSlider');
const ultradramAmount = document.getElementById('ultradramAmount');

if (ultradramSlider && ultradramAmount) {
  ultradramSlider.addEventListener('input', () => {
    ultradramAmount.textContent = ultradramSlider.value;
  });
}

const pni = document.querySelector(".permanent-notice-icon");
const pn = document.querySelector(".permanent-notice");

if (pni && pn) {
  if (getLocalStorageWithExpiry("permanentNoticeDismissed") !== "true") {
    pn.classList.add("show");
  }

  pni.addEventListener("click", () => {
    setLocalStorageWithExpiry("permanentNoticeDismissed", "true", 365);
    pn.classList.remove("show");
  });
}

const aubtn = document.querySelector(".aubtn");

if (aboutus) {
  setTimeout(() => {
    aboutus.style.display = "flex";
    setTimeout(() => {
      aboutus.style.opacity = "1";
      updateAboutUsPosition();
    }, 200);
  }, 1000);
}

if (aubtn && aboutus) {
  aubtn.addEventListener("click", () => {
    if (aulogo) aulogo.style.opacity = "0";
    setTimeout(() => {
      aubtn.style.width = "50%";
      aubtn.style.right = "50%";
      aubtn.style.transform = "translateX(50%)";
      setTimeout(() => {
        aubtn.style.width = "90%";
      }, 200);
    }, 200);

    setTimeout(() => {
      aboutus.style.opacity = "0";
      const notifyContainer = document.getElementById('notify-container');
      if (notifyContainer && notifyContainer.children.length > 0) {
        let totalHeight = 0;
        Array.from(notifyContainer.children).forEach(child => {
          totalHeight += child.offsetHeight + 10;
        });
        aboutus.style.transform = `translateY(${totalHeight}px) translateX(200px)`;
      } else {
        aboutus.style.transform = "translateX(200px)";
      }
      setTimeout(() => {
        aboutus.style.display = "none";
        window.location.href = "aboutus";
      }, 300);
    }, 900);
  });
}

function scrollup() {
  if (window.scrollY < 100) return;

  window.scrollTo({
    top: 0,
    left: 0,
    behavior: "smooth"
  });
}

const navbar = document.querySelector(".navbar");
const cwn = document.querySelector(".changewidthnavbar");

const MIN_WIDTH = 240;
const MAX_WIDTH_RATIO = 0.85;

function getMaxNavbarWidth() {
  return document.documentElement.clientWidth * MAX_WIDTH_RATIO;
}

function clampNavbarWidth(width) {
  const maxWidth = Math.max(MIN_WIDTH, getMaxNavbarWidth());
  return Math.min(Math.max(width, MIN_WIDTH), maxWidth);
}

function applyNavbarWidth(width, save = false) {
  if (!navbar || Number.isNaN(width)) return;
  const clamped = clampNavbarWidth(width);
  navbar.style.width = clamped + "px";
  if (save && typeof setLocalStorageWithExpiry === "function") {
    setLocalStorageWithExpiry("navbarWidth", clamped, 365);
  }
}

const savedNavbarWidth = typeof getLocalStorageWithExpiry === "function" ? getLocalStorageWithExpiry("navbarWidth") : null;
if (navbar && savedNavbarWidth) {
  applyNavbarWidth(parseFloat(savedNavbarWidth), false);
}

let x = 0;
let isMoving = false;
let currentWidth = MIN_WIDTH;

cwn.addEventListener("pointerdown", (e) => {
  if (!navbar) return;
  x = e.clientX;
  isMoving = true;
  currentWidth = parseFloat(getComputedStyle(navbar).width) || MIN_WIDTH;
  navbar.style.backgroundColor = "rgba(79, 78, 78, 0.16)";
  body.classList.add("us");
  if (cwn.setPointerCapture) {
    cwn.setPointerCapture(e.pointerId);
  }
});

window.addEventListener("pointermove", (e) => {
  if (!isMoving || !navbar) return;
  const nextWidth = currentWidth + (x - e.clientX);
  applyNavbarWidth(nextWidth, false);
});

function pointercancel() {
  if (!isMoving) return;
  isMoving = false;
  if (navbar) {
    const finalWidth = parseFloat(navbar.style.width) || MIN_WIDTH;
    applyNavbarWidth(finalWidth, true);
  }
  navbar.style.backgroundColor = "rgba(41, 41, 41, 0.2)";
  body.classList.remove("us");
}

window.addEventListener("pointerup", pointercancel);
window.addEventListener("pointercancel", pointercancel);

window.addEventListener("resize", () => {
  if (!navbar) return;
  const activeWidth = parseFloat(navbar.style.width) || parseFloat(savedNavbarWidth) || MIN_WIDTH;
  applyNavbarWidth(activeWidth, false);
});

// if (aboutus) {
//     let startX = 0;
//     let startY = 0;

//     aboutus.addEventListener("pointerdown", (e) => {
//     startX = e.clientX;
//     startY = e.clientY;
//     });

//     aboutus.addEventListener("pointerup", (e) => {
//     const dx = e.clientX - startX;
//     const dy = e.clientY - startY;

//     if (dx > 80 && dy < 50 && dy > -50) {
//         aboutus.style.transform = "translateX(500px)";

//         setTimeout(() => {
//         aboutus.style.display = "none";
//         }, 100);
//     }
//     });
// }

if (aboutus) {
  let isDragging = false;
  let startX = 0;

  aboutus.addEventListener("pointerdown", (e) => {
    aboutus.style.transform = `translateY(${aboutUsOffsetY}px) scale(0.9)`;
    isDragging = true;
    startX = e.clientX;
  });

  window.addEventListener("pointermove", (e) => {
    if (!isDragging) return;
    const dx = e.clientX - startX + 20;
    if (e.clientX >= startX - 20) {
      aboutus.style.transform = `translate(${dx}px, ${aboutUsOffsetY}px) scale(0.9)`;
    }
    if (dx > 150) {
      isDragging = false;
      aboutus.style.transform = `translate(500px, ${aboutUsOffsetY}px)`;

      setTimeout(() => {
        aboutus.style.display = "none";
      }, 100);
    }
  });

  window.addEventListener("pointerup", () => {
    if (!isDragging) return;
    aboutus.style.transform = `translateY(${aboutUsOffsetY}px) scale(1)`;
    isDragging = false;
  });
}