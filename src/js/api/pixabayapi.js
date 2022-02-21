import config from './config';
import axios from 'axios';
const { API_KEY, API_URL } = config;
export const fetchImages = async request => {
  const images = await axios.get(API_URL, {
    params: {
      key: API_KEY,
      q: request.queryString,
      image_type: 'photo',
      orientation: 'horizontal',
      safesearch: true,
      page: request.page,
      per_page: request.perpage,
    },
  });
  return images;
};
