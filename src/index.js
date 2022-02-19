import './sass/main.scss';
import { fetchImages } from './js/api/pixabayapi';
import { handleApiData } from './js/handleData';
import pictureCard from './js/components/pictureCard';

// // fetchImages().then(handleApiData).catch(console.log);
const gallery = document.querySelector('.gallery');
fetchImages().then(response => renderMarkup(response.data.hits)); //тут проверка

function renderMarkup(data) {
  gallery.innerHTML = pictureCard(data);
}
