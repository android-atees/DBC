import React, {useState, useEffect, useRef} from 'react';
import PropTypes from 'prop-types';
import {View, Text, Dimensions, StyleSheet, ScrollView} from 'react-native';
import PaginationView from '../Walkthrough/PaginationView';
import DotedView from './DotedView';
import {Button, List, ListItem} from 'react-native-elements';
import {Colors} from '../../Theme';

const data = [
  {id: 1, name: 'Mike', city: 'philps', state: 'DBC Organiser in general'},
  {id: 2, name: 'Steve', city: 'Square', state: 'Contact list infografic'},
  {id: 3, name: 'Jhon', city: 'market', state: 'Quotation Infographic'},
];

function Walkthrough(props) {
  const myScrollView = useRef();
  const [index, setindex] = useState(0);

  useEffect(() => {});
  const handleScroll = event => {
    let xOffset = event.nativeEvent.contentOffset.x;
    let contentWidth = event.nativeEvent.contentSize.width;
    let value = contentWidth / xOffset;
    let newVal = parseFloat(value.toPrecision(2))
    console.log('Sssss', newVal);
    setindex(data.length / newVal);
  };
  const onPress = () => {
    if (index === data.length - 1) {
      props.navigation.navigate('tabbar');
    } else {
      myScrollView.current.scrollTo({
        x: Dimensions.get('window').width * (index + 1),
        y: 0,
        animated: true,
      });
      setindex(selec => selec + 1);
    }
  };
  return (
    <View style={styles.container}>
      <ScrollView
        ref={myScrollView}
        contentContainerStyle={styles.scrollView}
        horizontal={true}
        pagingEnabled={true}
        bounces={false}
        onScroll={handleScroll}
        showsHorizontalScrollIndicator={false}>
        {data.map(singledata => (
          <PaginationView title={singledata.state} />
        ))}
      </ScrollView>
      <View style={styles.buttonView}>
        <DotedView selected={index} count={data} />
        <Button
          buttonStyle={styles.buttoncontainer}
          title={index === data.length - 1 ? 'HOME' : 'NEXT'}
          onPress={onPress}
        />
      </View>
    </View>
  );
}

Walkthrough.propTypes = {};

export default Walkthrough;

const styles = StyleSheet.create({
  container: {
    // flex: 1,
  },
  scrollviewContainer: {
    // flex: 0.7,
  },
  scrollView: {
    width: Dimensions.get('screen').width * data.length,
  },
  buttoncontainer: {
    backgroundColor: Colors.secondary,
    width: 250,
    height: 50,
    borderRadius: 10,
  },
  buttonView: {
    marginTop: -100,
    alignItems: 'center',
  },
});
