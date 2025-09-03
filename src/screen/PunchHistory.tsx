import React, { useEffect, useState } from "react";
import { View, TextInput, StyleSheet, FlatList, Image, StatusBar, ImageBackground, Modal } from "react-native";
import Ionicons from "@react-native-vector-icons/ionicons";

import {  Text, TouchableOpacity, Dimensions } from "react-native";

const { width } = Dimensions.get("window");
import DateTimePickerModal from "react-native-modal-datetime-picker";

import { AppColors } from "../uitility/color";
import GlobalStyle from "../uitility/GlobalStyle";
import { SafeAreaView } from "react-native-safe-area-context";
import { images } from "../uitility/image";
import PunchHistoryViewModel from "../viewModel/PunchistoryViewModel";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../redux/store";
import { dailyattendance } from "../redux/slice/PunchHisSlice";
import { Dropdown } from "react-native-element-dropdown";
import CustomButton from "../component/CustomButton";
import CustomTextField from "../component/CustomTextfield";
import App from "../../App";


interface HeaderProps {
  title: string;
  onBack?: () => void;
  onpop:boolean
}

export const Header: React.FC<HeaderProps> = ({ title, onBack,onpop }) => {
  return (
    <SafeAreaView edges={["left", "right"]} style={{ backgroundColor: "transparent" }}>
      {/* StatusBar overlay */}
      <StatusBar translucent backgroundColor="transparent" barStyle="light-content" />

      <ImageBackground
        source={images.top}
        style={{
          width: "100%",
          paddingTop: StatusBar.currentHeight, // push content below statusbar
          borderBottomLeftRadius: 16,
          borderBottomRightRadius: 16,
          overflow: "hidden",
        }}
        resizeMode="cover"
      >
        <View style={{ flexDirection: "row", alignItems: "center", padding: 12,marginBottom:15 ,marginTop:10}}>
        {onpop&&  <TouchableOpacity onPress={onBack} style={styles.backBtn}>
            <Ionicons name="chevron-back-outline" size={22} color="#fff" />
          </TouchableOpacity>}
          <Text style={[GlobalStyle.semibold_black,{fontWeight:"800",
             flex: 1, textAlign: "center", color: "#fff", fontSize: 18 }]}>
            {title}
          </Text>
          <View style={{ width: 40 }} />
        </View>
      </ImageBackground>
    </SafeAreaView>

  );
};

export const SearchBar = ({ value, onChange }: { value: string; onChange: (t: string) => void }) => (
  <View style={styles.container}>
    <Ionicons name="search" size={20} color="#aaa" />
    <TextInput
      style={[GlobalStyle.regular_FontMedium,styles.input]}
      placeholder="Search by name or ID"
      placeholderTextColor={AppColors.hintext}
      value={value}
      onChangeText={onChange}
    />
  </View>
);


export const PunchCard = ({ name, role, id, time, status, image }: any) => {
  const isPunchIn = status === "Punch In";

  return (
    <View style={styles.card}>
<Image
  source={
    image
      ? { uri: image }
      : images.photo // your local default image
  }
  style={styles.avatar}
/>
      <View style={{ flex: 1, marginLeft: 12 }}>
        <Text style={[GlobalStyle.semibold_black,styles.name]}>{name}</Text>
        <Text style={[GlobalStyle.regular_Font,styles.details]}>{role} 
          <Text style={{color:AppColors.primaryLinear}}> •   
            </Text><Text style={[GlobalStyle.semibold_black,{fontSize:13}]}>
              {id}
              </Text></Text>
        <Text style={[GlobalStyle.regular_FontMedium,styles.time]}>🕒 {time}</Text>
      </View>

      <TouchableOpacity
        style={[
          styles.button,
          {  backgroundColor:status=="Not_Yet"?AppColors.addcolor:status=="IN"?"#08B74E":"#E53935"
 },
        ]}
      >
        <Text style={[GlobalStyle.regular_Font,styles.buttonText,{alignSelf:"center"
        }]}>{status}</Text>
      </TouchableOpacity>
    </View>
  );
};





