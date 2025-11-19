import { createNativeStackNavigator } from '@react-navigation/native-stack';
import SupportScreen from '../screens/support/SupportScreen';
import FaqScreen from '../screens/support/FaqScreen';


const HelpStack = createNativeStackNavigator();

export default function HelpStackNavigator() {
    return (
        <HelpStack.Navigator screenOptions={{ headerShown: false }}>
            <HelpStack.Screen name="Support" component={SupportScreen} />
            <HelpStack.Screen name="Faq" component={FaqScreen} />
        </HelpStack.Navigator>
    );
}
