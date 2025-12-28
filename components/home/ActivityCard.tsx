import { MAIN_COLOR, STRONG_TEXT, SUBTEXT } from "@/src/constant";
import { Proof } from "@/src/types";
import { getResponsiveFontSize } from "@/src/helpers/responsive";
import React from "react";
import {
  Pressable,
  StyleSheet,
  Text,
  View,
  ViewStyle,
  PressableStateCallbackType,
} from "react-native";
import MaterialIcon from "react-native-vector-icons/MaterialCommunityIcons";

type Props = {
  proof: Proof;
  onPress?: () => void;
};

export default function ActivityCard({ proof, onPress }: Props) {
  const renderCardStyle = ({ pressed }: PressableStateCallbackType): ViewStyle[] => [
    styles.card,
    pressed && styles.cardPressed,
  ];

  return (
    <Pressable style={renderCardStyle} onPress={onPress} android_ripple={{ color: "#00000033" }}>
      {/* Columna izquierda: icono + info */}
      <View style={styles.leftSection}>
        <View style={styles.iconWrapper}>
          <MaterialIcon
            name="file-document-outline"
            size={26}
            color={MAIN_COLOR}
          />
        </View>

        <View style={styles.textSection}>
          {/* Encabezado */}
          <Text style={styles.title} numberOfLines={1}>
            Comprobante #{proof.proof_mp_id}
          </Text>

          {/* Fechas en dos columnas */}
          <View style={styles.row}>
            <View style={styles.metaItem}>
              <MaterialIcon
                name="cloud-upload-outline"
                size={14}
                color={SUBTEXT}
                style={styles.metaIcon}
              />
              <Text style={styles.metaLabel}>Carga</Text>
              <Text style={styles.metaValue} numberOfLines={1}>
                {proof.proof_date}
              </Text>
            </View>

            <View style={styles.metaItem}>
              <MaterialIcon
                name="calendar-check-outline"
                size={14}
                color={SUBTEXT}
                style={styles.metaIcon}
              />
              <Text style={styles.metaLabel}>Pago</Text>
              <Text style={styles.metaValue} numberOfLines={1}>
                {proof.date_approved_mp}
              </Text>
            </View>

            <View style={styles.metaItem}>
              <MaterialIcon
                name="cart-variant"
                size={14}
                color={SUBTEXT}
                style={styles.metaIcon}
              />
              <Text style={styles.metaLabel}>Producto</Text>
              <Text style={styles.metaValue} numberOfLines={1}>
                {proof.product_name }
              </Text>
            </View>
          </View>
        </View>
      </View>

      {/* Columna derecha: monto */}
      <View style={styles.amountContainer}>
        <Text style={styles.amountLabel}>Monto</Text>
        <Text style={styles.amountValue}>${proof.amount_mp}</Text>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 14,
    backgroundColor: "#252426",
    borderRadius: 14,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#ffffff10",
    shadowColor: "#000",
    shadowOpacity: 0.25,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 3 },
    elevation: 3,
  },
  cardPressed: {
    opacity: 0.85,
    transform: [{ scale: 0.99 }],
  },
  leftSection: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
  },
  iconWrapper: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: "#1a191b",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 10,
  },
  textSection: {
    flex: 1,
  },
  title: {
    color: STRONG_TEXT,
    fontSize: getResponsiveFontSize(15, 13),
    fontWeight: "600",
    marginBottom: 7,
  },
  row: {
    flexDirection: "column",
    gap: 10,
  },
  metaItem: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    flexWrap: "nowrap",
  },
  metaIcon: {
    marginRight: 4,
  },
  metaLabel: {
    color: SUBTEXT,
    fontSize: getResponsiveFontSize(12, 11),
    marginRight: 4,
  },
  metaValue: {
    color: STRONG_TEXT,
    fontSize: getResponsiveFontSize(12, 11),
    flexShrink: 1,
  },
  amountContainer: {
    marginLeft: 12,
    alignItems: "flex-end",
    justifyContent: "center",
  },
  amountLabel: {
    color: SUBTEXT,
    fontSize: getResponsiveFontSize(12, 11),
    marginBottom: 2,
  },
  amountValue: {
    color: MAIN_COLOR,
    fontSize: getResponsiveFontSize(17, 15),
    fontWeight: "700",
  },
});
