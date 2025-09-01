import { PaginationRequest } from "@/types/globals";
import Cookies from "js-cookie";
import { httpDeleteInterceptor, httpGetInterceptor, httpPostInterceptor, httpPutInterceptor } from "./http-config/http-interceptor-services";

const token = Cookies.get("access_token");

export async function createMagazine(data: any) {
  const pathUrl = `/magazines`;
  return await httpPostInterceptor(pathUrl, data);
}

export async function getListMagazine(props: PaginationRequest) {
  const { page, limit, search, startDate, endDate } = props;
  return await httpGetInterceptor(
    `/magazines?limit=${limit}&page=${page}&title=${search}&startDate=${
      startDate || ""
    }&endDate=${endDate || ""}`
  );
}

export async function updateMagazine(id: string, data: any) {
  const pathUrl = `/magazines/${id}`;
  return await httpPutInterceptor(pathUrl, data);
}

export async function getMagazineById(id: string) {
  return await httpGetInterceptor(`/magazines/${id}`);
}

export async function deleteMagazine(id: string) {
  return await httpDeleteInterceptor(`magazines/${id}`);
}

export async function uploadMagazineFile(id: string, data: any) {
  const headers = {
    "content-type": "multipart/form-data",
  };
  return await httpPostInterceptor(`/magazine-files/${id}`, data, headers);
}

export async function uploadMagazineThumbnail(id: string, data: any) {
  const headers = {
    "content-type": "multipart/form-data",
  };
  return await httpPostInterceptor(`/magazines/thumbnail/${id}`, data, headers);
}

export async function deleteMagazineFiles(id: number) {
  return await httpDeleteInterceptor(`magazine-files/${id}`);
}
