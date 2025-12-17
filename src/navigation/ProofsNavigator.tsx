import { createNativeStackNavigator } from '@react-navigation/native-stack';
import ProofScreen from '../screens/proof/ProofScreen';
import ProofsFullListScreen from '../screens/proof/ProofsFullListScreen';


const ProofStack = createNativeStackNavigator();

export default function ProofsNavigator() {
    return (
        <ProofStack.Navigator screenOptions={{ headerShown: false }} initialRouteName='ProofsMain' >
            <ProofStack.Screen name="ProofsMain" component={ProofScreen} />
            <ProofStack.Screen name="FullListProofs" component={ProofsFullListScreen} />
        </ProofStack.Navigator>
    );
}
