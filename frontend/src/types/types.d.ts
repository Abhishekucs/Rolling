declare namespace RollingTypes {
  /* eslint-disable @typescript-eslint/no-explicit-any */
  type EndpointResponse<Data = any> = Promise<HttpClientResponse<Data>>;

  interface HttpClientResponse<Data> {
    status: number;
    message: string;
    data: Data | null;
  }

  interface RequestOptions {
    headers?: Record<string, string>;
    searchQuery?: Record<string, any>;
    payload?: any;
  }

  type HttpClientMethod = (
    endpoint: string,
    config?: RequestOptions,
  ) => Promise<HttpClientResponse>;

  interface HttpClient {
    get: HttpClientMethod;
    post: HttpClientMethod;
    put: HttpClientMethod;
    patch: HttpClientMethod;
    delete: HttpClientMethod;
  }

  type HttpMethodTypes = keyof HttpClient;

  type ProductVariantItemSize = { [key: string]: number };

  interface ProductVariantItem {
    _id: string;
    color: string;
    size: ProductVariantItemSize[];
    price: number;
    images: string[];
    createdAt: number;
    modifiedAt: number;
  }

  interface Product {
    _id: string;
    category: string;
    name: string;
    description: string[];
    variants: ProductVariantItem;
    createdAt: number;
    modifiedAt: number;
  }

  type ProductQueryFilter = "expensive" | "new" | "cheap" | "old" | "instock";

  interface ProductQuery {
    category?: string;
    color?: string;
    filter?: ProductQueryFilter;
    skip?: number;
    limit?: number;
  }
}
