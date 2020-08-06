import React from 'react';
import PropTypes from 'prop-types';
import {
  View,
  Text,
  Dimensions,
  StyleSheet,
  ImageBackground,
} from 'react-native';
import DotedView from './DotedView';
import {Colors} from '../../Theme';

function PaginationView(props) {
  return (
    <View>
      <ImageBackground
        source={require('../../Assets/background.jpg')}
        style={styles.container}>
        <View style={styles.container}>
          <Text style={styles.title}>{props.title}</Text>
        </View>
      </ImageBackground>
    </View>
  );
}
const styles = StyleSheet.create({
  title: {
    fontSize: 45,
    fontWeight: '800',
    letterSpacing: 2,
    color: Colors.white,
    marginHorizontal: 10,
  },
  container: {
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height,
    backgroundColor: '#000000c9',

    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default PaginationView;
