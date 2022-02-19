import './sass/main.scss';
import { Notify } from 'notiflix/build/notiflix-notify-aio';
import { fetchImages } from './js/api/pixabayapi';
import { handleApiData } from './js/handleData';
import pictureCard from './js/components/pictureCard';

const gallery = document.querySelector('.gallery');
const form = document.querySelector('.search-form');

const searchImages = async query => {
  try {
    const response = await fetchImages(query);
    handleApiData(response.data);
  } catch (error) {
    console.log(error.message);
  }
};

form.addEventListener('submit', event => {
  event.preventDefault();
  const inputString = event.currentTarget.searchQuery.value.trim();
  if (!inputString) {
    Notify.warning('Please enter valid image name');
    return;
  }
  searchImages(inputString);
});
