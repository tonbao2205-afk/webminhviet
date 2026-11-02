const menu = document.querySelector(".menu");
const links = document.querySelector(".links");
const backdrop = document.querySelector("#drawer-backdrop");
const closeBtn = document.querySelector("#drawer-close");
const siteHeader = document.querySelector(".site-header");

// Kiểm tra phiên bản PC (Desktop > 1080px)
const isPC = () => window.matchMedia("(min-width: 1081px)").matches;

function setMenuOpen(open) {
  if (!menu || !links) return;
  links.classList.toggle("open", open);
  menu.setAttribute("aria-expanded", String(open));
  document.body.classList.toggle("drawer-open", open);
  if (backdrop) backdrop.hidden = !open;
}

if (menu && links) {
  menu.addEventListener("click", () => {
    setMenuOpen(!links.classList.contains("open"));
  });
  if (closeBtn) {
    closeBtn.addEventListener("click", () => setMenuOpen(false));
  }
  if (backdrop) {
    backdrop.addEventListener("click", () => setMenuOpen(false));
  }
  links.addEventListener("click", event => {
    if (event.target.closest("a") && !event.target.closest("[data-open-cta]")) {
      setMenuOpen(false);
    }
  });
}

// Mở/đóng danh mục con DỊCH VỤ trong ngăn kéo bên trái trên điện thoại
const subToggle = document.querySelector(".sub-toggle");
const dropdownItem = document.querySelector(".nav-item-dropdown");
if (subToggle && dropdownItem) {
  subToggle.addEventListener("click", event => {
    event.preventDefault();
    event.stopPropagation();
    const isOpen = dropdownItem.classList.toggle("sub-open");
    subToggle.setAttribute("aria-expanded", String(isOpen));
  });
}

// =========================================================
// 0. CHUYỂN ĐỔI GIAO DIỆN SÁNG / TỐI (Chuẩn color-scheme Chrome)
// =========================================================
const colorSchemeMeta = document.querySelector('meta[name="color-scheme"]');
const themeToggleBtns = document.querySelectorAll("[data-theme-toggle]");
const darkSchemeQuery = window.matchMedia("(prefers-color-scheme: dark)");

function readStoredColorScheme() {
  try {
    const val = localStorage.getItem("color-scheme");
    return val === "light" || val === "dark" ? val : null;
  } catch {
    return null;
  }
}

function getRenderedColorScheme() {
  const metaVal = colorSchemeMeta?.content;
  if (metaVal === "light" || metaVal === "dark") return metaVal;
  const stored = readStoredColorScheme();
  if (stored) return stored;
  return darkSchemeQuery.matches ? "dark" : "light";
}

function applyColorSchemeMeta(schemeOrNull) {
  if (colorSchemeMeta) {
    colorSchemeMeta.content = schemeOrNull ?? "light dark";
  }
}

if (themeToggleBtns.length && colorSchemeMeta) {
  themeToggleBtns.forEach(btn => {
    btn.addEventListener("click", () => {
      const current = getRenderedColorScheme();
      const target = current === "dark" ? "light" : "dark";
      const system = darkSchemeQuery.matches ? "dark" : "light";

      if (target !== system) {
        try {
          localStorage.setItem("color-scheme", target);
        } catch {
          // Vẫn áp dụng cho phiên hiện tại nếu trình duyệt chặn localStorage
        }
        applyColorSchemeMeta(target);
      } else {
        try {
          localStorage.removeItem("color-scheme");
        } catch {
          // Ignore storage errors
        }
        applyColorSchemeMeta(null);
      }
    });
  });

  window.addEventListener("storage", event => {
    if (event.key === "color-scheme" || event.key === null) {
      const next = event.newValue === "light" || event.newValue === "dark" ? event.newValue : null;
      applyColorSchemeMeta(next);
    }
  });
}

// Hàm đóng Popup (<dialog>) kèm hiệu ứng mượt
function closeDialogSmooth(dialog) {
  if (!dialog || !dialog.open || dialog.classList.contains("is-closing")) return;
  dialog.classList.add("is-closing");
  setTimeout(() => {
    dialog.classList.remove("is-closing");
    dialog.close();
  }, 200);
}

