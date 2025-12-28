import Icon from 'react-native-vector-icons/AntDesign';

import FormInput from '@/components/inputs/FormInput';
import { BG, MAIN_COLOR, STRONG_TEXT, SUBTEXT } from '@/src/constant';
import { isSmallScreen, RESPONSIVE_SIZES } from '@/src/helpers/responsive';
import { Pressable, StyleSheet, Text, View, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { useState } from 'react';

import Toast from 'react-native-toast-message';

type RegisterData = {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
}

type RegisterErrors = {
  name?: string;
  email?: string;
  password?: string;
  confirmPassword?: string;
};

export default function RegisterScreen({ navigation }) {

  const [registerData, setRegisterData] = useState<RegisterData>({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  const [errors, setErrors] = useState<RegisterErrors>({});
  const [loading, setLoading] = useState(false);

  const validEntries = registerData.name !== ""
    && registerData.email !== ""
    && registerData.password !== ""
    && registerData.confirmPassword !== ""


  const handleRegisterData = (patch: Partial<RegisterData>) => {
    setErrors({});
    setRegisterData((prev) => ({ ...prev, ...patch }))
  }

  const validateForm = (): boolean => {
    const newErrors: RegisterErrors = {};

    const name = registerData.name.trim();
    if (!name) newErrors.name = 'El nombre es obligatorio.';
    else if (name.length < 6) newErrors.name = 'El nombre debe tener al menos 6 caracteres.'
    else if (name.length > 30) newErrors.name = 'El nombre debe tener como maximo 30 caracteres';

    const email = registerData.email.trim();
    if (!email) newErrors.email = 'El email es obligatorio.'
    else if (email.length < 8) {
      newErrors.email = 'El email debe tener al menos 8 caracteres.';
    }
    else if (email.length > 30) {
      newErrors.email = 'El email debe tener como maximo 30 caracteres.';
    }
    else {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) newErrors.email = 'Ingresá un email válido.';
    }

    if (!registerData.password) {
      newErrors.password = 'La contraseña es obligatoria.';
    } else if (registerData.password.length < 8) {
      newErrors.password = 'La contraseña debe tener al menos 8 caracteres.';
    } else if (registerData.password.length > 30) {
      newErrors.password = 'La contraseña debe tener como maximo 30 caracteres.';
    }

    if (!registerData.confirmPassword) {
      newErrors.confirmPassword = 'Debés repetir la contraseña.';
    } else if (registerData.password !== registerData.confirmPassword) {
      newErrors.confirmPassword = 'Las contraseñas no coinciden.';
    }

    setErrors(newErrors);

    const hasErrors = Object.values(newErrors).some((v) => v !== undefined);
    return !hasErrors;
  };

  const handleSubmit = async () => {

    const isValid = validateForm();
    if (!isValid) return;

    setLoading(true);

    try {
      const res = await fetch(`${process.env.EXPO_PUBLIC_POWERMIX_API_URL}/api/v1/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: registerData.name.trim(),
          email: registerData.email.trim(),
          password: registerData.password,
          confirmPassword: registerData.confirmPassword
        }),
      });

      const data = await res.json().catch(() => null);

      if (!res.ok) {

        const backendMsg: string =
          data?.message ||
          data?.error ||
          data?.details?.error ||
          'Ocurrió un error en el servidor.';

        if (res.status === 409) {
          Toast.show({
            type: 'appWarning',
            text1: 'No pudimos crear el usuario',
            text2: backendMsg,
          });
          return;
        }

        if (res.status === 400) {
          Toast.show({
            type: 'appWarning',
            text1: 'No pudimos crear el usuario',
            text2: backendMsg,
          });
          return;
        }

        Toast.show({
          type: 'appWarning',
          text1: 'Hubo un problema al intentar crear el usuario',
          text2: backendMsg,
        });
        return;
      }

      Toast.show({
        type: 'appSuccess',
        text1: 'Registro completado exitosamente!',
      });

      setTimeout(() => {
        navigation.navigate('Login');
      }, 1000)


    } catch (error) {
      Toast.show({
        type: 'appError',
        text1: 'Error inesperado el intentar registrar un usuario',
        text2: error
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
        <View style={styles.iconContainer}>
          <Icon style={styles.icon} name="user-add" size={55} color={MAIN_COLOR} />
        </View>
        <Text style={styles.title}>Crear una cuenta nueva</Text>
        <Text style={styles.subtitle}>Unite para empezar a disfrutar de nuestro servicio</Text>

        <FormInput
          iconName="abc"
          size={24}
          color={SUBTEXT}
          placeholder="Introduce tu nombre y apellido"
          placeholderTextColor={SUBTEXT}
          keyBoardType="visible-password"
          labelText="Nombre y Apellido"
          marginTop={isSmallScreen ? 20 : 25}
          onChangeText={(text) => handleRegisterData({ name: text })}
          value={registerData.name}
          error={errors.name}
        />

        <FormInput
          iconName="email"
          size={24}
          color={SUBTEXT}
          placeholder="ejemplo@correo.com"
          placeholderTextColor={SUBTEXT}
          keyBoardType="email-address"
          labelText="Correo electronico"
          marginTop={isSmallScreen ? 20 : 25}
          onChangeText={(text) => handleRegisterData({ email: text })}
          value={registerData.email}
          error={errors.email}
        />

        <FormInput
          iconName="lock-outline"
          size={24}
          color={SUBTEXT}
          placeholder="Crea una contraseña segura"
          placeholderTextColor={SUBTEXT}
          keyBoardType="visible-password"
          labelText="Contraseña"
          marginTop={isSmallScreen ? 20 : 25}
          onChangeText={(text) => handleRegisterData({ password: text })}
          value={registerData.password}
          error={errors.password}
        />

        <FormInput
          iconName="lock-outline"
          size={24}
          color={SUBTEXT}
          placeholder="Repite la contraseña"
          placeholderTextColor={SUBTEXT}
          keyBoardType="visible-password"
          labelText="Confirmar contraseña"
          marginTop={isSmallScreen ? 20 : 25}
          onChangeText={(text) => handleRegisterData({ confirmPassword: text })}
          value={registerData.confirmPassword}
          error={errors.confirmPassword}
        />
        <View style={styles.registerTextContainer}>
          <Text style={styles.subText}>
            Al crear tu cuenta, aceptás nuestros
            <Text
              style={styles.link}>
            {' '}Términos
          </Text>
          <Text> y </Text>
          <Text style={styles.link}>
            Política de Privacidad
          </Text>
          </Text>
        </View>


        <View style={styles.buttonsContainer}>
          <Pressable
            style={[styles.button, !validEntries && { opacity: 0.7 }]}
            disabled={!validEntries}
            onPress={handleSubmit}
          >
            <Text style={styles.buttonText}>{loading ? 'Creando cuenta...' : 'Crear cuenta'}</Text>
          </Pressable>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: BG
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: RESPONSIVE_SIZES.header.paddingTop,
    paddingHorizontal: RESPONSIVE_SIZES.padding.horizontal,
  },
  iconContainer: {
    backgroundColor: '#8b003a7c',
    width: 80,
    height: 83,
    borderRadius: 60,
    justifyContent: 'center',
    alignItems: 'center'
  },
  icon: {
    zIndex: 10
  },
  title:
  {
    fontSize: 32,
    marginTop: 20,
    textAlign: 'center',
    color: STRONG_TEXT,
    fontWeight: 'bold',
  },
  registerTextContainer: {
    width: '90%',
    alignSelf: 'center',
    marginTop: 16,
  },
  subtitle: {
    fontSize: 17.5,
    marginTop: 10,
    maxWidth: '80%',
    textAlign: 'center',
    color: SUBTEXT
  },
  subText: {
    fontSize: 16,
    color: SUBTEXT,
    textAlign: 'center',
  },
  link: {
    color: MAIN_COLOR,
    fontWeight: '600',
  },
  button: {
    backgroundColor: MAIN_COLOR,
    marginTop: 25,
    borderRadius: 8,
    paddingVertical: 14,
    width: '86%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    color: STRONG_TEXT,
    fontSize: 17,
    fontWeight: 600
  },
  buttonsContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    gap: 15
  }
});