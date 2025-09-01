import axios from "axios";

const baseURL = "https://disestages.com/api";

const axiosDisestagesInstance = axios.create({
  baseURL,
  headers: {
    "content-type": "application/json",
  },
});

export default axiosDisestagesInstance;