// Gắn quy tắc đóng Popup bằng phím ESC: CHỈ HOẠT ĐỘNG TRÊN BẢN PC
function bindDialogEvents(dialog, closeButton) {
  if (!dialog) return;
  dialog.addEventListener("cancel", event => {
    event.preventDefault();
    if (isPC()) {
      closeDialogSmooth(dialog);
    }
  });
  if (closeButton) {
    closeButton.addEventListener("click", () => closeDialogSmooth(dialog));
  }
  dialog.addEventListener("click", event => {
    if (event.target === dialog) closeDialogSmooth(dialog);
  });
}

// =========================================================
// 1. MENU DROP-UP NÚT TRÒN NỔI (Floating Speed-Dial CTA)
// =========================================================
const fabSpeedDial = document.querySelector("#fab-speed-dial");
const fabTrigger = document.querySelector("#fab-trigger");
const fabMenu = document.querySelector("#fab-dropup-menu");
const fabItems = fabMenu ? Array.from(fabMenu.querySelectorAll(".fab-dropup-item")) : [];
const ctaTriggers = document.querySelectorAll("[data-open-cta]");

function setFabDropupOpen(open, { focusFirst = false } = {}) {
  if (!fabSpeedDial || !fabTrigger || !fabMenu) return;
  fabSpeedDial.classList.toggle("is-open", open);
  fabTrigger.setAttribute("aria-expanded", String(open));
  fabTrigger.setAttribute(
    "aria-label",
    open ? "Đóng menu nút tròn liên hệ tư vấn" : "Mở menu nút tròn liên hệ tư vấn Minh Việt"
  );
  fabMenu.setAttribute("aria-hidden", String(!open));
  fabItems.forEach(item => {
    item.setAttribute("tabindex", open ? "0" : "-1");
  });
  if (open && focusFirst && fabItems.length) {
    const bottomItem = fabItems[fabItems.length - 1];
    setTimeout(() => bottomItem.focus(), 60);
  }
}

if (fabSpeedDial && fabTrigger) {
  fabTrigger.addEventListener("click", event => {
    event.stopPropagation();
    const isOpen = fabSpeedDial.classList.contains("is-open");
    setFabDropupOpen(!isOpen);
  });

  ctaTriggers.forEach(trigger => {
    trigger.addEventListener("click", event => {
      event.preventDefault();
      event.stopPropagation();
      setMenuOpen(false);
      setFabDropupOpen(true, { focusFirst: true });
    });
  });

  if (fabMenu) {
    fabMenu.addEventListener("click", event => {
      if (event.target.closest(".fab-dropup-item")) {
        setFabDropupOpen(false);
      }
    });
  }

  document.addEventListener("click", event => {
    if (
      fabSpeedDial.classList.contains("is-open") &&
      !fabSpeedDial.contains(event.target) &&
      !event.target.closest("[data-open-cta]")
    ) {
      setFabDropupOpen(false);
    }
  });

  fabSpeedDial.addEventListener("keydown", event => {
    if (!fabSpeedDial.classList.contains("is-open") || !fabItems.length) return;
    const currentIndex = fabItems.indexOf(document.activeElement);
    if (event.key === "ArrowUp") {
      event.preventDefault();
      const nextIndex = currentIndex <= 0 ? fabItems.length - 1 : currentIndex - 1;
      fabItems[nextIndex].focus();
    } else if (event.key === "ArrowDown") {
      event.preventDefault();
      const nextIndex = currentIndex === -1 || currentIndex >= fabItems.length - 1 ? 0 : currentIndex + 1;
      fabItems[nextIndex].focus();
    }
  });
}

