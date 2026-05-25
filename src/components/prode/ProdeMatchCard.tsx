import { Pressable, StyleSheet, Text, View } from "react-native";
import { ProdeMatch } from "@/src/types/prode";
import { CARD_BG, MAIN_COLOR, SUBTEXT, STRONG_TEXT } from "../../constant";

type Props = {
	match: ProdeMatch;
	onPressEdit: (match: ProdeMatch) => void;
	onPressVouchers: () => void;
};

function formatDate(iso: string): string {
	const d = new Date(iso);
	const day = String(d.getDate()).padStart(2, "0");
	const month = String(d.getMonth() + 1).padStart(2, "0");
	const hours = String(d.getHours()).padStart(2, "0");
	const mins = String(d.getMinutes()).padStart(2, "0");
	return `${day}/${month} ${hours}:${mins}`;
}

function formatStage(stage: string): string {
	return stage.replace(/_/g, " ");
}

function getStatusLabel(status: string): string {
	const labels: Record<string, string> = {
		SCHEDULED: "Programado",
		OPEN: "Abierto",
		CLOSED: "Cerrado",
		RESULT_RECORDED: "Resultado cargado",
		EVALUATED: "Evaluado",
		CANCELLED: "Cancelado",
		DRAFT: "Borrador",
	};
	return labels[status] ?? status;
}

function getStatusColor(status: string): string {
	const colors: Record<string, string> = {
		SCHEDULED: "#6b7280",
		OPEN: "#22c55e",
		CLOSED: "#ef4444",
		RESULT_RECORDED: "#f59e0b",
		EVALUATED: "#14b8a6",
		CANCELLED: "#6b7280",
		DRAFT: "#6b7280",
	};
	return colors[status] ?? "#6b7280";
}

export default function ProdeMatchCard({
	match,
	onPressEdit,
	onPressVouchers,
}: Props) {
	return (
		<View style={styles.card}>
			<View style={styles.stageRow}>
				<Text style={styles.stage}>{formatStage(match.stage)}</Text>
				<View
					style={[
						styles.statusBadge,
						{ backgroundColor: getStatusColor(match.status) + "22" },
					]}
				>
					<View
						style={[
							styles.statusDot,
							{ backgroundColor: getStatusColor(match.status) },
						]}
					/>
					<Text
						style={[styles.statusText, { color: getStatusColor(match.status) }]}
					>
						{getStatusLabel(match.status)}
					</Text>
				</View>
			</View>

			<Text style={styles.opponent}>🇦🇷 Argentina vs {match.opponent}</Text>

			<View style={styles.infoRow}>
				<Text style={styles.infoIcon}>📅</Text>
				<Text style={styles.infoText}>{formatDate(match.kickoff_at)}</Text>
			</View>

			<View style={styles.infoRow}>
				<Text style={styles.infoIcon}>⏳</Text>
				<Text style={styles.infoText}>
					Cierre: {formatDate(match.cutoff_at)}
				</Text>
			</View>

			{match.is_open && (
				<View style={styles.openBadge}>
					<Text style={styles.openBadgeText}>Abierto a predicciones</Text>
				</View>
			)}

			{match.argentina_goals !== null && match.opponent_goals !== null && (
				<View style={styles.resultBox}>
					<Text style={styles.resultLabel}>Resultado final:</Text>
					<Text style={styles.resultScore}>
						{match.argentina_goals} - {match.opponent_goals}
					</Text>
				</View>
			)}

			{match.my_prediction && (
				<View style={styles.predictionBox}>
					<Text style={styles.predictionLabel}>Tu predicción:</Text>
					<Text style={styles.predictionScore}>
						{match.my_prediction.argentina_goals} -{" "}
						{match.my_prediction.opponent_goals}
					</Text>
					<PredictioStatusBadge status={match.my_prediction.status} />
				</View>
			)}

			{match.is_open && (
				<Pressable style={styles.editBtn} onPress={() => onPressEdit(match)}>
					<Text style={styles.editBtnText}>
						{match.my_prediction ? "Editar predicción" : "Predecir"}
					</Text>
				</Pressable>
			)}

			{match.my_prediction?.status === "CORRECT" && (
				<View style={styles.rewardBox}>
					<Text style={styles.rewardIcon}>🎉</Text>
					<View style={styles.rewardContent}>
						<Text style={styles.rewardTitle}>¡Ganaste un batido/voucher!</Text>
						<Text style={styles.rewardSub}>
							Podés verlo en tu sección de premios
						</Text>
						<Pressable style={styles.rewardBtn} onPress={onPressVouchers}>
							<Text style={styles.rewardBtnText}>Ver en Mis Premios</Text>
						</Pressable>
					</View>
				</View>
			)}
		</View>
	);
}

