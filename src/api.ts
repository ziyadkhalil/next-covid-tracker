import axios from "axios";

export const api = axios.create();

export const setApiToken = (token: string) => {
  api.defaults.headers.common.Authorization = `Bearer ${token}`;
};

export const clearApiToken = async () => {
  delete api.defaults.headers.common.Authorization;
};
