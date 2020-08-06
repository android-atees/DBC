import React, {
  useEffect,
  useCallback,
  useState,
  useRef,
  componentDidMount,
} from "react";
import PropTypes from "prop-types";
import {
  StatusBar,
  View,
  Text,
  FlatList,
  Image,
  StyleSheet,
  Platform,
  SectionList,
  Dimensions,
  ScrollView,
  ToastAndroid,
} from "react-native";
import { Header, Button } from "react-native-elements";
import Icon from "react-native-vector-icons/FontAwesome";
import { Colors, HelperStyles } from "../../Theme";
import { useDispatch, useSelector } from "react-redux";
import AsyncStorage from "@react-native-community/async-storage";
import RNFS from "react-native-fs";
import {
  setContact,
  setContactDetails,
  setUrlDetails,
} from "../../Redux/Actions";
import moment from "moment";
import { useFocusEffect } from "@react-navigation/native";
//import { SearchBar } from "react-native-elements";
import ActionSheet from "react-native-actionsheet";
import { getNameId } from "../../Utils/Validator";
import CardView from "react-native-cardview";
import Color from "../../Theme/Color";
import { TouchableWithoutFeedback } from "react-native-gesture-handler";
import RNCalendarEvents from "react-native-calendar-events";
import Contacts from "react-native-contacts";
import { PermissionsAndroid } from "react-native";
import ShareMenu from "react-native-share-menu";

import ListItem from "../../Components/ListItem";
import Avatar from "../../Components/Avatar";
import SearchBar from "../../Components/SearchBar";
import { FAB } from "react-native-paper";
//import { NavigationEvents } from 'react-navigation';

type SharedItem = {
  mimeType: string,
  data: string,
};

