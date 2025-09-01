import axiosBaseInstance from "./axios-base-instance";

const defaultHeaders = {
  "Content-Type": "application/json",
  "X-Client-Key": "bb65b1ad-e954-4a1a-b4d0-74df5bb0b640"
};

export async function httpGet(pathUrl: any, headers?: any) {  
  console.log("X-HEADERS : ", defaultHeaders)
  const mergedHeaders = {
    ...defaultHeaders,
    ...headers,
  };

  console.log("Merged Headers : ", mergedHeaders);

  const response = await axiosBaseInstance
    .get(pathUrl, { headers: mergedHeaders })
    .catch((error) => error.response);
  console.log("Response base svc : ", response);
  if (response?.data.success) {
    return {
      error: false,
      message: "success",
      data: response?.data,
    };
  } else {
    return {
      error: true,
      message: response?.data?.message || null,
      data: null,
    };
  }
}

export async function httpPost(pathUrl: any, data: any, headers?: any) {
  const mergedHeaders = {
    ...defaultHeaders,
    ...headers,
  };
  const response = await axiosBaseInstance
    .post(pathUrl, data, { headers: mergedHeaders })
    .catch(function (error) {
      console.log(error);
      return error.response;
    });
  console.log("Response base svc : ", response);
  if (response?.status == 200 || response?.status == 201) {
    return {
      error: false,
      message: "success",
      data: response?.data,
    };
  } else {
    return {
      error: true,
      message: response?.data?.message || response?.data || null,
      data: null,
    };
  }
}
