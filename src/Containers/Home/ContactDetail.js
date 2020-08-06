import React, { useState } from "react";
import PropTypes from "prop-types";
import { Header, ListItem, Button, Avatar, Card } from "react-native-elements";
import { Colors, HelperStyles } from "../../Theme";
import {
  View,
  StyleSheet,
  Text,
  ScrollView,
  Image,
  TouchableOpacity,
  TouchableWithoutFeedback,
  Dimensions,
  FlatList,
  Modal,
} from "react-native";
import FileViewer from "react-native-file-viewer";
import { useSelector, useDispatch } from "react-redux";
import RNFS from "react-native-fs";
import Icon from "react-native-vector-icons/FontAwesome";
import Share from "react-native-share";
import { getNameId } from "../../Utils/Validator";
import CardView from "react-native-cardview";
import { setContact, setContactDetails } from "../../Redux/Actions";
import AsyncStorage from "@react-native-community/async-storage";
import { Linking } from "react-native";
import DatePicker from "react-native-datepicker";
import moment from "moment";
import RNCalendarEvents from "react-native-calendar-events";
function ContactDetail(props) {
  const ContactVal = useSelector((cont) => cont.contactDetail);
  const dbcStore = useSelector((cont) => cont);
  const [remainderDate, setRemainderDate] = useState(moment());
  const [modalVisible, setmodalVisible] = useState(false);
  const [selectedReminderTitle, setselectedReminderTitle] = useState("");
  const dispatch = useDispatch();
  // console.log('contact val', ContactVal);
  const onEditTap = () => {
    props.navigation.navigate("addContact", { isEdit: true });
  };

  const setRimander = () => {
    let date = moment(remainderDate).toISOString();
    let date2 = moment(remainderDate)
      .add(5, "minute")
      .toISOString();

    RNCalendarEvents.saveEvent(selectedReminderTitle, {
      startDate: date,
      endDate: date2,
      alarms: [
        {
          date: date,
        },
      ],
    });
    setmodalVisible(false)
  };
  const onReminderPress = (title) => {
    setmodalVisible(true);
    setselectedReminderTitle(title);
  };

  const callContact = (phoneNumber) => {
    Linking.openURL(`tel:${phoneNumber}`);
  };
  const statusChange = (type, value) => {
    let jsonValue = ContactVal;
    if (type === 1) {
      dispatch(
        setContactDetails({
          ...ContactVal,
          favorited: value,
        })
      );
    } else {
      dispatch(
        setContactDetails({
          ...ContactVal,
          myTeam: value,
        })
      );
    }

    const allCont = JSON.parse(JSON.stringify(dbcStore.contacts));
    console.log("before", allCont);

    for (var i = 0; i < allCont.length; i++) {
      let item = allCont[i];

      if (item.id === ContactVal.id) {
        if (type === 1) {
          allCont[i] = {
            ...ContactVal,
            favorited: value,
          };
        } else {
          allCont[i] = {
            ...ContactVal,
            myTeam: value,
          };
        }
      }
    }
    console.log("aaaaa", allCont);

    AsyncStorage.setItem("allContacts", JSON.stringify(allCont));

    //  AsyncStorage.setItem('allContacts', JSON.stringify(allCont));
    dispatch(setContact(allCont));

    // dispatch(setContactDetails(jsonValue));
  };

  const onGridTap=(item)=>{
console.log("girdtap",item);

    props.navigation.navigate('ContactDocumentsList',{type:item.type})
  }
  return (
    <View style={styles.container}>
      {console.log("reloadedddd")}

      <Header
        backgroundColor={Colors.primary}
        leftComponent={{
          icon: "chevron-left",
          color: "#fff",
          size: 40,
          onPress: () => props.navigation.goBack(),
        }}
        centerComponent={
          <Text style={HelperStyles.headerTitle}>Contact Details</Text>
        }
        rightComponent={
          <Text onPress={() => onEditTap()} style={HelperStyles.headerTitle}>
            Edit
          </Text>
        }
      />

      <ScrollView bounces={true}>
        <View style={styles.content}>
          <View style={{ alignItems: "center" }}>
            <Avatar
              containerStyle={styles.avathar}
              titleStyle={styles.avthrTitle}
              rounded
              title={getNameId(
                ContactVal.firstName + " " + ContactVal.lastName
              )}
            />
          </View>
          <Text style={styles.name}>{ContactVal.firstName + " " + ContactVal.lastName}</Text>
          <Text style={styles.subTitle}>{ContactVal.subtitle}</Text>
          <Text style={styles.designation}>{ContactVal.designation}</Text>
          <View
            style={{
              flexDirection: "row",
              justifyContent: "center",
              marginVertical: 10,
            }}
          >
            <Button
              onPress={() => statusChange(1, !ContactVal.favorited)}
              containerStyle={{
                borderColor: Colors.secondary,
                borderRadius: 8,
                borderWidth: 1,
                marginRight: 3,
                backgroundColor: ContactVal.favorited
                  ? Colors.secondary
                  : Colors.white,
              }}
              type="outline"
              icon={
                <Icon
                  name="star"
                  size={10}
                  color={
                    !ContactVal.favorited ? Colors.secondary : Colors.white
                  }
                />
              }
            />

            <Button
              onPress={() => statusChange(2, !ContactVal.myTeam)}
              containerStyle={{
                borderColor: Colors.secondary,
                borderRadius: 8,
                borderWidth: 1,
                marginLeft: 3,
                backgroundColor: ContactVal.myTeam
                  ? Colors.secondary
                  : Colors.white,
              }}
              type="outline"
              icon={
                <Icon
                  name="users"
                  size={10}
                  color={!ContactVal.myTeam ? Colors.secondary : Colors.white}
                />
              }
            />
            <Button
              onPress={() => callContact(ContactVal.phoneNumber)}
              containerStyle={{
                borderColor: Colors.secondary,
                borderRadius: 8,
                borderWidth: 1,
                marginLeft: 3,
                backgroundColor: Colors.white,
              }}
              type="outline"
              icon={<Icon name="phone" size={10} color={Colors.secondary} />}
            />
          </View>
          <CardView
          cardElevation={1}
          cardMaxElevation={1}
          >
          <CustomFlatList
          isDetailList={false}

            onReminderPress={onReminderPress}
            title="Business Cards"
            items={ContactVal.businessCards}
            id={ContactVal.id}
          />
          </CardView>
          <CustomGridView onPress={onGridTap}/>
          {/* <CustomFlatList
            onReminderPress={onReminderPress}
            title="Quotations"
            items={ContactVal.quotations}
            id={ContactVal.id}
          />
          <CustomFlatList
            onReminderPress={onReminderPress}
            title="Invoice"
            items={ContactVal.invoices}
            id={ContactVal.id}
          />
          <CustomFlatList
            onReminderPress={onReminderPress}
            title="Documents"
            items={ContactVal.documents}
            id={ContactVal.id}
          /> */}
        </View>
      </ScrollView>
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}

        // onRequestClose={() => {
        //   Alert.alert("Modal has been closed.");
        // }}
      >
        <View
          style={{
            justifyContent: "center",
            alignItems: "center",
            height: "100%",
          }}
        >
          <View
            style={{
              backgroundColor: Colors.white,
              borderRadius: 15,
              borderColor: "#ddd",
              borderWidth: 0.5,
              overflow: "hidden",
            }}
          >
            <Text
              style={{
                backgroundColor: Colors.secondary,
                width: 320,
                textAlign: "center",
                color: Colors.white,
                height: 44,
                paddingTop: 15,
                borderRadius: 15,
              }}
            >
              SET REMAINDER
            </Text>
            <View style={{ padding: 30 }}>
              {/* <View style={{backgroundColor:Colors.primary}}> */}

              {/* </View> */}
              <DatePicker
                style={{ width: 250, borderRadius: 8 }}
                date={remainderDate}
                mode="datetime"
                format="YYYY-MM-DD HH:mm"
                confirmBtnText="Confirm"
                cancelBtnText="Cancel"
                showIcon={true}
                customStyles={{
                  dateIcon: {
                    position: "absolute",
                    left: 0,
                    top: 4,
                    marginLeft: 0,
                  },
                  dateInput: {
                    borderRadius: 5,
                    borderColor: "#ddd",
                    // marginLeft: 36
                  },
                  // ... You can check the source to find the other keys.
                }}
                onDateChange={(datetime) => {
                  setRemainderDate(datetime);
                }}
              />
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-around",
                  marginTop: 30,
                }}
              >
                <Button
                  containerStyle={{ width: 120 }}
                  titleStyle={{ fontSize: 10 }}
                  buttonStyle={{ backgroundColor: Colors.red }}
                  title="Cancel"
                  onPress={() => setmodalVisible(false)}
                />
                <Button
                  titleStyle={{ fontSize: 10 }}
                  containerStyle={{ width: 120 }}
                  buttonStyle={{ backgroundColor: Colors.primary }}
                  title="Set Remainder"
                  onPress={() => setRimander()}
                />
              </View>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

