import {
  deleteCardFromServer,
  addLike,
  deleteLike,
  handleError,
} from "./api.js";

const cardTemplate = document
  .querySelector("#card-template")
  .content.querySelector(".places__item");

// Функция создания карточки при загрузке страницы

export function createCard(
  data,
  handleDelete,
  openImagePopup,
  likeCard,
  userId
) {
  const { link, name } = data;
  const newCard = cardTemplate.cloneNode(true);
  const deleteButton = newCard.querySelector(".card__delete-button");
  const cardTitle = newCard.querySelector(".card__title");
  const cardImage = newCard.querySelector(".card__image");
  const likesCounter = newCard.querySelector(".card__likes-counter");

  cardImage.src = data.link;
  cardImage.alt = data.name;
  cardTitle.textContent = data.name;

  cardImage.addEventListener("click", () =>
    openImagePopup(data.link, data.name)
  );

  const cardLikeBtn = newCard.querySelector(".card__like-button");
  cardLikeBtn.addEventListener("click", (evt) =>
    likeCard(evt, data._id, likesCounter)
  );
  likesCounter.textContent = data.likes.length;

  deleteButton.addEventListener("click", () => handleDelete(newCard, data._id));

  if (data.owner._id === userId) {
    deleteButton.classList.remove("card__delete-button_hidden");
  } else {
    deleteButton.classList.add("card__delete-button_hidden");
  }

  if (data.likes.some((like) => like._id === userId)) {
    cardLikeBtn.classList.add("card__like-button_is-active");
  }

  return newCard;
}

// Функция удаления карточки

export const handleDelete = (card, cardId) => {
  deleteCardFromServer(cardId)
    .then(() => {
      card.remove(card);
    })
    .catch(handleError);
};

// Функция, обрабатывающая события лайка

export const likeCard = (event, cardId, likesCounter) => {
  const button = event.target;

  if (button.classList.contains("card__like-button_is-active")) {
    deleteLike(cardId)
      .then((cardData) => {
        button.classList.remove("card__like-button_is-active");
        likesCounter.textContent = cardData.likes.length;
      })
      .catch(handleError);
  } else {
    addLike(cardId)
      .then((cardData) => {
        button.classList.add("card__like-button_is-active");
        likesCounter.textContent = cardData.likes.length;
      })
      .catch(handleError);
  }
};
