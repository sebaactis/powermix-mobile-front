import { useEffect, useRef } from "react";
import { Animated, Dimensions, Image, StyleSheet, View } from "react-native";

interface AnimatedSplashProps {
    isAppReady: boolean;
    onAnimationEnd: () => void;

}

const { height } = Dimensions.get("window")

export default function AnimatedSplash({ isAppReady, onAnimationEnd }: AnimatedSplashProps) {
    const translateY = useRef(new Animated.Value(0)).current
    const opacity = useRef(new Animated.Value(1)).current

    useEffect(() => {
        if (!isAppReady) return

        Animated.parallel([
            Animated.timing(opacity, {
                toValue: 0,
                duration: 1000,
                useNativeDriver: true
            }),
            Animated.timing(translateY, {
                toValue: -height,
                duration: 1000,
                useNativeDriver: true
            })
        ]).start(() => onAnimationEnd())
    }, [isAppReady, onAnimationEnd, opacity, translateY])

    return (
        <Animated.View
            style={[
                StyleSheet.absoluteFillObject,
                styles.container,
                {
                    opacity,
                    transform: [{ translateY }]
                }
            ]}
        >
            <View style={styles.container}>
                <Image
                    source={require("../assets/splash.png")}
                    style={styles.logo}
                    resizeMode="contain"
                />
            </View>
        </Animated.View>
    )
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#101010",
    justifyContent: "center",
    alignItems: "center",
  },
  logoContainer: {
    width: 200,
    height: 200,
    justifyContent: "center",
    alignItems: "center",
  },
  logo: {
    width: 390,
    height: 390,
  },
});