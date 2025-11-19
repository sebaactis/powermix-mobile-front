import { BG, MAIN_COLOR, STRONG_TEXT, SUBTEXT } from "@/src/constant";
import { useRef, useState } from "react";
import { Animated, Easing, Pressable, StyleSheet, Text, View } from "react-native";
import Icon from 'react-native-vector-icons/FontAwesome';

export default function FaqItem({ question, answer }: FaqItemProps) {
    const [expanded, setExpanded] = useState(false);
    const animation = useRef(new Animated.Value(0)).current;

    const toggle = () => {
        const toValue = expanded ? 0 : 1;

        Animated.timing(animation, {
            toValue,
            duration: 220,
            easing: Easing.out(Easing.ease),
            useNativeDriver: false,
        }).start();

        setExpanded(!expanded);
    };

    const height = animation.interpolate({
        inputRange: [0, 1],
        outputRange: [0, 80],
    });

    const opacity = animation.interpolate({
        inputRange: [0, 1],
        outputRange: [0, 1],
    });

    return (
        <View style={styles.faqItem}>
            <Pressable style={styles.faqHeader} onPress={toggle}>
                <View style={{ flexDirection: 'row', alignItems: 'center', flex: 1 }}>
                    <View style={styles.faqIconCircle}>
                        <Icon name="question-circle" size={18} color={MAIN_COLOR} />
                    </View>
                    <Text style={styles.faqQuestion}>{question}</Text>
                </View>

                <Icon
                    name={expanded ? 'chevron-up' : 'chevron-down'}
                    size={14}
                    color={SUBTEXT}
                />
            </Pressable>

            <Animated.View
                style={[
                    styles.faqBodyAnimated,
                    { height, opacity },
                ]}
            >
                <Text style={styles.faqAnswer} numberOfLines={expanded ? 0 : 3}>
                    {answer}
                </Text>
            </Animated.View>
        </View>
    );
}

const styles = StyleSheet.create({
    faqItem: {
        borderRadius: 12,
        backgroundColor: BG,
        marginBottom: 12,
        overflow: 'hidden',
        paddingVertical: 2,
    },
    faqHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 12,
        paddingVertical: 10,
    },
    faqIconCircle: {
        width: 34,
        height: 34,
        borderRadius: 30,
        backgroundColor: '#be185d3a',
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 8,
    },
    faqQuestion: {
        flex: 1,
        color: STRONG_TEXT,
        fontSize: 15,
        fontWeight: '400',
        maxWidth: '80%',
    },

    faqBodyAnimated: {
        paddingHorizontal: 12,
        overflow: 'hidden',
    },
    faqAnswer: {
        color: SUBTEXT,
        fontSize: 14,
        lineHeight: 16,
        fontWeight: '500',
    },

})