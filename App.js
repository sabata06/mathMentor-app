import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import Login from "./src/screens/Login";
import StudentList from "./src/screens/StudentList";
import StudentDetail from "./src/screens/StudentDetail";
import AddStudent from "./src/screens/AddStudent";
import EditStudent from "./src/screens/EditStudent";

const Stack = createStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Login">
        <Stack.Screen
          name="Login"
          component={Login}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="StudentList"
          component={StudentList}
          // options={{ headerShown: false }}
        />
        <Stack.Screen
          name="StudentDetail"
          component={StudentDetail}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="AddStudent"
          component={AddStudent}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="EditStudent"
          component={EditStudent}
          options={{ headerShown: false }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
