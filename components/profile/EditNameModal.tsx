import React, { useEffect, useRef, useState } from "react";
import {
    Animated,
    Modal,
    Pressable,
    StyleSheet,
    Text,
    TextInput,
    View,
} from "react-native";
import Toast from "react-native-toast-message";
import { useAuth } from "@/src/context/AuthContext";
import { MAIN_COLOR, STRONG_TEXT, SUBTEXT } from "@/src/constant";

type Props = {
    visible: boolean;
    onClose: () => void;
};

export default function EditNameModal({ visible, onClose }: Props) {
    const { user, setUser, accessToken } = useAuth();

    const [nameDraft, setNameDraft] = useState(user?.name ?? "");
    const [error, setError] = useState<string | undefined>();
    const [loading, setLoading] = useState(false);

    const scaleAnim = useRef(new Animated.Value(0.9)).current;
    const opacityAnim = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        if (visible) {
            setNameDraft(user?.name ?? "");
            setError(undefined);

            scaleAnim.setValue(0.9);
            opacityAnim.setValue(0);

            Animated.parallel([
                Animated.timing(scaleAnim, {
                    toValue: 1,
                    duration: 200,
                    useNativeDriver: true,
                }),
                Animated.timing(opacityAnim, {
                    toValue: 1,
                    duration: 200,
                    useNativeDriver: true,
                }),
            ]).start();
        }
    }, [visible, user, scaleAnim, opacityAnim]);

    const closeWithAnimation = () => {
        Animated.parallel([
            Animated.timing(scaleAnim, {
                toValue: 0.9,
                duration: 150,
                useNativeDriver: true,
            }),
            Animated.timing(opacityAnim, {
                toValue: 0,
                duration: 150,
                useNativeDriver: true,
            }),
        ]).start(() => {
            onClose();
            setError(undefined);
        });
    };

    const handleChangeName = (text: string) => {
        setNameDraft(text);
        setError(undefined);
    };

    const handleSaveName = async () => {
        const trimmed = nameDraft.trim();
        if (!trimmed) {
            setError("El nombre es obligatorio.");
            return;
        }

        try {
            setLoading(true);
            const res = await fetch("http://10.0.2.2:8080/api/v1/user/update", {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${accessToken}`,
                },
                body: JSON.stringify({ name: trimmed }),
            });

            const data = await res.json().catch(() => null);

            if (!res.ok) {
                const backendMsg: string =
                    data?.message ||
                    data?.error ||
                    data?.details?.error ||
                    "Ocurrió un error en el servidor.";

                Toast.show({
                    type: "appWarning",
                    text1: "No pudimos actualizar el usuario",
                    text2: backendMsg,
                });

                return;
            }

            Toast.show({
                type: "appSuccess",
                text1: "Usuario editado correctamente!",
            });

            setUser({
                ...user,
                name: trimmed,
            });

            closeWithAnimation();
        } catch (error: any) {
            Toast.show({
                type: "appError",
                text1: "Error inesperado al intentar editar un usuario",
                text2: error?.message ?? "Error desconocido",
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <Modal
            visible={visible}
            transparent
            animationType="fade"
            onRequestClose={closeWithAnimation}
        >
            <View style={styles.modalOverlay}>
                <Animated.View
                    style={[
                        styles.modalContainer,
                        { opacity: opacityAnim, transform: [{ scale: scaleAnim }] },
                    ]}
                >
                    <Text style={styles.modalTitle}>Editar nombre</Text>
                    <Text style={styles.modalSubtitle}>
                        Actualizá tu nombre para que se vea en tu perfil.
                    </Text>

                    <TextInput
                        style={[styles.modalInput, error && styles.modalInputError]}
                        value={nameDraft}
                        onChangeText={handleChangeName}
                        placeholder="Tu nombre completo"
                        placeholderTextColor={SUBTEXT}
                        autoFocus
                        returnKeyType="done"
                        onSubmitEditing={handleSaveName}
                    />

                    {error && <Text style={styles.errorText}>{error}</Text>}

                    <View style={styles.modalButtonsRow}>
                        <Pressable
                            style={[styles.modalButton, styles.modalButtonSecondary]}
                            onPress={closeWithAnimation}
                            disabled={loading}
                        >
                            <Text style={styles.modalButtonSecondaryText}>Cancelar</Text>
                        </Pressable>

                        <Pressable
                            style={[styles.modalButton, styles.modalButtonPrimary]}
                            onPress={handleSaveName}
                            disabled={loading}
                        >
                            <Text style={styles.modalButtonPrimaryText}>
                                {loading ? "Guardando..." : "Guardar"}
                            </Text>
                        </Pressable>
                    </View>
                </Animated.View>
            </View>
        </Modal>
    );
}

const styles = StyleSheet.create({
    modalOverlay: {
        flex: 1,
        backgroundColor: "rgba(0,0,0,0.55)",
        justifyContent: "center",
        alignItems: "center",
        paddingHorizontal: 24,
    },
    modalContainer: {
        width: "100%",
        borderRadius: 18,
        paddingHorizontal: 20,
        paddingVertical: 18,
        backgroundColor: "#1D1D1F",
        shadowColor: "#000",
        shadowOpacity: 0.35,
        shadowRadius: 10,
        shadowOffset: { width: 0, height: 4 },
        elevation: 6,
    },
    modalTitle: {
        fontSize: 18,
        fontWeight: "700",
        color: STRONG_TEXT,
        marginBottom: 4,
    },
    modalSubtitle: {
        fontSize: 14,
        color: SUBTEXT,
        marginBottom: 14,
    },
    modalInput: {
        borderRadius: 10,
        borderWidth: StyleSheet.hairlineWidth,
        borderColor: "#3A3A3C",
        paddingHorizontal: 12,
        paddingVertical: 10,
        color: STRONG_TEXT,
        fontSize: 16,
        backgroundColor: "#2A2A2C",
        marginBottom: 5,
    },
    modalInputError: {
        borderColor: "#f97373",
        borderWidth: 1.5,
    },
    modalButtonsRow: {
        flexDirection: "row",
        justifyContent: "flex-end",
        gap: 10,
        marginTop: 10,
    },
    modalButton: {
        paddingVertical: 9,
        paddingHorizontal: 16,
        borderRadius: 999,
    },
    modalButtonSecondary: {
        backgroundColor: "transparent",
    },
    modalButtonSecondaryText: {
        color: SUBTEXT,
        fontSize: 15,
        fontWeight: "500",
    },
    modalButtonPrimary: {
        backgroundColor: MAIN_COLOR,
    },
    modalButtonPrimaryText: {
        color: "#FFFFFF",
        fontSize: 15,
        fontWeight: "600",
    },
    errorText: {
        color: "#f97373",
        fontSize: 13,
        marginTop: 2,
    },
});
