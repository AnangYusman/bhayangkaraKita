import axios from "axios";

const baseURL = "https://dev.mikulnews.com/api";

const axiosBaseInstance = axios.create({
  baseURL,
  headers: {
    "Content-Type": "application/json",
    "X-Client-Key": "bb65b1ad-e954-4a1a-b4d0-74df5bb0b640"
  },
});

export default axiosBaseInstance;
