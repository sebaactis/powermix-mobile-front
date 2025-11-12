import { Dimensions, StyleSheet, Text, View } from "react-native";
import Icon from "react-native-vector-icons/FontAwesome";
import { getStatusConfig } from "@/components/proof/getStatusConfig";
import { CARD_BG, STRONG_TEXT, SUBTEXT } from "@/src/constant";

const { width } = Dimensions.get("window");

export const RenderItem = ({ item }: { item: ReceiptItem }) => {
    const statusConfig = getStatusConfig(item.status);

    return (
        <View style={styles.historyCard}>
            {/* Icono circular de estado */}
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
                        name={statusConfig.iconName}
                        size={16}
                        color={statusConfig.iconColor}
                    />
                </View>
            </View>

            {/* Texto central */}
            <View style={styles.historyCenter}>
                <Text style={styles.historyMachine}>{item.machine}</Text>
                <Text style={styles.historyDate}>
                    {item.date} - {"\n"}
                    {item.time}
                </Text>
            </View>

            {/* Estado a la derecha */}
            <View style={styles.historyRight}>
                <Text
                    style={[
                        styles.historyStatusText,
                        { color: statusConfig.textColor },
                    ]}
                >
                    {statusConfig.label}
                </Text>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    historyCard: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: CARD_BG,
        borderRadius: 18,
        paddingVertical: 13,
        paddingHorizontal: 13,
        marginBottom: 12,
        width: width - 40,
        alignSelf: "center",
        borderWidth: 1,
        borderColor: "#1E1E1E",
    },
    statusCircleOuter: {
        width: 50,
        height: 50,
        borderRadius: 23,
        alignItems: "center",
        justifyContent: "center",
        marginRight: 12,
    },
    statusCircleInner: {
        width: 35,
        height: 35,
        borderRadius: 23,
        alignItems: "center",
        justifyContent: "center",
    },
    historyCenter: {
        flex: 1,
    },
    historyMachine: {
        color: STRONG_TEXT,
        fontSize: 17,
        fontWeight: "700",
        marginBottom: 4,
    },
    historyDate: {
        color: SUBTEXT,
        fontSize: 14,
    },
    historyRight: {
        marginLeft: 10,
    },
    historyStatusText: {
        fontSize: 16,
        fontWeight: "700",
    },
})