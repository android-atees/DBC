import React from 'react';
import PropTypes from 'prop-types';
import {View, Text, FlatList, Image, StyleSheet, Linking} from 'react-native';
import {Header, ListItem, Button} from 'react-native-elements';
import Icon from 'react-native-vector-icons/FontAwesome';
import {Colors, HelperStyles} from '../../Theme';
import Share from 'react-native-share';

function More(props) {
  const list = [
    'Share App',
    'App information',
    'FAQ',
    'Developer contact',
    'Feature request mail',
  ]; 
  const listIcon = [
    'share-alt',
    'info-circle',
    'question-circle',
    'user',
    'envelope',
  ];
  const OnItemTap = index => {
    switch (index) {
      case 0:
        return ShareApp();
      case 1:
        return Linking.openURL('https://google.com');
      case 2:
        return Linking.openURL('https://google.com');
      case 4:
        const shareOptions = {
          title: 'Share via',
          message: 'some message',
          url: 'some share url',
          social: Share.Social.EMAIL,
          whatsAppNumber: '9199999999', // country code + phone number
          filename: 'test', // only for base64 file in Android
        };
        Share.shareSingle(shareOptions);
        break;
      default:
        break;
    }
  };
  const ShareApp = () => {
    Share.open({
      url: `https://google.com`,
      title: 'He is an awesome app',
    })
      .then(res => {
        console.log(res);
      })
      .catch(err => {
        err && console.log(err);
      });
  };
  return (
    <View>
      <Header
        backgroundColor={Colors.primary}
        // leftComponent={{icon: 'menu', color: '#fff'}}
        centerComponent={<Text style={HelperStyles.headerTitle}>More</Text>}
        
        
        // rightComponent={{icon: 'More', color: '#fff'}}
      />
      <FlatList
        data={list}
        bounces={false}
        renderItem={({item, index}) => (
          <ListItem
            roundAvatar
            onPress={() => OnItemTap(index)}
            title={item}
            titleStyle={{fontWeight:'bold'}}
            bottomDivider
            leftAvatar={<Icon name={listIcon[index]} size={15} color={Colors.black}/>}
          />
        )}
        keyExtractor={({item, index}) => index}
      />
    </View>
  );
}

More.propTypes = {};

export default More;
const styles = StyleSheet.create({
  avatar: {
    width: 35,
    height: 35,
  },
  button: {
    width: 70,
    height: 70,
    borderRadius: 35,
    right: 0,
    shadowColor: 'rgba(0,0,0, .4)', // IOS
    shadowOffset: {height: 1, width: 1}, // IOS
    shadowOpacity: 1, // IOS
    shadowRadius: 5, //IOS
    elevation: 2, // Android
  },
  buttonContainer: {
    alignItems: 'flex-end',
    bottom: 25,
    marginRight: 10,
  },
});
