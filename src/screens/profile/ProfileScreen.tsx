import ProfileRow from "@/components/profile/ProfileRow";
import EditNameModal from "@/components/profile/EditNameModal";
import ChangePasswordModal from "@/components/profile/ChangePasswordModal";

import { BG, STRONG_TEXT } from "@/src/constant";
import { useAuth } from "@/src/context/AuthContext";
import { getResponsiveFontSize, getResponsivePadding, RESPONSIVE_SIZES } from "@/src/helpers/responsive";

import React, { useState } from "react";
import {
  Pressable,
  StyleSheet,
  Text,
  View,
  ScrollView,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Icon from "react-native-vector-icons/FontAwesome";
import Toast from "react-native-toast-message";

export default function ProfileScreen({ navigation }) {
  const { user, signOut } = useAuth();

  const [showEditName, setShowEditName] = useState(false);
  const [showChangePassword, setShowChangePassword] = useState(false);

  const handleSignOut = () => {
    signOut();
    Toast.show({
      type: "appSuccess",
      text1: "Sesión cerrada correctamente!",
    });
  }

  return (
    <SafeAreaView style={styles.screen} edges={['top']}>
      <View style={styles.header}>
        <Pressable
          style={styles.headerBtnLeft}
          onPress={() => navigation.navigate("Home")}
          hitSlop={8}
        >
          <Icon name="arrow-left" size={20} color="#FFFFFF" />
        </Pressable>

        <Text style={styles.headerTitle}>Mi Perfil</Text>
      </View>

      <ScrollView
        style={styles.content}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.avatarWrap}>
          <View style={styles.avatarOuter}>
            <View style={styles.avatarInner}>
              <Icon name="user" size={52} color="#EDEDED" />
            </View>
          </View>
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
            onRightPress={() => setShowEditName(true)}
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
            onRightPress={() => setShowChangePassword(true)}
          />
        </View>

        <Pressable style={styles.closeSessionBtn} onPress={handleSignOut}>
          <Text style={styles.textCloseSessionBtn}>Cerrar sesión</Text>
        </Pressable>
      </ScrollView>

      <EditNameModal
        visible={showEditName}
        onClose={() => setShowEditName(false)}
      />

      <ChangePasswordModal
        visible={showChangePassword}
        onClose={() => setShowChangePassword(false)}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: BG,
  },

  header: {
    height: 56,
    justifyContent: "center",
    alignItems: "center",
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: "#838383",
    marginBottom: 30,
  },
  headerTitle: {
    color: STRONG_TEXT,
    fontSize: getResponsiveFontSize(18, 16),
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

  content: {
    paddingHorizontal: getResponsivePadding(20, 18),
  },
  scrollContent: {
    paddingBottom: RESPONSIVE_SIZES.header.paddingTop,
  },

  avatarWrap: {
    alignSelf: "center",
    marginTop: 6,
    marginBottom: 15,
  },
  avatarOuter: {
    width: 100,
    height: 100,
    borderRadius: 59,
    borderWidth: 4,
    borderColor: "#ff2b80",
    alignItems: "center",
    justifyContent: "center",
  },
  avatarInner: {
    width: 90,
    height: 90,
    borderRadius: 53,
    backgroundColor: "#232325",
    alignItems: "center",
    justifyContent: "center",
  },
  name: {
    textAlign: "center",
    color: STRONG_TEXT,
    fontSize: getResponsiveFontSize(26, 24),
    fontWeight: "800",
  },
  email: {
    textAlign: "center",
    color: "#9e9ea0",
    fontSize: getResponsiveFontSize(17, 16),
    marginTop: 6,
    marginBottom: 14,
  },

  cards: {
    marginTop: 8,
    paddingBottom: 26,
  },

  closeSessionBtn: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginHorizontal: 80,
    paddingTop: 20,
    borderRadius: 10,
  },
  textCloseSessionBtn: {
    color: "#ff0000",
    fontSize: getResponsiveFontSize(17, 16),
    fontWeight: "500",
  },
});
