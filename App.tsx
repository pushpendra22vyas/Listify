/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React from 'react';
import {SafeAreaView, StyleSheet} from 'react-native';
import NavigationWrapper from './components/NavigationWrapper';

function App(): React.JSX.Element {
  return (
    <SafeAreaView style={styles.mainContainer}>
      <NavigationWrapper/>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
  },
});

export default App;
