import AddProofModal from "@/components/proof/AddProofModal";
import { RenderItem } from "@/components/proof/RenderItem";

import { BG, CARD_BG, MAIN_COLOR, STRONG_TEXT, SUBTEXT } from "@/src/constant";
import { useAuth } from "@/src/context/AuthContext";
import { ApiHelper } from "@/src/helpers/apiHelper";
import { PaginatedProofs, Proof } from "@/src/types";
import { useEffect, useRef, useState } from "react";
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
    const PAGE_SIZE = 5

    const { accessToken } = useAuth();

    const [proofs, setProofs] = useState<Proof[]>([]);

    const [loadingInitial, setLoadingInitial] = useState(false)
    const [loadingMore, setLoadingMore] = useState(false);
    const [page, setPage] = useState(1)
    const [hasMore, setHasMore] = useState(true)

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
    }, [headerAnim, loadingInitial]);

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

    const fetchProofs = async (
        pageToLoad = 1,
        isRefresh = false,
        isLoadMore = false
    ) => {
        if (loadingInitial || loadingMore) return;

        if (isRefresh) {
            setRefreshing(true);
        } else if (isLoadMore) {
            setLoadingMore(true);
        } else {
            setLoadingInitial(true);
        }

        try {
            const url = `${process.env.EXPO_PUBLIC_POWERMIX_API_URL}/api/v1/proofs/me/paginated?page=${pageToLoad}&pageSize=${PAGE_SIZE}`;

            const res = await ApiHelper<PaginatedProofs>(
                url,
                "GET",
                undefined,
                {
                    Authorization: `Bearer ${accessToken}`,
                }
            );

            console.log("📥 Respuesta backend /proofs paginated:", res);

            if (!res.success || !res.data) {
                const errorMsg =
                    res.error?.message || "Error al cargar los comprobantes";

                Toast.show({
                    type: "appError",
                    text1: "Ocurrió un error",
                    text2: errorMsg,
                });

                return;
            }

            const newItems = res.data.items ?? [];
            setHasMore(res.data.hasMore);
            setPage(res.data.page);

            setProofs((prev) => {
                if (pageToLoad === 1) {
                    return newItems;
                }

                const existingIds = new Set(prev.map((p) => p.proof_mp_id));
                const filtered = newItems.filter(
                    (p) => !existingIds.has(p.proof_mp_id)
                );

                return [...prev, ...filtered];
            });
        } catch (e) {
            Toast.show({
                type: "appError",
                text1: "Ocurrió un error inesperado",
                text2: e.message,
            });
        } finally {
            setLoadingInitial(false);
            setLoadingMore(false);
            setRefreshing(false);
        }
    };


    const handleLoadMore = () => {
        if (!hasMore || loadingMore || loadingInitial || refreshing) return;

        fetchProofs({ pageToLoad: page + 1, isLoadMore: true })
    }

    useEffect(() => {
        fetchProofs({ pageToLoad: 1 });
    }, [])

    const onRefresh = () => {
        setHasMore(true);
        setPage(1);
        fetchProofs({ pageToLoad: 1, isRefresh: true });
    };

    if (loadingInitial && proofs.length === 0) {
        return (
            <View
                style={{
                    flex: 1,
                    backgroundColor: BG,
                    justifyContent: "center",
                    alignItems: "center",
                }}
            >
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

                        <View style={styles.historyHeaderRow}>
                            <Text style={styles.historyTitle}>Historial de subidas recientes</Text>

                            <Pressable onPress={() => navigation.navigate("FullListProofs")}>
                                <Text style={styles.historyLinkText}>Ver listado completo</Text>
                            </Pressable>
                        </View>
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
                onEndReached={handleLoadMore}
                onEndReachedThreshold={0.4}
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
        fontSize: 16,
        fontWeight: "700",
        marginTop: 14,
        marginBottom: 16,
    },
    historyHeaderRow: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        marginTop: 12,
        marginBottom: 16,
    },
    historyLinkText: {
        color: "#ff006a",
        fontSize: 14,
        fontWeight: "500",
    },
});
