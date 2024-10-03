// Функция открытия попапа
export function openPopup(popup) {
  popup.classList.add("popup_is-opened");
  document.addEventListener("keydown", closePopupByEsc);
}

// Функция закрытия попапа
export function closePopup(popup) {
  popup.classList.remove("popup_is-opened");
  document.removeEventListener("keydown", closePopupByEsc);
}

// Функция закрытия попапа через Escape
export function closePopupByEsc(e) {
  if (e.key === "Escape") {
    closePopup(document.querySelector(".popup_is-opened"));
  }
}

export const closePopupByClick = (popups) => {
  popups.forEach((popup) => {
    popup.addEventListener("click", (event) => {
      if (
        event.target.classList.contains("popup") ||
        event.target.classList.contains("popup__close")
      ) {
        closePopup(popup);
      }
    })
  })
}
