
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import HomeScreen from './src/screens/HomeScreen';
import AddRepositoryScreen from './src/screens/AddRepositoryScreen';

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen
          name="Home"
          component={HomeScreen}
          options={{
            title: 'Meus Repositórios',
            headerRight: ({ tintColor }) => (
              <></>
            ),
          }}
        />

        <Stack.Screen
          name="Adicionar"
          component={AddRepositoryScreen}
          options={{
            title: 'Adicionar Repositório',
          }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
