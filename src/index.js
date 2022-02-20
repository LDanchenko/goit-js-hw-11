import './sass/main.scss';
import { Notify } from 'notiflix/build/notiflix-notify-aio';
import { fetchImages } from './js/api/pixabayapi';
import { handleApiData } from './js/handleData';
import pictureCard from './js/components/pictureCard.hbs';

const gallery = document.querySelector('.gallery');
const form = document.querySelector('.search-form');
const loadButton = document.querySelector('.button-more');

const searchImages = async query => {
  try {
    const response = await fetchImages(query);
    return response.data;
  } catch (error) {
    console.log(error.message);
  }
};

form.addEventListener('submit', async event => {
  event.preventDefault();
  const inputString = event.currentTarget.searchQuery.value.trim();
  if (!inputString) {
    Notify.warning('Please enter valid image name');
    return;
  }

  const images = await searchImages(inputString);
  const data = await handleApiData(images);
  gallery.innerHTML = pictureCard(data);
  toggleButton(data);
});

const toggleButton = data => {
  console.log(data);
  if (!data) {
    loadButton.classList.add('is-hidden');
  } else {
    loadButton.classList.remove('is-hidden');
  }
};
