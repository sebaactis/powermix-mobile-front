import Icon from 'react-native-vector-icons/AntDesign';

import FormInput from '@/components/inputs/FormInput';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { mainColor } from '@/src/constant';

export default function RegisterScreen() {
  return (
    <View style={styles.container}>
      <View style={styles.iconContainer}>
        <Icon style={styles.icon} name="user-add" size={55} color="rgb(190, 24, 93)" />
      </View>
      <Text style={styles.title}>Crear una cuenta nueva</Text>
      <Text style={styles.subtitle}>Unite para empezar a disfrutar de nuestro servicio</Text>

      <FormInput
        iconName="abc"
        size={24}
        color="#848496"
        placeholder="Introduce tu nombre"
        placeholderTextColor={'#848496'}
        keyBoardType="visible-password"
        labelText="Nombre"
        marginTop={25}
      />

      <FormInput
        iconName="email"
        size={24}
        color="#848496"
        placeholder="ejemplo@correo.com"
        placeholderTextColor={'#848496'}
        keyBoardType="email-address"
        labelText="Correo electronico"
        marginTop={25}
      />

      <FormInput
        iconName="lock-outline"
        size={24}
        color="#848496"
        placeholder="Crea una contraseña segura"
        placeholderTextColor={'#848496'}
        keyBoardType="visible-password"
        labelText="Contraseña"
        marginTop={25}
      />

      <FormInput
        iconName="lock-outline"
        size={24}
        color="#848496"
        placeholder="Repite la contraseña"
        placeholderTextColor={'#848496'}
        keyBoardType="visible-password"
        labelText="Confirmar contraseña"
        marginTop={25}
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
        <Pressable color={mainColor} title='Iniciar Sesion' style={styles.button}>
          <Text style={styles.buttonText}>Crear cuenta</Text>
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
    backgroundColor: '#171717'
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
    color: "#FFFFFF",
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
    color: "#d6d6d6",
  },
  subText: {
    fontSize: 16,
    color: '#6b7280',
    textAlign: 'center',
  },
  link: {
    color: mainColor,
    fontWeight: '600',
  },
  button: {
    backgroundColor: mainColor,
    marginTop: 25,
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
  buttonsContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    gap: 15
  }
});