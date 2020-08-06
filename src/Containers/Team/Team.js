import React, {useEffect, useCallback, useState, useRef} from 'react';
import PropTypes from 'prop-types';
import {View, Text, FlatList, Image, StyleSheet, Platform} from 'react-native';
import {Header, ListItem, Button, Avatar} from 'react-native-elements';
import Icon from 'react-native-vector-icons/FontAwesome';
import {Colors, HelperStyles} from '../../Theme';
import {useDispatch, useSelector} from 'react-redux';
import AsyncStorage from '@react-native-community/async-storage';
import RNFS from 'react-native-fs';
import {
  setContact,
  setContactDetails,
  setUrlDetails,
} from '../../Redux/Actions';
import {useFocusEffect} from '@react-navigation/native';
import {SearchBar} from 'react-native-elements';
import ActionSheet from 'react-native-actionsheet';
import {getNameId} from '../../Utils/Validator';
import CardView from 'react-native-cardview';

function Team(props) {
  const [searchText, setsearchText] = useState('');
  const path = RNFS.DocumentDirectoryPath + '/dbcFiles/';
  const actionSheet = useRef();
  // const dispatch = useDispatch();
  const contacts = useSelector(cont => cont.contacts);
  const dispatch = useDispatch();
  const tappedFloatButton = () => {
    dispatch(
      setContactDetails({
        id: '',
        name: '',
        subtitle: '',
        designation: '',
        myTeam: false,
        businessCards: [],
        quotations: [],
        invoices: [],
        documents: [],
      }),
    );

    props.navigation.navigate('addContact', {isEdit: false});
  };
  const optionSelected = index => {
    if (index == 0) {
      props.navigation.navigate('addContact', {isEdit: true});
    } else {
    }
    console.log(index);
  };
  useEffect(() => {}, []);
  const _onOpenActionSheet = item => {
    actionSheet.current.show();
    dispatch(setContactDetails(item));
    dispatch(
      setUrlDetails({
        imageUrl: path + item.image,
        quotationUrl: item.quotation,
      }),
    );
  };

  const onItemTap = item => {
    props.navigation.navigate('contactDetail');
    console.log('itemllll', item);

    dispatch(setContactDetails(item));
  };
  return (
    <View style={styles.container}>
      <Header
        backgroundColor={Colors.primary}
        // leftComponent={{icon: 'menu', color: '#fff'}}
        centerComponent={<Text style={HelperStyles.headerTitle}>My Team</Text>}

        // centerComponent={{text: 'My Team', style: {color: '#fff'}}}
        // rightComponent={{icon: 'Team', color: '#fff'}}
      />
      <SearchBar
        platform="ios"
        placeholder="Search..."
        onChangeText={text => setsearchText(text)}
        value={searchText}
      />
      <FlatList
        data={
          searchText !== ''
            ? contacts.filter(
                person =>
                  person.name.includes(searchText) && person.myTeam === true,
              )
            : contacts.filter(person => person.myTeam === true)
        }
        bounces={false}
        renderItem={({item}) => (
            <View style={{ marginHorizontal: 0, marginVertical: 0 }}>
            <ListItem
              containerStyle={{ height: 70 }}
              roundAvatar
              onPress={() => onItemTap(item)}
              onLongPress={() => _onOpenActionSheet(item)}
              title={item.firstName +" "+ item.lastName}
              titleStyle={styles.title}
              subtitle={item.subtitle}
              subtitleStyle={styles.subtitle}
              leftElement={<Icon name="users" color={Colors.secondary} size={15}/>}
              leftAvatar={
                <Avatar
                  containerStyle={{
                    backgroundColor: Colors.secondary,
                    height: 46,
                    width: 46,
                    borderRadius: 23,
                    marginLeft: 0,
                  }}
                  rounded
                  title={getNameId(item.firstName + " " + item.lastName)}
                />
              }
              //  bottomDivider
            />
          </View>
        )}
        keyExtractor={item => item.id}
      />
      <Button
        buttonStyle={styles.button}
        icon={<Icon name="plus" size={25} color="white" />}
        containerStyle={styles.buttonContainer}
        onPress={() => tappedFloatButton('new')}
      />
      <ActionSheet
        ref={actionSheet}
        title={'Choose any one option'}
        options={['Edit', 'Delete', 'cancel']}
        cancelButtonIndex={2}
        destructiveButtonIndex={1}
        onPress={index => {
          optionSelected(index);
        }}
      />
    </View>
  );
}

Team.propTypes = {};

export default Team;

const styles = StyleSheet.create({
    avatar: {
        width: 35,
        height: 35,
      },
      title: {
        fontWeight: "bold",
      },
      subtitle: {
        color: Colors.grey,fontWeight: "bold",
      },
  button: {
    width: 70,
    height: 70,
    borderRadius: 35,
    right: 0,
    backgroundColor: Colors.secondary,
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
  },
  container: {flex: 1},
});
