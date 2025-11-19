import ProfileRow from "@/components/profile/ProfileRow";
import { BG, MAIN_COLOR, STRONG_TEXT, SUBTEXT } from "@/src/constant";
import { useAuth } from "@/src/context/AuthContext";
import React from "react";
import {
  Platform,
  Pressable,
  StatusBar,
  StyleSheet,
  Text,
  View,
} from "react-native";
import Icon from "react-native-vector-icons/FontAwesome";

export default function ProfileScreen({ navigation }) {

  const { user, signOut } = useAuth();

  const handleEditName = () => {
    console.log("editar nombre");
  };

  const handleChangePassword = () => {
    console.log("cambiar contraseña");
  };



  return (
    <View style={styles.screen}>
      <View style={styles.header}>
        <Pressable style={styles.headerBtnLeft} onPress={() => navigation.navigate("Home")} hitSlop={8}>
          <Icon name="arrow-left" size={24} color="#FFFFFF" />
        </Pressable>

        <Text style={styles.headerTitle}>Mi Perfil</Text>

      </View>


      <View style={styles.content}>

        <View style={styles.avatarWrap}>
          <View style={styles.avatarOuter}>
            <View style={styles.avatarInner}>
              <Icon name="user" size={58} color="#EDEDED" />
            </View>
          </View>

          <Pressable style={styles.editFab} onPress={() => console.log("editar avatar")}>
            <Icon name="pencil" size={16} color="#FFFFFF" />
          </Pressable>
        </View>


        <Text style={styles.name}>{user.name}</Text>
        <Text style={styles.email}>{user.email}</Text>


        <View style={styles.cards}>
          <ProfileRow
            iconLeft="user"
            title="Nombre completo"
            subtitle={user.name}
            rightType="link"
            rightText="Editar"
            onRightPress={handleEditName}
          />

          <ProfileRow
            iconLeft="envelope"
            title="Correo electrónico"
            subtitle={user.email}
            rightType="lock"
          />

          <ProfileRow
            iconLeft="key"
            title="Contraseña"
            subtitle="••••••••••"
            rightType="link"
            rightText="Cambiar"
            onRightPress={handleChangePassword}
          />
        </View>

        <Pressable style={styles.closeSessionBtn} onPress={signOut}>
          <Text style={styles.textCloseSessionBtn}>Cerrar sesión</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: BG,
    paddingTop:
      Platform.OS === "android" ? (StatusBar.currentHeight || 0) : 0,
  },

  header: {
    height: 56,
    justifyContent: "center",
    alignItems: "center",
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: "#838383",
    marginBottom: 30
  },
  headerTitle: {
    color: STRONG_TEXT,
    fontSize: 18,
    fontWeight: "700",
  },
  headerBtnLeft: {
    position: "absolute",
    left: 20,
    height: 40,
    width: 40,
    alignItems: "center",
    justifyContent: "center",
  },
  headerBtnRight: {
    position: "absolute",
    right: 20,
    height: 40,
    width: 40,
    alignItems: "center",
    justifyContent: "center",
  },

  /** Content */
  content: {
    paddingHorizontal: 20,
  },

  /** Avatar */
  avatarWrap: {
    alignSelf: "center",
    marginTop: 6,
    marginBottom: 15,
  },
  avatarOuter: {
    width: 118,
    height: 118,
    borderRadius: 59,
    borderWidth: 4,
    borderColor: MAIN_COLOR,
    alignItems: "center",
    justifyContent: "center",
  },
  avatarInner: {
    width: 106,
    height: 106,
    borderRadius: 53,
    backgroundColor: "#232325",
    alignItems: "center",
    justifyContent: "center",
  },
  editFab: {
    position: "absolute",
    right: -2,
    bottom: -2,
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: MAIN_COLOR,
    alignItems: "center",
    justifyContent: "center",
    elevation: 3,
    shadowColor: "#000",
    shadowOpacity: 0.25,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
  },

  /** Name + email */
  name: {
    textAlign: "center",
    color: STRONG_TEXT,
    fontSize: 30,
    fontWeight: "800",
  },
  email: {
    textAlign: "center",
    color: SUBTEXT,
    fontSize: 17,
    marginTop: 6,
    marginBottom: 14,
  },

  cards: {
    marginTop: 8,
    paddingBottom: 26,
  },
  closeSessionBtn: {
    backgroundColor: '#8b0000',
    flexDirection: 'row',
    gap: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 80,
    paddingVertical: 10,
    borderRadius: 10,
  },
  textCloseSessionBtn: {
    color: '#FFFFFF',
    fontSize: 17,
    fontWeight: '600',
  }
});
