import AuthNavigator from "./AuthNavigator";
import AuthenticatedNavigator from "./AuthenticatedNavigator";
import { useAuth } from "../context/AuthContext";
import { ActivityIndicator, View } from "react-native";

const MainNavigator = () => {
	const { isAuthenticated, loading } = useAuth();

	if (loading) {
		return (
			<View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
				<ActivityIndicator />
			</View>
		);
	}

	return isAuthenticated ? <AuthenticatedNavigator /> : <AuthNavigator />;
};

export default MainNavigator;