export default function PunchHistory() {
  const [search, setSearch] = useState("");
const history = useSelector((state: RootState) => state.PunchHisSlice.employee_details);
const dispatch=useDispatch()
  const viewModel=PunchHistoryViewModel()
useEffect(()=>{
viewModel?.ini()
},[])
  const filteredData = history.filter(item =>
    item.user_name.toLowerCase().includes(search.toLowerCase()) ||
    item.employee_id.toLowerCase().includes(search.toLowerCase())
  );
       
const { page, hasMore, loading } = useSelector((state: RootState) => state.PunchHisSlice);
 

  return (
    <View style={{ flex: 1, backgroundColor: "#f5f5f5" }}>
      {/* Header */}
      <Header title={"Punch History"}  />

      {/* Search + Filter */}
      <View style={styles.topRow}>
        <SearchBar value={search} onChange={setSearch} />
        <TouchableOpacity style={styles.filterBtn} onPress={()=>{viewModel?.setIsVisible(true)}}>
          <Ionicons name="filter" size={20} color="#fff" />
        </TouchableOpacity>
      </View>

      {/* Today Label */}
      <View style={styles.todayRow}>
        <View style={{ flexDirection: "row" }}>
          <Ionicons name="calendar" size={18} color="#8E31EC" />
          <Text style={[GlobalStyle.semibold_black, styles.todayText]}> Today</Text>
        </View>

        {/* <TouchableOpacity style={styles.sortBtn}>
          <Ionicons name="swap-vertical" size={18} color="#FF7E00" />
          <Text style={[GlobalStyle.semibold_black, { color: "#FF7E00", marginLeft: 4, fontWeight: "700" }]}>
            Sort
          </Text>
        </TouchableOpacity> */}
      </View>


<FlatList
  data={filteredData}
  keyExtractor={(item:any) => item.employee_id.toString()}
  renderItem={({ item }) => (
    <PunchCard
      name={item.user_name}   // adjust keys based on API
      role={item.designation_name}
      id={item.employee_id}
      time={"09:08 AM"}
      status={item.status}
      image={item.photo}
    />
  )}
     onEndReached={() => {
      if (hasMore && !loading) {
        dispatch(dailyattendance({  page, per_page: 20 }));
      }
    }}
        onEndReachedThreshold={0.5}
  contentContainerStyle={{ paddingBottom: 20 }}
/>
   <Modal
        visible={viewModel?.isVisible}
        onDismiss={() =>viewModel?. setIsVisible(false)}
     transparent animationType="fade"
        
      >
        <View style={styles.modalContainer}>
            <View >
<FilterModal onpress={() =>
{
viewModel?. setIsVisible(false);
   }
}/>
</View>
        </View>

      </Modal>
    </View>
  );
}



const FilterModal = ({onpress}:{onpress:any}) => {
const dispatch=useDispatch()
const designation:any = useSelector((state: RootState) => state.FilterSlice.desingationList);
const depatment:any = useSelector((state: RootState) => state.FilterSlice.departmentlist);

 
const viewmodal=PunchHistoryViewModel()
  

  
  return (
    <View>
      
        <View style={styles.modalContent}>
          {/* Punch Type */}
          <Text style={styles.label}>Punch Type</Text>
          <Dropdown
            style={styles.dropdown}
            data={viewmodal?.punchTypeData}
            labelField="label"
            valueField="value"
            placeholder="All types"
            value={viewmodal?.punchType}
            onChange={(item) => viewmodal?.setPunchType(item.value)}
          />

          {/* Date Range */}
       
        <CustomTextField heading={"Date range"}
        isRequired={false}
        value={viewmodal?.dateRange}
        suffixIcon="calendar"
        onTap={viewmodal?.showDatePicker}
         hintText={"Select the Date"} onChangeText={function (text: string): void {
          throw new Error("Function not implemented.");
        } }/>
 {/* Date Picker */}
      <DateTimePickerModal
        isVisible={viewmodal?.isDatePickerVisible}
        mode="date"
        onConfirm={viewmodal?.handleConfirm}
        onCancel={viewmodal?.hideDatePicker}
      />
          {/* Department */}
          <Text style={styles.label}>Desgination</Text>
   <Dropdown
  style={[styles.dropdown, { marginBottom: 10 }]}
  data={
    designation?.designations?.map((d: any) => ({
      label: d.designation_name,
      value: d.designation_name, // 👈 must add this
    })) || []
  }
  labelField="label"
  valueField="value"
  placeholder="All Designation"
  value={viewmodal?.desginaion} // should match the "value", not "label"
  onChange={(item) => {
    viewmodal?.setdesingation(item.value);
   
    console.log("selected....", item.value);
  }}
/>


<Text style={styles.label}>Department {viewmodal.desginaion}</Text>
          <Dropdown
            style={[styles.dropdown,{marginBottom:10}]}
            data={
    depatment?.map((d: any) => ({
      label: d.department_name,
      value: d.department_name,
    })) || []
  }
            labelField="label"
            valueField="value"
            placeholder="All Department"
            value={viewmodal?.departments}
            onChange={(item) =>viewmodal?. setDepartment(item.value)}
          />

          <View style={{width:"50%",alignSelf:"center"}}>
 <CustomButton title="Submit" onPress={()=>{
  onpress();
  viewmodal?.filteroption();
 }


  
  }
  
    />
          </View>
         
          <View style={{marginBottom:10}}>

          </View>
        </View>

    </View>
  );
};

