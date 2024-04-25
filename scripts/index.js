// @todo: Темплейт карточки

// @todo: DOM узлы
const cardTemplate = document.querySelector('#card-template').content.querySelector('.places__item');
const placesContainer = document.querySelector('.places__list');

// @todo: Функция создания карточки

const createCard = (data, onDelete) => {
  const newCard = cardTemplate.cloneNode(true);
  const deleteButton = newCard.querySelector('.card__delete-button');
  const name = newCard.querySelector('.card__title');
  name.textContent = data.name;
  const link = newCard.querySelector('.card__image');
  link.src = data.link;

  deleteButton.addEventListener('click', () => { 
   onDelete(newCard);
  });

  return newCard;
}

// @todo: Функция удаления карточки

const handleDelete = (card) => {
card.remove()
}

// @todo: Вывести карточки на страницу

initialCards.forEach((data) => {
const newCard = createCard(data, handleDelete);
placesContainer.append(newCard);
})




 
  