function PredictioStatusBadge({ status }: { status: string }) {
	const colors: Record<string, string> = {
		PENDING: "#f59e0b",
		CORRECT: "#22c55e",
		INCORRECT: "#ef4444",
	};
	const labels: Record<string, string> = {
		PENDING: "Pendiente",
		CORRECT: "¡Acertaste!",
		INCORRECT: "No acertaste",
	};
	const color = colors[status] ?? "#6b7280";
	return (
		<View style={[styles.predictionStatus, { backgroundColor: color + "22" }]}>
			<Text style={[styles.predictionStatusText, { color }]}>
				{labels[status] ?? status}
			</Text>
		</View>
	);
}

const styles = StyleSheet.create({
	card: {
		backgroundColor: CARD_BG,
		borderRadius: 12,
		padding: 16,
		marginBottom: 12,
	},
	stageRow: {
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "space-between",
		marginBottom: 10,
	},
	stage: {
		fontSize: 12,
		fontWeight: "600",
		color: SUBTEXT,
		textTransform: "uppercase",
		letterSpacing: 0.5,
	},
	statusBadge: {
		flexDirection: "row",
		alignItems: "center",
		paddingHorizontal: 8,
		paddingVertical: 3,
		borderRadius: 6,
	},
	statusDot: {
		width: 6,
		height: 6,
		borderRadius: 3,
		marginRight: 5,
	},
	statusText: {
		fontSize: 11,
		fontWeight: "600",
	},
	opponent: {
		fontSize: 16,
		fontWeight: "700",
		color: STRONG_TEXT,
		marginBottom: 12,
	},
	infoRow: {
		flexDirection: "row",
		alignItems: "center",
		marginBottom: 4,
	},
	infoIcon: {
		fontSize: 13,
		marginRight: 8,
	},
	infoText: {
		fontSize: 13,
		color: SUBTEXT,
	},
	openBadge: {
		marginTop: 10,
		alignSelf: "flex-start",
		backgroundColor: "#22c55e22",
		paddingHorizontal: 10,
		paddingVertical: 4,
		borderRadius: 6,
	},
	openBadgeText: {
		fontSize: 12,
		fontWeight: "600",
		color: "#22c55e",
	},
	resultBox: {
		marginTop: 12,
		paddingTop: 12,
		borderTopWidth: 1,
		borderTopColor: "#333",
		flexDirection: "row",
		alignItems: "center",
		gap: 8,
	},
	resultLabel: {
		fontSize: 13,
		color: SUBTEXT,
	},
	resultScore: {
		fontSize: 16,
		fontWeight: "700",
		color: STRONG_TEXT,
	},
	predictionBox: {
		marginTop: 12,
		paddingTop: 12,
		borderTopWidth: 1,
		borderTopColor: "#333",
		flexDirection: "row",
		alignItems: "center",
		gap: 8,
		flexWrap: "wrap",
	},
	predictionLabel: {
		fontSize: 13,
		color: SUBTEXT,
	},
	predictionScore: {
		fontSize: 16,
		fontWeight: "700",
		color: STRONG_TEXT,
	},
	predictionStatus: {
		paddingHorizontal: 8,
		paddingVertical: 3,
		borderRadius: 6,
	},
	predictionStatusText: {
		fontSize: 11,
		fontWeight: "600",
	},
	editBtn: {
		marginTop: 12,
		height: 42,
		borderRadius: 10,
		backgroundColor: MAIN_COLOR,
		alignItems: "center",
		justifyContent: "center",
	},
	editBtnText: {
		fontSize: 14,
		fontWeight: "700",
		color: STRONG_TEXT,
	},
	rewardBox: {
		marginTop: 12,
		padding: 16,
		borderRadius: 12,
		backgroundColor: "#22c55e15",
		borderWidth: 1,
		borderColor: "#22c55e30",
		flexDirection: "row",
		gap: 12,
	},
	rewardIcon: {
		fontSize: 28,
	},
	rewardContent: {
		flex: 1,
	},
	rewardTitle: {
		fontSize: 14,
		fontWeight: "700",
		color: "#22c55e",
		marginBottom: 2,
	},
	rewardSub: {
		fontSize: 12,
		color: SUBTEXT,
		marginBottom: 10,
		lineHeight: 17,
	},
	rewardBtn: {
		height: 34,
		paddingHorizontal: 16,
		borderRadius: 8,
		backgroundColor: "#22c55e",
		alignItems: "center",
		justifyContent: "center",
		alignSelf: "flex-start",
	},
	rewardBtnText: {
		fontSize: 12,
		fontWeight: "700",
		color: "#1E1E1E",
	},
});