const styles = StyleSheet.create({
   modalContainer: {
    flex: 1,
    width: "100%",
    justifyContent: 'center',
    padding: 10,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: "white",
    padding: 10,
    borderRadius: 10,
    elevation: 5, // Adds shadow on Android
  },
  modalWrapper: {
    justifyContent: "center",
    alignItems: "center",
  },
  // modalContent: {
  //   backgroundColor: "transparent", // transparent backdrop
  //   justifyContent: "center",
  //   alignItems: "center",
  // },
  innerBox: {
    backgroundColor: "#fff", // actual modal box
    padding: 16,
    borderRadius: 12,
    width: "90%",
    elevation: 5,
  },
  label: {
    marginBottom: 8,
    fontSize: 14,
    fontWeight: "600",
  },
  dropdown: {
    height: 50,
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    backgroundColor: "#fff",
  },
  placeholderStyle: {
    fontSize: 14,
    color: "#999",
  },
  selectedTextStyle: {
    fontSize: 14,
    color: "#000",
  },
  inputSearchStyle: {
    height: 40,
    fontSize: 14,
  },
  iconStyle: {
    width: 20,
    height: 20,
  },
   container: { flex: 1, justifyContent: "center", alignItems: "center" },
  filterButton: {
    backgroundColor: "#6200EE",
    padding: 12,
    borderRadius: 30,
  },
  modal: {
    justifyContent: "center",
    alignItems: "center",
  },

      bg: {
    width: "100%",
    paddingBottom: 16,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    overflow: "hidden",     // 👈 important
  },
  bgImage: {
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
  },
  backBtn: {
    width: 35,
    height: 35,
    borderRadius: 12,
    backgroundColor: "rgba(255,255,255,0.2)",
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "600",
    textAlign: "center",
    flex: 1,
  },

  header: {
    paddingTop: 50,
    paddingBottom: 20,
    paddingHorizontal: 16,
    flexDirection: "row",
    alignItems: "center",
    borderBottomLeftRadius:30,
    borderBottomRightRadius:30
  },
  headerText: { color: "#fff", fontSize: 18, fontWeight: "600", marginLeft: 10 },
  topRow: {
    flexDirection: "row",
  justifyContent:"space-between",
    paddingHorizontal: 16,
 
  },
  filterBtn: {
    backgroundColor: "#C084FC",
    padding: 12,
    borderRadius: 10,
alignSelf:"center"
  },
  todayRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    marginTop: 10,
    justifyContent: "space-between",
  },
  todayText: { fontWeight: "700", fontSize: 18, color: "#333", marginLeft: 6 },
  sortBtn: { flexDirection: "row", alignItems: "center" },

  container: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F9FAFB",
    color:"#F9FAFB",
    borderRadius: 8,
    paddingHorizontal: 15,
    marginVertical: 15,
    elevation: 2,
    width:"70%"
  },
  input: {
    flex: 1,
    marginLeft: 8,
    paddingVertical: 12,
    color:AppColors.black
    
  },
    card: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FCF4FF",
    borderColor:"#F2CFFF",
    borderRadius: 12,
    borderWidth:1,
    padding: 15,
    marginVertical: 6,
    elevation: 2,
    width: width * 0.92,
    alignSelf: "center",
  },
  avatar: { width: 50, height: 50, borderRadius: 25 },
  name: { fontWeight: "600", fontSize: 16 },
  details: { color: "#777", fontSize: 13 },
  time: { fontSize: 12, color: "#f57c00", marginTop: 4 },
  button: {
    paddingHorizontal: 6,
    paddingVertical: 6,
    width:"18%",
    borderRadius: 4,
  },
  buttonText: { color: "#fff", fontWeight: "bold",fontSize:10 },

});