// =========================================================
// 2. MA TRẬN DỊCH VỤ TƯƠNG TÁC TRÊN TRANG CHỦ (Service Matrix)
// =========================================================
const matrixShell = document.querySelector("[data-service-matrix]");
if (matrixShell) {
  const tabs = Array.from(matrixShell.querySelectorAll(".matrix-tab"));
  const panels = Array.from(matrixShell.querySelectorAll(".matrix-panel"));

  const activateTab = targetSlug => {
    tabs.forEach(tab => {
      const isMatch = tab.dataset.matrixTarget === targetSlug;
      tab.classList.toggle("is-active", isMatch);
      tab.setAttribute("aria-selected", String(isMatch));
    });
    panels.forEach(panel => {
      const isMatch = panel.id === `matrix-panel-${targetSlug}`;
      panel.classList.toggle("is-active", isMatch);
      panel.hidden = !isMatch;
    });
  };

  tabs.forEach(tab => {
    tab.addEventListener("click", () => activateTab(tab.dataset.matrixTarget));
    tab.addEventListener("mouseenter", () => {
      if (isPC()) activateTab(tab.dataset.matrixTarget);
    });
  });
}

// =========================================================
// 3. BỘ LỌC TRA CỨU NHANH 18 DỊCH VỤ (dich-vu.html)
// =========================================================
const searchInput = document.querySelector("#service-search-input");
const filterButtons = Array.from(document.querySelectorAll("[data-filter-group]"));
const directoryBlocks = Array.from(document.querySelectorAll("[data-directory-group]"));

if (searchInput || filterButtons.length) {
  let activeGroup = "all";
  let query = "";

  const applyServiceFilter = () => {
    const q = query.trim().toLowerCase();
    directoryBlocks.forEach(block => {
      const groupSlug = block.dataset.directoryGroup;
      const groupMatch = activeGroup === "all" || activeGroup === groupSlug;
      const cards = Array.from(block.querySelectorAll(".service-detail-card"));
      let visibleCount = 0;

      cards.forEach(card => {
        const text = card.dataset.serviceSearch || "";
        const textMatch = !q || text.includes(q);
        const show = groupMatch && textMatch;
        card.hidden = !show;
        if (show) visibleCount++;
      });

      block.hidden = visibleCount === 0;
    });
  };

  if (searchInput) {
    searchInput.addEventListener("input", event => {
      query = event.target.value;
      applyServiceFilter();
    });
    if (window.location.hash === "#tra-cuu-dich-vu") {
      setTimeout(() => searchInput.focus(), 180);
    }
  }

  filterButtons.forEach(btn => {
    btn.addEventListener("click", () => {
      activeGroup = btn.dataset.filterGroup;
      filterButtons.forEach(b => b.classList.toggle("is-active", b === btn));
      applyServiceFilter();
    });
  });
}

// Hỗ trợ các nút/liên kết trỏ tới anchor (#tru-so, #ho-so-phap-ly) khi đang ở cùng trang
document.addEventListener("click", event => {
  const anchor = event.target.closest('a[href*="#"]');
  if (!anchor) return;
  const href = anchor.getAttribute("href") || "";
  const hashIndex = href.indexOf("#");
  if (hashIndex === -1) return;
  const hash = href.slice(hashIndex + 1);
  if (!hash) return;
  try {
    const url = new URL(href, window.location.href);
    if (url.pathname === window.location.pathname) {
      const targetEl = document.getElementById(hash);
      if (targetEl) {
        event.preventDefault();
        setMenuOpen(false);
        setFabDropupOpen(false);
        targetEl.scrollIntoView({ behavior: "smooth", block: "start" });
        history.replaceState(null, "", `#${hash}`);
      }
    }
  } catch {
    // Ignore invalid URLs
  }
});

// Hỗ trợ thông minh cho mọi nút/liên kết Gửi Email (mailto:):
// Tự động sao chép Email vào Clipboard + hiện thông báo nổi kèm nút mở Gmail Web (phòng trường hợp máy không cài Outlook)
let emailToast = null;
let emailToastTimer = null;

