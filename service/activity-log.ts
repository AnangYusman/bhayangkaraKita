import { httpGet, httpPost } from "./http-config/http-base-services";

export async function saveActivity(data: any, token?: string) {
  const headers = token
    ? {
        "content-type": "application/json",
        Authorization: `Bearer ${token}`,
      }
    : {
        "content-type": "application/json",
      };
  const pathUrl = `/activity-logs`;
  return await httpPost(pathUrl, data, headers);
}

export async function getActivity() {
  const pathUrl = `/activity-logs/statistics`;
  return await httpGet(pathUrl);
}
