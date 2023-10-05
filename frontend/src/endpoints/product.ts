const BASE_PATH = "/product";

export default class Product {
  constructor(private httpClient: RollingTypes.HttpClient) {
    this.httpClient = httpClient;
  }

  async getProducts(
    query?: RollingTypes.ProductQuery,
  ): RollingTypes.EndpointResponse {
    const searchQuery = {
      ...query,
    };
    return await this.httpClient.get(BASE_PATH, { searchQuery });
  }

  async getProductById(
    productId: string,
    variantId: string,
  ): RollingTypes.EndpointResponse {
    return await this.httpClient.get(
      `${BASE_PATH}/${productId}/variant/${variantId}`,
    );
  }
}
