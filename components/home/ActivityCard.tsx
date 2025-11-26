import { MAIN_COLOR, STRONG_TEXT, SUBTEXT } from "@/src/constant";
import { Proof } from "@/src/types";
import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import MaterialIcon from "react-native-vector-icons/MaterialCommunityIcons";


export default function ActivityCard({ proof }: { proof: Proof }) {
    return (
        <Pressable style={styles.card}>
            <View style={styles.iconWrapper}>
                <MaterialIcon name="file-document-outline" size={28} color={MAIN_COLOR} />
            </View>

            <View style={styles.infoContainer}>
                <View style={styles.infoRow}>
                    <Text style={styles.infoLabel}>Comprobante:</Text>
                    <Text style={styles.infoValue}>{proof.proof_mp_id}</Text>
                </View>

                <View style={styles.infoRow}>
                    <Text style={styles.infoLabel}>Fecha de carga:</Text>
                    <Text style={styles.infoValue}>{proof.proof_date}</Text>
                </View>

                <View style={styles.infoRow}>
                    <Text style={styles.infoLabel}>Fecha de pago:</Text>
                    <Text style={styles.infoValue}>{proof.date_approved_mp}</Text>
                </View>

                <View style={styles.infoRow}>
                    <Text style={styles.infoLabel}>Monto:</Text>
                    <Text style={styles.infoValue}>${proof.amount_mp}</Text>
                </View>

            </View>

        </Pressable>
    );
}

const styles = StyleSheet.create({
    card: {
        flexDirection: "row",
        alignItems: "center",
        paddingHorizontal: 14,
        paddingVertical: 15,
        backgroundColor: "#2f2d2d",
        borderRadius: 10,
        marginBottom: 13,
    },
    iconWrapper: {
        width: 50,
        height: 50,
        borderRadius: 30,
        backgroundColor: "#1d1d1d",
        alignItems: "center",
        justifyContent: "center",
        marginRight: 12,
    },
    infoContainer: {
        flexDirection: "column",
        flex: 1,
        justifyContent: "center"
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
    }
});