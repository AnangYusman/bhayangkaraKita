import Cookies from "js-cookie";
import { httpGet, httpPost } from "./http-config/http-base-services";
import {
  httpDeleteInterceptor,
  httpGetInterceptor,
  httpPostInterceptor,
  httpPutInterceptor,
} from "./http-config/http-interceptor-services";
import { hex } from "framer-motion";

const token = Cookies.get("access_token");
const id = Cookies.get("uie");

export async function listMasterUsers(data: any) {
  const headers = {
    "content-type": "application/json",
  };
  return await httpGet(`/users?page=${data.page}&limit=${data.limit}`, headers);
}

export async function createMasterUser(data: any) {
  const pathUrl = `/users`;
  return await httpPostInterceptor(pathUrl, data);
}

export async function emailValidation(data: any) {
  const pathUrl = `/users/email-validation`;
  return await httpPost(pathUrl, data);
}
export async function setupEmail(data: any) {
  const pathUrl = `/users/setup-email`;
  return await httpPost(pathUrl, data);
}

export async function getDetailMasterUsers(id: string) {
  const pathUrl = `/users/detail/${id}`;
  return await httpGetInterceptor(pathUrl);
}

export async function editMasterUsers(data: any, id: string) {
  const pathUrl = `/users/${id}`;
  return await httpPutInterceptor(pathUrl, data);
}

export async function deleteMasterUser(id: string) {
  const pathUrl = `/users/${id}`;
  return await httpDeleteInterceptor(pathUrl);
}

export async function postSignIn(data: any) {
  const pathUrl = `/users/login`;
  return await httpPost(pathUrl, data);
}

export async function getProfile(token?: string) {
  const headers = {
    "content-type": "application/json",
    Authorization: `Bearer ${token}`,
  };
  const pathUrl = `/users/info`;
  return await httpGet(pathUrl, headers);
}

export async function updateProfile(data: any) {
  const pathUrl = `/users/${id}`;
  return await httpPutInterceptor(pathUrl, data);
}
export async function savePassword(data: any) {
  const pathUrl = `/users/save-password`;
  return await httpPostInterceptor(pathUrl, data);
}

export async function resetPassword(data: any) {
  const headers = {
    "content-type": "application/json",
  };
  return await httpPost(`/users/reset-password`, headers, data);
}

export async function checkUsernames(username: string) {
  const headers = {
    "content-type": "application/json",
  };
  return await httpPost(`/users/forgot-password`, headers, { username });
}

export async function otpRequest(email: string, name: string) {
  const pathUrl = `/users/otp-request`;
  return await httpPost(pathUrl, { email, name });
}

export async function otpValidation(email: string, otpCode: string) {
  const pathUrl = `/users/otp-validation`;
  return await httpPost(pathUrl, { email, otpCode });
}

export async function postArticleComment(data: any) {
  const headers = token
    ? {
        "content-type": "application/json",
        Authorization: `Bearer ${token}`,
      }
    : {
        "content-type": "application/json",
      };
  return await httpPost(`/article-comments`, headers, data);
}

export async function editArticleComment(data: any, id: number) {
  const pathUrl = `/article-comments/${id}`;
  return await httpPutInterceptor(pathUrl, data);
}

export async function getArticleComment(id: string) {
  const pathUrl = `/article-comments?isPublic=true&articleId=${id}`;
  return await httpGet(pathUrl);
}

export async function deleteArticleComment(id: number) {
  const pathUrl = `/article-comments/${id}`;
  return await httpDeleteInterceptor(pathUrl);
}

export async function getCsrfToken() {
  const pathUrl = "csrf-token";
  const headers = {
    "content-type": "application/json",
  };
  return httpGet(pathUrl, headers);
}
