import { PaginationRequest } from "@/types/globals";
import { httpGetInterceptor, httpPostInterceptor, httpPutInterceptor } from "./http-config/http-interceptor-services";
import { httpGet } from "./http-config/http-base-services";

export async function createCustomStaticPage(data: any) {
  const pathUrl = `/custom-static-pages`;
  return await httpPostInterceptor(pathUrl, data);
}

export async function editCustomStaticPage(data: any) {
  const pathUrl = `/custom-static-pages/${data.id}`;
  return await httpPutInterceptor(pathUrl, data);
}

export async function getCustomStaticPage(props: PaginationRequest) {
  const { page, limit, search } = props;
  const pathUrl = `/custom-static-pages?limit=${limit}&page=${page}&title=${search}`;
  return await httpGetInterceptor(pathUrl);
}

export async function getCustomStaticDetail(id: string) {
  return await httpGetInterceptor(`/custom-static-pages/${id}`);
}

export async function getCustomStaticDetailBySlug(slug: string) {
  const pathUrl = `/custom-static-pages/slug/${slug}`;
  return await httpGet(pathUrl);
}