ContactDetail.propTypes = {};
const styles = StyleSheet.create({
  avthrTitle: {
    fontSize: 36,
    fontWeight: "bold",
    marginTop: 10,
  },
  pdfDetails: {
    overflow: "hidden",
    marginBottom: 10,
    marginHorizontal: 5,
  },
  pdfTitles: {
    textAlign: "center",
    fontSize: 8,
    marginTop: 3,
    color: Colors.grey,
    // width: 100,
  },
  gridTitles: {
    textAlign: "center",
    fontSize: 12,
    marginTop: 12,
    color: Colors.white
    // width: 100,
  },
  pdfName: {
    marginTop: -20,
    fontSize: 12,
    color: Colors.grey,
  },
  pdfDate: {
    fontSize: 12,
    color: Colors.grey,
  },
  designation: {
    marginBottom: 5,
    textAlign: "center",
    color: Colors.grey,
    fontSize: 14,
    marginTop: -3,
  },
  pdfBg: {
    height: 50,
    width: 40,
    borderRadius: 5,
    // marginHorizontal: 10,
    backgroundColor: Colors.primary,
    alignItems: "center",
    justifyContent: "center",
  },
  image: {
    width: Dimensions.get("window").width - 100,
    height: 200,
    resizeMode: "contain",
  },
  container: {
    backgroundColor: Colors.white,
    height: "100%",
  },
  imageBg: {
    borderWidth: 1,
    borderColor: Colors.primary,
    padding: 5,
    marginTop: 10,
    borderRadius: 5,
  },
  header: {
    backgroundColor: Colors.secondary,
    padding: 5,
    // width: '100%',
    // height: 30,
    // marginBottom:-20,
    color: "white",
  },
  headerTitle: {
    color: Colors.white,
    fontSize: 13,
    fontWeight: "bold",
    marginLeft: 10,
  },
  avathar: {
    height: 80,
    width: 80,
    borderRadius: 40,
    backgroundColor: Colors.secondary,
  },
  content: { marginTop: 30, marginBottom: 120 },
  name: {
    fontSize: 18,
    textAlign: "center",
    fontWeight: "bold",
    marginTop: 5,
    // margin: 5,
    // marginTop: 5,
  },
  subTitle: {
    fontSize: 16,
    textAlign: "center",
    marginTop: -3,
  },
  card: {
    margin: 15,
    // borderRadius: 15,
    // padding: 0,
    // shadowColor: '#000',
    // shadowOffset: {
    //   width: 0,
    //   height: 6,
    // },
    // shadowOpacity: 0.37,
    // shadowRadius: 7.49,

    // elevation: 12,
  },
  flatList: { marginVertical: 0, marginHorizontal: 0 },
  noData: { textAlign: "center", color: Colors.grey, marginVertical: 20 },
});

