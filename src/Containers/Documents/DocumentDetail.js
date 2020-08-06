import React, {useState, useEffect} from 'react';
import PropTypes from 'prop-types';
import {View, Text, FlatList, Image, StyleSheet} from 'react-native';
import {Header, ListItem, Button, SearchBar} from 'react-native-elements';
import Icon from 'react-native-vector-icons/FontAwesome';
import {useSelector, useDispatch} from 'react-redux';
import {Colors} from '../../Theme';
import {setContactDetails} from '../../Redux/Actions';

function DocumentDetail(props) {
  const type = props.route.params ? props.route.params.type : 'quotations';


  const [searchText, setsearchText] = useState('');
  const dispatch = useDispatch();
  const contacts = useSelector(cont => cont.contacts);
  const [allFiles, setAllFiles] = useState([]);
  const tappedFloatButton = () => {
    props.navigation.navigate('addDocument');
  };
  const onItemTap = item => {
    console.log('----', item.id);

    props.navigation.navigate('contactDetail');
    dispatch(setContactDetails(item.id));
  };
  var documentList = [];
  useEffect(() => {
    for (var i = 0; i < contacts.length; i++) {
      const contact = contacts[i];
      console.log('contact', contact);

      for (var j = 0; j < contact[type].length; j++) {
        const obj = {
          id: contact,
          data: contact[type][j],
        };
        documentList.push(obj);
      }
      // for (var j = 0; j < contact.invoices.length; j++) {
      //   const obj = {
      //     id: contact,
      //     data: contact.invoices[j],
      //   };
      //   documentList.push(obj);
      // }
      // for (var k = 0; k < contact.documents.length; k++) {
      //   const obj = {
      //     id: contact,
      //     data: contact.documents[k],
      //   };
      //   documentList.push(obj);
      // }
    }
    setAllFiles(documentList);
  }, []);

  return (
    <View style={styles.container}>
      <Header
        backgroundColor={Colors.primary}
        // leftComponent={{icon: 'menu', color: '#fff'}}
        leftComponent={{
          icon: 'chevron-left',
          color: '#fff',
          size: 40,
          onPress: () => props.navigation.goBack(),
        }}
        centerComponent={{text: 'Document Detail', style: {color: '#fff'}}}
        // rightComponent={{icon: 'home', color: '#fff'}}
      />
      <SearchBar
        platform="ios"
        placeholder="search a contact name"
        onChangeText={text => setsearchText(text)}
        value={searchText}
      />
      <FlatList
        data={
          searchText === ''
            ? allFiles
            : allFiles.filter(document => document.id.name.includes(searchText))
        }
        bounces={false}
        renderItem={({item}) => (
          <ListItem
            onPress={() => onItemTap(item)}
            roundAvatar
            title={item.data}
            subtitle={item.id.name}
            leftAvatar={
              <Image
                    style={styles.pdfBg}
                    source={require("../../Assets/pdfIcon.jpeg")}
                  />
              // <Icon name="file-pdf-o" size={30} />
              // <Image
              //   source={require('../../Assets/placeholder.jpeg')}
              //   style={styles.avatar}
              // />
            }
            bottomDivider
          />
        )}
        keyExtractor={item => item.id}
      />
      <Button
        buttonStyle={styles.button}
        icon={<Icon name="plus" size={25} color="white" />}
        containerStyle={styles.buttonContainer}
        onPress={tappedFloatButton}
      />
    </View>
  );
}

DocumentDetail.propTypes = {};

export default DocumentDetail;
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
  },pdfBg: {
    height: 50,
    width: 40,
    borderRadius: 5,
    // marginHorizontal: 10,
    backgroundColor: Colors.primary,
    alignItems: "center",
    justifyContent: "center",
  },
});
