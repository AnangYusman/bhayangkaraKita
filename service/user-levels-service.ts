
import Cookies from "js-cookie";
import { httpGetInterceptor, httpPostInterceptor, httpPutInterceptor } from "./http-config/http-interceptor-services";
const token = Cookies.get("access_token");

export async function getAllUserLevels(data?: any) {
  const pathUrl = `user-levels?limit=${data?.limit || ""}&levelNumber=${
      data?.levelNumber || ""
    }&name=${data?.search || ""}&page=${data?.page || "1"}`
  return await httpGetInterceptor(pathUrl);
}
export async function getUserLevels(id: string) {
  return await httpGetInterceptor(`user-levels/${id}`);
}

export async function getAccountById(id: string) {
  return await httpGetInterceptor(`user-account/findById/${id}`);
}

export async function createUserLevels(data: any) {
  return await httpPostInterceptor(`user-levels`, data);
}

export async function editUserLevels(id: string, data: any) {
  return await httpPutInterceptor(`user-levels/${id}`, data);
}

export async function changeIsApproval(data: any) {
  return await httpPutInterceptor(`user-levels/enable-approval`, data);
}