export default ContactDetail;

export function CustomFlatList({ title, items, id, onReminderPress,isDetailList }) {
  const onImageTap = async (item) => {
    console.log("lll", item);

    await FileViewer.open(
      RNFS.DocumentDirectoryPath + "/dbcFiles/" + id + "_" + item
    );
  };
  const shareDBSFile = (name) => {
    Share.open({
      url: `file://${RNFS.DocumentDirectoryPath + "/dbcFiles/" + name}`,
    })
      .then((res) => {
        console.log(res);
      })
      .catch((err) => {
        err && console.log(err);
      });
  };
  return (
    <View style={styles.card}>
     {!isDetailList && <ListItem
        // onPress={() => shareDBSFile(title)}
        containerStyle={styles.header}
        // contentContainerStyle={styles.header}
        titleStyle={styles.headerTitle}
        title={title}
        // leftAvatar={
        //   <Icon
        //     name={title === 'Business Cards' ? 'id-card' : 'file-text'}
        //     size={15}
        //     color={Colors.white}
        //   />
        // }
        // rightAvatar={<Icon name={'share'} size={15} color={Colors.white} />}
      />}
      {items.length === 0 ? (
        <></>
      ) : (
        // <Text style={styles.noData}>No data</Text>
        <FlatList
          style={styles.flatList}
          data={items}
          // horizontal={true}
          // numColumns={3}
          bounces={false}
          renderItem={({ item }) => (
            <ListItem
              containerStyle={{ height: 80 }}
              onPress={() => onImageTap(item)}
              title={item}
              titleStyle={styles.pdfName}
              subtitle={"20/05/2020"}
              subtitleStyle={styles.pdfDate}
              rightElement={
                <TouchableOpacity onPress={() => onReminderPress(item)}>
                  <View style={{ flexDirection: "row" }}>
                    <Icon name={"bell"} size={10} color={Colors.grey} />
                    <Text
                      style={{
                        fontSize: 10,
                        color: Colors.grey,
                        marginLeft: 3,
                      }}
                    >
                      Reminder
                    </Text>
                  </View>
                </TouchableOpacity>
              }
              leftAvatar={
                <View style={{ flexDirection: "column" }}>
                  <Image
                    style={styles.pdfBg}
                    source={require("../../Assets/pdfIcon.jpeg")}
                  />
                  <Text style={styles.pdfTitles}>{"DBC PDF"}</Text>
                </View>
              }
              bottomDivider
            />

            // <TouchableOpacity
            //   style={styles.pdfDetails}
            //   onPress={() => onImageTap(item)}>
            //   <View style={styles.pdfBg}>
            //     <Image style={styles.pdfBg} source={require('../../Assets/pdfIcon.jpeg')}/>
            //     {/* <Icon name="file-pdf-o" size={70} color="white" /> */}
            //   </View>
            //   <Text style={styles.pdfTitles}>{item}</Text>
            // </TouchableOpacity>
          )}
          keyExtractor={(item) => item}
        />
      )}
    </View>
  );
}



 export function CustomGridView(props) {
  const list = [
    {
      name: 'Quotations',
      type: 'quotations',
    },
    {
      name: 'Invoices',
      type: 'invoices',
    },
    {
      name: 'Generic Documents',
      type: 'documents',
    },
  ];
  return (
    <View>
      <FlatList
          style={[styles.flatList,{marginHorizontal:15}]}
          contentContainerStyle={{justifyContent:'center'}}
          data={list}
          // horizontal={true}
           numColumns={3}
          bounces={false}
          renderItem={({ item }) => (<TouchableOpacity onPress={()=>props.onPress(item) }>
         <CardView
          cardElevation={5}
          cardMaxElevation={5}
          >
         
<View style={{ flexDirection: "column",justifyContent:"center",alignItems:'center',borderRadius:6,marginHorizontal:5 ,paddingTop:0,marginVertical:10,width:(Dimensions.get('window').width/3)-20,height:(Dimensions.get('window').width/3)-20,backgroundColor:Colors.secondary}}>
                  {/* <Image
                    style={{width:(Dimensions.get('window').width/3)-40,height:80}}
                    source={require("../../Assets/pdfIcon.jpeg")}
                  /> */}
                 
                  <Icon name="file-text-o" size={25} color={Colors.white}/>
                  <Text style={styles.gridTitles}>{item.name}</Text>
                </View>
</CardView>   

          </TouchableOpacity>
           

          )}
          keyExtractor={(item) => item}
        />
    </View>
  )
}
