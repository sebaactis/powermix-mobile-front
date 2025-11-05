import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { View, Text, StyleSheet, TextInput, Pressable } from 'react-native';

export default function LoginScreen({ navigator }) {
  return (
    <View style={styles.container}>
      <View style={styles.iconContainer}>
        <Icon style={styles.icon} name="arm-flex-outline" size={55} color="rgb(190, 24, 93)" />
      </View>
      <Text style={styles.title}>Bienvenido</Text>
      <Text style={styles.subtitle}>Inicie sesión para continuar</Text>

      <View style={styles.inputContainer}>
        <Text style={styles.emailLabel}>Correo electronico</Text>

        <View style={styles.inputRow}>
          <Icon name="email-outline" size={24} color="#848496" />
          <TextInput
            style={styles.emailInput}
            placeholder='ejemplo@correo.com'
            placeholderTextColor={'#848496'}
            keyboardType="email-address"
            autoCapitalize='none'
          />
        </View>

      </View>

      <View style={styles.inputContainer}>
        <Text style={styles.emailLabel}>Contraseña</Text>

        <View style={styles.inputRow}>
          <Icon name="lock-outline" size={24} color="#848496" />
          <TextInput
            style={styles.emailInput}
            placeholder='Contraseña'
            placeholderTextColor={'#848496'}
            keyboardType="visible-password"
            autoCapitalize='none'
          />
        </View>
      </View>

      <Text style={styles.forgotPassword}>¿Olvidaste tu contraseña?</Text>

      <Pressable color='#be185d' title='Iniciar Sesion' style={styles.button}>
        <Text style={styles.buttonText}>Iniciar Sesion</Text>
      </Pressable>

      <View style={styles.registerTextContainer}>
        <Text style={styles.register}>¿No tenés cuenta? </Text>
        <Text style={styles.registerSubText}>Registrate</Text>
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
  inputContainer: {
    marginTop: 35,
    width: '100%',
    justifyContent: 'center',
    paddingHorizontal: 30,
    gap: 6
  },
  inputRow: {
    flexDirection: 'row',      // icono + input en fila
    alignItems: 'center',
    borderStyle: 'solid',
    borderColor: "#848496",
    borderWidth: 0.7,
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 4,
    backgroundColor: "#53535328",
  },
  emailLabel: {
    color: "#d6d6d6",
    fontSize: 16,
    fontWeight: '400',
  },
  emailInput: {
    borderRadius: 7,
    height: 50,
    paddingHorizontal: 10,
    color: "#FFFFFF",
    flex: 1,
    fontSize: 16
  },
  forgotPassword: {
    color: "#be185d",
    marginTop: 8,
    textAlign: 'right',
    width: '85%',
    fontSize: 16,
    fontWeight: 500,
  },
  button: {
    backgroundColor: "#be185d",
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
    color: "#be185d",
    fontSize: 16,
    fontWeight: 500
  }
});