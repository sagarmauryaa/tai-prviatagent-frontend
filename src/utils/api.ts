
import { HTTP_CODE } from "@/constant/http-codes";
import axios, {
  AxiosError,
  AxiosInstance,
  AxiosResponse,
  InternalAxiosRequestConfig,
} from "axios";
import { V4_APIS } from "./config";

const { ERR_NETWORK, ECONNABORTED } = HTTP_CODE;

const axiosInstance: AxiosInstance = axios.create({ 
  // baseURL: 'http://localhost:4300/dashboard/' 
  baseURL: `${V4_APIS}/dashboard/` 
});

/* The `axiosInstance.interceptors.request.use()` function is adding a request interceptor to the Axios
instance. This interceptor is used to modify the outgoing request before it is sent.. */

axiosInstance.interceptors.request.use(
  (req: InternalAxiosRequestConfig<any>) => {
    // const X_ACCESS_KEY = process.env.REACT_APP_X_ACCESS_ENCRYPTED_API_KEY;
    const X_ACCESS_KEY = "8521404a389eb8d58a46cd1a8c84426a:0ce6bc92069524e9ece234a8c0aeab24c9b852ff361eceb2757e1b687c637f0ef5edb5ef3207c66d322df5e20ce483aa2db5b7a85daa75dc1f7b6551ad7c89c78c885a70b5180aac97efb853aa40c446";


    if (X_ACCESS_KEY && X_ACCESS_KEY.trim() !== "") {
      req.headers["x-api-key"] = X_ACCESS_KEY;
    }
    return req;
  },
  (error: AxiosError) => {
    return Promise.reject(error.message);
  }
);

axiosInstance.interceptors.response.use(
  (response: AxiosResponse<any, any>) => {
    // Any status code that lie within the range of 2xx cause this function to trigger
    // Do something with response data
    return response;
  },
  (error: AxiosError) => {
    // Any status codes that falls outside the range of 2xx cause this function to trigger
    // Handle errors globally

    if (error.response) {
      console.error("Response error:", error);

      return Promise.reject(error?.response?.data);
    } else {
      // api server not working
      if (error.code === ERR_NETWORK) {
        return Promise.reject({ error: "Server Issue" });
      }

      if (error.code === ECONNABORTED) {
        return Promise.reject({ error: "Internal Server Error" });
      }

      return Promise.reject({ error: error.message });
    }
  }
);

export default axiosInstance;
