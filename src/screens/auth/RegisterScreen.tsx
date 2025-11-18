import Icon from 'react-native-vector-icons/AntDesign';

import FormInput from '@/components/inputs/FormInput';
import { BG, MAIN_COLOR, STRONG_TEXT, SUBTEXT } from '@/src/constant';
import { Alert, Pressable, StyleSheet, Text, View } from 'react-native';
import { useState } from 'react';

type RegisterData = {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export default function RegisterScreen({ navigation }) {

  const [registerData, setRegisterData] = useState<RegisterData>({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  })

  const [loading, setLoading] = useState(false);

  const validEntries = registerData.name !== ""
    && registerData.email !== ""
    && registerData.password !== ""
    && registerData.confirmPassword !== ""
    && registerData.password === registerData.confirmPassword;


  const handleRegisterData = (patch: Partial<RegisterData>) => {
    setRegisterData((prev) => ({ ...prev, ...patch }))
  }

  const handleSubmit = async () => {
    if (!registerData.name.trim() || !registerData.email.trim() || !registerData.password.trim()) {
      Alert.alert('Campos incompletos', 'Completá nombre, email y contraseña.');
      return;
    }

    if (registerData.password !== registerData.confirmPassword) {
      Alert.alert('Contraseñas', 'Las contraseñas no coinciden.');
      return;
    }

    setLoading(true);

    try {
      const res = await fetch('http://10.0.2.2:8080/api/v1/register', {
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

      console.log('STATUS:', res.status);
      console.log('BODY:', data);

      if (!res.ok) {

        const backendMsg =
          data?.message ||
          data?.error ||
          data?.details?.error ||
          'Ocurrió un error en el servidor.';

        if (res.status === 500 || data?.details?.error === 'el email ya está en uso') {
          Alert.alert('Email en uso', backendMsg);
          return;
        }

        if (res.status === 400) {
          Alert.alert('Error de validación', backendMsg);
          return;
        }

        Alert.alert('Error', backendMsg);
        return;
      }

      Alert.alert('Cuenta creada', 'Tu cuenta fue creada correctamente.', [
        {
          text: 'OK',
          onPress: () => {
            console.log('Usuario creado:', data);
            navigation.navigate('Login');
          },
        },
      ]);
    } catch (error) {
      console.error('Error de red:', error);
      Alert.alert('Error de conexión', 'No se pudo conectar con el servidor. Revisá la URL o tu red.');
    } finally {
      setLoading(false);
    }
  };



  return (
    <View style={styles.container}>
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
        marginTop={25}
        onChangeText={(text) => handleRegisterData({ name: text })}
        value={registerData.name}
      />

      <FormInput
        iconName="email"
        size={24}
        color={SUBTEXT}
        placeholder="ejemplo@correo.com"
        placeholderTextColor={SUBTEXT}
        keyBoardType="email-address"
        labelText="Correo electronico"
        marginTop={25}
        onChangeText={(text) => handleRegisterData({ email: text })}
        value={registerData.email}
      />

      <FormInput
        iconName="lock-outline"
        size={24}
        color={SUBTEXT}
        placeholder="Crea una contraseña segura"
        placeholderTextColor={SUBTEXT}
        keyBoardType="visible-password"
        labelText="Contraseña"
        marginTop={25}
        onChangeText={(text) => handleRegisterData({ password: text })}
        value={registerData.password}
      />

      <FormInput
        iconName="lock-outline"
        size={24}
        color={SUBTEXT}
        placeholder="Repite la contraseña"
        placeholderTextColor={SUBTEXT}
        keyBoardType="visible-password"
        labelText="Confirmar contraseña"
        marginTop={25}
        onChangeText={(text) => handleRegisterData({ confirmPassword: text })}
        value={registerData.confirmPassword}
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
          color={MAIN_COLOR}
          title='Iniciar Sesion'
          style={[styles.button, !validEntries && { opacity: 0.7 }]}
          disabled={!validEntries}
          onPress={handleSubmit}
        >
          <Text style={styles.buttonText}>{loading ? 'Creando cuenta...' : 'Crear cuenta'}</Text>
        </Pressable>
      </View>

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: BG
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