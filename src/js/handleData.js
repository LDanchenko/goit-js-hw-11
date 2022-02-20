import { Notify } from 'notiflix/build/notiflix-notify-aio';

export const handleApiData = data => {
  if (data.total === 0) {
    Notify.failure('Sorry, there are no images matching your search query. Please try again.');
    return '';
  }
  return data.hits;
};
