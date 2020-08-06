import RNFS from 'react-native-fs';
import store from '../Redux/store';
export function isFileValid(type, name) {
  const allContacts = store.getState().contacts;
  var temp1 = [];

  for (var i = 0; i < allContacts.length; i++) {
    const file = allContacts[i];
    console.log('files', allContacts[i]);
    console.log('name', name);

    if (file.image === name || file.quotation === name) {
      console.log('validate fasle');

      return [false, 'The contact already exist'];
    }
  }
  const temp = name.split('_');
  if (temp.length === 3) {
    temp1 = temp[2].split('.');
  } else {
    return [false, 'Not a valid file'];
  }
  if (
    temp.length === 3 &&
    temp[0] === 'dbc' &&
    temp[1].length === 6 &&
    temp1.length === 2
  ) {
    if ((type === 'image' && temp1[0] === 'image') || temp1[0] === 'jpg') {
      return [true, temp[1]];
    } else if (temp1[0] === 'pdf') {
      return [true, temp[1]];
    } else {
      return [false, temp[1]];
    }
  } else {
    return [false, 'Not a valid file'];
  }
}

export function getNameId(name) {
  const nameArray = name.split(' ');
  if (nameArray.length > 1) {
    return (
      nameArray[0].charAt(0).toUpperCase() +
      nameArray[1].charAt(0).toUpperCase()
    );
  }
  return name.charAt(0).toUpperCase();
}
