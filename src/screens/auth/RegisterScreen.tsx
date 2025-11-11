import Icon from 'react-native-vector-icons/AntDesign';

import FormInput from '@/components/inputs/FormInput';
import { BG, MAIN_COLOR, STRONG_TEXT, SUBTEXT } from '@/src/constant';
import { Pressable, StyleSheet, Text, View } from 'react-native';

export default function RegisterScreen() {
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
        placeholder="Introduce tu nombre"
        placeholderTextColor={SUBTEXT}
        keyBoardType="visible-password"
        labelText="Nombre"
        marginTop={25}
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
        <Pressable color={MAIN_COLOR} title='Iniciar Sesion' style={styles.button}>
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