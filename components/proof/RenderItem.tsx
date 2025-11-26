import { Dimensions, StyleSheet, Text, View } from "react-native";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { getStatusConfig } from "@/components/proof/getStatusConfig";
import { CARD_BG, STRONG_TEXT, SUBTEXT } from "@/src/constant";
import { Proof } from "@/src/types";

const { width } = Dimensions.get("window");

export const RenderItem = ({ item }: { item: Proof }) => {
    const statusConfig = getStatusConfig("APROBADO");

    return (
        <View style={styles.historyCard}>
            <View style={styles.historyLeft}>
                <View style={styles.infoRow}>
                    <Text style={styles.infoLabel}>Comprobante:</Text>
                    <Text style={styles.infoValue}>{item.proof_mp_id}</Text>
                </View>

                <View style={styles.infoRow}>
                    <Text style={styles.infoLabel}>Fecha de pago:</Text>
                    <Text style={styles.infoValue}>{item.date_approved_mp}</Text>
                </View>
                <View style={styles.infoRow}>
                    <Text style={styles.infoLabel}>Monto:</Text>
                    <Text style={styles.infoValue}>${item.amount_mp}</Text>
                </View>

                <View style={styles.infoRow}>
                    <Text style={styles.infoLabel}>Fecha de subida:</Text>
                    <Text style={styles.infoValue}>{item.proof_date}</Text>
                </View>

            </View>

            <View style={styles.historyRight}>
                <View
                    style={[
                        styles.statusCircleOuter,
                        { backgroundColor: statusConfig.outerBg },
                    ]}
                >
                    <View
                        style={[
                            styles.statusCircleInner,
                            { backgroundColor: statusConfig.innerBg },
                        ]}
                    >
                        <Icon
                            name="file-document-outline"
                            size={26}
                            color={statusConfig.iconColor}
                        />
                    </View>
                </View>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    historyCard: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        backgroundColor: CARD_BG,
        borderRadius: 18,
        paddingVertical: 13,
        paddingHorizontal: 13,
        marginBottom: 12,
        width: width - 30,
        alignSelf: "center",
        borderWidth: 1,
        borderColor: "#1E1E1E",
    },
    historyLeft: {
        flex: 1,
        marginRight: 10,
    },
    infoRow: {
        flexDirection: "row",
        marginBottom: 3,
    },
    infoLabel: {
        color: SUBTEXT,
        fontSize: 14,
        fontWeight: "600",
        marginRight: 4,
    },
    infoValue: {
        color: STRONG_TEXT,
        fontSize: 14,
        flexShrink: 1,
    },
    historyRight: {
        alignItems: "center",
        justifyContent: "center",
    },
    statusCircleOuter: {
        width: 55,
        height: 55,
        borderRadius: 25,
        alignItems: "center",
        justifyContent: "center",
        marginBottom: 4,
    },
    statusCircleInner: {
        width: 40,
        height: 40,
        borderRadius: 20,
        alignItems: "center",
        justifyContent: "center",
    },
    historyStatusText: {
        fontSize: 14,
        fontWeight: "700",
    },
});
