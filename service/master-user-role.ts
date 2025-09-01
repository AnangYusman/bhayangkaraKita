import Cookies from "js-cookie";
import { httpDeleteInterceptor, httpGetInterceptor, httpPostInterceptor } from "./http-config/http-interceptor-services";

const token = Cookies.get("access_token");

export async function listUserRole(data: any) {
  return await httpGetInterceptor(
    `/user-roles?limit=${data.limit}&page=${data.page}`
  );
}

export async function createMasterUserRole(data: any) {
  const pathUrl = `/user-roles`;
  return await httpPostInterceptor(pathUrl, data);
}

export async function getMasterUserRoleById(id: any) {
  const headers = {
    "content-type": "application/json",
  };
  return await httpGetInterceptor(`/user-roles/${id}`);
}

export async function deleteMasterUserRole(id: string) {
  const headers = {
    "content-type": "application/json",
  };
  return await httpDeleteInterceptor(`/user-roles/${id}`);
}
