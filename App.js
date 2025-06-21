import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { NotificationProvider } from "./contexts/NotificationContext";
import { AppDataProvider } from "./data/AppDataProvider";

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
import EditField from "./screens/EditField";
import ColetaScreen from "./screens/ColetaScreen";
import MyCollection from "./screens/MyCollection";
import AddCollection from "./screens/AddCollection";
import SelectProjectAndField from "./screens/SelectProjectAndField";
import ReportScreenQuantitativo from "./screens/ReportScreenQuantitativo";
import SearchSpecies from "./screens/SearchSpecies";
import MyReports from "./screens/MyReports";
import EditProject from "./screens/EditProject";
import AjudemeAIdentificar from "./screens/AjudemeAIdentificar";
import EuConhecoEssa from "./screens/EuConhecoEssa";
import BuscarAjudaAjudeaIdentificar from "./screens/BuscarAjuda-AjudeaIdentificar";
import ChatEuConhecoEssa from "./screens/Chat-EuConhecoEssa";
import ReportConfiguration from "./screens/ReportConfiguration";
import ReportView from "./screens/ReportView";

// Novas telas de relatório
import BiodiversityReport from "./screens/BiodiversityReport";
import QuantitativeReport from "./screens/QuantitativeReport";
import QualitativeReport from "./screens/QualitativeReport";

// Novas telas de sugestão de identificação
import TelaPedidodeAjuda from "./screens/TelaPedidodeAjuda-AjudemeaIdentificar";
import ChatAjudemeaIdentificar from "./screens/Chat-AjudemeaIdentificar";

const Stack = createNativeStackNavigator();

const App = () => {
  return (
    <NotificationProvider>
      <AppDataProvider>
        <NavigationContainer>
          <Stack.Navigator initialRouteName="Home">
            {/* Telas principais */}
            <Stack.Screen
              name="Home"
              component={Home}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="AjudemeAIdentificar"
              component={AjudemeAIdentificar}
              options={{ headerShown: false, gestureEnabled: true }}
            />
            <Stack.Screen
              name="EuConhecoEssa"
              component={EuConhecoEssa}
              options={{ headerShown: false, gestureEnabled: true }}
            />
            <Stack.Screen
              name="Register"
              component={Register}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="BuscarAjudaAjudeaIdentificar"
              component={BuscarAjudaAjudeaIdentificar}
              options={{ headerShown: false, gestureEnabled: true }}
            />
            <Stack.Screen
              name="ChatEuConhecoEssa"
              component={ChatEuConhecoEssa}
              options={{ headerShown: false, gestureEnabled: true }}
            />

            {/* Novas telas de sugestão de identificação */}
            <Stack.Screen
              name="TelaPedidodeAjuda-AjudemeaIdentificar"
              component={TelaPedidodeAjuda}
              options={{ headerShown: false, gestureEnabled: true }}
            />
            <Stack.Screen
              name="Chat-AjudemeaIdentificar"
              component={ChatAjudemeaIdentificar}
              options={{ headerShown: false, gestureEnabled: true }}
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
              name="ColetaScreen"
              component={ColetaScreen}
              options={{ headerShown: false, gestureEnabled: true }}
            />
            <Stack.Screen
              name="EditField"
              component={EditField}
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

            {/* Tela Selecionar Projeto e Campo */}
            <Stack.Screen
              name="SelectProjectAndField"
              component={SelectProjectAndField}
              options={{ headerShown: false, gestureEnabled: true }}
            />

            {/* Novas telas de relatório */}
            <Stack.Screen
              name="ReportConfiguration"
              component={ReportConfiguration}
              options={{ headerShown: false, gestureEnabled: true }}
            />
            <Stack.Screen
              name="ReportView"
              component={ReportView}
              options={{ headerShown: false, gestureEnabled: true }}
            />

            {/* Novas telas de relatório biodiversificado */}
            <Stack.Screen
              name="BiodiversityReport"
              component={BiodiversityReport}
              options={{ headerShown: false, gestureEnabled: true }}
            />
            <Stack.Screen
              name="QuantitativeReport"
              component={QuantitativeReport}
              options={{ headerShown: false, gestureEnabled: true }}
            />
            <Stack.Screen
              name="QualitativeReport"
              component={QualitativeReport}
              options={{ headerShown: false, gestureEnabled: true }}
            />
          </Stack.Navigator>
        </NavigationContainer>
      </AppDataProvider>
    </NotificationProvider>
  );
};

export default App;
