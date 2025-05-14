import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Home from './screens/Home';
import Register from './screens/Register';
import Login from './screens/Login';
import Password from './screens/Password';
import NewProject from './screens/NewProject';
import HomePage from './screens/HomePage';
import Profile from './screens/Profile';
import About from './screens/About';
import MyProjects from './screens/MyProjects'; // Importe o novo componente MyProjects

const Stack = createNativeStackNavigator();

const App = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Home">
        {/* Main Screens */}
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
        <Stack.Screen 
          name="About" 
          component={About} 
          options={{ headerShown: false }}
        />
        
        {/* Password Recovery */}
        <Stack.Screen 
          name="Password" 
          component={Password} 
          options={{ headerShown: false }}
        />
        
        {/* Main App Screens */}
        <Stack.Screen 
          name="HomePage" 
          component={HomePage} 
          options={{ 
            headerShown: false,
            gestureEnabled: false // Prevent swipe back to login
          }}
        />
        
        {/* Profile Screen */}
        <Stack.Screen 
          name="Profile" 
          component={Profile} 
          options={{ 
            headerShown: false,
            gestureEnabled: true // Allow swipe back to HomePage
          }}
        />
        
        {/* New Project Screen */}
        <Stack.Screen 
          name="NewProject" 
          component={NewProject} 
          options={{ 
            headerShown: false,
            gestureEnabled: true // Allow swipe back to HomePage
          }}
        />
        
        {/* My Projects Screen */}
        <Stack.Screen 
          name="MyProjects" 
          component={MyProjects} 
          options={{ 
            headerShown: false,
            gestureEnabled: true // Allow swipe back to HomePage
          }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;