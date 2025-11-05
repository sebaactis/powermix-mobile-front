import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function Header() {
    return (
        <View style={styles.container}>
            <Text style={styles.title}>Mi App</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        height: 60,
        justifyContent: 'center',
        paddingHorizontal: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#ddd',
    },
    title: {
        fontSize: 20,
        fontWeight: 'bold',
    },
});
