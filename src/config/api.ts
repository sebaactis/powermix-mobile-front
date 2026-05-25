import { Platform } from "react-native";

const PRODUCTION_URL = process.env.EXPO_PUBLIC_POWERMIX_API_URL!;
const SANDBOX_URL = process.env.EXPO_PUBLIC_POWERMIX_API_URL_SANDBOX!;

const USE_SANDBOX = false;

export const POWERMIX_API_URL = USE_SANDBOX ? SANDBOX_URL : PRODUCTION_URL;

export const SANDBOX_BASE_URL = Platform.select({
	android: "http://10.0.2.2:8080",
	default: "http://localhost:8080",
});
