import axiosDisestagesInstance from "./disestages-instance";
import axios from "axios";
const baseURL = "https://staging.disestages.com/api";

export async function httpPost(pathUrl: any, headers: any, data?: any) {
  const response = await axiosDisestagesInstance
    .post(pathUrl, data, { headers })
    .catch(function (error) {
      console.log(error);
      return error.response;
    });
  console.log("Response base svc : ", response);
  if (response?.status == 200 || response?.status == 201) {
    return {
      error: false,
      message: "success",
      data: response?.data,
    };
  } else {
    return {
      error: true,
      message: response?.data?.message || response?.data || null,
      data: null,
    };
  }
}

export async function httpGet(pathUrl: any, headers: any) {
  const response = await axiosDisestagesInstance
    .get(pathUrl, { headers })
    .catch(function (error) {
      console.log(error);
      return error.response;
    });
  console.log("Response base svc : ", response);
  if (response?.status == 200 || response?.status == 201) {
    return {
      error: false,
      message: "success",
      data: response?.data,
    };
  } else {
    return {
      error: true,
      message: response?.data?.message || response?.data || null,
      data: null,
    };
  }
}

export async function httpPost2(pathUrl: any, headers: any, data?: any) {
  const response = await axios
    .create({
      baseURL,
      headers: {
        "content-type": "application/json",
      },
    })
    .post(pathUrl, data, { headers })
    .catch(function (error) {
      console.log(error);
      return error.response;
    });
  console.log("Response base svc : ", response);
  if (response?.status == 200 || response?.status == 201) {
    return {
      error: false,
      message: "success",
      data: response?.data,
    };
  } else {
    return {
      error: true,
      message: response?.data?.message || response?.data || null,
      data: null,
    };
  }
}
