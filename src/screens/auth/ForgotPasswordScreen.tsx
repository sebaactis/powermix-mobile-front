import { useState } from "react";
import { View, Text, StyleSheet, Pressable, ActivityIndicator, KeyboardAvoidingView, Platform, ScrollView } from "react-native";
import FormInput from "@/components/inputs/FormInput";
import { BG, MAIN_COLOR, STRONG_TEXT, SUBTEXT } from "@/src/constant";
import { isCompactScreen, RESPONSIVE_SIZES } from "@/src/helpers/responsive";
import Toast from "react-native-toast-message";
import { ApiHelper } from "@/src/helpers/apiHelper";

type RecoveryPasswordRequestResponse = {
    email: string;
    token: string;
};

export function ForgotPasswordScreen({ navigation }) {
    const [email, setEmail] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSendRecovery = async () => {
        if (!email) return;

        try {
            setLoading(true);

            const url = `${process.env.EXPO_PUBLIC_POWERMIX_API_URL}/api/v1/recoveryPassword`;
            const res = await ApiHelper<RecoveryPasswordRequestResponse>(url, "POST", { email });

            if (!res.success) {
                Toast.show({
                    type: "appError",
                    text1: "No se pudo enviar el correo",
                    text2: res.error?.message ?? "Intentá nuevamente",
                });
                return;
            }

            // DEV MODE (falta flujo de email)
            const token = res.data?.token;

            Toast.show({
                type: "appSuccess",
                text1: "Revisa tu correo",
                text2: "Si el email existe, te enviamos instrucciones.",
            });

            if (token) {
                navigation.navigate("ResetPassword", {
                    email: res.data?.email,
                    token,
                });
            } else {
                // En producción --> configurar deep link
                navigation.goBack();
            }
        } catch (e: any) {
            Toast.show({
                type: "appError",
                text1: "Error",
                text2: e.message ?? "No se pudo procesar la solicitud",
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <KeyboardAvoidingView
            style={styles.container}
            behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        >
            <ScrollView
                contentContainerStyle={styles.scrollContent}
                keyboardShouldPersistTaps="handled"
                showsVerticalScrollIndicator={false}
            >
                <Text style={styles.title}>Recuperar contraseña</Text>
                <Text style={styles.subtitle}>
                    Ingresá el correo que usás para iniciar sesión.
                </Text>

                <FormInput
                    iconName="email"
                    size={24}
                    color={SUBTEXT}
                    placeholder="ejemplo@correo.com"
                    placeholderTextColor={SUBTEXT}
                    labelText="Correo electrónico"
                    marginTop={isCompactScreen ? 25 : 35}
                    keyBoardType="email-address"
                    value={email}
                    onChangeText={setEmail}
                />

                <Pressable
                    style={[styles.button, (!email || loading) && { opacity: 0.7 }]}
                    onPress={handleSendRecovery}
                    disabled={!email || loading}
                >
                    {loading ? (
                        <ActivityIndicator color={STRONG_TEXT} />
                    ) : (
                        <Text style={styles.buttonText}>Enviar instrucciones</Text>
                    )}
                </Pressable>
            </ScrollView>
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: BG,
    },
    scrollContent: {
        flexGrow: 1,
        justifyContent: "center",
        paddingVertical: RESPONSIVE_SIZES.header.paddingTop,
        paddingHorizontal: RESPONSIVE_SIZES.padding.horizontal,
    },
    title: {
        fontSize: 26,
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
