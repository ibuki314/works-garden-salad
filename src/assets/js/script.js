(() => {
  const viewportMetaTag = document.querySelector('meta[name="viewport"]');
  const updateViewport = () => {
    const newViewportContent = window.outerWidth > 360 ? "width=device-width,initial-scale=1" : "width=360";
    if (viewportMetaTag.getAttribute("content") !== newViewportContent) {
      viewportMetaTag.setAttribute("content", newViewportContent);
    }
  };
  window.addEventListener("resize", updateViewport);
  updateViewport();
})();
document.addEventListener("DOMContentLoaded", () => {
  /* ---------------------------------------------------------------------- */
  /* スムーズスクロール */
  /* ---------------------------------------------------------------------- */ const header = document.getElementById("js-header");
  const headerHeight = header ? header.offsetHeight : 0;
  const anchorSelectors = ['a[href^="#"]', `a[href^="${window.location.pathname}#"]`, `a[href^="${window.location.origin}${window.location.pathname}#"]`];
  const anchors = document.querySelectorAll(anchorSelectors.join(","));
  anchors.forEach((anchor) => {
    anchor.addEventListener("click", function (e) {
      e.preventDefault();
      const href = this.getAttribute("href");
      const id = href.includes("#") ? href.substring(href.indexOf("#")) : href;
      const targetElement = document.querySelector(id === "#" ? "html" : id);
      if (targetElement) {
        const targetPosition = targetElement.offsetTop - headerHeight;
        window.scrollTo({ top: targetPosition, behavior: "smooth" });
      }
    });
  });
  /* ---------------------------------------------------------------------- */
  /* ページトップの要素を取得 */
  /* ---------------------------------------------------------------------- */
  const pageTopButton = document.getElementById("js-page-top");
  let previousScrollTop = 0;
  window.addEventListener("scroll", () => {
    const currentScrollTop = document.documentElement.scrollTop || document.body.scrollTop;
    if (currentScrollTop > 100 && currentScrollTop < previousScrollTop) {
      pageTopButton.classList.add("is-show");
    } else {
      pageTopButton.classList.remove("is-show");
    }
    previousScrollTop = currentScrollTop;
  });
  /* ---------------------------------------------------------------------- */
  /* ページトップのクリックイベントのリスナーを追加 */
  /* ---------------------------------------------------------------------- */
  pageTopButton.addEventListener("click", (e) => {
    e.preventDefault();
    window.scrollTo({ top: 0, behavior: "smooth" });
  });
  /* ---------------------------------------------------------------------- */
  /* プライバシボリシー */
  /* ---------------------------------------------------------------------- */
  const body = document.body;
  const modalOpenButton = document.getElementById("js-privacy-open");
  const modalCloseButton = document.getElementById("js-privacy-close");
  const modal = document.getElementById("js-privacy-modal");
  const modalInner = document.getElementById("js-privacy-inner");
  const draggable = document.getElementById("js-privacy-draggable");
  const offsetY = { value: 0 };
  let newY = 0;
  const setModalTransform = (transformValue, innerHeight) => {
    modal.style.transform = transformValue;
    modalInner.style.height = innerHeight;
  };
  const toggleBodyScroll = (isNoScroll) => {
    body.classList.toggle("is-no-scroll", isNoScroll);
  };
  const attachModalListeners = (shouldAttach) => {
    const method = shouldAttach ? "addEventListener" : "removeEventListener";
    document[method]("pointermove", moveElement);
    document[method]("touchmove", moveElement);
    document[method]("pointerup", stopMovingElement);
    document[method]("touchend", stopMovingElement);
  };
  const openModal = (event) => {
    event.preventDefault();
    setModalTransform("translateY(22%)", "calc(78% - 35px)");
    toggleBodyScroll(true);
    modal.style.visibility = "visible";
    document.addEventListener("click", clickOutsideModal);
  };
  const closeModal = (event) => {
    event.preventDefault();
    setModalTransform("translateY(100%)", "");
    toggleBodyScroll(false);
    modal.style.visibility = "hidden";
    document.removeEventListener("click", clickOutsideModal);
  };
  const startDrag = (event) => {
    const initialEvent = event.type === "touchstart" ? event.touches[0] : event;
    offsetY.value = initialEvent.clientY - draggable.getBoundingClientRect().top;
    modal.style.transition = "none";
    attachModalListeners(true);
  };
  const moveElement = (event) => {
    const moveEvent = event.type === "touchmove" ? event.touches[0] : event;
    newY = moveEvent.clientY - offsetY.value;
    modalInner.style.height = "calc(100% - 35px)";
    if (newY > 0) {
      modal.style.transform = `translateY(${newY}px)`;
    }
  };
  const stopMovingElement = (event) => {
    modal.style.transition = "transform 220ms ease";
    if (newY <= window.innerHeight * 0.11) {
      setModalTransform("translateY(0)", "calc(100% - 35px)");
    } else if (newY <= window.innerHeight * 0.33) {
      setModalTransform("translateY(22%)", "calc(78% - 35px)");
    } else {
      closeModal(event);
    }
    attachModalListeners(false);
  };
  const clickOutsideModal = (event) => {
    if (!modal.contains(event.target) && !modalOpenButton.contains(event.target)) {
      closeModal(event);
    }
  };
  modalOpenButton.addEventListener("click", openModal);
  modalCloseButton.addEventListener("click", closeModal);
  draggable.addEventListener("pointerdown", startDrag);
});
