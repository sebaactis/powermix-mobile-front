import { View, Text, TextInput, StyleSheet } from 'react-native'
import Icon from 'react-native-vector-icons/MaterialIcons';


export default function FormInput({ iconName, size, color, placeholder, placeholderTextColor, keyBoardType, labelText, marginTop, onChangeText, value }) {
    return (
        <View style={[styles.inputContainer, { marginTop }]}>
            <Text style={styles.inputLabel}>{labelText}</Text>

            <View style={styles.inputRow}>
                <Icon name={iconName} size={size} color={color} />
                <TextInput
                    style={styles.emailInput}
                    placeholder={placeholder}
                    placeholderTextColor={placeholderTextColor}
                    keyboardType={keyBoardType}
                    autoCapitalize='none'
                    onChangeText={onChangeText}
                    value={value}
                />
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    inputContainer: {
        width: '100%',
        justifyContent: 'center',
        paddingHorizontal: 30,
        gap: 6
    },
    inputRow: {
        flexDirection: 'row',
        alignItems: 'center',
        borderStyle: 'solid',
        borderColor: "#848496",
        borderWidth: 0.7,
        borderRadius: 8,
        paddingHorizontal: 10,
        paddingVertical: 4,
        backgroundColor: "#53535328",
    },
    inputLabel: {
        color: "#d6d6d6",
        fontSize: 16,
        fontWeight: '400',
    },
    emailInput: {
        borderRadius: 7,
        height: 50,
        paddingHorizontal: 10,
        color: "#FFFFFF",
        flex: 1,
        fontSize: 16
    },
})