function Home(props) {
  const [contactsArray, setContactsArray] = useState([]);
  const [searchText, setsearchText] = useState("");
  const path = RNFS.DocumentDirectoryPath + "/dbcFiles/";
  const actionSheetHome = useRef();
  const sectionListRef = useRef();
  // const dispatch = useDispatch();
  const contacts = useSelector((cont) => cont.contacts);
  const contactDetails = useSelector((cont) => cont.contactDetail);
  const dbcStore = useSelector((cont) => cont);

  const [sharedData, setSharedData] = useState("");
  const [sharedMimeType, setSharedMimeType] = useState("");
  const [sharedExtraData, setSharedExtraData] = useState(null);

  const handleShare = useCallback((item: ?SharedItem) => {
    if (!item) {
      return;
    }

    const { mimeType, data, extraData } = item;

    setSharedData(data);
    setSharedExtraData(extraData);
    setSharedMimeType(mimeType);
  }, []);

  useEffect(() => {
    ShareMenu.getInitialShare(handleShare);
  }, []);

  useEffect(() => {
    const listener = ShareMenu.addNewShareListener(handleShare);

    return () => {
      listener.remove();
    };
  }, []);

  //....................................................................

  const dispatch = useDispatch();

  const showToast = () => {
    ToastAndroid.show(
      "Please Provide Required Permissions",
      ToastAndroid.SHORT
    );
  };

  const loadContacts = () => {
    //....................Android..............................

    // PermissionsAndroid.request(
    //   PermissionsAndroid.PERMISSIONS.READ_CONTACTS,
    //   {
    //     'title': 'Contacts',
    //     'message': 'This app would like to view your contacts.',
    //     'buttonPositive': 'Please accept bare mortal'
    //   }
    // ).then(() => {
    //   Contacts.getAll((err, contacts) => {
    //     if (err === 'denied'){
    //       showToast();
    //     } else {
    //       setContactsArray(contacts);
    //     }
    //   })
    // })

    //....................iOS.................................
    Contacts.getAll((err, contacts) => {
      setContactsArray(contacts);
      console.log(contacts);
      if (err) {
        throw err;
      }
    });
  };
  const tappedFloatButton = () => {
    console.log("??????", dbcStore.contactDetail);

    props.navigation.navigate("addContact", { isEdit: true });
  };

  const optionSelected = (index) => {
    if (index == 0) {
      props.navigation.navigate("addContact", { isEdit: true });
    } else {
      let allValue = [];

      allValue = contacts.filter((item) => item.id !== contactDetails.id);
      dispatch(setContact(allValue));

      AsyncStorage.setItem("allContacts", JSON.stringify(allValue));
    }
  };

  useEffect(() => {
    loadContacts();
    // if (props.route.params != undefined) {
    //   props.navigation.navigate('addContact', {
    //     name: props.route.params.newFile,
    //   });
    // }
    RNCalendarEvents.authorizeEventStore()
      .then((status) => {
        console.log("Ssssssssaaaaa", status);

        // handle status
      })
      .catch((error) => {
        // handle error
      });
    // setEvent()
    getData();
    loadContacts();
  }, []);

  const setEvent = () => {
    console.log(
      "----",
      moment()
        .add(1, "minutes")
        .toISOString()
    );

    RNCalendarEvents.saveEvent("Title of event", {
      startDate: moment()
        .add(1, "minutes")
        .toISOString(),
      endDate: moment()
        .add(2, "minutes")
        .toISOString(),
      alarms: [
        {
          date: moment()
            .add(1, "minutes")
            .toISOString(),
        },
      ],
    });
  };
  sortWithHeader(contacts);
  const _onOpenActionSheet = (item) => {
    console.log("ssssssss", item);

    dispatch(setContactDetails(item));
    actionSheetHome.current.show();

    dispatch(
      setUrlDetails({
        imageUrl: path + item.image,
        quotationUrl: item.quotation,
      })
    );
  };
  const getData = async () => {
    try {
      await AsyncStorage.setItem("appLoadedOnce", "true");
      const jsonValue = await AsyncStorage.getItem("allContacts");
      if (jsonValue != null) {
        console.log("-----", JSON.parse(jsonValue));

        dispatch(setContact(JSON.parse(jsonValue)));
      }
    } catch (e) {
      // error reading value
    }
  };
  const onItemTap = (item) => {
    props.navigation.navigate("contactDetail");
    console.log("itemllll", item);

    dispatch(setContactDetails(item));
  };

  const onAphabetTap = (item) => {
    console.log(item);

    const index = sortWithHeader(contacts).findIndex(
      (x) => x.letter === item.toUpperCase()
    );

    console.log(index);
    if (index != -1) {
      sectionListRef.current.scrollToLocation({
        animated: true,
        itemIndex: index,
        sectionIndex: 0,
      });
    }
  };

  const getAvatarInitials = (textString) => {
    if (!textString) return "";

    const text = textString.trim();

    const textSplit = text.split(" ");

    if (textSplit.length <= 1) return text.charAt(0);

    const initials =
      textSplit[0].charAt(0) + textSplit[textSplit.length - 1].charAt(0);

    return initials;
  };

  const searchContact = (text) => {
    const phoneNumberRegex = /\b[\+]?[(]?[0-9]{2,6}[)]?[-\s\.]?[-\s\/\.0-9]{3,15}\b/m;
    const emailAddressRegex = /^(([^<>()[\].,;:\s@"]+(\.[^<>()[\].,;:\s@"]+)*)|(".+"))@(([^<>()[\].,;:\s@"]+\.)+[^<>()[\].,;:\s@"]{2,})$/i;
    if (text === "" || text === null) {
      loadContacts();
    } else if (phoneNumberRegex.test(text)) {
      Contacts.getContactsByPhoneNumber(text, (err, contacts) => {
        setContactsArray(contacts);
      });
    } else if (emailAddressRegex.test(text)) {
      Contacts.getContactsByEmailAddress(text, (err, contacts) => {
        setContactsArray(contacts);
      });
    } else {
      Contacts.getContactsMatchingString(text, (err, contacts) => {
        setContactsArray(contacts);
      });
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar
        barStyle="dark-content"
        hidden={false}
        backgroundColor="#00BCD4"
        translucent={true}
      />

      <Header
        backgroundColor={Colors.white}
        // leftComponent={{icon: 'menu', color: '#fff'}}
        centerComponent={
          <Text
            style={[
              HelperStyles.headerTitle,
              { color: Colors.black },
              { fontSize: 20 },
            ]}
          >
            Home
          </Text>
        }
      />
      <SearchBar
        onChangeText={(text) => searchContact(text)}
        value={searchText}
      />

      <ScrollView style={{ flex: 1 }}>
        {contactsArray.map((contact) => {
          return (
            <ListItem
              leftElement={
                <Avatar
                  img={
                    contact.hasThumbnail
                      ? { uri: contact.thumbnailPath }
                      : undefined
                  }
                  placeholder={getAvatarInitials(
                    `${contact.givenName} ${contact.familyName}`
                  )}
                  width={40}
                  height={40}
                />
              }
              key={contact.recordID}
              title={`${contact.givenName} ${contact.familyName}`}
              description={`${contact.company}`}
              onPress={() =>
                Contacts.openExistingContact(contact, () => {
                  console.log("QWQERRRRRRRRRRRRRRR", contact);
                })
              }
              onDelete={() =>
                Contacts.deleteContact(contact, () => {
                  loadContacts();
                })
              }
            />
          );
        })}
      </ScrollView>

      <FAB style={styles.fab} icon="plus" onPress={() => tappedFloatButton()} />
    </View>
  );
}

Home.propTypes = {};

export default Home;
function getFirstLetterFrom(value) {
  return value.slice(0, 1).toUpperCase();
}
function sortWithHeader(values) {
  values.sort((a, b) => a.firstName.localeCompare(b.firstName));
  const newNames = values.reduce(function(list, data, index) {
    let listItem = list.find(
      (item) =>
        item.letter && item.letter === getFirstLetterFrom(data.firstName)
    );
    if (!listItem) {
      list.push({ letter: getFirstLetterFrom(data.firstName), data: [data] });
    } else {
      listItem.data.push(data);
    }

    return list;
  }, []);

  return newNames;
}
const styles = StyleSheet.create({
  avatar: {
    width: 35,
    height: 35,
  },
  fab: {
    backgroundColor: "#003c8f",
    position: "absolute",
    margin: 16,
    right: 0,
    bottom: 0,
  },
  title: {
    fontWeight: "bold",
  },
  subtitle: {
    color: Color.grey,
    fontWeight: "bold",
  },
  header: {
    backgroundColor: Colors.white,
    marginLeft: 10,
    color: Colors.grey,
    fontWeight: "800",
    fontSize: 16,
    paddingVertical: 5,
  },
  button: {
    width: 50,
    height: 50,
    // borderRadius: 35,
    // right: 0,
    backgroundColor: Colors.secondary,
    // Android
  },
  contact_details: {
    textAlign: "center",
    color: "red",
    margin: 10,
  },
  buttonContainer: {
    position: "absolute",
    bottom: 15,
    right: 30,
    borderRadius: 35,
  },
  container: { flex: 1 },
});
const alphabetsArray = [
  "a",
  "b",
  "c",
  "d",
  "e",
  "f",
  "g",
  "h",
  "i",
  "j",
  "k",
  "l",
  "m",
  "n",
  "o",
  "p",
  "q",
  "r",
  "s",
  "t",
  "u",
  "v",
  "w",
  "x",
  "y",
  "z",
];
