import React, {useEffect, useCallback, useState} from 'react';
import {StyleSheet, Platform, AppState} from 'react-native';
import 'react-native-gesture-handler';
import {NavigationContainer, useFocusEffect} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import LoadSplasScreen from './Containers/LaunchScreen/SplashScreen';
import Home from './Containers/Home/Home';
import Team from './Containers/Team/Team';
import Documents from './Containers/Documents/Documents';
import More from './Containers/More/More';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import Walkthrough from './Containers/Walkthrough/Walkthrough';
import addContact from './Containers/AddConatct/addContact';
import Icon from 'react-native-vector-icons/FontAwesome';
import DocumentDetail from './Containers/Documents/DocumentDetail';
import {Colors} from './Theme';
import RNFS, {pathForBundle} from 'react-native-fs';
import {useSelector, useDispatch} from 'react-redux';
import {
  setNewFileImport,
  setContactDetails,
  setUrlDetails,
} from './Redux/Actions';
import {isFileValid} from './Utils/Validator';
import ContactDetail from './Containers/Home/ContactDetail';
import AddDocuments from './Containers/Documents/AddDocuments';
import Favorities from './Containers/Favorites/Favorities';
import RNCalendarEvents from 'react-native-calendar-events';
import ContactDocumentsList from './Containers/Home/ContactDocumentsList';
const Stack = createStackNavigator();

const Tab = createBottomTabNavigator();

function TabBarItems(props) {
  return (
    <Tab.Navigator
      screenOptions={({route}) => ({
        tabBarIcon: ({focused, color, size}) => {
          let iconName;

          if (route.name === 'Home') {
            iconName = focused ? 'home' : 'home';
          } else if (route.name === 'Favorites') {
            iconName = focused ? 'star' : 'star';
          }else if (route.name === 'Team') {
            iconName = focused ? 'users' : 'users';
          } else if (route.name === 'Documents') {
            iconName = focused ? 'file-text' : 'file-text';
          } else if (route.name === 'More') {
            iconName = focused ? 'ellipsis-h' : 'ellipsis-h';
          }

          // You can return any component that you like here!
          return <Icon name={iconName} size={20} color={focused?Colors.black:Colors.grey} />;
        },
      })}
      tabBarOptions={{
        activeTintColor: Colors.black,
        inactiveTintColor: 'gray',
      }}>
      <Tab.Screen
        name="Home"
        component={Home}
        initialParams={props.route.params}
      />
      <Tab.Screen name="Favorites" component={Favorities} />
      <Tab.Screen name="Team" component={Team} />
      <Tab.Screen name="Documents" component={Documents} />
      <Tab.Screen name="More" component={More} />
    </Tab.Navigator>
  );
}

function AppNavigator() {
  const newImportFile = useSelector(cont => cont.newFileImport);
  const dbcStore = useSelector(cont => cont);
  const dispatch = useDispatch();
  useEffect(() => {

    AppState.addEventListener('change', _handleAppStateChange);

    return () => {
      AppState.removeEventListener('change', _handleAppStateChange);
    };

  }, []);

  const _handleAppStateChange = nextAppState => {
    console.log('next state', nextAppState);
    if (nextAppState === 'active') {
      _loadFiles();
    }
  };
  const _loadFiles = async () => {
    if (Platform.OS === 'ios') {
      await _moveInboxFiles();
    }
    console.log('----path', RNFS.DocumentDirectoryPath);

    RNFS.readDir(RNFS.DocumentDirectoryPath)
      .then(srcFiles => {
        let files = [];
        srcFiles.map(file => {
           console.log('opende filleee---', file);
          if (file.isFile() && file.name.indexOf('.PNG') >= 0 || file.name.indexOf('.jpg') >= 0) {
            console.log('new file present');
            const [fileValid, contactId] = isFileValid('image', file.name);
            if (fileValid) {
              dispatch(setNewFileImport(file.name));
              dispatch(
                setContactDetails({
                  ...dbcStore.contactDetails,
                  id: contactId,
                  image: file.name,
                }),
              );
              dispatch(
                setUrlDetails({
                  ...dbcStore.urlDetails,

                  imageUrl:
                    Platform.OS === 'ios'
                      ? file.path
                      : RNFS.DocumentDirectoryPath + '/' + file.name,
                }),
              );
            }
          } else if (file.isFile() && file.name.indexOf('.pdf' >= 0)) {
            const [fileValid, contactId] = isFileValid('PDF', file.name);
            if (fileValid) {
              dispatch(setNewFileImport(file.name));
              dispatch(
                setContactDetails({
                  ...dbcStore.contactDetails,
                  id: contactId,
                  quotation: file.name,
                }),
              );
              dispatch(
                setUrlDetails({
                  ...dbcStore.urlDetails,

                  quotationUrl:
                    Platform.OS === 'ios'
                      ? file.path
                      : RNFS.DocumentDirectoryPath + '/' + file.name,
                }),
              );
            }
          }
        });
      })
      .catch(err => {
        console.log(err.message, err.code);
      });
  };
  return (
    <NavigationContainer>
      {newImportFile !== '' ? (
        <Stack.Navigator screenOptions={{headerShown: false}}>
          <Stack.Screen name="addContact" component={addContact} />
        </Stack.Navigator>
      ) : (
        <Stack.Navigator screenOptions={{headerShown: false}}>
          <Stack.Screen name="SplashScreen" component={LoadSplasScreen} />
          <Stack.Screen name="walkthrough" component={Walkthrough} />
          <Stack.Screen name="tabbar" component={TabBarItems} />
          <Stack.Screen name="addContact" component={addContact} />
          <Stack.Screen name="documentDetail" component={DocumentDetail} />
          <Stack.Screen name="contactDetail" component={ContactDetail} />
          <Stack.Screen name="addDocument" component={AddDocuments} />
          <Stack.Screen name="ContactDocumentsList" component={ContactDocumentsList} />


          
        </Stack.Navigator>
      )}
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  scrollView: {
    backgroundColor: Colors.lighter,
  },
  engine: {
    position: 'absolute',
    right: 0,
  },
  body: {
    backgroundColor: Colors.white,
  },
  sectionContainer: {
    marginTop: 32,
    paddingHorizontal: 24,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '600',
    color: Colors.black,
  },
  sectionDescription: {
    marginTop: 8,
    fontSize: 18,
    fontWeight: '400',
    color: Colors.dark,
  },
  highlight: {
    fontWeight: '700',
  },
});

export default AppNavigator;
async function _moveInboxFiles() {
  try {
    const tmpFiles = await RNFS.readDir(
      RNFS.TemporaryDirectoryPath + '/org.reactjs.native.shamshir.DBC-Inbox',
    );
    // const inboxFiles = await RNFS.readDir(
    //   RNFS.DocumentDirectoryPath + '/Inbox',
    // );
    console.log('inboxFiles', tmpFiles);

    // tmpFiles.concat(inboxFiles);

    if (tmpFiles) {
      tmpFiles.map(async file => {
        if (file.isFile()) {
          if (
            file.isFile() &&
            (file.name.indexOf('.PNG') >= 0 || file.name.indexOf('.pdf') >= 0)
          ) {
            await RNFS.moveFile(
              file.path,
              `${RNFS.DocumentDirectoryPath}/${file.name}`,
            );
          }
        }
      });
    }
  } catch (err) {
    console.log(err.message, err.code);
  }
}
