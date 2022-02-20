export class Pagination {
  constructor() {
    this.query = '';
    this.page = 1;
  }

  nextPage() {
    this.page += 1;
  }
  resetPage() {
    this.page = 1;
  }
}
