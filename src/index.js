import SimpleLightbox from 'simplelightbox';
import { Notify } from 'notiflix/build/notiflix-notify-aio';
import debounce from 'lodash.debounce';
import './sass/main.scss';
import 'simplelightbox/dist/simple-lightbox.min.css';
import pictureCard from './js/components/pictureCard.hbs';
import { RestAPI } from './js/restapi';

const PERPAGE = 40;
const DEBOUNCE_DELAY = 170;
const gallery = document.querySelector('.gallery');
const form = document.querySelector('.search-form');
const loadSpinner = document.querySelector('.load-more');

const searchQuery = new RestAPI(PERPAGE);
let lightboxInstance = new SimpleLightbox('.gallery a');

const onSearch = async event => {
  event.preventDefault();
  clearGallery();
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
    gallery.innerHTML = pictureCard(data.hits);
    loadSpinner.classList.remove('is-hidden');
    gallery.addEventListener('click', handleCardClick);
    lightboxInstance.refresh();
    window.addEventListener('scroll', debounce(handleScroll, DEBOUNCE_DELAY));
  }
};

const onLoadMore = async () => {
  const topButtonPosition = loadSpinner.getBoundingClientRect().top;

  loadSpinner.classList.add('is-hidden');
  searchQuery.nextPage();
  const data = await getApiData();
  gallery.insertAdjacentHTML('beforeend', pictureCard(data.hits));
  lightboxInstance.refresh();
  if (searchQuery.totalHits <= searchQuery.page * searchQuery.perpage) {
    loadSpinner.classList.add('is-hidden');
    Notify.warning("We're sorry, but you've reached the end of search results.");
  } else {
    loadSpinner.classList.remove('is-hidden');
  }
  scrollPage(topButtonPosition);
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

const clearGallery = () => {
  gallery.innerHTML = '';
  loadSpinner.classList.add('is-hidden');
  gallery.removeEventListener('click', handleCardClick);
  window.removeEventListener('scroll', handleScroll);
};

const handleCardClick = event => {
  event.preventDefault();
  if (event.target.nodeName !== 'IMG') {
    return;
  }
  lightboxInstance.open('.gallery a');
};

const scrollPage = (top = 0) => {
  window.scrollBy({
    top,
    behavior: 'smooth',
  });
};

function handleScroll() {
  const buttonPositionTop = loadSpinner.getBoundingClientRect().top;
  if (buttonPositionTop > 0 && buttonPositionTop <= window.innerHeight) {
    onLoadMore();
  }
}

form.addEventListener('submit', onSearch);
