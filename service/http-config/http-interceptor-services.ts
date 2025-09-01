import { useRouter } from "next/navigation";
import Cookies from "js-cookie";
import axiosInterceptorInstance from "./axios-interceptor-instance";
import { getCsrfToken } from "../master-user";

const defaultHeaders = {
  "Content-Type": "application/json",
  "X-Client-Key": "bb65b1ad-e954-4a1a-b4d0-74df5bb0b640"
};

export async function httpGetInterceptor(pathUrl: any) {
  console.log("X-HEADERS : ", defaultHeaders)
  const response = await axiosInterceptorInstance
    .get(pathUrl, { headers: defaultHeaders })
    .catch((error) => error.response);
  console.log("Response interceptor : ", response);
  if (response?.status == 200 || response?.status == 201) {
    return {
      error: false,
      message: "success",
      data: response?.data,
    };
  } else if (response?.status == 401) {
    Cookies.set("is_logout", "true");
    window.location.href = "/";
    return {
      error: true,
    };
  } else {
    return {
      error: true,
      message: response?.data?.message || response?.data || null,
      data: null,
    };
  }
}

export async function httpPostInterceptor(pathUrl: any, data: any, headers?: any) {
  const resCsrf = await getCsrfToken();
  const csrfToken = resCsrf?.data?.csrf_token;

  const mergedHeaders = {
    ...defaultHeaders,
    ...headers,
    ...(csrfToken ? { "X-CSRF-TOKEN": csrfToken } : {}),
  };

  const response = await axiosInterceptorInstance
    .post(pathUrl, data, { headers: mergedHeaders })
    .catch((error) => error.response);
  console.log("Response interceptor : ", response);
  if (response?.status == 200 || response?.status == 201) {
    return {
      error: false,
      message: "success",
      data: response?.data,
    };
  } else if (response?.status == 401) {
    Cookies.set("is_logout", "true");
    window.location.href = "/";
  } else {
    return {
      error: true,
      message: response?.data?.message || response?.data || null,
      data: null,
    };
  }
}

export async function httpPutInterceptor(pathUrl: any, data: any, headers?: any) {
  const resCsrf = await getCsrfToken();
  const csrfToken = resCsrf?.data?.csrf_token;

  const mergedHeaders = {
    ...defaultHeaders,
    ...headers,
    ...(csrfToken ? { "X-CSRF-TOKEN": csrfToken } : {}),
  };
  const response = await axiosInterceptorInstance
    .put(pathUrl, data, { headers: mergedHeaders })
    .catch((error) => error.response);
  console.log("Response interceptor : ", response);
  if (response?.status == 200 || response?.status == 201) {
    return {
      error: false,
      message: "success",
      data: response?.data,
    };
  } else if (response?.status == 401) {
    Cookies.set("is_logout", "true");
    window.location.href = "/";
  } else {
    return {
      error: true,
      message: response?.data?.message || response?.data || null,
      data: null,
    };
  }
}

export async function httpDeleteInterceptor(pathUrl: any, headers?: any) {
   const resCsrf = await getCsrfToken();
  const csrfToken = resCsrf?.data?.csrf_token;

  const mergedHeaders = {
    ...defaultHeaders,
    ...headers,
    ...(csrfToken ? { "X-CSRF-TOKEN": csrfToken } : {}),
  };

  const response = await axiosInterceptorInstance
    .delete(pathUrl, { headers: mergedHeaders })
    .catch((error) => error.response);
  console.log("Response interceptor : ", response);
  if (response?.status == 200 || response?.status == 201) {
    return {
      error: false,
      message: "success",
      data: response?.data,
    };
  } else if (response?.status == 401) {
    Cookies.set("is_logout", "true");
    window.location.href = "/";
  } else {
    return {
      error: true,
      message: response?.data?.message || response?.data || null,
      data: null,
    };
  }
}
