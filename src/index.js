import './sass/main.scss';
import { Notify } from 'notiflix/build/notiflix-notify-aio';
import { fetchImages } from './js/api/pixabayapi';
import { handleApiData } from './js/handleData';
import pictureCard from './js/components/pictureCard.hbs';
import { Pagination } from './js/pagination';

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
const searchQuery = new Pagination();

form.addEventListener('submit', async event => {
  event.preventDefault();
  loadButton.classList.add('is-hidden');
  const inputString = event.currentTarget.searchQuery.value.trim();
  if (!inputString) {
    Notify.warning('Please enter valid image name');
    return;
  }
  searchQuery.query = inputString;
  searchQuery.resetPage();
  const images = await searchImages(searchQuery);
  const data = await handleApiData(images);
  gallery.innerHTML = pictureCard(data);
  toggleButton(data);
});

loadButton.addEventListener('click', async () => {
  loadButton.classList.add('is-hidden');

  searchQuery.nextPage();
  const images = await searchImages(searchQuery);
  const data = await handleApiData(images);
  const markup = pictureCard(data);
  console.log(markup);
  gallery.insertAdjacentHTML('beforeend', markup);
  toggleButton(data);
});

const toggleButton = data => {
  if (!data) {
    loadButton.classList.add('is-hidden');
  } else {
    loadButton.classList.remove('is-hidden');
  }
};
