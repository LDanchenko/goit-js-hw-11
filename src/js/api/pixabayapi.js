import config from './config';
import axios from 'axios';
const { API_KEY, API_URL } = config;
export const fetchImages = async query => {
  const images = await axios.get(API_URL, {
    params: {
      key: API_KEY,
      q: query,
      image_type: 'photo',
      orientation: 'horizontal',
      safesearch: true,
    },
  });
  return images;
};
