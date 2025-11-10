import MaterialIcon from 'react-native-vector-icons/FontAwesome';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

import FormInput from '@/components/inputs/FormInput';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { mainColor } from '@/src/constant';

export default function LoginScreen({ navigation  }) {
  return (
    <View style={styles.container}>
      <View style={styles.iconContainer}>
        <Icon style={styles.icon} name="arm-flex-outline" size={55} color="rgb(190, 24, 93)" />
      </View>
      <Text style={styles.title}>Bienvenido</Text>
      <Text style={styles.subtitle}>Inicie sesión para continuar</Text>

      <FormInput
        iconName="email"
        size={24}
        color="#848496"
        placeholder="ejemplo@correo.com"
        placeholderTextColor={'#848496'}
        keyBoardType="email-address"
        labelText="Correo electronico"
        marginTop={35}
      />

      <FormInput
        iconName="lock-outline"
        size={24}
        color="#848496"
        placeholder="Contraseña"
        placeholderTextColor={'#848496'}
        keyBoardType="visible-password"
        labelText="Contraseña"
        marginTop={35}
      />

      <Text style={styles.forgotPassword}>¿Olvidaste tu contraseña?</Text>


      <View style={styles.buttonsContainer}>
        <Pressable color={mainColor} title='Iniciar Sesion' style={styles.button}>
          <Text style={styles.buttonText}>Iniciar Sesion</Text>
        </Pressable>

        <Text style={styles.oText}>o</Text>

        <Pressable color={mainColor} title='Iniciar Sesion' style={styles.googleButton}>
          <MaterialIcon style={styles.icon} name="google" size={30} color="rgb(255, 255, 255)" />
          <Text style={styles.buttonText}>Iniciar sesion con Google</Text>
        </Pressable>
      </View>

      <View style={styles.registerTextContainer}>
        <Text style={styles.register}>¿No tenés cuenta? </Text>
        <Text onPress={() => navigation.navigate("Register")} style={styles.registerSubText}>Registrate</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#171717'
  },
  iconContainer: {
    backgroundColor: '#8b003a7c',
    width: 75,
    height: 85,
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
    color: "#FFFFFF",
    fontWeight: 'bold',
  },
  subtitle: {
    fontSize: 17.5,
    marginTop: 10,
    color: "#d6d6d6",
  },
  forgotPassword: {
    color: mainColor,
    marginTop: 8,
    textAlign: 'right',
    width: '85%',
    fontSize: 16,
    fontWeight: 500,
  },
  button: {
    backgroundColor: mainColor,
    marginTop: 45,
    borderRadius: 8,
    paddingVertical: 14,
    width: '86%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    color: "#FFFFFF",
    fontSize: 17,
    fontWeight: 600
  },
  registerTextContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    width: '85%',
    marginTop: 13,
    gap: 2
  },
  register: {
    color: "#ffffff",
    fontSize: 16,
    fontWeight: 500
  },
  registerSubText: {
    color: mainColor,
    fontSize: 16,
    fontWeight: 500
  },
  googleButton: {
    flexDirection: 'row',
    backgroundColor: "#404040",
    borderRadius: 8,
    paddingVertical: 10,
    width: '86%',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 15
  },
  buttonsContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    gap: 15
  },
  oText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: 500
  }
});