function showEmailToast(emailAddress) {
  if (!emailToast) {
    emailToast = document.createElement("div");
    emailToast.className = "mv-email-toast";
    emailToast.setAttribute("role", "status");
    emailToast.setAttribute("aria-live", "polite");
    document.body.append(emailToast);
  }
  const gmailUrl = `https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(emailAddress)}`;
  emailToast.innerHTML = `
    <span>Đã sao chép Email: <strong>${emailAddress}</strong></span>
    <span class="mv-email-toast-actions">
      <a class="mv-email-toast-btn" href="${gmailUrl}" target="_blank" rel="noopener noreferrer">Mở Gmail soạn thư ↗</a>
      <button type="button" class="mv-email-toast-close" aria-label="Đóng thông báo">✕</button>
    </span>
  `;
  const closeToastBtn = emailToast.querySelector(".mv-email-toast-close");
  if (closeToastBtn) {
    closeToastBtn.addEventListener("click", () => {
      emailToast.classList.remove("is-visible");
    });
  }
  requestAnimationFrame(() => {
    emailToast.classList.add("is-visible");
  });
  clearTimeout(emailToastTimer);
  emailToastTimer = setTimeout(() => {
    if (emailToast) emailToast.classList.remove("is-visible");
  }, 7000);
}

function showCopyToast(label, copiedText) {
  if (!emailToast) {
    emailToast = document.createElement("div");
    emailToast.className = "mv-email-toast";
    emailToast.setAttribute("role", "status");
    emailToast.setAttribute("aria-live", "polite");
    document.body.append(emailToast);
  }
  emailToast.innerHTML = `
    <span>Đã sao chép ${label}: <strong>${copiedText}</strong></span>
    <span class="mv-email-toast-actions">
      <button type="button" class="mv-email-toast-close" aria-label="Đóng thông báo">✕</button>
    </span>
  `;
  const closeToastBtn = emailToast.querySelector(".mv-email-toast-close");
  if (closeToastBtn) {
    closeToastBtn.addEventListener("click", () => {
      emailToast.classList.remove("is-visible");
    });
  }
  requestAnimationFrame(() => {
    emailToast.classList.add("is-visible");
  });
  clearTimeout(emailToastTimer);
  emailToastTimer = setTimeout(() => {
    if (emailToast) emailToast.classList.remove("is-visible");
  }, 4500);
}

document.addEventListener("click", event => {
  const copyBtn = event.target.closest("[data-copy-text]");
  if (copyBtn) {
    const textToCopy = copyBtn.getAttribute("data-copy-text");
    const copyLabel = copyBtn.getAttribute("data-copy-label") || "nội dung";
    if (!textToCopy) return;
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(textToCopy).catch(() => {});
    }
    const labelSpan = copyBtn.querySelector("span");
    if (labelSpan) {
      const origText = copyBtn.dataset.origLabel || labelSpan.textContent;
      copyBtn.dataset.origLabel = origText;
      labelSpan.textContent = "✓ Đã chép";
      copyBtn.classList.add("is-copied");
      setTimeout(() => {
        labelSpan.textContent = origText;
        copyBtn.classList.remove("is-copied");
      }, 2200);
    }
    showCopyToast(copyLabel, textToCopy);
    return;
  }

  const mailLink = event.target.closest('a[href^="mailto:"]');
  if (!mailLink) return;
  const emailAddress = mailLink.getAttribute("href").replace(/^mailto:/i, "").split("?")[0].trim();
  if (!emailAddress) return;
  if (navigator.clipboard && navigator.clipboard.writeText) {
    navigator.clipboard.writeText(emailAddress).catch(() => {});
  }
  showEmailToast(emailAddress);
});

// =========================================================
// 4. SCROLL-SPY MỤC LỤC HỒ SƠ ĐIỀU HÀNH (.dossier-toc)
// =========================================================
const tocLinks = Array.from(document.querySelectorAll(".dossier-toc-nav a"));
if (tocLinks.length && "IntersectionObserver" in window) {
  const sectionMap = new Map();
  tocLinks.forEach(link => {
    const id = link.getAttribute("href")?.slice(1);
    const sec = id ? document.getElementById(id) : null;
    if (sec) sectionMap.set(sec, link);
  });

  const tocObserver = new IntersectionObserver(
    entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const activeLink = sectionMap.get(entry.target);
          if (activeLink) {
            tocLinks.forEach(l => l.classList.toggle("is-active", l === activeLink));
          }
        }
      });
    },
    { rootMargin: "-18% 0px -68% 0px", threshold: 0 }
  );

  sectionMap.forEach((_, sec) => tocObserver.observe(sec));
}

