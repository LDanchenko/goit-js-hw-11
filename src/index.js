import './sass/main.scss';
import { Notify } from 'notiflix/build/notiflix-notify-aio';
import pictureCard from './js/components/pictureCard.hbs';
import { RestAPI } from './js/restapi';

const PERPAGE = 40;
const gallery = document.querySelector('.gallery');
const form = document.querySelector('.search-form');
const loadButton = document.querySelector('.button-more');

const searchQuery = new RestAPI(PERPAGE);

const handleSubmitButton = async event => {
  event.preventDefault();
  createMarkup(gallery, '');
  loadButton.classList.add('is-hidden');

  const query = event.currentTarget.searchQuery.value.trim();
  if (!query) {
    Notify.warning('Please enter valid image name');
    return;
  }
  searchQuery.setQuery(query);
  searchQuery.resetPage();

  const data = await getApiData();

  if (data) {
    searchQuery.totalHits = data.totalHits;
    Notify.info(`Hooray! We found ${searchQuery.totalHits} images`);
    createMarkup(gallery, pictureCard(data.hits));
    loadButton.classList.remove('is-hidden');
  }
};

const handleMoreButton = async () => {
  loadButton.classList.add('is-hidden');
  searchQuery.nextPage();
  const data = await getApiData();
  gallery.insertAdjacentHTML('beforeend', pictureCard(data.hits));

  if (searchQuery.totalHits <= searchQuery.page * searchQuery.perpage) {
    loadButton.classList.add('is-hidden');
    Notify.warning("We're sorry, but you've reached the end of search results.");
  } else {
    loadButton.classList.remove('is-hidden');
  }
};

const createMarkup = (elem, markup) => {
  elem.innerHTML = markup;
};

const getApiData = async () => {
  try {
    const data = await searchQuery.searchImages();
    if (data.total === 0) {
      Notify.failure('Sorry, there are no images matching your search query. Please try again.');
      return;
    }
    return { totalHits: data.totalHits, hits: data.hits };
  } catch (error) {
    Notify.failure('Oops, an error occurred');
  }
};

form.addEventListener('submit', handleSubmitButton);
loadButton.addEventListener('click', handleMoreButton);
