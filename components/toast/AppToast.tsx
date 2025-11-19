import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';


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
        color: '#22c55e',
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
        color: '#eab308',
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
                {/* icono con fondo circular */}
                <View style={[styles.iconCircle, { backgroundColor: v.bg }]}>
                    <Icon name={v.icon} size={22} color={v.color} />
                </View>

                {/* textos */}
                <View style={styles.textContainer}>
                    <Text style={[styles.title, { color: v.color }]}>
                        {text1 || v.defaultTitle}
                    </Text>
                    {text2 ? (
                        <Text style={styles.message} numberOfLines={2}>
                            {text2}
                        </Text>
                    ) : null}
                </View>
            </View>

            {/* “barra” de color abajo tipo glow */}
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
        backgroundColor: "#040303",
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
        fontSize: 16,
        fontWeight: '700',
    },
    message: {
        marginTop: 2,
        fontSize: 14,
        color: "#FFFFFF",
    },
    bottomAccent: {
        height: 3,
        borderRadius: 14,
        alignSelf: 'center',
        width: '90%',
        opacity: 0.9,
    },
});
