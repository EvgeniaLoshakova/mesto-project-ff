// @todo: Темплейт карточки

// @todo: DOM узлы

// @todo: Функция создания карточки

// @todo: Функция удаления карточки

// @todo: Вывести карточки на страницу

const placesContainer = document.querySelector('.places__list');
const cardTemplate = document.querySelector('#card-template').content;

const cardInfo = initialCards.map(function (item) {
return {
  name: item.name,
  link: item.link
};
});

function render() {
cardInfo.forEach(renderCard);
}

function renderCard({ name, link }) {
  const cardElement = cardTemplate.querySelector('.places__item').cloneNode(true);
  cardElement.querySelector('.card__image').src = link;
  cardElement.querySelector('.card__title').textContent = name;
  placesContainer.append(cardElement);
}

render();

const deleteButton = document.querySelector('.card__delete-button');
deleteButton.addEventListener('click', function () {
  const listItem = deleteButton.closest('.places__item');
  listItem.remove();
});

