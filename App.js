import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import Home from './screens/Home';
import Register from './screens/Register';
import Login from './screens/Login';
import Password from './screens/Password';
import HomePage from './screens/HomePage';
import Profile from './screens/Profile';
import NewProject from './screens/NewProject';
import MyProjects from './screens/MyProjects';
import ProjectScreen from './screens/ProjectScreen';
import NewField from './screens/NewField';       // Nova tela NewField
import FieldScreen from './screens/FieldScreen'; // Nova tela FieldScreen

const Stack = createNativeStackNavigator();

const App = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Home">
        {/* Telas principais */}
        <Stack.Screen 
          name="Home" 
          component={Home} 
          options={{ headerShown: false }}
        />
        <Stack.Screen 
          name="Register" 
          component={Register} 
          options={{ headerShown: false }}
        />
        <Stack.Screen 
          name="Login" 
          component={Login} 
          options={{ headerShown: false }}
        />

        {/* Recuperação de senha */}
        <Stack.Screen 
          name="Password" 
          component={Password} 
          options={{ headerShown: false }}
        />

        {/* Telas do aplicativo */}
        <Stack.Screen 
          name="HomePage" 
          component={HomePage} 
          options={{ 
            headerShown: false,
            gestureEnabled: false, // Impede voltar para login com gesto
          }}
        />

        {/* Perfil */}
        <Stack.Screen 
          name="Profile" 
          component={Profile} 
          options={{ 
            headerShown: false,
            gestureEnabled: true, // Permite voltar para HomePage com gesto
          }}
        />

        {/* Novo Projeto */}
        <Stack.Screen 
          name="NewProject" 
          component={NewProject} 
          options={{ 
            headerShown: false,
            gestureEnabled: true,
          }}
        />

        {/* Meus Projetos */}
        <Stack.Screen 
          name="MyProjects" 
          component={MyProjects} 
          options={{ 
            headerShown: false,
            gestureEnabled: true,
          }}
        />

        {/* Tela de Projeto Específico */}
        <Stack.Screen 
          name="ProjectScreen" 
          component={ProjectScreen} 
          options={{ 
            headerShown: false,
            gestureEnabled: true,
          }}
        />

        {/* Tela Novo Campo */}
        <Stack.Screen 
          name="NewField" 
          component={NewField} 
          options={{ 
            headerShown: false,
            gestureEnabled: true,
          }}
        />

        {/* Tela Detalhes do Campo */}
        <Stack.Screen 
          name="FieldScreen" 
          component={FieldScreen} 
          options={{ 
            headerShown: false,
            gestureEnabled: true,
          }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;