import { createNativeStackNavigator } from "@react-navigation/native-stack";
import TabNavigator from "./TabNavigator";
import ProdeScreen from "../screens/prode/ProdeScreen";
import ProdeFloatingButton from "../components/prode/ProdeFloatingButton";

const Stack = createNativeStackNavigator();

function MainTabsWithFab() {
	return (
		<>
			<TabNavigator />
			<ProdeFloatingButton />
		</>
	);
}

export default function AuthenticatedNavigator() {
	return (
		<Stack.Navigator screenOptions={{ headerShown: false }}>
			<Stack.Screen name="MainTabs" component={MainTabsWithFab} />
			<Stack.Screen name="Prode" component={ProdeScreen} />
		</Stack.Navigator>
	);
}
