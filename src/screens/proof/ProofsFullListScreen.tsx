import { RenderItem } from "@/components/proof/RenderItem";
import { BG, MAIN_COLOR, STRONG_TEXT, SUBTEXT } from "@/src/constant";
import { useAuth } from "@/src/context/AuthContext";
import { Proof } from "@/src/types";
import { useEffect, useState } from "react";
import {
    ActivityIndicator,
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

type PaginatedProofsResponse = {
    items: Proof[];
    page: number;
    pageSize: number;
    total: number;
    hasMore: boolean;
};

export default function ProofsFullListScreen({ navigation }) {
    const { accessToken } = useAuth();

    const [proofs, setProofs] = useState<Proof[]>([]);
    const [loadingInitial, setLoadingInitial] = useState(false);
    const [loadingMore, setLoadingMore] = useState(false);
    const [refreshing, setRefreshing] = useState(false);

    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);
    const PAGE_SIZE = 20;

    const fetchProofs = async ({ pageToLoad = 1, isRefresh = false, isLoadMore = false }) => {
        if (loadingInitial || loadingMore) return;

        if (isRefresh) {
            setRefreshing(true);
        } else if (isLoadMore) {
            setLoadingMore(true);
        } else {
            setLoadingInitial(true);
        }

        try {
            const res = await fetch(
                `${process.env.EXPO_PUBLIC_POWERMIX_API_URL}/api/v1/proofs/me/paginated?page=${pageToLoad}&pageSize=${PAGE_SIZE}`,
                {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${accessToken}`,
                    },
                },
            );

            const data: PaginatedProofsResponse = await res.json().catch(
                () => null as any,
            );

            if (!res.ok || !data) {
                const error =
                    (data as any)?.details?.error ||
                    "Error al cargar los comprobantes";

                Toast.show({
                    type: "appError",
                    text1: "Ocurrió un error",
                    text2: error,
                });
                return;
            }

            const newItems = data.items ?? [];
            setHasMore(data.hasMore);
            setPage(pageToLoad);

            setProofs(prev =>
                pageToLoad === 1 ? newItems : [...prev, ...newItems],
            );
        } catch {
            Toast.show({
                type: "appError",
                text1: "Ocurrió un error inesperado",
                text2: "Intente de nuevo más tarde",
            });
        } finally {
            setLoadingInitial(false);
            setLoadingMore(false);
            setRefreshing(false);
        }
    };

    useEffect(() => {
        fetchProofs({ pageToLoad: 1 });
    }, []);

    const onRefresh = () => {
        setHasMore(true);
        setPage(1);
        setProofs([]);
        fetchProofs({ pageToLoad: 1, isRefresh: true });
    };

    const handleLoadMore = () => {
        if (!hasMore || loadingMore || loadingInitial || refreshing) return;
        fetchProofs({ pageToLoad: page + 1, isLoadMore: true });
    };

    if (loadingInitial && proofs.length === 0) {
        return (
            <View style={styles.loaderContainer}>
                <ActivityIndicator color={MAIN_COLOR} />
            </View>
        );
    }

    return (
        <View style={styles.screen}>
            {/* Header propio */}
            <View className="header" style={styles.header}>
                <Pressable
                    style={styles.headerBtnLeft}
                    onPress={() => navigation.goBack()}
                    hitSlop={8}
                >
                    <Icon name="arrow-left" size={20} color="#FFFFFF" />
                </Pressable>

                <Text style={styles.headerTitle}>Listado completo</Text>
            </View>

            {/* TO DO FILTERS ---- */}
            <View style={styles.filtersContainer}>
                <Text style={styles.filtersTitle}>Filtros (próximo paso)</Text>
                <Text style={styles.filtersSubtitle}>
                    Acá vamos a agregar filtros por fecha, monto, etc.
                </Text>
            </View>

            <FlatList
                data={proofs}
                keyExtractor={item => item.proof_mp_id}
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
                ListFooterComponent={
                    loadingMore ? (
                        <View style={{ paddingVertical: 12 }}>
                            <ActivityIndicator color={MAIN_COLOR} />
                        </View>
                    ) : null
                }
                contentContainerStyle={styles.listContent}
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
    loaderContainer: {
        flex: 1,
        backgroundColor: BG,
        justifyContent: "center",
        alignItems: "center",
        paddingTop:
            Platform.OS === "android" ? (StatusBar.currentHeight || 0) : 0,
    },
    header: {
        height: 56,
        justifyContent: "center",
        alignItems: "center",
        borderBottomWidth: StyleSheet.hairlineWidth,
        borderBottomColor: "#838383",
        marginBottom: 8,
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
    filtersContainer: {
        paddingHorizontal: 20,
        paddingVertical: 12,
        borderBottomColor: "#3a3a3a",
        borderBottomWidth: StyleSheet.hairlineWidth,
        marginBottom: 4,
    },
    filtersTitle: {
        color: STRONG_TEXT,
        fontSize: 15,
        fontWeight: "600",
        marginBottom: 4,
    },
    filtersSubtitle: {
        color: SUBTEXT,
        fontSize: 12,
    },
});
