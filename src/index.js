import SimpleLightbox from 'simplelightbox';
import { Notify } from 'notiflix/build/notiflix-notify-aio';
import './sass/main.scss';
import 'simplelightbox/dist/simple-lightbox.min.css';
import pictureCard from './js/components/pictureCard.hbs';
import { RestAPI } from './js/restapi';

const PERPAGE = 40;
const gallery = document.querySelector('.gallery');
const form = document.querySelector('.search-form');
const loadButton = document.querySelector('.button-more');

const searchQuery = new RestAPI(PERPAGE);
let lightboxInstance = new SimpleLightbox('.gallery a');

const handleSubmitButtonClick = async event => {
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
    loadButton.classList.remove('is-hidden');
    gallery.addEventListener('click', handleCardClick);
    lightboxInstance.refresh();
    window.addEventListener('scroll', handleScroll);
  }
};

const handleLoadMore = async () => {
  const topButtonPosition = loadButton.getBoundingClientRect().top;

  loadButton.classList.add('is-hidden');
  searchQuery.nextPage();
  const data = await getApiData();
  gallery.insertAdjacentHTML('beforeend', pictureCard(data.hits));
  lightboxInstance.refresh();
  if (searchQuery.totalHits <= searchQuery.page * searchQuery.perpage) {
    loadButton.classList.add('is-hidden');
    Notify.warning("We're sorry, but you've reached the end of search results.");
  } else {
    loadButton.classList.remove('is-hidden');
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
  loadButton.classList.add('is-hidden');
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
  const buttonPositionTop = loadButton.getBoundingClientRect().top;
  if (buttonPositionTop > 0 && buttonPositionTop <= window.innerHeight) {
    handleLoadMore();
  }
}

form.addEventListener('submit', handleSubmitButtonClick);
