import React, { useState } from 'react';
import { ActivityIndicator, Image, KeyboardAvoidingView, Platform, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import MaterialIcon from 'react-native-vector-icons/FontAwesome';

import FormInput from '@/components/inputs/FormInput';
import { BG, CARD_BG, MAIN_COLOR, STRONG_TEXT, SUBTEXT } from '@/src/constant';
import { useAuth } from '@/src/context/AuthContext';
import { getResponsiveFontSize, isSmallScreen, RESPONSIVE_FONT_SIZES, RESPONSIVE_SIZES } from '@/src/helpers/responsive';

import { ApiHelper } from '@/src/helpers/apiHelper';
import { GoogleSignin } from '@react-native-google-signin/google-signin';
import Toast from 'react-native-toast-message';

type LoginGoogleResponse = {
  accessToken: string;
  refreshToken: string;
  user: {
    email: string;
    name: string;
  };
};


export default function LoginScreen({ navigation }) {
  const { signIn, signInWithTokens } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [errors, setErrors] = useState({ email: '', password: '' });

  const validate = (): boolean => {
    const newErrors: { email: string; password: string } = { email: '', password: '' };

    if (!email.trim()) {
      newErrors.email = 'El correo es requerido';
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = 'Correo inválido';
    }

    if (!password.trim()) {
      newErrors.password = 'La contraseña es requerida';
    }

    setErrors(newErrors);
    return !newErrors.email && !newErrors.password;
  };

  const handleLogin = async () => {
    if (!validate()) return;

    try {
      setError(null);
      setLoading(true);
      await signIn(email, password);
    } catch (e: any) {
      setError(e.message || 'Error al iniciar sesión');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    try {
      setError(null);
      setGoogleLoading(true);

      console.log("🚀 Iniciando Google Login");

      await GoogleSignin.hasPlayServices({
        showPlayServicesUpdateDialog: true,
      });

      const userInfo = await GoogleSignin.signIn();
      console.log("👤 User info Google:", userInfo);

      const tokens = await GoogleSignin.getTokens();
      console.log("🔑 Tokens de Google:", {
        hasAccessToken: !!tokens.accessToken,
        hasIdToken: !!tokens.idToken,
      });

      if (!tokens.accessToken) {
        setError("No se pudo obtener el access token de Google");
        return;
      }

      const url = `${process.env.EXPO_PUBLIC_POWERMIX_API_URL}/api/v1/login-google`;

      const res = await ApiHelper<LoginGoogleResponse>(url, "POST", {
        access_token: tokens.accessToken,
      });

      if (!res.success || !res.data) {
        Toast.show({
          type: "appError",
          text1: "Error al iniciar sesión con Google",
          text2: res.error?.message
        })
        return;
      }

      const { accessToken, refreshToken, user } = res.data;

      await signInWithTokens(accessToken, refreshToken, {
        email: user.email,
        name: user.name,
      });

      console.log("✅ Login con Google completado");
    } catch (error: any) {
      console.error("❌ Error en login Google:", error);
      console.error("❌ Error message:", error?.message);
      console.error("❌ Error code:", error?.code);
      setError(error?.message || "Error al iniciar sesión con Google");
    } finally {
      setGoogleLoading(false);
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
        <View style={styles.logoContainer}>
          <Image 
            source={require('@/assets/splash-native.png')}
            style={styles.logo}
            resizeMode="contain"
          />
        </View>
        <Text style={styles.title}>Bienvenido</Text>
        <Text style={styles.subtitle}>Inicie sesión para continuar</Text>

        <FormInput
          iconName="email"
          size={24}
          color={SUBTEXT}
          placeholder="ejemplo@correo.com"
          placeholderTextColor={SUBTEXT}
          keyBoardType="email-address"
          labelText="Correo electronico"
          marginTop={isSmallScreen ? 25 : 35}
          value={email}
          onChangeText={(text) => {
            setEmail(text);
            setErrors(prev => ({ ...prev, email: '' }));
          }}
          error={errors.email}
        />

        <FormInput
          iconName="lock-outline"
          size={24}
          color={SUBTEXT}
          placeholder="Contraseña"
          placeholderTextColor={SUBTEXT}
          labelText="Contraseña"
          marginTop={isSmallScreen ? 25 : 35}
          secureTextEntry
          value={password}
          onChangeText={(text) => {
            setPassword(text);
            setErrors(prev => ({ ...prev, password: '' }));
          }}
          error={errors.password}
        />

        <Text
          style={styles.forgotPassword}
          onPress={() => navigation.navigate('ForgotPassword')}
        >
          ¿Olvidaste tu contraseña?
        </Text>

        <View style={styles.buttonsContainer}>
          <Pressable
            style={[styles.button, (loading || !email || !password) && { opacity: 0.7 }]}
            onPress={handleLogin}
            disabled={loading || !email || !password}
          >
            {loading ? (
              <ActivityIndicator color={STRONG_TEXT} />
            ) : (
              <Text style={styles.buttonText}>Iniciar Sesion</Text>
            )}
          </Pressable>

          <Text style={styles.oText}>o</Text>

          <Pressable
            style={[styles.googleButton, googleLoading && { opacity: 0.7 }]}
            onPress={handleGoogleLogin}
            disabled={googleLoading}
          >
            {googleLoading ? (
              <ActivityIndicator color={STRONG_TEXT} />
            ) : (
              <>
                <MaterialIcon name="google" size={22} color={STRONG_TEXT} />
                <Text style={styles.buttonText}>Iniciar sesión con Google</Text>
              </>
            )}
          </Pressable>
          {error && <Text style={styles.errorMessage}>{error}</Text>}
        </View>

        <View style={styles.registerTextContainer}>
          <Text style={styles.register}>¿No tenés cuenta? </Text>
          <Text onPress={() => navigation.navigate('Register')} style={styles.registerSubText}>
            Registrate
          </Text>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: BG,
    paddingBottom: 20
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: RESPONSIVE_SIZES.header.paddingTop,
    paddingHorizontal: RESPONSIVE_SIZES.padding.horizontal,
  },
  logoContainer: {
    width: 150,
    height: 150,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logo: {
    width: '100%',
    height: '100%',
  },
  title: {
    fontSize: getResponsiveFontSize(26, 24),
    marginTop: 10,
    textAlign: 'center',
    color: STRONG_TEXT,
    fontWeight: 'bold',
  },
  subtitle: {
    fontSize: getResponsiveFontSize(17, 15),
    marginTop: 10,
    color: SUBTEXT,
  },
  forgotPassword: {
    color: MAIN_COLOR,
    marginTop: 8,
    textAlign: 'right',
    width: '85%',
    fontSize: getResponsiveFontSize(16, 14),
    fontWeight: '500',
  },
  errorMessage: {
    color: '#f97373',
    textAlign: 'center',
    fontSize: getResponsiveFontSize(15, 14),
    fontWeight: '400',
    marginBottom: 13
  },
  button: {
    backgroundColor: MAIN_COLOR,
    marginTop: 30,
    borderRadius: 8,
    paddingVertical: 10,
    width: '86%',
    alignItems: 'center',
    justifyContent: 'center',

  },
  buttonText: {
    color: STRONG_TEXT,
    fontSize: getResponsiveFontSize(17, 15),
    fontWeight: '600',
  },
  registerTextContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    width: '85%',
    marginTop: 13,
    gap: 2,
  },
  register: {
    color: STRONG_TEXT,
    fontSize: getResponsiveFontSize(16, 14),
    fontWeight: '500',
  },
  registerSubText: {
    color: MAIN_COLOR,
    fontSize: getResponsiveFontSize(16, 14),
    fontWeight: '500',
  },
  googleButton: {
    flexDirection: 'row',
    backgroundColor: CARD_BG,
    borderRadius: 8,
    paddingVertical: 10,
    width: '86%',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 15,
  },
  buttonsContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    gap: 12,
  },
  oText: {
    color: STRONG_TEXT,
    fontSize: getResponsiveFontSize(16, 14),
    fontWeight: '500',
  },
});
