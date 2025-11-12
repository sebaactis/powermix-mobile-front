import { MAIN_COLOR } from "@/src/constant";
import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import MaterialIcon from "react-native-vector-icons/MaterialCommunityIcons";

type ReceiptCardProps = {
    title: string;
    date: string;
    amount: string;
    onPress?: () => void;
};

export default function ActivityCard({
    title,
    date,
    amount,
    onPress,
}: ReceiptCardProps) {
    return (
        <Pressable style={styles.card} onPress={onPress}>
            <View style={styles.iconWrapper}>
                <MaterialIcon name="file-document-outline" size={28} color={MAIN_COLOR} />
            </View>

            <View style={styles.textContainer}>
                <Text style={styles.title} numberOfLines={1}>
                    {title}
                </Text>
                <Text style={styles.date}>{date}</Text>
            </View>

            <Text style={styles.amount}>${amount}</Text>
        </Pressable>
    );
}

const styles = StyleSheet.create({
    card: {
        flexDirection: "row",
        alignItems: "center",
        paddingHorizontal: 16,
        paddingVertical: 20,
        backgroundColor: "#2f2d2d",
        borderRadius: 10,
        marginBottom: 10,
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
    textContainer: {
        flex: 1,
    },
    title: {
        color: "#F9FAFB",
        fontSize: 16,
        fontWeight: "600",
    },
    date: {
        color: "#9CA3AF",
        fontSize: 15,
        marginTop: 2,
    },
    amount: {
        color: "#F9FAFB",
        fontSize: 17,
        fontWeight: "700",
        marginLeft: 8,
    },
});