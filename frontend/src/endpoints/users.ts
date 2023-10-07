const BASE_PATH = "/user";

export default class Users {
  constructor(private httpClient: RollingTypes.HttpClient) {
    this.httpClient = httpClient;
  }

  async getUser(): RollingTypes.EndpointResponse {
    return await this.httpClient.get(BASE_PATH);
  }

  async create(
    name: string,
    email?: string,
    uid?: string,
  ): RollingTypes.EndpointResponse {
    const payload = {
      email,
      uid,
      name,
    };

    return await this.httpClient.post(`${BASE_PATH}/signup`, { payload });
  }

  async sendVerificationEmail(): RollingTypes.EndpointResponse {
    return await this.httpClient.get(`${BASE_PATH}/verificationEmail`);
  }

  async deleteUser(): RollingTypes.EndpointResponse {
    return await this.httpClient.delete(BASE_PATH);
  }
}
