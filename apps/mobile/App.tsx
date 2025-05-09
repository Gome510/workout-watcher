import React from 'react';
import {GraphProvider, NormalButton} from '@workout-watcher/ui';
import {createStaticNavigation} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import HomeScreen from './src/screens/Home/HomeScreen';
import PoseCamera from './src/screens/PoseCamera/PoseCameraScreen';

const Stack = createNativeStackNavigator({
  screenOptions: {
    headerShown: false,
  },
  initialRouteName: 'Home',
  screens: {
    Home: HomeScreen,
    PoseCamera: PoseCamera,
  },
});
const Navigation = createStaticNavigation(Stack);

const App = () => {
  return (
    <GraphProvider>
      <Navigation />
    </GraphProvider>
  );
};

export default App;
