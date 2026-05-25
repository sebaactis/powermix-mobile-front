import { useState } from "react";
import {
	ActivityIndicator,
	Modal,
	Pressable,
	StyleSheet,
	Text,
	TextInput,
	View,
} from "react-native";
import Toast from "react-native-toast-message";
import { CARD_BG, MAIN_COLOR, STRONG_TEXT, SUBTEXT } from "../../constant";

type Props = {
	visible: boolean;
	matchStage: string;
	matchOpponent: string;
	initialArgentinaGoals: number | null;
	initialOpponentGoals: number | null;
	onSave: (argentinaGoals: number, opponentGoals: number) => Promise<void>;
	onClose: () => void;
};

export default function ProdePredictionModal({
	visible,
	matchStage,
	matchOpponent,
	initialArgentinaGoals,
	initialOpponentGoals,
	onSave,
	onClose,
}: Props) {
	const [argGoals, setArgGoals] = useState(
		initialArgentinaGoals?.toString() ?? "",
	);
	const [oppGoals, setOppGoals] = useState(
		initialOpponentGoals?.toString() ?? "",
	);
	const [saving, setSaving] = useState(false);

	const handleSave = async () => {
		const a = parseInt(argGoals, 10);
		const o = parseInt(oppGoals, 10);

		if (isNaN(a) || isNaN(o)) {
			Toast.show({
				type: "appWarning",
				text1: "Completá ambos campos",
			});
			return;
		}

		if (a < 0 || a > 50 || o < 0 || o > 50) {
			Toast.show({
				type: "appWarning",
				text1: "Los goles deben ser entre 0 y 50",
			});
			return;
		}

		setSaving(true);
		try {
			await onSave(a, o);
		} finally {
			setSaving(false);
		}
	};

	return (
		<Modal
			visible={visible}
			transparent
			animationType="fade"
			onRequestClose={onClose}
		>
			<Pressable style={styles.overlay} onPress={onClose}>
				<Pressable style={styles.container} onPress={() => {}}>
					<Text style={styles.title}>PRODE</Text>
					<Text style={styles.subtitle}>
						{formatStage(matchStage)} · Argentina vs {matchOpponent}
					</Text>

					<View style={styles.inputsRow}>
						<View style={styles.inputGroup}>
							<Text style={styles.teamLabel}>🇦🇷 Argentina</Text>
							<TextInput
								style={styles.input}
								keyboardType="number-pad"
								value={argGoals}
								onChangeText={setArgGoals}
								placeholder="0"
								placeholderTextColor={SUBTEXT}
								maxLength={2}
								editable={!saving}
							/>
						</View>

						<Text style={styles.vs}>vs</Text>

						<View style={styles.inputGroup}>
							<Text style={styles.teamLabel}>{matchOpponent}</Text>
							<TextInput
								style={styles.input}
								keyboardType="number-pad"
								value={oppGoals}
								onChangeText={setOppGoals}
								placeholder="0"
								placeholderTextColor={SUBTEXT}
								maxLength={2}
								editable={!saving}
							/>
						</View>
					</View>

					<View style={styles.actions}>
						<Pressable
							style={styles.cancelBtn}
							onPress={onClose}
							disabled={saving}
						>
							<Text style={styles.cancelBtnText}>Cancelar</Text>
						</Pressable>
						<Pressable
							style={[styles.saveBtn, saving && styles.saveBtnDisabled]}
							onPress={handleSave}
							disabled={saving}
						>
							{saving ? (
								<ActivityIndicator color={STRONG_TEXT} size="small" />
							) : (
								<Text style={styles.saveBtnText}>Guardar</Text>
							)}
						</Pressable>
					</View>
				</Pressable>
			</Pressable>
		</Modal>
	);
}

function formatStage(stage: string): string {
	return stage.replace(/_/g, " ");
}

const styles = StyleSheet.create({
	overlay: {
		flex: 1,
		backgroundColor: "rgba(0,0,0,0.7)",
		justifyContent: "center",
		alignItems: "center",
		padding: 24,
	},
	container: {
		width: "100%",
		maxWidth: 340,
		backgroundColor: CARD_BG,
		borderRadius: 16,
		padding: 24,
	},
	title: {
		fontSize: 20,
		fontWeight: "700",
		color: STRONG_TEXT,
		textAlign: "center",
		marginBottom: 4,
	},
	subtitle: {
		fontSize: 13,
		color: SUBTEXT,
		textAlign: "center",
		marginBottom: 24,
	},
	inputsRow: {
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "center",
		gap: 12,
		marginBottom: 24,
	},
	inputGroup: {
		alignItems: "center",
		flex: 1,
	},
	teamLabel: {
		fontSize: 12,
		color: SUBTEXT,
		marginBottom: 8,
		textAlign: "center",
	},
	input: {
		width: "100%",
		height: 56,
		borderRadius: 12,
		backgroundColor: "#1E1E1E",
		color: STRONG_TEXT,
		fontSize: 24,
		fontWeight: "700",
		textAlign: "center",
		borderWidth: 1,
		borderColor: "#333",
	},
	vs: {
		fontSize: 14,
		fontWeight: "600",
		color: SUBTEXT,
		marginTop: 20,
	},
	actions: {
		flexDirection: "row",
		gap: 12,
	},
	cancelBtn: {
		flex: 1,
		height: 48,
		borderRadius: 10,
		borderWidth: 1,
		borderColor: "#333",
		alignItems: "center",
		justifyContent: "center",
	},
	cancelBtnText: {
		color: SUBTEXT,
		fontSize: 15,
		fontWeight: "600",
	},
	saveBtn: {
		flex: 1,
		height: 48,
		borderRadius: 10,
		backgroundColor: MAIN_COLOR,
		alignItems: "center",
		justifyContent: "center",
	},
	saveBtnDisabled: {
		opacity: 0.6,
	},
	saveBtnText: {
		color: STRONG_TEXT,
		fontSize: 15,
		fontWeight: "700",
	},
});
