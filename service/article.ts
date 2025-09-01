import { PaginationRequest } from "@/types/globals";
import { httpGet } from "./http-config/http-base-services";
import { httpDeleteInterceptor, httpGetInterceptor, httpPostInterceptor, httpPutInterceptor } from "./http-config/http-interceptor-services";

export async function getListArticle(props: PaginationRequest) {
  const {
    page,
    limit,
    search,
    startDate,
    endDate,
    isPublish,
    category,
    sortBy,
    sort,
    categorySlug,
    isBanner,
  } = props;
  return await httpGet(
    `/articles?limit=${limit}&page=${page}&isPublish=${
      isPublish === undefined ? "" : isPublish
    }&title=${search}&startDate=${startDate || ""}&endDate=${
      endDate || ""
    }&categoryId=${category || ""}&sortBy=${sortBy || "created_at"}&sort=${
      sort || "asc"
    }&category=${categorySlug || ""}&isBanner=${isBanner || ""}`,
    null
  );
}

export async function getArticlePagination(props: PaginationRequest) {
  const {
    page,
    limit,
    search,
    startDate,
    endDate,
    category,
    sortBy,
    sort,
    categorySlug,
    isBanner,
  } = props;
  return await httpGetInterceptor(
    `/articles?limit=${limit}&page=${page}&title=${search}&startDate=${startDate || ""}&endDate=${
      endDate || ""
    }&categoryId=${category || ""}&sortBy=${sortBy || "created_at"}&sort=${
      sort || "asc"
    }&category=${categorySlug || ""}&isBanner=${isBanner || ""}`
  );
}

export async function getTopArticles(props: PaginationRequest) {
  const { page, limit, search, startDate, endDate, isPublish, category } =
    props;
  const headers = {
    "content-type": "application/json",
  };
  return await httpGet(
    `/articles?limit=${limit}&page=${page}&isPublish=${
      isPublish === undefined ? "" : isPublish
    }&title=${search}&startDate=${startDate || ""}&endDate=${
      endDate || ""
    }&category=${category || ""}&sortBy=view_count&sort=desc`,
    headers
  );
}

export async function createArticle(data: any) {
  const pathUrl = `/articles`;
  return await httpPostInterceptor(pathUrl, data);
}

export async function createArticleSchedule(data: any) {
  const pathUrl = `/articles/publish-scheduling?id=${data.id}&date=${data.date}`;
  return await httpPostInterceptor(pathUrl, data);
}

export async function updateArticle(id: string, data: any) {
  const pathUrl = `/articles/${id}`;
  return await httpPutInterceptor(pathUrl, data);
}

export async function getArticleById(id: any) {
  const headers = {
    "content-type": "application/json",
  };
  return await httpGet(`/articles/${id}`, headers);
}

export async function deleteArticle(id: string) {
  const headers = {
    "content-type": "application/json",
  };
  return await httpDeleteInterceptor(`articles/${id}`, headers);
}

export async function getArticleByCategory() {
  return await httpGetInterceptor(`/article-categories?limit=1000`);
}
export async function getCategoryPagination(data: any) {
  return await httpGet(
    `/article-categories?limit=${data?.limit}&page=${data?.page}&title=${data?.search}`
  );
}

export async function uploadArticleFile(id: string, data: any) {
  const headers = {
    "content-type": "multipart/form-data",
  };
  return await httpPostInterceptor(`/article-files/${id}`, data, headers);
}

export async function uploadArticleThumbnail(id: string, data: any) {
  const headers = {
    "content-type": "multipart/form-data",
  };
  return await httpPostInterceptor(`/articles/thumbnail/${id}`, data, headers);
}

export async function deleteArticleFiles(id: number) {
  const headers = {
    "content-type": "multipart/form-data",
  };
  return await httpDeleteInterceptor(`article-files/${id}`, headers);
}

export async function getUserLevelDataStat(startDate: string, endDate: string) {
  return await httpGet(
    `/articles/statistic/user-levels?startDate=${startDate}&endDate=${endDate}`
  );
}
export async function getStatisticMonthly(year: string) {
  return await httpGet(`/articles/statistic/monthly?year=${year}`);
}
export async function getStatisticMonthlyFeedback(year: string) {
  return await httpGet(`/feedbacks/statistic/monthly?year=${year}`);
}
export async function getStatisticSummary() {
  return await httpGet(`/articles/statistic/summary`);
}

export async function submitApproval(data: {
  articleId: number;
  message: string;
  statusId: number;
}) {
  return await httpPostInterceptor(`/article-approvals`, data);
}

export async function updateIsBannerArticle(id: number, status: boolean) {
  const headers = {
    "content-type": "application/json",
  };
  const pathUrl = `/articles/banner/${id}?isBanner=${status}`;
  return await httpPutInterceptor(pathUrl, headers);
}
