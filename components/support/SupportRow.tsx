import { MAIN_COLOR, STRONG_TEXT, SUBTEXT } from "@/src/constant";
import { Pressable, View, Text, StyleSheet } from "react-native";
import Icon from 'react-native-vector-icons/FontAwesome';

export default function SupportRow({
    icon,
    title,
    onPress,
}: {
    icon: string;
    title: string;
    onPress: () => void;
}) {
    return (
        <Pressable style={styles.row} onPress={onPress}>
            <View style={styles.rowIconWrap}>
                <Icon name={icon} size={18} color={MAIN_COLOR} />
            </View>
            <Text style={styles.rowText}>{title}</Text>
            <Icon name="chevron-right" size={14} color={SUBTEXT} />
        </Pressable>
    );
}

const styles = StyleSheet.create({
    row: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 10
    },
    rowIconWrap: {
        width: 36,
        height: 36,
        borderRadius: 20,
        backgroundColor: '#be185d3a',
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 12,
    },
    rowText: {
        color: STRONG_TEXT,
        flex: 1,
        fontSize: 15,
        fontWeight: '600'
    },
})