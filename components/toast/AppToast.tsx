import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { getResponsiveFontSize } from "@/src/helpers/responsive";


type Variant = 'success' | 'error' | 'warning';

type Props = {
    text1?: string;
    text2?: string;
    variant: Variant;
};

const VARIANT_STYLES: Record<
    Variant,
    { color: string; bg: string; icon: string; defaultTitle: string }
> = {
    success: {
        color: '#00a33c',
        bg: 'rgba(34, 197, 94, 0.16)',
        icon: 'check-circle',
        defaultTitle: 'Saved successfully',
    },
    error: {
        color: '#ef4444',
        bg: 'rgba(239, 68, 68, 0.16)',
        icon: 'error-outline',
        defaultTitle: 'Error occurred',
    },
    warning: {
        color: '#a57c00',
        bg: 'rgba(234, 179, 8, 0.16)',
        icon: 'warning-amber',
        defaultTitle: 'Action required',
    },
};

export function AppToast({ text1, text2, variant }: Props) {
    const v = VARIANT_STYLES[variant];

    return (
        <View style={styles.wrapper}>
            <View style={styles.container}>

                <View style={[styles.iconCircle, { backgroundColor: v.bg }]}>
                    <Icon name={v.icon} size={26} color={v.color} />
                </View>

                <View style={styles.textContainer}>
                    <Text style={[styles.title, { color: v.color }]}>
                        {text1 || v.defaultTitle}
                    </Text>
                    {text2 ? (
                        <Text style={[styles.message, { color: v.color }]} numberOfLines={2}>
                            {text2}
                        </Text>
                    ) : null}
                </View>
            </View>

            <View style={[styles.bottomAccent, { backgroundColor: v.color }]} />
        </View>
    );
}

const styles = StyleSheet.create({
    wrapper: {
        width: '100%',
        paddingHorizontal: 16,
    },
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingVertical: 12,
        borderRadius: 14,
        borderBottomEndRadius: 5,
        borderBottomStartRadius: 5,
        backgroundColor: "#ffffff",
        shadowColor: '#000',
        shadowOpacity: 0.35,
        shadowRadius: 8,
        shadowOffset: { width: 0, height: 4 },
        elevation: 6,
    },
    iconCircle: {
        width: 34,
        height: 34,
        borderRadius: 17,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 12,
    },
    textContainer: {
        flex: 1,
    },
    title: {
        fontSize: getResponsiveFontSize(16, 14),
        fontWeight: '700',
    },
    message: {
        marginTop: 2,
        fontSize: getResponsiveFontSize(14, 13),
    },
    bottomAccent: {
        height: 3,
        borderRadius: 2,
        alignSelf: 'center',
        width: '98%',
    },
});
