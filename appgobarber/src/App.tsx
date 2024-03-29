import 'react-native-gesture-handler';
import React from 'react';
import { View, StatusBar } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import Routes from './routes';
import AuthProvider from './hooks';

const App: React.FC = () => (
  <NavigationContainer>
    <StatusBar barStyle="light-content" backgroundColor="#312e39" translucent />
    <AuthProvider>
      <View style={{ flex: 1, backgroundColor: '#312e39' }}>
        <Routes />
      </View>
    </AuthProvider>
  </NavigationContainer>
);

export default App;
