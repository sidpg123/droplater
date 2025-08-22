import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import axios from 'axios'
import {  getCookie, useGetCookie } from "cookies-next";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}



export const axiosClient = axios.create({
  baseURL: 'http://localhost:3000'
});

axiosClient.interceptors.request.use(
  async (config) => {
    // const session = await getSession();
    // const getCookie = useGetCookie();
    // const token = session?.accessToken;

    const token = getCookie("passKey")
    console.log("token",token)
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  }
  , (error) => {
    return Promise.reject(error);
  }
);