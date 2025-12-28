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

import { MAIN_COLOR, STRONG_TEXT, SUBTEXT } from "@/src/constant";
import { useAuth } from "@/src/context/AuthContext";
import { AuthApi } from "@/src/helpers/authApi";

type Props = {
    visible: boolean;
    onClose: () => void;
};

type PasswordForm = {
    current: string;
    newPassword: string;
    confirmNewPassword: string;
};

type PasswordErrors = {
    currentPassword?: string;
    password?: string;
    confirmPassword?: string;
};

export default function ChangePasswordModal({ visible, onClose }: Props) {
    const { signOut } = useAuth();

    const [form, setForm] = useState<PasswordForm>({
        current: "",
        newPassword: "",
        confirmNewPassword: "",
    });

    console.log(form)

    const [errors, setErrors] = useState<PasswordErrors>({});
    const [loading, setLoading] = useState(false);

    const scaleAnim = useRef(new Animated.Value(0.9)).current;
    const opacityAnim = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        if (visible) {
            setForm({
                current: "",
                newPassword: "",
                confirmNewPassword: "",
            });
            setErrors({});

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
    }, [visible, opacityAnim, scaleAnim]);

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
            setErrors({});
        });
    };

    const updateField = (patch: Partial<PasswordForm>) => {
        setForm((prev) => ({ ...prev, ...patch }));
        setErrors({});
    };

    const handleSavePassword = async () => {
        const newErrors: PasswordErrors = {};

        if (!form.current.trim()) {
            newErrors.currentPassword = "Debes ingresar tu contraseña actual.";
        }

        if (!form.newPassword.trim()) {
            newErrors.password = "La nueva contraseña es obligatoria.";
        } else if (form.newPassword.length < 8) {
            newErrors.password = "La nueva contraseña debe tener al menos 8 caracteres.";
        }

        if (form.newPassword !== form.confirmNewPassword) {
            newErrors.confirmPassword = "Las contraseñas no coinciden.";
        }

        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            return;
        }

        try {
            setLoading(true);

            const url = `${process.env.EXPO_PUBLIC_POWERMIX_API_URL}/api/v1/user/change-password`;
            const res = await AuthApi(
                url,
                "PUT",
                signOut,
                {
                    currentPassword: form.current,
                    newPassword: form.newPassword,
                    confirmPassword: form.confirmNewPassword,
                }
            );
            if (!res.success | !res.data) {
                const backendMsg: string = res.error?.message

                Toast.show({
                    type: "appWarning",
                    text1: "No pudimos cambiar la contraseña",
                    text2: backendMsg,
                });

                return;
            }

            Toast.show({
                type: "appSuccess",
                text1: "Contraseña actualizada correctamente!",
            });

            closeWithAnimation();
        } catch (error: any) {
            Toast.show({
                type: "appError",
                text1: "Error inesperado al cambiar la contraseña",
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
                    <Text style={styles.modalTitle}>Cambiar contraseña</Text>
                    <Text style={styles.modalSubtitle}>
                        Ingresá tu contraseña actual y elegí una nueva.
                    </Text>

                    <TextInput
                        style={[
                            styles.modalInput,
                            errors.currentPassword && styles.modalInputError,
                        ]}
                        value={form.current}
                        onChangeText={(text) => updateField({ current: text })}
                        placeholder="Contraseña actual"
                        placeholderTextColor={SUBTEXT}
                        secureTextEntry
                        returnKeyType="next"
                    />
                    {errors.currentPassword && (
                        <Text style={styles.errorText}>{errors.currentPassword}</Text>
                    )}

                    <TextInput
                        style={[
                            styles.modalInput,
                            errors.password && styles.modalInputError,
                        ]}
                        value={form.newPassword}
                        onChangeText={(text) => updateField({ newPassword: text })}
                        placeholder="Nueva contraseña"
                        placeholderTextColor={SUBTEXT}
                        secureTextEntry
                        returnKeyType="next"
                    />
                    {errors.password && (
                        <Text style={styles.errorText}>{errors.password}</Text>
                    )}

                    <TextInput
                        style={[
                            styles.modalInput,
                            errors.confirmPassword && styles.modalInputError,
                        ]}
                        value={form.confirmNewPassword}
                        onChangeText={(text) => updateField({ confirmNewPassword: text })}
                        placeholder="Confirmar nueva contraseña"
                        placeholderTextColor={SUBTEXT}
                        secureTextEntry
                        returnKeyType="done"
                        onSubmitEditing={handleSavePassword}
                    />
                    {errors.confirmPassword && (
                        <Text style={styles.errorText}>{errors.confirmPassword}</Text>
                    )}

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
                            onPress={handleSavePassword}
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
        gap: 10
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
