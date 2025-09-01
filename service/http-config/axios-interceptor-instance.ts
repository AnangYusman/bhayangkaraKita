import axios from "axios";
import { postSignIn } from "../master-user";
import Cookies from "js-cookie";

const baseURL = "https://dev.mikulnews.com/api";

const refreshToken = Cookies.get("refresh_token");

const axiosInterceptorInstance = axios.create({
  baseURL,
  headers: {
    "Content-Type": "application/json",
    "X-Client-Key": "bb65b1ad-e954-4a1a-b4d0-74df5bb0b640"
  },
  withCredentials: true,
});

// Request interceptor
axiosInterceptorInstance.interceptors.request.use(
  (config) => {
    console.log("Config interceptor : ", config);
    const accessToken = Cookies.get("access_token");
    if (accessToken) {
      if (config.headers)
        config.headers.Authorization = "Bearer " + accessToken;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor
axiosInterceptorInstance.interceptors.response.use(
  (response) => {
    console.log("Response interceptor : ", response);
    return response;
  },
  async function (error) {
    console.log("Error interceptor : ", error.response.status);
    const originalRequest = error.config;
    if (error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      const data = {
        grantType: "refresh_token",
        refreshToken: refreshToken,
        clientId: "mediahub-app",
      };
      console.log("refresh token ", data);
      const res = await postSignIn(data);
      if (res?.error) {
        Object.keys(Cookies.get()).forEach((cookieName) => {
          Cookies.remove(cookieName);
        });
      } else {
        const { access_token } = res?.data;
        const { refresh_token } = res?.data;
        if (access_token) {
          Cookies.set("access_token", access_token);
          Cookies.set("refresh_token", refresh_token);
        }
      }

      return axiosInterceptorInstance(originalRequest);
    }

    return Promise.reject(error);
  }
);

export default axiosInterceptorInstance;
