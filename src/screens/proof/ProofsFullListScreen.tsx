import { RenderItem } from "@/components/proof/RenderItem";
import { BG, MAIN_COLOR, STRONG_TEXT, SUBTEXT } from "@/src/constant";
import { useAuth } from "@/src/context/AuthContext";
import { ApiHelper } from "@/src/helpers/apiHelper";
import { Proof } from "@/src/types";
import { useEffect, useState, useCallback } from "react";
import {
    ActivityIndicator,
    FlatList,
    Platform,
    Pressable,
    RefreshControl,
    StatusBar,
    StyleSheet,
    Text,
    TextInput,
    View,
} from "react-native";
import Toast from "react-native-toast-message";
import Icon from "react-native-vector-icons/FontAwesome";
import MaterialIcon from "react-native-vector-icons/MaterialCommunityIcons";

type PaginatedProofsResponse = {
    items: Proof[];
    page: number;
    pageSize: number;
    total: number;
    hasMore: boolean;
};

type FiltersState = {
    id_mp: string;
    fromProofDate: string;
    toProofDate: string;
    minAmount: string;
    maxAmount: string;
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

    const [filters, setFilters] = useState<FiltersState>({
        id_mp: "",
        fromProofDate: "",
        toProofDate: "",
        minAmount: "",
        maxAmount: "",
    });

    const handleChangeFilter = (field: keyof FiltersState, value: string) => {
        setFilters(prev => ({ ...prev, [field]: value }));
    };

    const buildUrlWithFilters = useCallback((pageToLoad: number) => {
        let url = `${process.env.EXPO_PUBLIC_POWERMIX_API_URL}/api/v1/proofs/me/paginated?page=${pageToLoad}&pageSize=${PAGE_SIZE}`;

        if (filters.id_mp.trim()) {
            url += `&id_mp=${encodeURIComponent(filters.id_mp.trim())}`;
        }
        if (filters.fromProofDate.trim()) {
            url += `&fromProofDate=${encodeURIComponent(filters.fromProofDate.trim())}`;
        }
        if (filters.toProofDate.trim()) {
            url += `&toProofDate=${encodeURIComponent(filters.toProofDate.trim())}`;
        }
        if (filters.minAmount.trim()) {
            url += `&minAmount=${encodeURIComponent(filters.minAmount.trim())}`;
        }
        if (filters.maxAmount.trim()) {
            url += `&maxAmount=${encodeURIComponent(filters.maxAmount.trim())}`;
        }

        return url;
    }, [filters, PAGE_SIZE]);

    const fetchProofs = useCallback(async ({
        pageToLoad = 1,
        isRefresh = false,
        isLoadMore = false,
    }: {
        pageToLoad?: number;
        isRefresh?: boolean;
        isLoadMore?: boolean;
    }) => {
        if (loadingInitial || loadingMore) return;

        if (isRefresh) {
            setRefreshing(true);
        } else if (isLoadMore) {
            setLoadingMore(true);
        } else {
            setLoadingInitial(true);
        }

        try {
            const url = buildUrlWithFilters(pageToLoad);

            const res = await ApiHelper<PaginatedProofsResponse>(
                url,
                "GET",
                undefined,
                {
                    Authorization: `Bearer ${accessToken}`,
                }
            );

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
    }, [accessToken, loadingInitial, loadingMore, buildUrlWithFilters]);


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

    const handleApplyFilters = () => {
        setHasMore(true);
        setPage(1);
        setProofs([]);
        fetchProofs({ pageToLoad: 1 });
    };

    const handleClearFilters = () => {
        setFilters({
            id_mp: "",
            fromProofDate: "",
            toProofDate: "",
            minAmount: "",
            maxAmount: "",
        });
        setHasMore(true);
        setPage(1);
        setProofs([]);
        fetchProofs({ pageToLoad: 1 });

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

            <View style={styles.header}>
                <Pressable
                    style={styles.headerBtnLeft}
                    onPress={() => navigation.goBack()}
                    hitSlop={8}
                >
                    <Icon name="arrow-left" size={20} color="#FFFFFF" />
                </Pressable>

                <Text style={styles.headerTitle}>Listado completo</Text>
            </View>


            <View style={styles.filtersContainer}>
                <Text style={styles.filtersTitle}>Filtros</Text>

                <View style={styles.filterRow}>
                    <TextInput
                        style={styles.filterInput}
                        placeholder="Buscar por comprobante"
                        placeholderTextColor={SUBTEXT}
                        value={filters.id_mp}
                        onChangeText={text => handleChangeFilter("id_mp", text)}
                    />
                </View>


                <View style={styles.filterRow}>
                    <TextInput
                        style={[styles.filterInput, styles.filterInputHalf, { marginRight: 6 }]}
                        placeholder="Desde (YYYY-MM-DD)"
                        placeholderTextColor={SUBTEXT}
                        value={filters.fromProofDate}
                        onChangeText={text =>
                            handleChangeFilter("fromProofDate", text)
                        }
                    />
                    <TextInput
                        style={[styles.filterInput, styles.filterInputHalf, { marginLeft: 6 }]}
                        placeholder="Hasta (YYYY-MM-DD)"
                        placeholderTextColor={SUBTEXT}
                        value={filters.toProofDate}
                        onChangeText={text =>
                            handleChangeFilter("toProofDate", text)
                        }
                    />
                </View>

                <View style={styles.filterRow}>
                    <TextInput
                        style={[styles.filterInput, styles.filterInputHalf, { marginRight: 6 }]}
                        placeholder="Monto mín."
                        placeholderTextColor={SUBTEXT}
                        keyboardType="numeric"
                        value={filters.minAmount}
                        onChangeText={text =>
                            handleChangeFilter("minAmount", text)
                        }
                    />
                    <TextInput
                        style={[styles.filterInput, styles.filterInputHalf, { marginLeft: 6 }]}
                        placeholder="Monto máx."
                        placeholderTextColor={SUBTEXT}
                        keyboardType="numeric"
                        value={filters.maxAmount}
                        onChangeText={text =>
                            handleChangeFilter("maxAmount", text)
                        }
                    />
                </View>


                <View style={styles.filterButtonsRow}>
                    <Pressable
                        style={styles.applyBtn}
                        onPress={handleApplyFilters}
                    >
                        <Text style={styles.applyBtnText}>Aplicar filtros</Text>
                    </Pressable>

                    <Pressable
                        style={styles.clearBtn}
                        onPress={handleClearFilters}
                    >
                        <Text style={styles.clearBtnText}>Limpiar</Text>
                    </Pressable>
                </View>
            </View>
            {proofs?.length === 0 && <View style={styles.noProofsContainer}>
                <MaterialIcon name="file-document-remove-outline" size={80} color="#9e9e9e" />
                <Text style={styles.noProofsText}>Aun no cargaste ningún comprobante</Text>
            </View>}
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
        marginBottom: 4,
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
        borderBottomColor: "#8a8a8a",
        borderBottomWidth: StyleSheet.hairlineWidth,
        marginBottom: 20,
    },
    filtersTitle: {
        color: STRONG_TEXT,
        fontSize: 15,
        fontWeight: "600",
        marginBottom: 8,
    },
    filterRow: {
        flexDirection: "row",
        marginBottom: 10,
        marginTop: 5
    },
    filterInput: {
        flex: 1,
        borderRadius: 10,
        borderWidth: StyleSheet.hairlineWidth,
        borderColor: "#6b6b6b",
        paddingHorizontal: 10,
        paddingVertical: 8,
        color: STRONG_TEXT,
        fontSize: 13,
        backgroundColor: "#1e1e1e",
    },
    filterInputHalf: {
        flex: 1,
    },
    filterButtonsRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginTop: 5,
    },
    applyBtn: {
        flex: 1,
        backgroundColor: MAIN_COLOR,
        paddingVertical: 10,
        borderRadius: 10,
        alignItems: "center",
        justifyContent: "center",
        marginRight: 6,
    },
    applyBtnText: {
        color: STRONG_TEXT,
        fontSize: 13,
        fontWeight: "700",
    },
    clearBtn: {
        width: 90,
        borderRadius: 10,
        borderWidth: StyleSheet.hairlineWidth,
        borderColor: "#555",
        alignItems: "center",
        justifyContent: "center",
        paddingVertical: 10,
    },
    clearBtnText: {
        color: SUBTEXT,
        fontSize: 12,
        fontWeight: "500",
    },
    noProofsContainer: {
        justifyContent: "center",
        alignItems: "center",
        marginTop: 50
    },
    noProofsText: {
        color: "#9e9e9e",
        fontSize: 17,
        fontWeight: 700,
        marginTop: 10
    }
});
