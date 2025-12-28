import { STRONG_TEXT } from "@/src/constant";
import { StyleSheet, Text, View } from "react-native";
import { getResponsiveFontSize } from "@/src/helpers/responsive";

export default function Field({ label, children }: { label: string; children: React.ReactNode }) {
    return (
        <View style={{ marginTop: 14 }}>
            <Text style={styles.label}>{label}</Text>
            {children}
        </View>
    );
}

const styles = StyleSheet.create({
    label: {
        color: STRONG_TEXT,
        marginBottom: 6,
        fontWeight: '600',
        fontSize: getResponsiveFontSize(14, 12),
    },
})
