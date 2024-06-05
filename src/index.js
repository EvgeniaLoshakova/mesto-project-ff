import "./pages/index.css";
import { initialCards } from "./scripts/cards.js";
import { createCard, handleDelete, likeCard } from "./components/card.js";
import { openPopup, closePopup } from "./components/modal.js";

const placesContainer = document.querySelector(".places__list");
const popupTypeEdit = document.querySelector(".popup_type_edit");
const btnEditProfile = document.querySelector(".profile__edit-button");
const popupTypeNewCard = document.querySelector(".popup_type_new-card");
const btnAddProfile = document.querySelector(".profile__add-button");
const btnClosePopup = document.querySelectorAll(".popup__close");
const popupList = Array.from(document.querySelectorAll(".popup"));
const popupTypeImage = document.querySelector(".popup_type_image");
const popupImage = popupTypeImage.querySelector(".popup__image");
const popupCaption = popupTypeImage.querySelector(".popup__caption");
const formEditProfile = document.querySelector('form[name="edit-profile"]');
const nameInput = formEditProfile.querySelector(".popup__input_type_name");
const jobInput = formEditProfile.querySelector(
  ".popup__input_type_description"
);
const profileTitle = document.querySelector(".profile__title");
const profileDescription = document.querySelector(".profile__description");
const formNewPlace = document.querySelector('form[name="new-place"]');
const placeNameInput = formNewPlace.querySelector(
  ".popup__input_type_card-name"
);
const linkInput = formNewPlace.querySelector(".popup__input_type_url");
const cardImage = document.querySelector(".card__image");
const cardTitle = document.querySelector(".card__title");

initialCards.forEach((data) => {
  const newCard = createCard(data, handleDelete, openImagePopup, likeCard);
  placesContainer.prepend(newCard);
});

function openImagePopup(cardLink, cardName) {
  popupImage.src = cardLink;
  popupImage.alt = cardName;
  popupCaption.textContent = cardName;

  openPopup(popupTypeImage);
}

btnEditProfile.addEventListener("click", () => {
  nameInput.value = profileTitle.textContent;
  jobInput.value = profileDescription.textContent;
  openPopup(popupTypeEdit);
});
btnAddProfile.addEventListener("click", () => openPopup(popupTypeNewCard));

const setCloseListener = () => {
  popupList.forEach((popup) => {
    popup.addEventListener("click", (event) => {
      if (
        event.target.classList.contains("popup") ||
        event.target.classList.contains("popup__close")
      ) {
        closePopup(popup);
      }
    });
  });
};

setCloseListener();

function submitProfileForm(evt) {
  evt.preventDefault();

  profileTitle.textContent = nameInput.value;
  profileDescription.textContent = jobInput.value;

  closePopup(popupTypeEdit);
}

formEditProfile.addEventListener("submit", submitProfileForm);

function submitNewCardForm(evt) {
  evt.preventDefault();

  const newCard = {
    name: placeNameInput.value,
    link: linkInput.value,
  };

  const card = createCard(newCard, handleDelete, openImagePopup, likeCard);
  placesContainer.prepend(card);

  formNewPlace.reset();
  closePopup(popupTypeNewCard);
}

formNewPlace.addEventListener("submit", submitNewCardForm);

// Функция добавления класса анимации
document.addEventListener("DOMContentLoaded", () => {
  popupList.forEach((popup) => {
    if (!popup.classList.contains("popup_is-animated")) {
      popup.classList.add("popup_is-animated");
    }
  });
});
