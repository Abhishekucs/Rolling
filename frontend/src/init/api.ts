import { buildHttpClient } from "../utils/api-adaptor";
import endpoints from "@/endpoints";

const DEV_SERVER_HOST = "http://localhost:4000";
const PROD_SERVER_HOST = "https://api.rollingcloth.in";

const API_PATH = "/v1";
const BASE_URL =
  window.location.hostname === "localhost" ? DEV_SERVER_HOST : PROD_SERVER_HOST;
const API_URL = `${BASE_URL}${API_PATH}`;

const httpClient = buildHttpClient(API_URL, 10000);

// API Endpoints
const Rolling = {
  users: new endpoints.Users(httpClient),
};

export default Rolling;