// =========================================================
// 5. LIGHTBOX XEM ẢNH HOẠT ĐỘNG & ESCAPE CHỈ BẢN PC
// =========================================================
let lightboxDialog = null;
const triggers = document.querySelectorAll(".lightbox-trigger");
if (triggers.length && typeof HTMLDialogElement !== "undefined") {
  lightboxDialog = document.createElement("dialog");
  lightboxDialog.className = "lightbox-dialog";
  lightboxDialog.innerHTML = `
    <div class="lightbox-inner">
      <button type="button" class="lightbox-close" aria-label="Đóng ảnh">ĐÓNG ✕</button>
      <img src="" alt="">
      <div class="lightbox-caption"></div>
    </div>
  `;
  document.body.append(lightboxDialog);
  const img = lightboxDialog.querySelector("img");
  const caption = lightboxDialog.querySelector(".lightbox-caption");
  const lbCloseBtn = lightboxDialog.querySelector(".lightbox-close");

  bindDialogEvents(lightboxDialog, lbCloseBtn);

  triggers.forEach(trigger => {
    trigger.addEventListener("click", event => {
      event.preventDefault();
      const href = trigger.getAttribute("href");
      const text = trigger.dataset.caption || trigger.querySelector("img")?.alt || "";
      img.src = href;
      img.alt = text;
      caption.textContent = text;
      lightboxDialog.classList.remove("is-closing");
      lightboxDialog.showModal();
    });
  });
}

document.addEventListener("keydown", event => {
  if (event.key !== "Escape") return;
  if (!isPC()) return;
  if (fabSpeedDial && fabSpeedDial.classList.contains("is-open")) {
    event.preventDefault();
    setFabDropupOpen(false);
    if (fabTrigger) fabTrigger.focus();
  }
  if (lightboxDialog && lightboxDialog.open) {
    event.preventDefault();
    closeDialogSmooth(lightboxDialog);
  }
});

// =========================================================
// 6. CUỘN TRANG (nút lên đầu trang, trạng thái header)
// =========================================================
const scrollTopBtn = document.querySelector("#scroll-top");
const floatingActions = document.querySelector(".floating-actions");
const siteFooter = document.querySelector("footer.site-footer");
const handleScroll = () => {
  const y = window.scrollY;
  if (siteHeader) {
    siteHeader.classList.toggle("is-scrolled", y > 24);
  }
  if (scrollTopBtn) {
    scrollTopBtn.hidden = y < 360;
  }
  if (floatingActions && siteFooter) {
    const footerRect = siteFooter.getBoundingClientRect();
    floatingActions.classList.toggle("is-near-footer", footerRect.top < window.innerHeight - 20);
  }
};
window.addEventListener("scroll", handleScroll, { passive: true });
handleScroll();

if (scrollTopBtn) {
  scrollTopBtn.addEventListener("click", () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  });
}

const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

