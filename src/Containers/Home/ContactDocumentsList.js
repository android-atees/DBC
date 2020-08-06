import React, { useState } from 'react'
import PropTypes from 'prop-types'
import { CustomFlatList } from './ContactDetail'

import DatePicker from "react-native-datepicker";
import moment from "moment";
import RNCalendarEvents from "react-native-calendar-events";
import { useSelector } from 'react-redux';
import { View, Modal, Text, StyleSheet } from 'react-native';
import { Button,Header, Input, } from 'react-native-elements';

import { HelperStyles,Colors } from '../../Theme';
// import { TextInput } from 'react-native-gesture-handler';

function ContactDocumentsList(props) {
  const params =  props.route.params.type

  const ContactVal = useSelector((cont) => cont.contactDetail);
  console.log("-------",params);
  

    const [remainderDate, setRemainderDate] = useState(moment());
  const [modalVisible, setmodalVisible] = useState(false);
  const [selectedReminderTitle, setselectedReminderTitle] = useState("");
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
    return (
        <View>




<Header
        backgroundColor={Colors.primary}
        leftComponent={{
          icon: "chevron-left",
          color: "#fff",
          size: 40,
          onPress: () => props.navigation.goBack(),
        }}
        centerComponent={
        <Text style={HelperStyles.headerTitle}>{params}</Text>
        }
      
        
      />
            {params === 'quotations' &&
            <CustomFlatList
            isDetailList={true}
            onReminderPress={onReminderPress}
            title="Quotations"
            items={ContactVal.quotations}
            id={ContactVal.id}/>
    }

{params === 'invoice' &&
          <CustomFlatList
          isDetailList={true}

            onReminderPress={onReminderPress}
            title="Invoice"
            items={ContactVal.invoices}
            id={ContactVal.id}
          />}
            {params === 'documents' &&
          <CustomFlatList
          isDetailList={true}

            onReminderPress={onReminderPress}
            title="Documents"
            items={ContactVal.documents}
            id={ContactVal.id}
/> }
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

              <Input
            //   labelStyle={styles.label}
              inputStyle={styles.label}
              inputContainerStyle={styles.inputDescriptionContainer}
            //   label="Reminder title"
              
              value={selectedReminderTitle} onChangeText={(text)=>setselectedReminderTitle(text)}
            />
              {/* <TextInput /> */}
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
    )
}

ContactDocumentsList.propTypes = {

}


const styles = StyleSheet.create({
    label: {
        // height: 30,
        fontSize: 12,
        color: Colors.black,
      },
      inputContainer: {
        borderRadius: 6,
        borderColor: Colors.grey,
        height: 45,
        borderWidth: 0.5,
        paddingLeft: 7.0,
      },inputDescriptionContainer: {
        borderRadius: 8,
        borderColor: '#ddd',
        width:250,
marginLeft:-10,
        // height: 45,
        borderWidth: 0.5,
        paddingLeft: 7.0,
        // textAlignVertical: 'top',
        // alignItems: 'flex-start',
      },
})

export default ContactDocumentsList

