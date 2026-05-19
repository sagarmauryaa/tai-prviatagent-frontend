
import { HTTP_CODE } from "@/constant/http-codes";
import axios, {
  AxiosError,
  AxiosInstance,
  AxiosResponse,
  InternalAxiosRequestConfig,
} from "axios";
import Cookies from "js-cookie";

const { ERR_NETWORK, ECONNABORTED } = HTTP_CODE;

const axiosInstance: AxiosInstance = axios.create({
  baseURL: `${process.env.BACKEND_ENDPOINT}/api/v1/`,
});

/* Request interceptor — attaches the JWT Bearer token from cookies to every request */
axiosInstance.interceptors.request.use(
  (req: InternalAxiosRequestConfig<any>) => {
    const token = Cookies.get("access_token");
    if (token) {
      req.headers["Authorization"] = `Bearer ${token}`;
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
