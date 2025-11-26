import AddProofModal from "@/components/proof/AddProofModal";
import { RenderItem } from "@/components/proof/RenderItem";

import { BG, CARD_BG, MAIN_COLOR, STRONG_TEXT, SUBTEXT } from "@/src/constant";
import { useAuth } from "@/src/context/AuthContext";
import { Proof } from "@/src/types";
import React, { useEffect, useRef, useState } from "react";
import {
    ActivityIndicator,
    Animated,
    Dimensions,
    FlatList,
    Platform,
    Pressable,
    RefreshControl,
    StatusBar,
    StyleSheet,
    Text,
    View,
} from "react-native";
import Toast from "react-native-toast-message";
import Icon from "react-native-vector-icons/FontAwesome";

const { width } = Dimensions.get("window");

export default function ProofScreen({ navigation }) {

    const { accessToken } = useAuth();

    const [proofs, setProofs] = useState<Proof[]>([]);
    const [loading, setLoading] = useState(false);
    const [refreshing, setRefreshing] = useState(false);

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

    const fetchProofs = async (isRefresh: boolean = false) => {
        setLoading(true)

        if (isRefresh) {
            setRefreshing(true)
        }
        try {
            const res = await fetch(`http://10.0.2.2:8080/api/v1/proofs/me`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${accessToken}`
                }
            })

            const data = await res.json().catch(() => null);

            if (!res.ok) {
                const error = data.details?.error || "Error al cargar los comprobantes"

                Toast.show({
                    type: "appError",
                    text1: "Ocurrió un error",
                    text2: error
                })

                return
            }

            setProofs(data)
        } catch {
            Toast.show({
                type: "appError",
                text1: "Ocurrió un error inesperado",
                text2: "Intente de nuevo mas tarde"
            })
        } finally {
            setLoading(false)
            setRefreshing(false)
        }
    }

    const onRefresh = () => {
        fetchProofs(true);
    };

    if (loading) {
        return (
            <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
                <ActivityIndicator color={MAIN_COLOR} />
            </View>
        );
    }

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
                data={proofs}
                keyExtractor={(item) => item.proof_mp_id}
                renderItem={({ item }) => <RenderItem item={item} />}
                refreshControl={
                    <RefreshControl
                        refreshing={refreshing}
                        onRefresh={onRefresh}
                        tintColor={MAIN_COLOR}
                    />
                }
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
