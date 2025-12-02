import { Dimensions, StyleSheet, Text, View } from "react-native";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { CARD_BG, STRONG_TEXT, SUBTEXT } from "@/src/constant";
import { Proof } from "@/src/types";

const { width } = Dimensions.get("window");

const CARD_STYLE = {
    label: "Aprobado",
    textColor: "#1CC8A0",
    iconName: "check",
    iconColor: "#E6FFFA",
    outerBg: "#096867",
    innerBg: "#007266",
};

export const RenderItem = ({ item }: { item: Proof }) => {
    return (
        <View
            style={[
                styles.card,
                { borderLeftColor: CARD_STYLE.outerBg },
            ]}
        >
            <View style={styles.headerRow}>
                <View style={styles.headerLeft}>
                    <View
                        style={[
                            styles.iconContainer,
                            { backgroundColor: CARD_STYLE.innerBg },
                        ]}
                    >
                        <Icon
                            name="file-document-outline"
                            size={22}
                            color={CARD_STYLE.iconColor}
                        />
                    </View>

                    <View style={styles.headerTextBlock}>
                        <Text style={styles.labelSmall}>Comprobante</Text>
                        <Text style={styles.proofId} numberOfLines={1}>
                            #{item.proof_mp_id}
                        </Text>
                    </View>
                </View>

                {/* Monto en el header (donde antes iba el status) */}
                <View style={styles.amountHeaderBlock}>
                    <Text style={styles.amountHeaderLabel}>Monto</Text>
                    <Text
                        style={[
                            styles.amountHeaderValue,
                            { color: CARD_STYLE.textColor },
                        ]}
                    >
                        ${item.amount_mp}
                    </Text>
                </View>
            </View>

            {/* Fechas abajo */}
            <View style={styles.metaBlock}>
                <View style={styles.metaRow}>
                    <Icon
                        name="calendar-check-outline"
                        size={14}
                        color={SUBTEXT}
                        style={styles.metaIcon}
                    />
                    <Text style={styles.metaLabel}>Fecha de pago:</Text>
                    <Text style={styles.metaValue} numberOfLines={1}>
                        {item.date_approved_mp}
                    </Text>
                </View>

                <View style={styles.metaRow}>
                    <Icon
                        name="cloud-upload-outline"
                        size={14}
                        color={SUBTEXT}
                        style={styles.metaIcon}
                    />
                    <Text style={styles.metaLabel}>Fecha de subida:</Text>
                    <Text style={styles.metaValue} numberOfLines={1}>
                        {item.proof_date}
                    </Text>
                </View>

                <View style={styles.metaRow}>
                    <Icon
                        name="cart-variant"
                        size={14}
                        color={SUBTEXT}
                        style={styles.metaIcon}
                    />
                    <Text style={styles.metaLabel}>Producto:</Text>
                    <Text style={styles.metaValue} numberOfLines={1}>
                        {item.product_name}
                    </Text>
                </View>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    card: {
        width: width - 30,
        alignSelf: "center",
        backgroundColor: CARD_BG,
        borderRadius: 16,
        paddingVertical: 10,
        paddingHorizontal: 14,
        marginBottom: 12,
        borderLeftWidth: 7,
        borderColor: "#ffffff10",
        shadowColor: "#000",
        shadowOpacity: 0.2,
        shadowRadius: 5,
        shadowOffset: { width: 0, height: 3 },
        elevation: 2,
    },
    headerRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 8,
    },
    headerLeft: {
        flexDirection: "row",
        alignItems: "center",
        flex: 1,
        marginRight: 10,
    },
    iconContainer: {
        width: 32,
        height: 32,
        borderRadius: 10,
        alignItems: "center",
        justifyContent: "center",
        marginRight: 8,
    },
    headerTextBlock: {
        flex: 1,
    },
    labelSmall: {
        fontSize: 12,
        color: SUBTEXT,
        marginBottom: 1,
    },
    proofId: {
        fontSize: 15,
        color: STRONG_TEXT,
        fontWeight: "600",
    },
    amountHeaderBlock: {
        alignItems: "flex-end",
        justifyContent: "center",
    },
    amountHeaderLabel: {
        fontSize: 12,
        color: SUBTEXT,
        marginBottom: 2,
    },
    amountHeaderValue: {
        fontSize: 18,
        fontWeight: "700",
    },
    metaBlock: {
        marginTop: 4,
    },
    metaRow: {
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 4,
    },
    metaIcon: {
        marginRight: 4,
    },
    metaLabel: {
        fontSize: 13,
        color: SUBTEXT,
        marginRight: 4,
    },
    metaValue: {
        fontSize: 13,
        color: STRONG_TEXT,
        flexShrink: 1,
    },
});
