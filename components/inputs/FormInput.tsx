import { View, Text, TextInput, StyleSheet } from 'react-native'
import Icon from 'react-native-vector-icons/MaterialIcons';

interface FormInputProps {
    iconName: string;
    size: number;
    color: string;
    placeholder: string;
    placeholderTextColor: string;
    keyBoardType: string;
    labelText: string;
    marginTop: number;
    onChangeText: (text: string) => void;
    value: string;
    error?: string;
}

export default function FormInput({ iconName, size, color, placeholder, placeholderTextColor, keyBoardType, labelText, marginTop, onChangeText, value, error }: FormInputProps) {

    const hasError = !!error

    return (
        <View style={[styles.inputContainer, { marginTop }]}>
            <Text style={styles.inputLabel}>{labelText}</Text>

            <View
                style={[
                    styles.inputRow,
                    hasError && styles.inputContainerError,
                ]}
            >
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

            {hasError && <Text style={styles.errorText}>{error}</Text>}
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
    inputContainerError: {
        borderColor: '#f97373',
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
    errorText: {
        color: '#f97373',
        fontSize: 13,
        marginTop: 4,
    },
})