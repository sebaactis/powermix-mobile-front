import AddProofModal from "@/components/proof/AddProofModal";
import { RenderItem } from "@/components/proof/RenderItem";

import { BG, CARD_BG, MAIN_COLOR, STRONG_TEXT, SUBTEXT } from "@/src/constant";
import React, { useEffect, useRef, useState } from "react";
import {
    Animated,
    Dimensions,
    FlatList,
    Platform,
    Pressable,
    StatusBar,
    StyleSheet,
    Text,
    View,
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

export default function ProofScreen({ navigation }) {
    const [showAddProof, setShowAddProof] = useState(false);

    const headerAnim = useRef(new Animated.Value(0)).current;
    const buttonScale = useRef(new Animated.Value(1)).current;

    useEffect(() => {
        Animated.timing(headerAnim, {
            toValue: 1,
            duration: 250,
            useNativeDriver: true,
        }).start();
    }, [headerAnim]);

    const handleOpenAddReceipt = () => {
        Animated.sequence([
            Animated.timing(buttonScale, {
                toValue: 0.97,
                duration: 80,
                useNativeDriver: true,
            }),
            Animated.timing(buttonScale, {
                toValue: 1,
                duration: 80,
                useNativeDriver: true,
            }),
        ]).start(() => setShowAddProof(true));
    };

    const headerTranslateY = headerAnim.interpolate({
        inputRange: [0, 1],
        outputRange: [16, 0],
    });

    return (
        <View style={styles.screen}>
            <View style={styles.header}>
                <Pressable
                    style={styles.headerBtnLeft}
                    onPress={() => navigation.navigate("Home")}
                    hitSlop={8}
                >
                    <Icon name="arrow-left" size={20} color="#FFFFFF" />
                </Pressable>

                <Text style={styles.headerTitle}>Mis Comprobantes</Text>
            </View>

            <FlatList
                contentContainerStyle={styles.listContent}
                ListHeaderComponent={
                    <Animated.View
                        style={{
                            opacity: headerAnim,
                            transform: [{ translateY: headerTranslateY }],
                        }}
                    >

                        <View style={styles.topCard}>
                            <Text style={styles.topCardText}>
                                Cargá tus comprobantes para sumar puntos en tu cuenta.
                            </Text>

                            <Animated.View style={{ transform: [{ scale: buttonScale }] }}>
                                <Pressable
                                    style={styles.uploadBtn}
                                    onPress={handleOpenAddReceipt}
                                >
                                    <Text style={styles.uploadBtnText}>
                                        Agregar comprobante
                                    </Text>
                                </Pressable>
                            </Animated.View>
                        </View>

                        <Text style={styles.historyTitle}>Historial de subidas</Text>
                    </Animated.View>
                }
                data={DATA}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => <RenderItem item={item} />}
            />

            <AddProofModal
                visible={showAddProof}
                onClose={() => setShowAddProof(false)}
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

    uploadBtn: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        height: 50,
        borderRadius: 14,
        backgroundColor: MAIN_COLOR,
        marginTop: 8,
    },
    uploadBtnText: {
        color: STRONG_TEXT,
        fontSize: 17,
        fontWeight: "800",
    },
    historyTitle: {
        color: STRONG_TEXT,
        fontSize: 19,
        fontWeight: "700",
        marginTop: 12,
        marginBottom: 16,
    },
});
