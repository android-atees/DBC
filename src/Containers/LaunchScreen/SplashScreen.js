import React, {useState, useEffect} from 'react';
import {View, Text, StyleSheet, ImageBackground, Image} from 'react-native';
import Home from '../Home/Home';
import Color from '../../Theme/Color';
import AsyncStorage from '@react-native-community/async-storage';

function SplashScreen(props) {
  useEffect(() => {
   initialCheck()
  });

  const initialCheck = async () => {
    try {
      const appLoaded = await AsyncStorage.getItem('appLoadedOnce');
      console.log('ooooooo', appLoaded);

      if (appLoaded != null) {
        props.navigation.navigate('tabbar');
      } else {
        props.navigation.navigate('walkthrough');
      }
    } catch (e) {
      // error reading value
    }
  };

  const setupDelay = () => {
    props.navigation.navigate('walkthrough');
  };
  return (
    <View style={styles.container}>
      {/* <ImageBackground
        source={require('../../Assets/download.jpeg')}
        style={styles.logo}> */}
      <Image
        style={styles.image}
        source={require('../../Assets/smart_logo.png')}
      />
      {/* <Text style={styles.title}>Splash Screen</Text> */}
      {/* </ImageBackground> */}
    </View>
  );
}

export default SplashScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    height: 100,
    width: 300,
    resizeMode: 'contain',
  },
  logoTextContainer: {
    flex: 0.5,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 20,
    marginTop: 10,
    fontWeight: 'bold',
    color: Color.blue,
  },
  logo: {
    flex: 1,
    resizeMode: 'cover',
    justifyContent: 'center',
    alignItems: 'center',
  },
});
