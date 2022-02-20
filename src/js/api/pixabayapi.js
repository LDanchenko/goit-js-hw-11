import config from './config';
import axios from 'axios';
const { API_KEY, API_URL } = config;
export const fetchImages = async searchQuery => {
  const images = await axios.get(API_URL, {
    params: {
      key: API_KEY,
      q: searchQuery.query,
      image_type: 'photo',
      orientation: 'horizontal',
      safesearch: true,
      page: searchQuery.page,
      per_page: 40,
    },
  });
  return images;
};
