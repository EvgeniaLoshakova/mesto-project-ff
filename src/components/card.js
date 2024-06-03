const cardTemplate = document
  .querySelector("#card-template")
  .content.querySelector(".places__item");
const placesContainer = document.querySelector(".places__list");

// Функция создания карточки

export function createCard (data, onDelete, openImagePopup, likeCard) {
  const newCard = cardTemplate.cloneNode(true);
  const deleteButton = newCard.querySelector(".card__delete-button");
  const cardTitle = newCard.querySelector(".card__title");
  cardTitle.textContent = data.name;
  const cardImage = newCard.querySelector(".card__image");

  cardImage.addEventListener("click", () =>
    openImagePopup(data.link, data.name)
  );

  cardImage.src = data.link;
  cardImage.alt = data.name;

  const cardLikeBtn = newCard.querySelector(".card__like-button");
  cardLikeBtn.addEventListener("click", likeCard);

  deleteButton.addEventListener("click", () => {
    onDelete(newCard);
  });

  return newCard;
};

// Функция удаления карточки
export function handleDelete(card) {
    card.remove(card);
  };

// Функция, обрабатывающая события лайка
 export function likeCard(button) {
    button.target.classList.toggle("card__like-button_is-active");
  }
