import { mainColor } from '@/src/constant';
import { ReactNode } from 'react'
import { StyleSheet, ViewStyle } from 'react-native'
import { Edge, SafeAreaView } from 'react-native-safe-area-context';

type Props = {
    children: ReactNode;
    style?: ViewStyle | ViewStyle[]; 
    edges: Edge[];
}

export default function ScreenSafeArea({ children, style, edges = ["top"] }: Props) {

    const bg = mainColor

    return (
        <SafeAreaView style={[styles.safeArea, { backgroundColor: bg }, style]} edges={edges}>
            {children}
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    safeArea: {
        flex: 1
    },

});