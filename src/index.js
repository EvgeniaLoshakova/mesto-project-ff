import "./pages/index.css";
import { createCard, handleDelete, likeCard } from "./components/card.js";
import {
  openPopup,
  closePopup,
  setClosePopupByClickListeners,
  closePopupByEsc,
} from "./components/modal.js";
import { enableValidation, clearValidation } from "./components/validation.js";
import {
  updateUser,
  getInitialCards,
  getUser,
  addNewCard,
  updateAvatar,
  handleError,
} from "./components/api.js";

const placesContainer = document.querySelector(".places__list");
const popupTypeEdit = document.querySelector(".popup_type_edit");
const btnEditProfile = document.querySelector(".profile__edit-button");
const popupTypeNewCard = document.querySelector(".popup_type_new-card");
const btnAddCard = document.querySelector(".profile__add-button");
const popupList = Array.from(document.querySelectorAll(".popup"));
const popupTypeImage = document.querySelector(".popup_type_image");
const popupImage = popupTypeImage.querySelector(".popup__image");
const popupCaption = popupTypeImage.querySelector(".popup__caption");

// Параметры формы редактирования профиля
const formEditProfile = document.querySelector('form[name="edit-profile"]');
const nameInput = formEditProfile.querySelector(".popup__input_type_name");
const jobInput = formEditProfile.querySelector(
  ".popup__input_type_description"
);

// Данные профиля на странице
const profileTitle = document.querySelector(".profile__title");
const profileDescription = document.querySelector(".profile__description");
const profileAvatar = document.querySelector(".profile__image");

const popupTypeNewAvatar = document.querySelector(".popup_type_new-avatar");
const formNewAvatar = document.querySelector('form[name="new-avatar"]');
const avatarInput = formNewAvatar.querySelector(".popup__input_type_link");
const profileOverlay = document.querySelector(".profile__overlay");

const formNewPlace = document.querySelector('form[name="new-place"]');
const placeNameInput = formNewPlace.querySelector(
  ".popup__input_type_card-name"
);
const linkInput = formNewPlace.querySelector(".popup__input_type_url");
const saveProfileBtn = formEditProfile.querySelector(".popup__button");
const saveAvatarBtn = formNewAvatar.querySelector(".popup__button");
const savePlaceBtn = formNewPlace.querySelector(".popup__button");

// Текущий пользователь
let currentUser;

// Функция открытия попапа-картинки
function openImagePopup(cardLink, cardName) {
  popupImage.src = cardLink;
  popupImage.alt = cardName;
  popupCaption.textContent = cardName;

  openPopup(popupTypeImage);
}

// Функция переключения состояния кнопки Сохранить
function setIsLoadingButton(button, text, isLoading) {
  button.textContent = text;
  if (isLoading) {
    button.classList.add("popup__button_saving");
  } else {
    button.classList.remove("popup__button_saving");
  }
}

// Получаем данные карточек и пользователя с сервера
Promise.all([getInitialCards(), getUser()])
  .then(([cards, user]) => {
    profileTitle.textContent = user.name;
    profileDescription.textContent = user.about;
    profileAvatar.src = user.avatar;
    currentUser = user;

    cards.forEach((card) => {
      const newCard = createCard(
        card,
        handleDelete,
        openImagePopup,
        likeCard,
        user._id
      );
      placesContainer.append(newCard);
    });
  })
  .catch(handleError);

// Функция замены имени и описания на HTML-странице данными из формы.
function handleProfileFormSubmit(evt) {
  evt.preventDefault();

  const initialTextBtn = saveProfileBtn.textContent;
  setIsLoadingButton(saveProfileBtn, "Сохранение...", true);

  updateUser(nameInput.value, jobInput.value)
    .then((profileData) => {
      profileTitle.textContent = profileData.name;
      profileDescription.textContent = profileData.about;
      closePopup(popupTypeEdit);
    })
    .catch(handleError)
    .finally(() => {
      setIsLoadingButton(saveProfileBtn, initialTextBtn, false);
    });
}

// Добавление новой карточки
function handleNewCardFormSubmit(evt) {
  evt.preventDefault();

  const initialTextBtn = savePlaceBtn.textContent;
  setIsLoadingButton(savePlaceBtn, "Сохранение...", true);

  const nameValue = placeNameInput.value;
  const linkValue = linkInput.value;

  addNewCard(nameValue, linkValue)
    .then((newCardData) => {
      placesContainer.prepend(
        createCard(
          newCardData,
          handleDelete,
          openImagePopup,
          likeCard,
          currentUser._id
        )
      );
      formNewPlace.reset();
      clearValidation(formNewPlace, validationConfig);
      closePopup(popupTypeNewCard);
    })
    .catch(handleError)
    .finally(() => {
      setIsLoadingButton(savePlaceBtn, initialTextBtn, false);
    });
}

// Обновление аватара пользователя
function handleAvatarFormSubmit(evt) {
  evt.preventDefault();

  const avatarValue = avatarInput.value;
  const initialTextBtn = saveAvatarBtn.textContent;
  setIsLoadingButton(saveAvatarBtn, "Сохранение...", true);

  updateAvatar(avatarValue)
    .then((avatarData) => {
      profileAvatar.src = avatarData.avatar;
      formNewAvatar.reset();
      clearValidation(formNewAvatar, validationConfig);
      closePopup(popupTypeNewAvatar);
    })
    .catch(handleError)
    .finally(() => {
      setIsLoadingButton(saveAvatarBtn, initialTextBtn, false);
    });
}

setClosePopupByClickListeners(popupList);

// Функция добавления класса анимации для попапов
document.addEventListener("DOMContentLoaded", () => {
  popupList.forEach((popup) => {
    if (!popup.classList.contains("popup_is-animated")) {
      popup.classList.add("popup_is-animated");
    }
  });
});

// Обработчики событий
btnEditProfile.addEventListener("click", () => {
  openPopup(popupTypeEdit);
  clearValidation(formEditProfile, validationConfig);
  nameInput.value = profileTitle.textContent;
  jobInput.value = profileDescription.textContent;
});
btnAddCard.addEventListener("click", () => openPopup(popupTypeNewCard));
profileOverlay.addEventListener("click", () => openPopup(popupTypeNewAvatar));
formNewAvatar.addEventListener("submit", handleAvatarFormSubmit);
formNewPlace.addEventListener("submit", handleNewCardFormSubmit);
formEditProfile.addEventListener("submit", handleProfileFormSubmit);

// Валидация форм
const validationConfig = {
  formSelector: ".popup__form",
  inputSelector: ".popup__input",
  submitButtonSelector: ".popup__button",
  inactiveButtonClass: "popup__button_inactive",
  inputErrorClass: "popup__input_type_error",
  errorClass: "popup__error_visible",
};

enableValidation(validationConfig);
