import React from 'react';
import PropTypes from 'prop-types';
import DocumentPicker from 'react-native-document-picker';
import {ScrollView} from 'react-native-gesture-handler';
import Color from '../../Theme/Color';
import RNFS from 'react-native-fs';
import FileViewer from 'react-native-file-viewer';
import AsyncStorage from '@react-native-community/async-storage';
import {useDispatch, useSelector} from 'react-redux';
import {
  setContact,
  setNewFileImport,
  setContactDetails,
  setUrlDetails,
} from '../../Redux/Actions';
import {isFileValid} from '../../Utils/Validator';
import RNPickerSelect from 'react-native-picker-select';
import {View, StyleSheet} from 'react-native';
import {Header} from 'react-native-elements';
import {Colors} from '../../Theme';

function AddDocuments(props) {
  const dispatch = useDispatch();
  const dbcStore = useSelector(cont => cont);

  const selectOneFile = async selectionType => {
    try {
      const res = await DocumentPicker.pick({
        type:
          selectionType === 'image'
            ? [DocumentPicker.types.images]
            : [DocumentPicker.types.pdf],
      });

      const [fileValid, contactId] = isFileValid(selectionType, res.name);
      console.log('oooooo', fileValid);

      if (fileValid) {
        await FileViewer.open(res.uri, {
          onDismiss: () => onFileViewerClosed(res, selectionType, contactId),
        });
      } else {
        alert(contactId);
      }
    } catch (err) {
      console.log('eeerror', err);

      if (DocumentPicker.isCancel(err)) {
      } else {
        throw err;
      }
    }
  };
  const checkFileAlreadyAdded = contactId => {
    if (dbcStore.contactDetails.id !== '') {
      if (dbcStore.contactDetails.id === contactId) {
        return true;
      }
      return false;
    } else {
      return true;
    }
  };
  const onFileViewerClosed = (res, type, contactId) => {
    console.log(res, type, contactId);
    console.log('wwwwwww', checkFileAlreadyAdded(contactId));

    if (type === 'image' && checkFileAlreadyAdded(contactId)) {
      dispatch(
        setContactDetails({
          ...dbcStore.contactDetails,
          id: contactId,
          image: res.name,
        }),
      );
      dispatch(
        setUrlDetails({
          ...dbcStore.urlDetails,

          imageUrl: res.uri,
        }),
      );
    } else if (type === 'pdf' && checkFileAlreadyAdded(contactId)) {
      dispatch(
        setContactDetails({
          ...dbcStore.contactDetails,
          id: contactId,
          quotation: res.name,
        }),
      );
      dispatch(
        setUrlDetails({
          ...dbcStore.urlDetails,

          quotationUrl: res.uri,
        }),
      );
    } else {
      console.log('oooooooo');

      alert('Image and documents doesnot match');
    }
  };
  const saveContact = () => {
    var rnfsPromises = [];
    var path = `${RNFS.DocumentDirectoryPath}/dbcFiles/`;
    if (isEdit) {
      const jsonValue = dbcStore.contactDetails;
      var allContacts = dbcStore.contacts;
      for (var i = 0; i < allContacts.length; i++) {
        let item = allContacts[i];
        if (item.id === jsonValue.id) {
          allContacts[i] = dbcStore.contactDetails;
        }
      }
      console.log('allcontacts', allContacts);

      AsyncStorage.setItem('allContacts', JSON.stringify(allContacts));
      dispatch(setContact(JSON.parse(JSON.stringify(allContacts))));
      return props.navigation.goBack();
    }
    if (dbcStore.contactDetails.image !== '') {
      rnfsPromises.push(
        RNFS.moveFile(
          dbcStore.urlDetails.imageUrl,
          `${path}${dbcStore.contactDetails.image}`,
        ),
      );
    }
    if (dbcStore.contactDetails.quotation !== '') {
      rnfsPromises.push(
        RNFS.moveFile(
          dbcStore.urlDetails.quotationUrl,
          `${path}${dbcStore.contactDetails.quotation}`,
        ),
      );
    }
    console.log('pathhhh', path);
    RNFS.mkdir(path)
      .then(success => {
        Promise.all(rnfsPromises)
          .then(success => {
            console.log('sucesss', success);
            const jsonValue = dbcStore.contactDetails;
            AsyncStorage.getItem('allContacts', (_err, result) => {
              if (result !== null) {
                console.log('Data Found', result);
                var allValue = JSON.parse(result).concat([jsonValue]);
                AsyncStorage.setItem('allContacts', JSON.stringify(allValue));
                dispatch(setContact(allValue));
              } else {
                console.log('Data Not Found');
                AsyncStorage.setItem(
                  'allContacts',
                  JSON.stringify([jsonValue]),
                );
                dispatch(setContact([jsonValue]));
              }
              dispatch(setNewFileImport(''));

              // props.navigation.navigate('Home');
            });

            console.log('FILE WRITTEN!');
          })
          .catch(err => {
            console.log(err.message);
            alert(err.message);
          });
      })
      .catch(err => {
        console.log(err.message);
        alert(err.message);
      });
  };
  return (
    <View>
      <Header
        backgroundColor={Colors.primary}
        leftComponent={{
          icon: 'chevron-left',
          color: '#fff',
          size: 40,
          onPress: () => props.navigation.goBack(),
        }}
        centerComponent={{text: 'Contact Details', style: {color: '#fff'}}}
        // rightComponent={{icon: 'home', color: '#fff'}}
      />
      <View>
        <RNPickerSelect
          style={{
            viewContainer: styles.selector,
            inputAndroidContainer: styles.input,
            inputIOSContainer: styles.input,
          }}
          onValueChange={value => console.log(value)}
          items={[
            {label: 'Football', value: 'football'},
            {label: 'Baseball', value: 'baseball'},
            {label: 'Hockey', value: 'hockey'},
          ]}
        />
      </View>
    </View>
  );
}

AddDocuments.propTypes = {};

export default AddDocuments;
const styles = StyleSheet.create({
  selector: {
    height: 50,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: Colors.grey,
    margin: 10,
  },
  input: {
    height: '100%',
    padding: 5,
    marginTop: 10,
  },
});
