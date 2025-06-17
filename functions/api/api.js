import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { Platform } from "react-native";

const API_URL = Platform.select({
  android: "http://10.0.2.2:8080/api/", // Android Emulator
  ios: "http://localhost:8080/api/", // iOS Simulator
  default: "http://localhost:8080/api/", // Fallback
});

const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

// api.interceptors.request.use(async (config) => {
//   try {
//     const token = await AsyncStorage.getItem("token");
//     if (token) {
//       config.headers.Authorization = `Bearer ${token}`;
//     }
//     return config;
//   } catch (error) {
//     console.error("Erro ao configurar requisição:", error);
//     return Promise.reject(error);
//   }
// });

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    console.error(
      "Erro na resposta da API:",
      error.response?.data || error.message
    );
    return Promise.reject(error);
  }
);

export default api;
