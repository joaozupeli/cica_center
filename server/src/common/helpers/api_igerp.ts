import axios, { AxiosInstance } from "axios";
import fs from "fs";
import http from "http";
import https from "https";
const { ClientCredentials } = require("simple-oauth2");

class ApiIGERP {
  static httpsAgent: https.Agent;
  static oAuthClient: any;
  static oAuthAccessToken: any;

  static config () {
    const httpAgent = new http.Agent({ maxSockets: 1000 });
    let httpsAgent;
    if (process.env.API_IGERP_CERT_PFX) {
      httpsAgent = new https.Agent({
        pfx       : fs.readFileSync(process.env.API_IGERP_CERT_PFX),
        passphrase: process.env.API_IGERP_CERT_PASSPHRASE,
      });
    }
    this.httpsAgent = httpsAgent;

    this.oAuthClient = new ClientCredentials({
      client: {
        id: process.env.API_IGERP_CLIENT_ID,
        secret: process.env.API_IGERP_CLIENT_SECRET
      },
      auth: {
        tokenHost: process.env.API_IGERP_AUTH_URL
      },
      http: {
        ...httpsAgent && {
          agents: {
            http: httpAgent,
            https: httpsAgent,
            httpsAllowUnauthorized: new https.Agent({ maxSockets: 100, rejectUnauthorized: false })
          }
        }
      }
    });
  }

  static async api (): Promise<AxiosInstance> {
    if (!this.oAuthAccessToken || this.oAuthAccessToken.expired()) {
      this.oAuthAccessToken = await this.oAuthClient.getToken(/*{
        scope: "<scope>",
      }*/);
    }

    const axiosInstance = axios.create({
      baseURL: `${process.env.API_IGERP_URL}`,
      headers: {
        Authorization: `Bearer ${this.oAuthAccessToken.token.access_token}`
      },
      ...this.httpsAgent && { httpsAgent: this.httpsAgent },
    });

    return axiosInstance;
  }
}

export default ApiIGERP;
