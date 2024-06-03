export function openPopup(popup) {
    popup.classList.add("popup_is-opened", "popup_is-animated");
  }
  
export function closePopup(popup) {
    popup.classList.remove("popup_is-opened");
  }