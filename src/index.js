import './pages/index.css';
import { initialCards } from './scripts/cards.js';
import { createCard, handleDelete, likeCard } from './components/card.js';
import { openPopup, closePopup } from './components/modal.js';


initialCards.forEach((data) => {
  const newCard = createCard(data, handleDelete, openImagePopup, likeCard);
  placesContainer.prepend(newCard);
});

const popupTypeEdit = document.querySelector(".popup_type_edit");
const profileEditBtn = document.querySelector(".profile__edit-button");

const popupTypeNewCard = document.querySelector(".popup_type_new-card");
const profileAddBtn = document.querySelector(".profile__add-button");

const popupCloseBtn = document.querySelectorAll(".popup__close");
const popupList = Array.from(document.querySelectorAll(".popup"));


function openImagePopup(cardLink, cardName) {
  const popupTypeImage = document.querySelector(".popup_type_image");
  const popupImage = popupTypeImage.querySelector(".popup__image");
  const popupCaption = popupTypeImage.querySelector(".popup__caption");

  popupImage.src = cardLink;
  popupImage.alt = cardName;
  popupCaption.textContent = cardName;

  openPopup(popupTypeImage);
}

profileEditBtn.addEventListener('click', () => {
  nameInput.value = profileTitle.textContent;
  jobInput.value = profileDescription.textContent;
  openPopup(popupTypeEdit);
});
profileAddBtn.addEventListener("click", () => openPopup(popupTypeNewCard));

const setCloseListener = () => {
  popupList.forEach((popup) => {
    popup.addEventListener("click", (event) => {
      if (
        event.target.classList.contains("popup") ||
        event.target.classList.contains("popup__close")
      ) {
        closePopup(popup);
        editProfileForm.reset();
        newPlaceForm.reset();
      }
    });
  });
};

setCloseListener();

const setEscapeCloseListener = () => {
  popupList.forEach((popup) => {
    window.addEventListener("keydown", (e) => {
      if (e.key === "Escape") {
        closePopup(popup);
        editProfileForm.reset();
        newPlaceForm.reset();
      }
    });
    window.removeEventListener("keydown", (e) => {
      if (e.key === "Escape") {
        closePopup(popup);
        editProfileForm.reset();
        newPlaceForm.reset();
      }
    });
  });
};

setEscapeCloseListener();

const editProfileForm = document.querySelector('form[name="edit-profile"]');
const nameInput = editProfileForm.querySelector(".popup__input_type_name");
const jobInput = editProfileForm.querySelector(".popup__input_type_description");
const profileTitle = document.querySelector(".profile__title");
const profileDescription = document.querySelector(".profile__description");

function submitProfileForm(evt) {
  evt.preventDefault();

  profileTitle.textContent = nameInput.value;
  profileDescription.textContent = jobInput.value;

  closePopup(popupTypeEdit);
}

editProfileForm.addEventListener("submit", submitProfileForm);

const newPlaceForm = document.querySelector('form[name="new-place"]');
const placeNameInput = newPlaceForm.querySelector(".popup__input_type_card-name");
const linkInput = newPlaceForm.querySelector(".popup__input_type_url");
const cardImage = document.querySelector(".card__image");
const cardTitle = document.querySelector(".card__title");

function submitNewCardForm(evt) {
  evt.preventDefault();

  const newCard = {
    name: placeNameInput.value,
    link: linkInput.value,
  };

  const card = createCard(newCard, handleDelete, openImagePopup, likeCard);
  placesContainer.prepend(card);

  newPlaceForm.reset();
  closePopup(popupTypeNewCard);
}

newPlaceForm.addEventListener("submit", submitNewCardForm);
