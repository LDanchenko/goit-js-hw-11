import { fetchImages } from './api/pixabayapi';

export class RestAPI {
  constructor(perpage) {
    this.queryString = '';
    this.page = 1;
    this.totalHits = 0;
    this.perpage = perpage;
  }

  async searchImages() {
    const response = await fetchImages(this);
    return response.data;
  }

  nextPage() {
    this.page += 1;
  }
  resetPage() {
    this.page = 1;
  }

  setQuery(query) {
    this.queryString = query;
  }
}
