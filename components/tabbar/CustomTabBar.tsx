import { MAIN_COLOR } from "@/src/constant";
import { BottomTabBarProps } from "@react-navigation/bottom-tabs";
import { useEffect, useRef } from "react";
import { Animated, Dimensions, Platform, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { getResponsiveFontSize } from "@/src/helpers/responsive";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const CustomTabBar: React.FC<BottomTabBarProps> = ({ state, descriptors, navigation }) => {
  const translateX = useRef(new Animated.Value(0)).current;
  const tabWidth = Dimensions.get('window').width / state.routes.length;
  const insets = useSafeAreaInsets();

  useEffect(() => {
    Animated.spring(translateX, {
      toValue: state.index * tabWidth,
      useNativeDriver: true,
      friction: 8,
      tension: 80,
    }).start();
  }, [state.index, tabWidth, translateX]);

  return (
    <View style={[styles.tabBar, { paddingBottom: Platform.OS === 'ios' ? insets.bottom : 20 }]}>

      <Animated.View
        style={[
          styles.indicator,
          {
            width: tabWidth,
            transform: [{ translateX }],
          },
        ]}
      />

      {state.routes.map((route, index) => {
        const { options } = descriptors[route.key];
        const isFocused = state.index === index;

        const onPress = () => {
          const event = navigation.emit({
            type: 'tabPress',
            target: route.key,
            canPreventDefault: true,
          });

          if (!isFocused && !event.defaultPrevented) {
            navigation.navigate(route.name);
          }
        };

        const color = isFocused ? MAIN_COLOR : '#CCCCCC';

        const icon = options.tabBarIcon
          ? options.tabBarIcon({ focused: isFocused, color, size: 24 })
          : null;

        const label =
          options.tabBarLabel !== undefined
            ? options.tabBarLabel
            : options.title !== undefined
            ? options.title
            : route.name;

        return (
          <TouchableOpacity
            key={route.key}
            onPress={onPress}
            style={styles.tabItem}
            activeOpacity={0.7}
          >
            {icon}
            <Text style={[styles.tabBarLabel, { color }]}>
              {label as string}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
};

export default CustomTabBar

const styles = StyleSheet.create({
  tabBar: {
    flexDirection: 'row',
    height: 79,
    backgroundColor: '#2f2d2d',
    borderTopColor: '#2f2d2d',
    borderTopWidth: 1,
    borderTopStartRadius: 8,
    borderTopEndRadius: 8,
    overflow: 'hidden',
  },
  indicator: {
    position: 'absolute',
    top: 0,
    height: 3,
    backgroundColor: MAIN_COLOR,
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
  },
  tabItem: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tabBarLabel: {
    marginTop: 1,
    fontSize: getResponsiveFontSize(11, 10),
    textAlign: 'center',
  },
});
