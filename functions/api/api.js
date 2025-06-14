import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { Platform } from "react-native";

const API_URL = Platform.select({
  android: "http://192.168.0.1:8080/api/", // Android (ajuste para o IP do seu computador)
  ios: "http://192.168.0.1:8080/api/", // iOS (ajuste para o IP do seu computador)
  default: "http://localhost:8080/api/", // Fallback
});

const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use(async (config) => {
  const token = await AsyncStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;
