// src/navigation/MainNavigator.tsx
import React, { useState } from 'react';
import AuthNavigator from './AuthNavigator';
import TabNavigator from './TabNavigator';

const MainNavigator = () => {
    const [user] = useState<null | { id: string }>("123");
    return user ? <TabNavigator /> : <AuthNavigator />;
};

export default MainNavigator;