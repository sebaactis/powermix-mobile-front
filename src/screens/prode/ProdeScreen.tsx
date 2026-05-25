import { POWERMIX_API_URL } from "@/src/config/api";
import { useCallback, useEffect, useState } from "react";
import { useNavigation } from "@react-navigation/native";
import {
	ActivityIndicator,
	FlatList,
	Pressable,
	RefreshControl,
	StyleSheet,
	Text,
	View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Toast from "react-native-toast-message";
import Icon from "react-native-vector-icons/FontAwesome";
import MaterialIcon from "react-native-vector-icons/MaterialCommunityIcons";
import { AuthApi } from "@/src/helpers/authApi";
import { useAuth } from "@/src/context/AuthContext";
import { ProdeMatch, ProdePrediction } from "@/src/types/prode";
import ProdeMatchCard from "../../components/prode/ProdeMatchCard";
import ProdePredictionModal from "../../components/prode/ProdePredictionModal";
import { CARD_BG, MAIN_COLOR, STRONG_TEXT, SUBTEXT } from "../../constant";

type ViewState =
	| { type: "loading" }
	| { type: "empty" }
	| { type: "unavailable" }
	| { type: "error"; message: string }
	| { type: "list"; matches: ProdeMatch[] };

function InfoHeader() {
	return (
		<View style={styles.infoCard}>
			<View style={styles.infoIconRow}>
				<View style={styles.infoIconCircle}>
					<MaterialIcon name="soccer" size={24} color={STRONG_TEXT} />
				</View>
				<View style={{ flex: 1 }}>
					<Text style={styles.infoTitle}>¿Cómo funciona?</Text>
					<Text style={styles.infoDesc}>
						Pronosticá el resultado exacto de cada partido de Argentina en
						los 90 minutos reglamentarios. Si acertás, ¡ganás un batido o
						voucher de regalo!
					</Text>
				</View>
			</View>
		</View>
	);
}

export default function ProdeScreen() {
	const navigation = useNavigation<any>();
	const { signOut } = useAuth();
	const [state, setState] = useState<ViewState>({ type: "loading" });
	const [refreshing, setRefreshing] = useState(false);
	const [editingMatch, setEditingMatch] = useState<ProdeMatch | null>(null);

	const fetchMatches = useCallback(
		async (isRefresh = false) => {
			if (isRefresh) setRefreshing(true);
			else setState({ type: "loading" });

			try {
				const res = await AuthApi<ProdeMatch[]>(
					`${POWERMIX_API_URL}/api/v1/prode/matches`,
					"GET",
					signOut,
				);

				if (res.status === 404) {
					setState({ type: "unavailable" });
					return;
				}

				if (!res.success || !res.data) {
					const msg = res.error?.message ?? "Error al cargar partidos";
					setState({ type: "error", message: msg });
					return;
				}

				if (res.data.length === 0) {
					setState({ type: "empty" });
					return;
				}

				setState({ type: "list", matches: res.data });
			} catch {
				setState({
					type: "error",
					message: "Error de red al conectar con el servidor",
				});
			} finally {
				setRefreshing(false);
			}
		},
		[signOut],
	);

	useEffect(() => {
		fetchMatches();
	}, [fetchMatches]);

	const handleSavePrediction = useCallback(
		async (matchId: string, argentinaGoals: number, opponentGoals: number) => {
			const res = await AuthApi<ProdePrediction>(
				`${POWERMIX_API_URL}/api/v1/prode/matches/${matchId}/prediction`,
				"PUT",
				signOut,
				{ argentina_goals: argentinaGoals, opponent_goals: opponentGoals },
			);

			if (res.status === 409) {
				Toast.show({
					type: "appWarning",
					text1: "La hora límite para predecir este partido ya pasó",
				});
				setEditingMatch(null);
				await fetchMatches();
				return;
			}

			if (!res.success || !res.data) {
				const msg = res.error?.message ?? "Error al guardar la predicción";
				Toast.show({ type: "appError", text1: msg });
				return;
			}

			Toast.show({
				type: "appSuccess",
				text1: matchId ? "Predicción actualizada" : "Predicción guardada",
			});

			// Update local state with the returned prediction
			setState((prev) => {
				if (prev.type !== "list") return prev;
				return {
					...prev,
					matches: prev.matches.map((m) =>
						m.id === matchId ? { ...m, my_prediction: res.data } : m,
					),
				};
			});

			setEditingMatch(null);
		},
		[signOut, fetchMatches],
	);

	const renderContent = () => {
		switch (state.type) {
			case "loading":
				return (
					<View style={styles.centered}>
						<ActivityIndicator size="large" color={STRONG_TEXT} />
					</View>
				);

			case "empty":
				return (
					<View style={styles.centered}>
						<Icon name="exclamation-circle" size={48} color={SUBTEXT} />
						<Text style={styles.emptyTitle}>
							Todavía no hay partidos del PRODE
						</Text>
						<Text style={styles.emptySub}>
							Volvé a revisar más cerca del Mundial 2026
						</Text>
					</View>
				);

			case "unavailable":
				return (
					<View style={styles.centered}>
						<Icon name="ban" size={48} color={SUBTEXT} />
						<Text style={styles.emptyTitle}>
							PRODE no está disponible en este momento
						</Text>
						<Text style={styles.emptySub}>
							Puede que la funcionalidad esté desactivada temporalmente
						</Text>
						<Pressable style={styles.retryBtn} onPress={() => fetchMatches()}>
							<Text style={styles.retryBtnText}>Reintentar</Text>
						</Pressable>
					</View>
				);

			case "error":
				return (
					<View style={styles.centered}>
						<Icon name="times-circle" size={48} color={SUBTEXT} />
						<Text style={styles.emptyTitle}>{state.message}</Text>
						<Pressable style={styles.retryBtn} onPress={() => fetchMatches()}>
							<Text style={styles.retryBtnText}>Reintentar</Text>
						</Pressable>
					</View>
				);

			case "list":
				return (
					<FlatList
						data={state.matches}
						keyExtractor={(item) => item.id}
						ListHeaderComponent={<InfoHeader />}
						renderItem={({ item }) => (
							<ProdeMatchCard
								match={item}
								onPressEdit={setEditingMatch}
								onPressVouchers={() =>
									navigation.navigate("MainTabs", {
										screen: "Vouchers",
									})
								}
							/>
						)}
						contentContainerStyle={styles.list}
						refreshControl={
							<RefreshControl
								refreshing={refreshing}
								onRefresh={() => fetchMatches(true)}
								tintColor={STRONG_TEXT}
							/>
						}
					/>
				);
		}
	};

	return (
		<SafeAreaView style={styles.screen} edges={["top"]}>
			<View style={styles.header}>
				<Pressable
					style={styles.headerBtnLeft}
					onPress={() => navigation.goBack()}
					hitSlop={8}
				>
					<Icon name="arrow-left" size={20} color={STRONG_TEXT} />
				</Pressable>
				<Text style={styles.headerTitle}>PRODE</Text>
				<View style={styles.headerBtnLeft} />
			</View>

			{renderContent()}

			<ProdePredictionModal
				visible={editingMatch !== null}
				matchStage={editingMatch?.stage ?? ""}
				matchOpponent={editingMatch?.opponent ?? ""}
				initialArgentinaGoals={
					editingMatch?.my_prediction?.argentina_goals ?? null
				}
				initialOpponentGoals={
					editingMatch?.my_prediction?.opponent_goals ?? null
				}
				onSave={async (a, o) => {
					if (!editingMatch) return;
					await handleSavePrediction(editingMatch.id, a, o);
				}}
				onClose={() => setEditingMatch(null)}
			/>
		</SafeAreaView>
	);
}

const styles = StyleSheet.create({
	screen: {
		flex: 1,
		backgroundColor: "#1E1E1E",
	},
	header: {
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "space-between",
		paddingHorizontal: 16,
		paddingVertical: 12,
	},
	headerBtnLeft: {
		width: 32,
		height: 32,
		alignItems: "center",
		justifyContent: "center",
	},
	headerTitle: {
		fontSize: 18,
		fontWeight: "700",
		color: STRONG_TEXT,
	},
	centered: {
		flex: 1,
		alignItems: "center",
		justifyContent: "center",
		paddingHorizontal: 32,
	},
	emptyTitle: {
		fontSize: 17,
		fontWeight: "600",
		color: STRONG_TEXT,
		textAlign: "center",
		marginTop: 16,
		marginBottom: 8,
	},
	emptySub: {
		fontSize: 14,
		color: SUBTEXT,
		textAlign: "center",
		lineHeight: 20,
	},
	retryBtn: {
		marginTop: 24,
		paddingHorizontal: 32,
		paddingVertical: 12,
		borderRadius: 8,
		backgroundColor: "#be185d",
	},
	retryBtnText: {
		color: STRONG_TEXT,
		fontSize: 15,
		fontWeight: "600",
	},
	list: {
		padding: 16,
		paddingBottom: 100,
	},
	infoCard: {
		backgroundColor: CARD_BG,
		borderRadius: 12,
		padding: 16,
		marginBottom: 16,
	},
	infoIconRow: {
		flexDirection: "row",
		alignItems: "flex-start",
		gap: 14,
	},
	infoIconCircle: {
		width: 44,
		height: 44,
		borderRadius: 22,
		backgroundColor: MAIN_COLOR + "25",
		alignItems: "center",
		justifyContent: "center",
	},
	infoTitle: {
		fontSize: 15,
		fontWeight: "700",
		color: STRONG_TEXT,
		marginBottom: 6,
	},
	infoDesc: {
		fontSize: 13,
		color: SUBTEXT,
		lineHeight: 19,
	},
});
