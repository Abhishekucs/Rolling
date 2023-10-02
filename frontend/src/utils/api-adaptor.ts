import { Auth } from "@/init/firebase";
import axios, { AxiosRequestConfig, AxiosResponse } from "axios";
import { getIdToken } from "firebase/auth";

type AxiosClientMethod = (
  endpoint: string,
  config: AxiosRequestConfig,
) => Promise<AxiosResponse>;

type AxiosClientDataMethod = (
  endpoint: string,
  data: unknown,
  config: AxiosRequestConfig,
) => Promise<AxiosResponse>;

async function adaptRequestOptions(
  options: RollingTypes.RequestOptions,
): Promise<AxiosRequestConfig> {
  const currentUser = Auth?.currentUser;
  const idToken = currentUser && (await getIdToken(currentUser));

  return {
    params: options.searchQuery,
    data: options.payload,
    headers: {
      ...options.headers,
      Accept: "application/json",
      "Content-Type": "application/json",
      ...(idToken && { Authorization: `Bearer ${idToken}` }),
      //"X-Client-Version": CLIENT_VERSION,
    },
  };
}

function rollingClientMethod(
  clientMethod: AxiosClientMethod | AxiosClientDataMethod,
  methodType: RollingTypes.HttpMethodTypes,
): RollingTypes.HttpClientMethod {
  return async (
    endpoint: string,
    options: RollingTypes.RequestOptions = {},
  ): RollingTypes.EndpointResponse => {
    let errorMessage = "";

    try {
      const requestOptions: AxiosRequestConfig =
        await adaptRequestOptions(options);

      let response;
      if (methodType === "get" || methodType === "delete") {
        response = await (clientMethod as AxiosClientMethod)(
          endpoint,
          requestOptions,
        );
      } else {
        response = await (clientMethod as AxiosClientDataMethod)(
          endpoint,
          requestOptions.data,
          requestOptions,
        );
      }

      const { message, data } = response.data;

      return {
        status: response.status,
        message,
        data,
      };
    } catch (error) {
      const typedError = error as Error;
      errorMessage = typedError.message;

      if (axios.isAxiosError(typedError)) {
        return {
          status: typedError.response?.status ?? 500,
          message: typedError.message,
          ...typedError.response?.data,
        };
      }
    }

    return {
      status: 500,
      message: errorMessage,
      data: null,
    };
  };
}

export function buildHttpClient(
  baseURL: string,
  timeout: number,
): RollingTypes.HttpClient {
  const axiosClient = axios.create({
    baseURL,
    timeout,
  });

  return {
    get: rollingClientMethod(axiosClient.get, "get"),
    post: rollingClientMethod(axiosClient.post, "post"),
    put: rollingClientMethod(axiosClient.put, "put"),
    patch: rollingClientMethod(axiosClient.patch, "patch"),
    delete: rollingClientMethod(axiosClient.delete, "delete"),
  };
}
