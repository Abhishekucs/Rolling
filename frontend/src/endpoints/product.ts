const BASE_PATH = "/product";

export default class Product {
  constructor(private httpClient: RollingTypes.HttpClient) {
    this.httpClient = httpClient;
  }

  async getProducts(
    query: RollingTypes.ProductQueryWithPagination,
  ): RollingTypes.EndpointResponse {
    const { category, color, filter, skip = 0, limit = 50 } = query;
    const searchQuery = {
      category,
      color,
      filter,
      skip: Math.max(skip, 0),
      limit: Math.max(Math.min(limit, 50), 0),
    };
    return await this.httpClient.get(BASE_PATH, { searchQuery });
  }

  async getProductById(productId: string): RollingTypes.EndpointResponse {
    return await this.httpClient.get(`${BASE_PATH}/${productId}`);
  }
}
