declare namespace RollingTypes {
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
    config?: RequestOptions
  ) => Promise<HttpClientResponse>;

  interface HttpClient {
    get: HttpClientMethod;
    post: HttpClientMethod;
    put: HttpClientMethod;
    patch: HttpClientMethod;
    delete: HttpClientMethod;
  }

  type HttpMethodTypes = keyof HttpClient;
}
