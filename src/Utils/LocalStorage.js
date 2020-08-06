
import AsyncStorage from '@react-native-community/async-storage';


export function updateContact(id,value){
AsyncStorage.getItem('allContacts', (_err, result) => {
      var allValue = JSON.parse(result)
     let objIndex = allValue.findIndex((obj => obj.id === id));
allValue[objIndex] = value
console.log("After update: ", allValue[objIndex])
AsyncStorage.setItem('allContacts', JSON.stringify(allValue));

  });
}