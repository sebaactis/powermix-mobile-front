import { useNavigation, useRoute } from "@react-navigation/native";
import { Pressable, StyleSheet, Text } from "react-native";
import { MAIN_COLOR } from "../../constant";

export default function ProdeFloatingButton() {
	const navigation = useNavigation<any>();
	const route = useRoute();

	// Hide the button when already on the PRODE screen
	if (route.name === "Prode") {
		return null;
	}

	return (
		<Pressable
			style={styles.fab}
			onPress={() => navigation.navigate("Prode")}
			accessibilityLabel="Abrir PRODE"
			accessibilityRole="button"
		>
			<Text style={styles.fabIcon}>⚽</Text>
		</Pressable>
	);
}

const styles = StyleSheet.create({
	fab: {
		position: "absolute",
		bottom: 100,
		right: 20,
		width: 60,
		height: 60,
		borderRadius: 30,
		backgroundColor: MAIN_COLOR,
		alignItems: "center",
		justifyContent: "center",
		elevation: 6,
		shadowColor: "#000",
		shadowOffset: { width: 0, height: 3 },
		shadowOpacity: 0.3,
		shadowRadius: 4,
		zIndex: 100,
	},
	fabIcon: {
		fontSize: 26,
	},
});
