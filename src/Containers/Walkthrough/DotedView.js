import React from 'react';
import PropTypes from 'prop-types';
import {View, Text, StyleSheet} from 'react-native';

function DotedView(props) {
  return (
    <View style={styles.bullets}>
      {props.count.map((interval, i) => (
        <Text
          key={i}
          style={{
            ...styles.bullet,
            opacity: i === props.selected ? 1.0 : 0.5,
          }}>
          &bull;
        </Text>
      ))}
    </View>
  );
}

DotedView.propTypes = {};
const styles = StyleSheet.create({
  bullets: {
    position: 'absolute',
    bottom: 50,
    // flex: 1,
    justifyContent: 'center',
    // right: 0,
    display: 'flex',
    flexDirection: 'row',
    paddingHorizontal: 10,
    paddingBottom: 5,
  },
  bullet: {
    paddingHorizontal: 10,
    fontSize: 40,
    color: 'white',
  },
});

export default DotedView;
