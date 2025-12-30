import { BG, CARD_BG, MAIN_COLOR, STRONG_TEXT, SUBTEXT } from "@/src/constant";
import { useAuth } from "@/src/context/AuthContext";
import { AuthApi } from "@/src/helpers/authApi";
import { getResponsiveFontSize, getResponsiveSize } from "@/src/helpers/responsive";
import { useEffect, useState } from "react";
import {
    ActivityIndicator,
    Dimensions,
    FlatList,
    Image,
    Modal,
    Platform,
    Pressable,
    RefreshControl,
    StyleSheet,
    Text,
    View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Toast from "react-native-toast-message";
import Icon from "react-native-vector-icons/FontAwesome";
import MaterialIcon from "react-native-vector-icons/MaterialCommunityIcons";

const { width } = Dimensions.get("window");

type QrStatus = "ACTIVE" | "USED";

const statusBind = {
    ACTIVE: "ACTIVO",
    USED: "UTILIZADO",
}

type VoucherApiItem = {
    VoucherID: string;
    UserID: string;
    QRCode: string;
    ImageURL: string;
    Status?: QrStatus;
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
                        <StatusPill status={statusBind[item?.Status]} />
                    </View>
                </View>
            </View>
        </Modal>
    );
}

export default function VoucherScreen({ navigation }) {
    const { signOut } = useAuth();

    const [items, setItems] = useState<VoucherApiItem[]>([]);
    const [loading, setLoading] = useState(false);
    const [refreshing, setRefreshing] = useState(false);
    const [deletingId, setDeletingId] = useState<string | null>(null);

    const [selected, setSelected] = useState<VoucherApiItem | null>(null);
    const [showModal, setShowModal] = useState(false);

    const urlGet = `${process.env.EXPO_PUBLIC_POWERMIX_API_URL}/api/v1/voucher/me`;

    const fetchVouchers = async (isRefresh = false) => {
        if (loading) return;

        if (isRefresh) setRefreshing(true);
        else setLoading(true);

        try {
            const res = await AuthApi<ApiResponse<VoucherApiItem[]>>(urlGet, "GET", signOut);


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

    const handleDelete = async (item: VoucherApiItem) => {
        setDeletingId(item.VoucherID);
        try {
            const urlDelete = `${process.env.EXPO_PUBLIC_POWERMIX_API_URL}/api/v1/voucher/${item.VoucherID}`;
            const res = await AuthApi<ApiResponse<any>>(urlDelete, "DELETE", signOut);

            if (!res.success) {
                Toast.show({
                    type: "appError",
                    text1: "Ocurrió un error",
                    text2: res.error?.message || "Error al eliminar voucher",
                });
                return;
            }

            Toast.show({
                type: "appSuccess",
                text1: "Voucher eliminado",
                text2: "El voucher ha sido eliminado correctamente.",
            });

            setItems((prevItems) => prevItems.filter((i) => i.VoucherID !== item.VoucherID));

        } catch (e: any) {
            Toast.show({
                type: "appError",
                text1: "Ocurrió un error inesperado",
                text2: e?.message ?? "Error inesperado",
            });

        } finally {
            setDeletingId(null);
            setRefreshing(false);
        }
    };

    const renderItem = ({ item }: { item: VoucherApiItem }) => {
        const canDelete = item.Status === "USED";

        return (
            <Pressable onPress={() => openQr(item)} style={styles.qrCard}>
                <View style={styles.qrRow}>
                    <Image source={{ uri: item.ImageURL }} style={styles.qrThumb} resizeMode="contain" />

                    <View style={styles.qrInfoContainer}>
                        <Text style={styles.qrCode} numberOfLines={1}>
                            #{item.QRCode}
                        </Text>

                        <View style={styles.statusAndActionsContainer}>
                            <StatusPill status={statusBind[item.Status]} />

                            {canDelete ? (
                                <Pressable onPress={() => handleDelete(item)} hitSlop={10} style={styles.deleteBtn}>
                                    <MaterialIcon name="trash-can-outline" size={getResponsiveSize(20, 18, 22)} color="#ff4d6d" />
                                    <Text style={styles.deleteBtnText}>{deletingId === item.VoucherID ? "Eliminando..." : "Borrar"}</Text>
                                </Pressable>
                            ) : (
                                <View style={styles.deleteDisabled}>
                                    <MaterialIcon name="trash-can-outline" size={getResponsiveSize(20, 18, 22)} color="#6f6f6f" />
                                    <Text style={styles.deleteDisabledText}>Solo usado</Text>
                                </View>
                            )}
                        </View>
                    </View>

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
        <SafeAreaView style={styles.screen} edges={['top']}>
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
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    screen: {
        flex: 1,
        backgroundColor: BG,
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
        fontSize: getResponsiveFontSize(17, 16),
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
        paddingVertical: 13,
        paddingHorizontal: 16,
        marginVertical: 5,
        borderWidth: StyleSheet.hairlineWidth,
        borderColor: CARD_BG,
        width: width - 32,
        alignSelf: "center",
    },
    topCardText: {
        color: SUBTEXT,
        textAlign: "center",
        fontSize: getResponsiveFontSize(15, 13),
        marginBottom: 3,
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
        fontSize: getResponsiveFontSize(16, 14),
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
        fontSize: getResponsiveFontSize(17, 15),
        fontWeight: "700",
        marginTop: 10,
    },

    qrCard: {
        backgroundColor: CARD_BG,
        borderRadius: 18,
        padding: 12,
        marginBottom: 10,
        borderWidth: StyleSheet.hairlineWidth,
        borderColor: "#2c2c2c",
    },
    qrRow: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
    },
    qrThumb: {
        width: getResponsiveSize(95, 80, 100),
        height: getResponsiveSize(95, 80, 100),
        borderRadius: 10,
        backgroundColor: "#1b1b1b",
    },

    qrCode: {
        color: SUBTEXT,
        fontSize: getResponsiveFontSize(15, 13),
        marginTop: 4,
        flex: 1,
        marginLeft: 8,
    },

    qrInfoContainer: {
        flex: 1,
        marginLeft: 8,
        maxWidth: "100%",
    },

    statusAndActionsContainer: {
        flexDirection: "row",
        alignItems: "center",
        gap: 8,
        flexWrap: "nowrap",
        flex: 1,
    },

    pill: {
        flexDirection: "row",
        alignItems: "center",
        paddingHorizontal: 10,
        paddingVertical: 9,
        borderRadius: 999,
        borderWidth: 1,
        flexShrink: 1,
        minWidth: 0,
    },
    pillDot: {
        width: 8,
        height: 8,
        borderRadius: 99,
        marginRight: 8,
    },
    pillText: {
        fontSize: getResponsiveFontSize(10, 9),
        fontWeight: "800",
    },

    deleteWrapper: {
        flexDirection: "row",
        alignItems: "center",
        gap: 10,
        marginTop: 13,
        flexShrink: 0,
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
        flexShrink: 1,
        minWidth: 0,
    },
    deleteBtnText: {
        color: "#ff4d6d",
        fontSize: getResponsiveFontSize(12, 10),
        fontWeight: "800",
        flexShrink: 1,
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
        flexShrink: 1,
        minWidth: 0,
    },
    deleteDisabledText: {
        color: "#6f6f6f",
        fontSize: getResponsiveFontSize(12, 10),
        fontWeight: "800",
        flexShrink: 1,
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
        fontSize: getResponsiveFontSize(16, 14),
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
        fontSize: getResponsiveFontSize(13, 12),
        fontWeight: "700",
    },
    modalCodeValue: {
        color: STRONG_TEXT,
        fontSize: getResponsiveFontSize(13, 12),
        fontWeight: "800",
    },
});
