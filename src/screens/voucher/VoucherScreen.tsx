import { BG, CARD_BG, MAIN_COLOR, STRONG_TEXT, SUBTEXT } from "@/src/constant";
import { useAuth } from "@/src/context/AuthContext";
import { ApiHelper } from "@/src/helpers/apiHelper";
import { useEffect, useState } from "react";
import {
    ActivityIndicator,
    Alert,
    Dimensions,
    FlatList,
    Image,
    Modal,
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
import MaterialIcon from "react-native-vector-icons/MaterialCommunityIcons";

const { width } = Dimensions.get("window");

type QrStatus = "ACTIVO" | "UTILIZADO";

type VoucherApiItem = {
    UserID: string;
    QRCode: string;
    ImageURL: string;
    // Status?: QrStatus; // to do en el backend
};

type ApiResponse<T> = {
    success: boolean;
    data: T;
    error: { message: string; fields?: any } | null;
};

function StatusPill({ status }: { status: QrStatus }) {
    const isActive = status === "ACTIVO";
    return (
        <View style={[styles.pill, { borderColor: isActive ? "#008c1c" : "#8d8d8d" }]}>
            <View style={[styles.pillDot, { backgroundColor: isActive ? "#008c1c" : "#8d8d8d" }]} />
            <Text style={[styles.pillText, { color: isActive ? "#008c1c" : "#8d8d8d" }]}>{status}</Text>
        </View>
    );
}

function FullQrModal({ visible, onClose, item }: { visible: boolean; onClose: () => void; item: VoucherApiItem | null; }) {
    return (
        <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
            <View style={styles.modalOverlay}>
                <View style={styles.modalCard}>
                    <View style={styles.modalHeader}>
                        <Text style={styles.modalTitle}>Tu QR</Text>
                        <Pressable onPress={onClose} hitSlop={10}>
                            <MaterialIcon name="close" size={26} color={STRONG_TEXT} />
                        </Pressable>
                    </View>

                    {item?.ImageURL ? (
                        <Image source={{ uri: item.ImageURL }} style={styles.modalQr} resizeMode="contain" />
                    ) : (
                        <View style={[styles.modalQr, { justifyContent: "center", alignItems: "center" }]}>
                            <Text style={{ color: SUBTEXT, textAlign: "center" }}>
                                No hay imagen de QR disponible.
                            </Text>
                        </View>
                    )}

                    <View style={styles.modalInfoRow}>
                        <Text style={styles.modalCodeLabel}>Código:</Text>
                        <Text style={styles.modalCodeValue}>{item?.QRCode ?? "-"}</Text>
                    </View>

                    <View style={{ marginTop: 15, alignItems: "center" }}>
                        <StatusPill status={"ACTIVO"} />
                    </View>
                </View>
            </View>
        </Modal>
    );
}

export default function VoucherScreen({ navigation }) {
    const { accessToken } = useAuth();

    const [items, setItems] = useState<VoucherApiItem[]>([]);
    const [loading, setLoading] = useState(false);
    const [refreshing, setRefreshing] = useState(false);

    const [selected, setSelected] = useState<VoucherApiItem | null>(null);
    const [showModal, setShowModal] = useState(false);

    const url = `${process.env.EXPO_PUBLIC_POWERMIX_API_URL}/api/v1/voucher/me`;

    const fetchVouchers = async (isRefresh = false) => {
        if (loading) return;

        if (isRefresh) setRefreshing(true);
        else setLoading(true);

        try {

            const res = await ApiHelper<ApiResponse<VoucherApiItem[]>>(
                url,
                "GET",
                undefined,
                { Authorization: `Bearer ${accessToken}` }
            );

            if (!res.success) {
                Toast.show({
                    type: "appError",
                    text1: "Ocurrió un error",
                    text2: res.error?.message || "Error al cargar vouchers",
                });
                return;
            }

            const list = res.data as VoucherApiItem[];
            setItems(Array.isArray(list) ? list : []);

        } catch (e: any) {

            Toast.show({
                type: "appError",
                text1: "Ocurrió un error inesperado",
                text2: e?.message ?? "Error inesperado",
            });

        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    };

    useEffect(() => {
        fetchVouchers(false);
    }, []);

    const onRefresh = async () => {
        await fetchVouchers(true);
    };

    const openQr = (item: VoucherApiItem) => {
        setSelected(item);
        setShowModal(true);
    };

    const handleDelete = (item: VoucherApiItem) => {
        Alert.alert("Por ahora no", "El borrado se habilita cuando la API envíe estado UTILIZADO.");
    };

    const renderItem = ({ item }: { item: VoucherApiItem }) => {
        const status: QrStatus = "ACTIVO";
        const canDelete = status === "UTILIZADO";

        return (
            <Pressable onPress={() => openQr(item)} style={styles.qrCard}>
                <View style={styles.qrRow}>
                    <Image source={{ uri: item.ImageURL }} style={styles.qrThumb} resizeMode="contain" />

                    <View style={{ flex: 1, marginLeft: 12 }}>

                        <Text style={styles.qrCode} numberOfLines={1}>
                            #{item.QRCode}
                        </Text>

                        <View style={{ marginTop: 13, flexDirection: "row", alignItems: "center", gap: 10 }}>
                            <StatusPill status={status} />

                            {canDelete ? (
                                <Pressable onPress={() => handleDelete(item)} hitSlop={10} style={styles.deleteBtn}>
                                    <MaterialIcon name="trash-can-outline" size={20} color="#ff4d6d" />
                                    <Text style={styles.deleteBtnText}>Borrar</Text>
                                </Pressable>
                            ) : (
                                <View style={styles.deleteDisabled}>
                                    <MaterialIcon name="trash-can-outline" size={20} color="#6f6f6f" />
                                    <Text style={styles.deleteDisabledText}>Solo usado</Text>
                                </View>
                            )}
                        </View>
                    </View>

                    <MaterialIcon name="chevron-right" size={26} color="#7f7f7f" />
                </View>
            </Pressable>
        );
    };

    if (loading && items.length === 0) {
        return (
            <View style={{ flex: 1, backgroundColor: BG, justifyContent: "center", alignItems: "center" }}>
                <ActivityIndicator color={MAIN_COLOR} />
            </View>
        );
    }

    return (
        <View style={styles.screen}>
            <View style={styles.header}>
                <Pressable style={styles.headerBtnLeft} onPress={() => navigation.navigate("Home")} hitSlop={8}>
                    <Icon name="arrow-left" size={20} color="#FFFFFF" />
                </Pressable>

                <Text style={styles.headerTitle}>Mis Premios</Text>
            </View>

            <FlatList
                contentContainerStyle={styles.listContent}
                ListHeaderComponent={
                    <>
                        <View style={styles.topCard}>
                            <Text style={styles.topCardText}>
                                Acá están tus premios en forma de QR. Tocá uno para verlo en grande.
                            </Text>
                        </View>

                        <View style={styles.historyHeaderRow}>
                            <Text style={styles.historyTitle}>Mis QRs</Text>
                        </View>

                        {items.length === 0 && (
                            <View style={styles.noItemsContainer}>
                                <MaterialIcon name="qrcode-remove" size={80} color="#9e9e9e" />
                                <Text style={styles.noItemsText}>Aún no tenés premios</Text>
                            </View>
                        )}
                    </>
                }
                data={items}
                keyExtractor={(item) => item.QRCode}
                renderItem={renderItem}
                refreshControl={
                    <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={MAIN_COLOR} />
                }
            />

            <FullQrModal visible={showModal} onClose={() => setShowModal(false)} item={selected} />
        </View>
    );
}

const styles = StyleSheet.create({
    screen: {
        flex: 1,
        backgroundColor: BG,
        paddingTop: Platform.OS === "android" ? (StatusBar.currentHeight || 0) : 0,
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
    },

    historyHeaderRow: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        marginTop: 12,
        marginBottom: 16,
    },
    historyTitle: {
        color: STRONG_TEXT,
        fontSize: 16,
        fontWeight: "700",
        marginTop: 14,
        marginBottom: 16,
    },

    noItemsContainer: {
        justifyContent: "center",
        alignItems: "center",
        marginTop: 50,
    },
    noItemsText: {
        color: "#9e9e9e",
        fontSize: 17,
        fontWeight: "700",
        marginTop: 10,
    },

    qrCard: {
        backgroundColor: CARD_BG,
        borderRadius: 18,
        padding: 14,
        marginBottom: 12,
        borderWidth: StyleSheet.hairlineWidth,
        borderColor: "#2c2c2c",
    },
    qrRow: {
        flexDirection: "row",
        alignItems: "center",
    },
    qrThumb: {
        width: 95,
        height: 95,
        borderRadius: 10,
        backgroundColor: "#1b1b1b",
    },

    qrCode: {
        color: SUBTEXT,
        fontSize: 15,
        marginTop: 4,
    },

    pill: {
        flexDirection: "row",
        alignItems: "center",
        paddingHorizontal: 10,
        paddingVertical: 7,
        borderRadius: 999,
        borderWidth: 1,
    },
    pillDot: {
        width: 8,
        height: 8,
        borderRadius: 99,
        marginRight: 8,
    },
    pillText: {
        fontSize: 12,
        fontWeight: "800",
    },

    deleteBtn: {
        flexDirection: "row",
        alignItems: "center",
        gap: 6,
        paddingHorizontal: 10,
        paddingVertical: 6,
        borderRadius: 999,
        borderWidth: 1,
        borderColor: "#ff4d6d",
    },
    deleteBtnText: {
        color: "#ff4d6d",
        fontSize: 12,
        fontWeight: "800",
    },
    deleteDisabled: {
        flexDirection: "row",
        alignItems: "center",
        gap: 6,
        paddingHorizontal: 10,
        paddingVertical: 6,
        borderRadius: 999,
        borderWidth: 1,
        borderColor: "#6f6f6f",
        opacity: 0.8,
    },
    deleteDisabledText: {
        color: "#6f6f6f",
        fontSize: 12,
        fontWeight: "800",
    },

    modalOverlay: {
        flex: 1,
        backgroundColor: "rgba(0,0,0,0.7)",
        justifyContent: "center",
        paddingHorizontal: 18,
    },
    modalCard: {
        backgroundColor: CARD_BG,
        borderRadius: 18,
        padding: 16,
        borderWidth: StyleSheet.hairlineWidth,
        borderColor: "#2c2c2c",
    },
    modalHeader: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        marginBottom: 10,
    },
    modalTitle: {
        color: STRONG_TEXT,
        fontSize: 16,
        fontWeight: "800",
    },
    modalQr: {
        width: "100%",
        height: 320,
        borderRadius: 14,
        backgroundColor: "#111",
        marginTop: 8,
    },
    modalInfoRow: {
        marginTop: 12,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        gap: 8,
    },
    modalCodeLabel: {
        color: SUBTEXT,
        fontSize: 13,
        fontWeight: "700",
    },
    modalCodeValue: {
        color: STRONG_TEXT,
        fontSize: 13,
        fontWeight: "800",
    },
});
