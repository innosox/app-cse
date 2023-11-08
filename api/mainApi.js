import axios from "axios";

const protocol = "https";
const url = "api.emelec.com.ec"; /// produccion socios
const url_event = "cseapi.com"; /// produccion eventos

// const url = "192.168.137.175:4000"; // local
// const url = "192.168.137.111:8000"; // local
/* const mainApi = axios.create(); */
const baseUrl = `${protocol}://${url}/api`;
const baseUrl_event = `${protocol}://${url_event}/api`;

const mainApi = axios.create({
  baseURL: baseUrl,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

mainApi.interceptors.request.use(
  (config) => {
    return config;
  },
  (error) => {
    // send error message
    const { response } = error;

    return Promise.reject(response);
  }
);

mainApi.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // send error message
    const { response, message: errorMessage } = error;
    const message =
      response?.data?.message ||
      response?.data?.detail?.join(", ") ||
      errorMessage;

    if (!message && typeof response !== "string") {
      return Promise.reject("Error inesperado");
    }

    return Promise.reject(message || response);
  }
);

/** API PARA EVENTOS */
const mainApiEvent = axios.create({
  baseURL: baseUrl_event,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

mainApiEvent.interceptors.request.use(
  (config) => {
    return config;
  },
  (error) => {
    // send error message
    const { response } = error;

    return Promise.reject(response);
  }
);

mainApiEvent.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // send error message
    const { response, message: errorMessage } = error;
    const message =
      response?.data?.message ||
      response?.data?.detail?.join(", ") ||
      errorMessage;

    if (!message && typeof response !== "string") {
      return Promise.reject("Error inesperado");
    }

    return Promise.reject(message || response);
  }
);


export { baseUrl, mainApi, mainApiEvent };