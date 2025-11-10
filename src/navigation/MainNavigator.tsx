// src/navigation/MainNavigator.tsx
import React, { useState } from 'react';
import AuthNavigator from './AuthNavigator';
import TabNavigator from './TabNavigator';

const MainNavigator = () => {
    const [user] = useState<null | { id: string }>("123");
    // más adelante esto vendrá de Redux / contexto

    return user ? <TabNavigator /> : <AuthNavigator />;
};

export default MainNavigator;