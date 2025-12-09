import { useState } from "react";
import { View, Text, StyleSheet, Pressable, ActivityIndicator } from "react-native";

import FormInput from "@/components/inputs/FormInput";
import { BG, MAIN_COLOR, STRONG_TEXT, SUBTEXT } from "@/src/constant";
import Toast from "react-native-toast-message";
import { ApiHelper } from "@/src/helpers/apiHelper";
import { useLocalSearchParams, useRouter } from "expo-router";

type ResetPasswordRouteParams = {
    token?: string | string[];
    email?: string | string[];
};

export default function ResetPasswordScreen({ navigation }) {
    const router = useRouter();
    const params = useLocalSearchParams<ResetPasswordRouteParams>();

    console.log("params", params);

    const tokenParam = params.token;
    const emailParam = params.email;

    const token =
        Array.isArray(tokenParam) ? tokenParam[0] : tokenParam || undefined;
    const email =
        Array.isArray(emailParam) ? emailParam[0] : emailParam || undefined;

    const [password, setPassword] = useState("");
    const [confirm, setConfirm] = useState("");
    const [loading, setLoading] = useState(false);

    const handleReset = async () => {
        if (!token) {
            Toast.show({
                type: "appError",
                text1: "Token inválido",
                text2: "Volvé a solicitar la recuperación.",
            });
            return;
        }

        if (!password || password.length < 8) {
            Toast.show({
                type: "appError",
                text1: "Contraseña demasiado corta",
                text2: "Debe tener al menos 8 caracteres.",
            });
            return;
        }

        if (password !== confirm) {
            Toast.show({
                type: "appError",
                text1: "Las contraseñas no coinciden",
            });
            return;
        }

        try {
            setLoading(true);

            const url = `${process.env.EXPO_PUBLIC_POWERMIX_API_URL}/api/v1/updatePasswordRecovery`; // ajustá path
            const res = await ApiHelper<any>(url, "POST", {
                token,
                password,
                confirmPassword: confirm,
            });

            if (!res.success) {
                Toast.show({
                    type: "appError",
                    text1: "No se pudo actualizar la contraseña",
                    text2: res.error?.message,
                });
                return;
            }

            Toast.show({
                type: "appSuccess",
                text1: "Contraseña actualizada",
                text2: "Ya podés iniciar sesión con tu nueva contraseña.",
            });

            router.replace("/login")
        } catch (e: any) {
            Toast.show({
                type: "appError",
                text1: "Error",
                text2: e.message ?? "No se pudo actualizar la contraseña",
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Crear nueva contraseña</Text>
            {email && <Text style={styles.subtitle}>{email}</Text>}

            <FormInput
                iconName="lock-outline"
                size={24}
                color={SUBTEXT}
                placeholder="Nueva contraseña"
                placeholderTextColor={SUBTEXT}
                labelText="Nueva contraseña"
                marginTop={35}
                secureTextEntry
                value={password}
                onChangeText={setPassword}
            />

            <FormInput
                iconName="lock-outline"
                size={24}
                color={SUBTEXT}
                placeholder="Repetir contraseña"
                placeholderTextColor={SUBTEXT}
                labelText="Confirmar contraseña"
                marginTop={20}
                secureTextEntry
                value={confirm}
                onChangeText={setConfirm}
            />

            <Pressable
                style={[styles.button, loading && { opacity: 0.7 }]}
                onPress={handleReset}
                disabled={loading}
            >
                {loading ? (
                    <ActivityIndicator color={STRONG_TEXT} />
                ) : (
                    <Text style={styles.buttonText}>Actualizar contraseña</Text>
                )}
            </Pressable>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: BG,

        justifyContent: "center",
    },
    title: {
        fontSize: 24,
        fontWeight: "700",
        color: STRONG_TEXT,
        marginBottom: 8,
        marginHorizontal: 30
    },
    subtitle: {
        fontSize: 15,
        color: SUBTEXT,
        marginHorizontal: 30
    },
    button: {
        backgroundColor: MAIN_COLOR,
        marginTop: 35,
        borderRadius: 8,
        paddingVertical: 14,
        alignItems: "center",
        justifyContent: "center",
        marginHorizontal: 30
    },
    buttonText: {
        color: STRONG_TEXT,
        fontSize: 16,
        fontWeight: "600",
    },
});
