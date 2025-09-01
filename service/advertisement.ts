import Cookies from "js-cookie";
import {
  httpDeleteInterceptor,
  httpPostInterceptor,
  httpPutInterceptor,
} from "./http-config/http-interceptor-services";
import { httpGet } from "./http-config/http-base-services";

const token = Cookies.get("access_token");

export async function createAdvertise(data: any) {
  const pathUrl = `/advertisement`;
  return await httpPostInterceptor(pathUrl, data);
}

export async function createMediaFileAdvertise(id: string | number, data: any) {
  const headers = {
    "Content-Type": "multipart/form-data",
  };
  const pathUrl = `/advertisement/upload/${id}`;
  return await httpPostInterceptor(pathUrl, data, headers);
}

export async function getAdvertise(data: any) {
  const pathUrl = `/advertisement?page=${data?.page || 1}&limit=${
    data?.limit || ""
  }&placement=${data?.placement || ""}&isPublish=${data.isPublish || ""}`;
  return await httpGet(pathUrl);
}

export async function getAdvertiseById(id: number) {
  const pathUrl = `/advertisement/${id}`;
  return await httpGet(pathUrl);
}

export async function editAdvertise(data: any) {
  const pathUrl = `/advertisement/${data?.id}`;
  return await httpPutInterceptor(pathUrl, data);
}

export async function editAdvertiseIsActive(data: any) {
  const pathUrl = `/advertisement/publish/${data?.id}?isPublish=${data?.isActive}`;
  return await httpPutInterceptor(pathUrl, data);
}

export async function deleteAdvertise(id: number) {
  const pathUrl = `/advertisement/${id}`;
  return await httpDeleteInterceptor(pathUrl);
}