// =========================================================
// 7. THANH TAB PHẲNG GẠCH CHÂN LỌC ALBUM HOẠT ĐỘNG
// =========================================================
const albumTabsList = document.querySelector("[data-album-tabs]");
if (albumTabsList) {
  const albumTabs = Array.from(albumTabsList.querySelectorAll(".album-tab"));
  const albumsWrap = document.querySelector(".activity-albums");
  const albumSections = albumsWrap ? Array.from(albumsWrap.querySelectorAll(".activity-album")) : [];

  const activateAlbumFilter = (filterId, { updateHash = false, focusTab = false } = {}) => {
    const validTarget =
      filterId && filterId !== "all" && albumSections.some(sec => sec.id === filterId) ? filterId : "all";

    albumTabs.forEach(tab => {
      const isMatch = tab.dataset.albumFilter === validTarget;
      tab.classList.toggle("is-active", isMatch);
      tab.setAttribute("aria-selected", String(isMatch));
      tab.setAttribute("tabindex", isMatch ? "0" : "-1");
      const li = tab.closest("li");
      if (li) li.classList.toggle("is-active", isMatch);

      if (isMatch) {
        if (focusTab) tab.focus({ preventScroll: true });
        if (albumTabsList.scrollWidth > albumTabsList.clientWidth) {
          const targetLeft = tab.offsetLeft - (albumTabsList.clientWidth - tab.offsetWidth) / 2;
          albumTabsList.scrollTo({
            left: Math.max(0, targetLeft),
            behavior: prefersReducedMotion ? "auto" : "smooth",
          });
        }
      }
    });

    if (albumsWrap) {
      albumsWrap.classList.toggle("is-filtered", validTarget !== "all");
    }

    albumSections.forEach(sec => {
      const show = validTarget === "all" || sec.id === validTarget;
      sec.hidden = !show;
    });

    if (updateHash) {
      const nextUrl =
        validTarget === "all" ? window.location.pathname + window.location.search : `#${validTarget}`;
      history.replaceState(null, "", nextUrl);
    }
  };

  albumTabs.forEach(tab => {
    tab.addEventListener("click", () => {
      activateAlbumFilter(tab.dataset.albumFilter, { updateHash: true });
    });
  });

  albumTabsList.addEventListener("keydown", event => {
    const currentIndex = albumTabs.indexOf(document.activeElement);
    if (currentIndex === -1) return;
    let nextIndex = -1;
    if (event.key === "ArrowRight") {
      nextIndex = (currentIndex + 1) % albumTabs.length;
    } else if (event.key === "ArrowLeft") {
      nextIndex = (currentIndex - 1 + albumTabs.length) % albumTabs.length;
    } else if (event.key === "Home") {
      nextIndex = 0;
    } else if (event.key === "End") {
      nextIndex = albumTabs.length - 1;
    }
    if (nextIndex !== -1) {
      event.preventDefault();
      activateAlbumFilter(albumTabs[nextIndex].dataset.albumFilter, {
        updateHash: true,
        focusTab: true,
      });
    }
  });

  const syncAlbumFilterFromHash = () => {
    const hash = window.location.hash.replace(/^#/, "");
    if (/^album-\d+$/.test(hash)) {
      activateAlbumFilter(hash);
    }
  };

  syncAlbumFilterFromHash();
  window.addEventListener("hashchange", syncAlbumFilterFromHash);
}

// =========================================================
// 8. HIỆU ỨNG XUẤT HIỆN THEO MỤC LỚN KHI CUỘN TỚI
// Lớp .mv-anim được bật sẵn trong <head> (trừ khi người dùng giảm chuyển động),
// nên phần tử ẩn ngay từ khung hình đầu, không bị chớp. Danh sách bộ chọn phải
// khớp với phần tương ứng trong styles.css.
// =========================================================
const revealRoot = document.documentElement;
if (revealRoot.classList.contains("mv-anim") && "IntersectionObserver" in window) {
  window.__mvReveal = true;

  // Chỉ các mục lớn (con trực tiếp của <main>), trừ phần đầu trang
  const revealSelector = "main > :not(.hero):not(.page-hero)";

  const STAGGER_MS = 56;
  const STAGGER_MAX = 6;

  const revealObserver = new IntersectionObserver(
    entries => {
      const entering = entries
        .filter(entry => entry.isIntersecting)
        .map(entry => entry.target)
        .sort((a, b) => (a.compareDocumentPosition(b) & Node.DOCUMENT_POSITION_FOLLOWING ? -1 : 1));

      entering.forEach((el, index) => {
        el.style.setProperty("--mv-d", `${Math.min(index, STAGGER_MAX) * STAGGER_MS}ms`);
        el.classList.add("is-in");
        revealObserver.unobserve(el);
      });
    },
    { rootMargin: "0px 0px -8% 0px", threshold: 0 }
  );

  document.querySelectorAll(revealSelector).forEach(el => revealObserver.observe(el));

  // In ấn: hiện toàn bộ nội dung
  window.addEventListener("beforeprint", () => {
    document.querySelectorAll(revealSelector).forEach(el => el.classList.add("is-in"));
  });
}
