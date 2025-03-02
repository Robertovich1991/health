import React from 'react';
import {
  ScrollView,
  StatusBar,
  Text,
  View,
} from 'react-native';
import { MyConnectionList } from './src/screens/myConnectionList/myConnectionList';
import styles from './src/screens/myConnectionList/myConnectionList.style';

function App(): React.JSX.Element {
  return (
    <View  >
      <StatusBar/>
      <ScrollView>
      <MyConnectionList/> 
   </ScrollView>
    </View>
  );
}
export default App

