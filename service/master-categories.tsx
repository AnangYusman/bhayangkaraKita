import Cookies from "js-cookie";
import { httpDeleteInterceptor, httpGetInterceptor, httpPostInterceptor, httpPutInterceptor } from "./http-config/http-interceptor-services";

const token = Cookies.get("access_token");

export async function createCategory(data: any) {
  const pathUrl = `/article-categories`;
  return await httpPostInterceptor(pathUrl, data);
}

export async function updateCategory(id: string, data: any) {
  const pathUrl = `/article-categories/${id}`;
  return await httpPutInterceptor(pathUrl, data);
}

export async function getCategoryById(id: number) {
  return await httpGetInterceptor(`/article-categories/${id}`);
}

export async function deleteCategory(id: number) {
  return await httpDeleteInterceptor(`article-categories/${id}`);
}

export async function uploadCategoryThumbnail(id: string, data: any) {
  const headers = {
    "content-type": "multipart/form-data",
  };
  return await httpPostInterceptor(`/article-categories/thumbnail/${id}`, data, headers);
}
