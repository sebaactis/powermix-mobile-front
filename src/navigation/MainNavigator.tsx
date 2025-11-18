
import AuthNavigator from './AuthNavigator';
import TabNavigator from './TabNavigator';
import { useAuth } from '../context/AuthContext';
import { ActivityIndicator, View } from 'react-native';

const MainNavigator = () => {

    const { isAuthenticated, loading } = useAuth();

    if (loading) {
        return (
            <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
                <ActivityIndicator />
            </View>
        );
    }

    return isAuthenticated ? <TabNavigator /> : <AuthNavigator />;
};

export default MainNavigator;