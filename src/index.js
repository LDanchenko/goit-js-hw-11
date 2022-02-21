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
  const response = await fetchImages(query);
  const data = await response.data;
  return data;
};

const searchQuery = new Pagination();

form.addEventListener('submit', async event => {
  gallery.innerHTML = '';
  event.preventDefault();
  loadButton.classList.add('is-hidden');
  const inputString = event.currentTarget.searchQuery.value.trim();
  if (!inputString) {
    Notify.warning('Please enter valid image name');
    return;
  }
  searchQuery.query = inputString;
  searchQuery.resetPage();
  try {
    const images = await searchImages(searchQuery);

    return images;
  } catch (error) {
    Notify.error('Oops, an error occured');
  }
  const data = await handleApiData(images);
  if (data) {
    searchQuery.totalHits = images.totalHits;
    gallery.innerHTML = pictureCard(data);
    loadButton.classList.remove('is-hidden');
  }
});

loadButton.addEventListener('click', async () => {
  loadButton.classList.add('is-hidden');
  searchQuery.nextPage();
  const images = await searchImages(searchQuery);
  const data = await handleApiData(images);
  const markup = pictureCard(data);
  console.log(markup);
  gallery.insertAdjacentHTML('beforeend', markup);
  loadButton.classList.remove('is-hidden');
  if (searchQuery.totalHits <= searchQuery.page * 40) {
    loadButton.classList.add('is-hidden');
    Notify.warning("We're sorry, but you've reached the end of search results.");
  }
});
