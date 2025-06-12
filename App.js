import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { NotificationProvider } from "./contexts/NotificationContext";

// Telas principais
import Home from "./screens/Home";
import Register from "./screens/Register";
import Login from "./screens/Login";
import Password from "./screens/Password";

// Telas institucionais
import About from "./screens/About";
import Contact from "./screens/Contact";

// Telas do aplicativo
import HomePage from "./screens/HomePage";
import Profile from "./screens/Profile";
import EditProfile from "./screens/EditProfile";
import NewProject from "./screens/NewProject";
import MyProjects from "./screens/MyProjects";
import ProjectScreen from "./screens/ProjectScreen";

import NewField from "./screens/NewField";
import FieldScreen from "./screens/FieldScreen";
import MyCollection from "./screens/MyCollection";
import AddCollection from "./screens/AddCollection";
import ReportScreenQuantitativo from "./screens/ReportScreenQuantitativo";
import SearchSpecies from "./screens/SearchSpecies";
import MyReports from "./screens/MyReports";
import EditProject from "./screens/EditProject";

const Stack = createNativeStackNavigator();

const App = () => {
  return (
    <NotificationProvider>
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
          <Stack.Screen
            name="Password"
            component={Password}
            options={{ headerShown: false }}
          />

          {/* Telas institucionais */}
          <Stack.Screen
            name="About"
            component={About}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="Contact"
            component={Contact}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="HomePage"
            component={HomePage}
            options={{ headerShown: false, gestureEnabled: false }}
          />
          <Stack.Screen
            name="Profile"
            component={Profile}
            options={{ headerShown: false, gestureEnabled: true }}
          />
          <Stack.Screen
            name="EditProfile"
            component={EditProfile}
            options={{ headerShown: false, gestureEnabled: true }}
          />
          <Stack.Screen
            name="NewProject"
            component={NewProject}
            options={{ headerShown: false, gestureEnabled: true }}
          />
          <Stack.Screen
            name="MyProjects"
            component={MyProjects}
            options={{ headerShown: false, gestureEnabled: true }}
          />
          <Stack.Screen
            name="EditProject"
            component={EditProject}
            options={{ headerShown: false, gestureEnabled: true }}
          />
          <Stack.Screen
            name="ProjectScreen"
            component={ProjectScreen}
            options={{ headerShown: false, gestureEnabled: true }}
          />
          <Stack.Screen
            name="NewField"
            component={NewField}
            options={{ headerShown: false, gestureEnabled: true }}
          />
          <Stack.Screen
            name="FieldScreen"
            component={FieldScreen}
            options={{ headerShown: false, gestureEnabled: true }}
          />
          <Stack.Screen
            name="MyReports"
            component={MyReports}
            options={{ headerShown: false, gestureEnabled: true }}
          />
          {/* Tela Adicionar Coleta */}
          <Stack.Screen
            name="AddCollection"
            component={AddCollection}
            options={{
              headerShown: false,
              gestureEnabled: true,
            }}
          />

          {/* Tela Minhas Coletas */}
          <Stack.Screen
            name="MyCollection"
            component={MyCollection}
            options={{
              headerShown: false,
              gestureEnabled: true,
            }}
          />

          {/* Tela Relatório Quantitativo */}
          <Stack.Screen
            name="ReportScreenQuantitativo"
            component={ReportScreenQuantitativo}
            options={{
              headerShown: false,
              gestureEnabled: true,
            }}
          />

          {/* Tela Pesquisar Espécie */}
          <Stack.Screen
            name="SearchSpecies"
            component={SearchSpecies}
            options={{
              headerShown: false,
              gestureEnabled: true,
            }}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </NotificationProvider>
  );
};

export default App;
