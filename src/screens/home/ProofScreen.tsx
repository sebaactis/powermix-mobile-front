import { BG, CARD_BG, MAIN_COLOR, STRONG_TEXT, SUBTEXT } from "@/src/constant";
import { useState } from "react";
import {
    View,
    Text,
    StyleSheet,
    Pressable,
    FlatList,
    Dimensions,
    Platform,
    StatusBar,
    TextInput,
} from "react-native";
import Icon from "react-native-vector-icons/FontAwesome";

const { width } = Dimensions.get("window");

type ReceiptStatus = "APROBADO" | "PENDIENTE" | "RECHAZADO";

type ReceiptItem = {
    id: string;
    machine: string;
    date: string;
    time: string;
    status: ReceiptStatus;
};

const DATA: ReceiptItem[] = [
    {
        id: "1",
        machine: "Máquina V-1234",
        date: "15 de Octubre, 2023",
        time: "10:30 AM",
        status: "APROBADO",
    },
    {
        id: "2",
        machine: "Máquina V-5678",
        date: "14 de Octubre, 2023",
        time: "09:15 AM",
        status: "PENDIENTE",
    },
    {
        id: "3",
        machine: "Máquina V-9012",
        date: "13 de Octubre, 2023",
        time: "04:50 PM",
        status: "RECHAZADO",
    },
];

export default function ProofScreen() {
    const [manualCode, setManualCode] = useState("");

    function getStatusConfig(status: ReceiptStatus) {
        switch (status) {
            case "APROBADO":
                return {
                    label: "Aprobado",
                    textColor: "#1CC8A0",
                    iconName: "check",
                    iconColor: "#E6FFFA",
                    outerBg: "#003B3A",
                    innerBg: "#007266",
                };
            case "PENDIENTE":
                return {
                    label: "Pendiente",
                    textColor: "#F5B41B",
                    iconName: "clock-o",
                    iconColor: "#FFF7D6",
                    outerBg: "#3A2A00",
                    innerBg: "#7A4B00",
                };
            case "RECHAZADO":
            default:
                return {
                    label: "Rechazado",
                    textColor: "#FF4B7D",
                    iconName: "close",
                    iconColor: "#FFE5EC",
                    outerBg: "#3F0016",
                    innerBg: "#7C0030",
                };
        }
    }

    const handleBack = () => {
        // TODO: navigation.goBack()
        console.log("back");
    };

    const handleUpload = () => {
        console.log("Subir comprobante. Código manual:", manualCode);
    };

    const renderItem = ({ item }: { item: ReceiptItem }) => {
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

    return (
        <View style={styles.screen}>
            <View style={styles.header}>
                <Pressable style={styles.headerBtnLeft} onPress={handleBack} hitSlop={8}>
                    <Icon name="arrow-left" size={20} color="#FFFFFF" />
                </Pressable>

                <Text style={styles.headerTitle}>Mis Comprobantes</Text>
            </View>

            <FlatList
                contentContainerStyle={styles.listContent}
                ListHeaderComponent={
                    <View>
                        {/* Card principal: foto + input */}
                        <View style={styles.topCard}>
                            <Text style={styles.topCardText}>
                                Toma una foto o selecciona una imagen de tu galería.
                            </Text>

                            <View style={styles.topInputWrapper}>
                                <Text style={styles.topInputLabel}>
                                    O ingresa el número del comprobante:
                                </Text>

                                <TextInput
                                    style={styles.topInput}
                                    placeholder="Ej: 000123-ABC"
                                    placeholderTextColor="#6B7280"
                                    value={manualCode}
                                    onChangeText={setManualCode}
                                    autoCapitalize="none"
                                    autoCorrect={false}
                                    keyboardType="default"
                                />
                            </View>

                            <Pressable style={styles.uploadBtn} onPress={handleUpload}>
                                <View style={styles.uploadBtnIconBox}>
                                    <Icon name="image" size={22} color="#FFFFFF" />
                                    <View style={styles.uploadBtnPlus}>
                                        <Icon name="plus" size={14} color="#FFFFFF" />
                                    </View>
                                </View>
                                <Text style={styles.uploadBtnText}>Subir Nuevo Comprobante</Text>
                            </Pressable>
                        </View>

                        <Text style={styles.historyTitle}>Historial de Subidas</Text>
                    </View>
                }
                data={DATA}
                keyExtractor={(item) => item.id}
                renderItem={renderItem}
            />
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
        marginBottom: 20,
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

    listContent: {
        paddingHorizontal: 20,
        paddingBottom: 24,
    },

    topCard: {
        backgroundColor: CARD_BG,
        borderRadius: 18,
        paddingVertical: 18,
        paddingHorizontal: 16,
        marginVertical: 12,
        borderWidth: StyleSheet.hairlineWidth,
        borderColor: CARD_BG,
        width: width - 32,
        alignSelf: "center",
    },

    topCardText: {
        color: SUBTEXT,
        textAlign: "center",
        fontSize: 16,
        marginBottom: 12,
    },

    topInputWrapper: {
        marginBottom: 14,
        marginTop: 4,
    },

    topInputLabel: {
        color: "#E5E7EB",
        fontSize: 15,
        marginBottom: 6,
    },

    topInput: {
        backgroundColor: "#111214",
        borderRadius: 12,
        borderWidth: 1,
        borderColor: "#30363F",
        paddingHorizontal: 12,
        paddingVertical: Platform.OS === "ios" ? 10 : 8,
        color: STRONG_TEXT,
        fontSize: 16,
        marginTop: 5
    },

    uploadBtn: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        height: 50,
        borderRadius: 14,
        backgroundColor: MAIN_COLOR,
        marginTop: 8,
    },
    uploadBtnIconBox: {
        width: 36,
        height: 36,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: "#FFFFFF",
        alignItems: "center",
        justifyContent: "center",
        marginRight: 10,
        position: "relative",
    },
    uploadBtnPlus: {
        position: "absolute",
        right: -5,
        bottom: -5,
        width: 16,
        height: 16,
        borderRadius: 8,
        backgroundColor: "#00000055",
        alignItems: "center",
        justifyContent: "center",
        borderWidth: 1,
        borderColor: "#FFFFFF",
    },
    uploadBtnText: {
        color: STRONG_TEXT,
        fontSize: 16,
        fontWeight: "800",
    },

    historyTitle: {
        color: STRONG_TEXT,
        fontSize: 19,
        fontWeight: "700",
        marginTop: 12,
        marginBottom: 16,
    },
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
});
