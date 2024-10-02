import "./pages/index.css"
import { createCard, handleDelete, likeCard } from "./components/card.js"
import { openPopup, closePopup, closePopupByEsc } from "./components/modal.js"
import { enableValidation, clearValidation } from "./components/validation.js"
import {
  updateUser,
  getInitialCards,
  getUser,
  addNewCard,
  updateAvatar,
  handleError,
} from "./components/api.js"

const placesContainer = document.querySelector(".places__list")
const popupTypeEdit = document.querySelector(".popup_type_edit")
const btnEditProfile = document.querySelector(".profile__edit-button")
const popupTypeNewCard = document.querySelector(".popup_type_new-card")
const btnAddProfile = document.querySelector(".profile__add-button")
const btnClosePopup = document.querySelectorAll(".popup__close")
const popupList = Array.from(document.querySelectorAll(".popup"))
const popupTypeImage = document.querySelector(".popup_type_image")
const popupImage = popupTypeImage.querySelector(".popup__image")
const popupCaption = popupTypeImage.querySelector(".popup__caption")

// Параметры формы редактирования профиля
const formEditProfile = document.querySelector('form[name="edit-profile"]')
const nameInput = formEditProfile.querySelector(".popup__input_type_name")
const jobInput = formEditProfile.querySelector(
  ".popup__input_type_description"
)

// Данные профиля на странице
const profileTitle = document.querySelector(".profile__title")
const profileDescription = document.querySelector(".profile__description")
const profileAvatar = document.querySelector(".profile__image")

const popupTypeNewAvatar = document.querySelector(".popup_type_new-avatar")
const formNewAvatar = document.querySelector('form[name="new-avatar"]')
const avatarInput = formNewAvatar.querySelector(".popup__input_type_link")
const profileOverlay = document.querySelector(".profile__overlay")

const formNewPlace = document.querySelector('form[name="new-place"]')
const placeNameInput = formNewPlace.querySelector(
  ".popup__input_type_card-name"
)
const linkInput = formNewPlace.querySelector(".popup__input_type_url")
const cardImage = document.querySelector(".card__image")
const cardTitle = document.querySelector(".card__title")

// Текущий пользователь
let currentUser


// Функция открытия попапа-картинки
function openImagePopup(cardLink, cardName) {
  popupImage.src = cardLink
  popupImage.alt = cardName
  popupCaption.textContent = cardName

  openPopup(popupTypeImage)
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
      placesContainer.prepend(newCard);
    });
  })
  .catch(handleError);

// Событие - нажатие кнопки редактирования профиля, открытие формы
btnEditProfile.addEventListener("click", () => {
  nameInput.value = profileTitle.textContent;
  jobInput.value = profileDescription.textContent;
  clearValidation(formEditProfile, validationConfig);
  openPopup(popupTypeEdit);
});

// Функция замены имени и описания на HTML-странице данными из формы.
function submitProfileForm(evt) {
  evt.preventDefault();

  // Заполняем форму редактирования значениями из HTML-страницы
  profileTitle.textContent = nameInput.value;
  profileDescription.textContent = jobInput.value;

  const saveBtn = formEditProfile.querySelector(".popup__button");
  const initialTextBtn = saveBtn.textContent;
  saveBtn.textContent = "Сохранение...";
  saveBtn.classList.add("saving");

  updateUser(nameInput.value, jobInput.value)
    .then((profileData) => {
      profileTitle.textContent = user.name;
      profileDescription.textContent = user.about;
      profileAvatar.src = user.avatar;
    })
    .catch(handleError)
    .finally(() => {
      saveBtn.textContent = initialTextBtn;
      saveBtn.classList.remove("saving");
      closePopup(popupTypeEdit);
    });
}
formEditProfile.addEventListener("submit", submitProfileForm);

// Событие - нажатие нопки добавления карточки
btnAddProfile.addEventListener("click", () => {
  formNewPlace.reset();
  clearValidation(formNewPlace, validationConfig);
  openPopup(popupTypeNewCard);
});

// Добавление новой карточки
function submitNewCardForm(evt) {
  evt.preventDefault();

  const nameValue = placeNameInput.value;
  const linkValue = linkInput.value;

  const saveBtn = formNewPlace.querySelector(".popup__button");
  const initialTextBtn = saveBtn.textContent;
  saveBtn.textContent = "Сохранение...";
  saveBtn.classList.add("saving");

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
    })
    .catch(handleError)
    .finally(() => {
      saveBtn.textContent = initialTextBtn;
      saveBtn.classList.remove("saving");
      closePopup(popupTypeNewCard);
    });
}

formNewPlace.addEventListener("submit", submitNewCardForm);

// Обновление аватара пользователя
function submitAvatarForm(evt) {
  evt.preventDefault();
  const avatarValue = avatarInput.value;

  const saveBtn = formNewAvatar.querySelector(".popup__button");
  const initialTextBtn = saveBtn.textContent;
  saveBtn.textContent = "Сохранение...";
  saveBtn.classList.add("saving");

  updateAvatar(avatarValue)
    .then((avatarData) => {
      profileAvatar.src = avatarData.avatar;
    })
    .catch(handleError)
    .finally(() => {
      saveBtn.textContent = initialTextBtn;
      saveBtn.classList.remove("saving");
      closePopup(popupTypeNewAvatar);
    });
}
formNewAvatar.addEventListener("submit", submitAvatarForm);

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

// Открытие попапа для замены аватара
profileOverlay.addEventListener("click", () => openPopup(popupTypeNewAvatar));

// Функция добавления класса анимации для попапов
document.addEventListener("DOMContentLoaded", () => {
  popupList.forEach((popup) => {
    if (!popup.classList.contains("popup_is-animated")) {
      popup.classList.add("popup_is-animated");
    }
  });
});

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
