import React, { useState } from 'react';
import MaterialIcon from 'react-native-vector-icons/FontAwesome';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { Pressable, StyleSheet, Text, View, ActivityIndicator } from 'react-native';

import FormInput from '@/components/inputs/FormInput';
import { BG, CARD_BG, MAIN_COLOR, STRONG_TEXT, SUBTEXT } from '@/src/constant';
import { useAuth } from '@/src/context/AuthContext';

import { GoogleSignin } from '@react-native-google-signin/google-signin';


export default function LoginScreen({ navigation }) {
  const { signIn, signInWithTokens } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleLogin = async () => {
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

      console.log('🚀 Iniciando Google Login');

      await GoogleSignin.hasPlayServices({
        showPlayServicesUpdateDialog: true,
      });

      const userInfo = await GoogleSignin.signIn();
      console.log('👤 User info Google:', userInfo);

      const tokens = await GoogleSignin.getTokens();
      console.log('🔑 Tokens de Google:', {
        hasAccessToken: !!tokens.accessToken,
        hasIdToken: !!tokens.idToken,
      });

      if (!tokens.accessToken) {
        setError('No se pudo obtener el access token de Google');
        return;
      }

      const res = await fetch(`${process.env.EXPO_PUBLIC_POWERMIX_API_URL}/api/v1/login-google`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ access_token: tokens.accessToken }),
      });

      const data = await res.json().catch(() => null);
      console.log('📥 Respuesta backend:', res.status, data);

      if (!res.ok) {
        throw new Error(data?.message || 'Error al iniciar sesión con Google');
      }

      await signInWithTokens(data.accessToken, data.refreshToken, {
        email: data.user.email,
        name: data.user.name,
      });

      console.log('✅ Login con Google completado');
    } catch (e: any) {
      console.error('❌ Error en login Google:', e);
      setError(e.message || 'Error al iniciar sesión con Google');
    } finally {
      setGoogleLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.iconContainer}>
        <Icon style={styles.icon} name="arm-flex-outline" size={55} color={MAIN_COLOR} />
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
        marginTop={35}
        value={email}
        onChangeText={setEmail}
      />

      <FormInput
        iconName="lock-outline"
        size={24}
        color={SUBTEXT}
        placeholder="Contraseña"
        placeholderTextColor={SUBTEXT}
        labelText="Contraseña"
        marginTop={35}
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />

      <Text style={styles.forgotPassword}>¿Olvidaste tu contraseña?</Text>

      {error && <Text style={styles.errorMessage}>{error}</Text>}

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
              <MaterialIcon style={styles.icon} name="google" size={30} color={STRONG_TEXT} />
              <Text style={styles.buttonText}>Iniciar sesión con Google</Text>
            </>
          )}
        </Pressable>
      </View>

      <View style={styles.registerTextContainer}>
        <Text style={styles.register}>¿No tenés cuenta? </Text>
        <Text onPress={() => navigation.navigate('Register')} style={styles.registerSubText}>
          Registrate
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: BG,
  },
  iconContainer: {
    backgroundColor: '#8b003a7c',
    width: 75,
    height: 85,
    borderRadius: 60,
    justifyContent: 'center',
    alignItems: 'center',
  },
  icon: {
    zIndex: 10,
  },
  title: {
    fontSize: 32,
    marginTop: 20,
    textAlign: 'center',
    color: STRONG_TEXT,
    fontWeight: 'bold',
  },
  subtitle: {
    fontSize: 17.5,
    marginTop: 10,
    color: SUBTEXT,
  },
  forgotPassword: {
    color: MAIN_COLOR,
    marginTop: 8,
    textAlign: 'right',
    width: '85%',
    fontSize: 16,
    fontWeight: '500',
  },
  errorMessage: {
    color: 'red',
    marginTop: 20,
    textAlign: 'center',
    fontSize: 16,
    fontWeight: '500',
    paddingHorizontal: 20,
  },
  button: {
    backgroundColor: MAIN_COLOR,
    marginTop: 45,
    borderRadius: 8,
    paddingVertical: 14,
    width: '86%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    color: STRONG_TEXT,
    fontSize: 17,
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
    fontSize: 16,
    fontWeight: '500',
  },
  registerSubText: {
    color: MAIN_COLOR,
    fontSize: 16,
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
    gap: 15,
  },
  oText: {
    color: STRONG_TEXT,
    fontSize: 16,
    fontWeight: '500',
  },
});
