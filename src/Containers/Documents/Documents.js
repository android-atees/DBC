import React from 'react';
import PropTypes from 'prop-types';
import {View, Text, FlatList, Image, StyleSheet} from 'react-native';
import {Header, ListItem, Button} from 'react-native-elements';
import Icon from 'react-native-vector-icons/FontAwesome';
import {Colors, HelperStyles} from '../../Theme';
import { CustomGridView } from '../Home/ContactDetail';

function Document(props) {
  const list = [
    {
      name: 'Quotations',
      subtitle: 'Vice President',
      type: 'quotations',
    },
    {
      name: 'Invoices',
      subtitle: 'Vice Chairman',
      type: 'invoices',
    },
    {
      name: 'Generic Documents',
      subtitle: 'Vice President',
      type: 'documents',
    },
  ];
  const tappedFloatButton = () => {
    props.navigation.navigate('addContact');
  };
  const onItemTap = item => {
    console.log('pppp', item);

    props.navigation.navigate('documentDetail', {type: item.type});
  };

  return (
    <View style={styles.container}>
      <Header
        backgroundColor={Colors.primary}
        centerComponent={<Text style={HelperStyles.headerTitle}>Document</Text>}
        // centerComponent={{text: 'Document', style: {color: '#fff'}}}
        // rightComponent={{icon: 'Document', color: '#fff'}}
      />

      <CustomGridView onPress={onItemTap}/>
      {/* <FlatList
        data={list}
        bounces={false}
        renderItem={({item}) => (
          <ListItem
            onPress={() => onItemTap(item)}
            roundAvatar
            title={item.name}
            // subtitle={item.subtitle}
            leftAvatar={
              <Image style={styles.pdfBg} source={require('../../Assets/pdfIcon.jpeg')}/>
              // <Image
              //   source={require('../../Assets/placeholder.jpeg')}
              //   style={styles.avatar}
              // />
            }
            bottomDivider
          />
        )}
        keyExtractor={item => item.id}
      /> */}
      {/* <Button
        buttonStyle={styles.button}
        icon={<Icon name="plus" size={25} color="white" />}
        containerStyle={styles.buttonContainer}
        onPress={tappedFloatButton}
      /> */}
    </View>
  );
}

Document.propTypes = {};

export default Document;
const styles = StyleSheet.create({
  avatar: {
    width: 35,
    height: 35,
  },
  container: {flex: 1},
  button: {
    width: 70,
    height: 70,
    borderRadius: 35,
    right: 0,
    backgroundColor: Colors.primary,
    shadowColor: 'rgba(0,0,0, .4)', // IOS
    shadowOffset: {height: 1, width: 1}, // IOS
    shadowOpacity: 1, // IOS
    shadowRadius: 5, //IOS
    elevation: 2, // Android
  },
  buttonContainer: {
    position: 'absolute',
    bottom: 15,
    right: 15,
  },  pdfBg: {
    height: 50,
    width: 40,}
});
