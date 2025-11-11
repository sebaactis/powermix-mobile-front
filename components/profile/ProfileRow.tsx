import { CARD_BG, MAIN_COLOR, STRONG_TEXT, SUBTEXT, TINT_BOX } from "@/src/constant";
import {
    Dimensions,
    Pressable,
    StyleSheet,
    Text,
    View
} from "react-native";

import Icon from "react-native-vector-icons/FontAwesome";

type RowProps = {
  iconLeft: string;
  title: string;
  subtitle?: string;
  rightType?: "link" | "lock" | "none";
  rightText?: string;
  onRightPress?: () => void;
};

const { width } = Dimensions.get("window");

const ProfileRow: React.FC<RowProps> = ({
  iconLeft,
  title,
  subtitle,
  rightType = "none",
  rightText,
  onRightPress,
}) => {
  return (
    <View style={styles.card}>
      <View style={styles.cardLeftIconBox}>
        <Icon name={iconLeft} size={20} color="#F0CADB" />
      </View>

      <View style={styles.cardCenter}>
        <Text style={styles.cardTitle}>{title}</Text>
        {!!subtitle && <Text style={styles.cardSubtitle}>{subtitle}</Text>}
      </View>

      <View style={styles.cardRight}>
        {rightType === "link" && !!rightText ? (
          <Pressable onPress={onRightPress} hitSlop={6}>
            <Text style={styles.link}>{rightText}</Text>
          </Pressable>
        ) : rightType === "lock" ? (
          <Icon name="lock" size={18} color="#AEB8C4" />
        ) : null}
      </View>
    </View>
  );
};

export default ProfileRow;

const styles = StyleSheet.create({
      card: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: CARD_BG,
    borderRadius: 18,
    padding: 14,
    marginBottom: 14,
    width: width - 40,
    alignSelf: "center",
    elevation: 2,
    shadowColor: "#000",
    shadowOpacity: 0.18,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
  },
  cardLeftIconBox: {
    width: 50,
    height: 50,
    borderRadius: 12,
    backgroundColor: TINT_BOX,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 14,
  },
  cardCenter: {
    flex: 1,
  },
  cardTitle: {
    color: STRONG_TEXT,
    fontSize: 17,
    fontWeight: "700",
  },
  cardSubtitle: {
    color: SUBTEXT,
    fontSize: 15,
    marginTop: 4,
  },
  cardRight: {
    marginLeft: 10,
  },
  link: {
    color: MAIN_COLOR,
    fontSize: 16,
    fontWeight: "700",
  },
})