import React, { useEffect, useRef, useState } from "react";
import { View, TextInput, StyleSheet, FlatList, Image, StatusBar, ImageBackground, Modal, RefreshControl } from "react-native";
import Ionicons from "@react-native-vector-icons/ionicons";
import { Text, TouchableOpacity, Dimensions } from "react-native";
const { width } = Dimensions.get("window");
import DateTimePickerModal from "react-native-modal-datetime-picker";
import { AppColors } from "../uitility/color";
import GlobalStyle from "../uitility/GlobalStyle";
import { images } from "../uitility/image";
import PunchHistoryViewModel from "../viewModel/PunchistoryViewModel";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../redux/store";
import { dailyattendance, resetAttendance } from "../redux/slice/PunchHisSlice";
import { Dropdown } from "react-native-element-dropdown";
import CustomButton from "../component/CustomButton";
import CustomTextField from "../component/CustomTextfield";


interface HeaderProps {
  title: string;
  onBack?: () => void;
  onpop: boolean
}

export const Header: React.FC<HeaderProps> = ({ title, onBack, onpop }) => {
  return (
    <View>
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
        <View style={{ flexDirection: "row", alignItems: "center", padding: 12, marginBottom: 15 }}>
          {onpop && <TouchableOpacity onPress={onBack} style={styles.backBtn}>
            <Ionicons name="chevron-back-outline" size={22} color="#fff" />
          </TouchableOpacity>}
          <Text style={[GlobalStyle.semibold_black, {
            fontWeight: "800",
            flex: 1, textAlign: "center", color: "#fff", fontSize: 18
          }]}>
            {title}
          </Text>
          <View style={{ width: 40 }} />
        </View>
      </ImageBackground>
    </View>

  );
};

export const SearchBar = ({ value, onChange }: { value: string; onChange: (t: string) => void }) => (
  <View style={styles.container}>
    <Ionicons name="search" size={20} color="#aaa" />
    <TextInput
      style={[GlobalStyle.regular_FontMedium, styles.input]}
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
        style={{
          width: 50,
          height: 50,
          borderRadius: 25,
          backgroundColor: "#eee", // placeholder bg
        }}
        source={
          image && image.startsWith("http")
            ? { uri: image }
            : images.photo
        }
        resizeMode="cover"
      />
      {/* <Text>
  {image}
</Text> */}
      <View style={{ flex: 1, marginLeft: 12 }}>
        <Text style={[GlobalStyle.semibold_black, styles.name]}>{name}</Text>
        <Text style={[GlobalStyle.regular_Font, styles.details]}>{role}
          <Text style={{ color: AppColors.primaryLinear }}> •
          </Text><Text style={[GlobalStyle.semibold_black, { fontSize: 13 }]}>
            {id}
          </Text></Text>
        <View style={{ flexDirection: "row" }}>
          <View style={{ alignSelf: "center", marginTop: 4 }}>
            <Ionicons name="time" size={18} color="orange" />
          </View>

          <Text style={[GlobalStyle.semibold_black, styles.time]}>{time}</Text>

        </View>

      </View>

      <TouchableOpacity
        style={[
          styles.button,
          {
            backgroundColor: status == "Not_Yet" ? AppColors.addcolor : status == "IN" ? "#08B74E" : "#E53935"
          },
        ]}
      >
        <Text style={[GlobalStyle.regular_Font, styles.buttonText, {
          alignSelf: "center"
        }]}>{status}</Text>
      </TouchableOpacity>
    </View>
  );
};





export default function PunchHistory() {
  const [search, setSearch] = useState("");
  const history = useSelector((state: RootState) => state.PunchHisSlice.employee_details);
  const dispatch = useDispatch()
  const viewModel = PunchHistoryViewModel()
  useEffect(() => {
    viewModel?.ini()
  }, [])
const filteredData = history.filter(item => {
  const name = (item.user_name || "").toLowerCase().trim();
  const empId = (item.employee_id || "").toString().toLowerCase().trim();
  const searchText = (search || "").toLowerCase().trim();

  return name.includes(searchText) || empId.includes(searchText);
});

  const designation: any = useSelector((state: RootState) => state.FilterSlice.desingationList);
  const depatment: any = useSelector((state: RootState) => state.FilterSlice.departmentlist);
  const { page, hasMore, loading } = useSelector((state: RootState) => state.PunchHisSlice);
  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = async () => {
    console.log("value to be searched//")
    viewModel?.setPunchType("")
    viewModel?.setDateRange("")
    viewModel?.setdesingation("")
    viewModel?.setDepartment("")

    dispatch(resetAttendance()); // reset state
    dispatch(dailyattendance({ page: 1, per_page: 20 })); // fetch first page

  };



const searchfun = (text: string) => {
  if (text.trim().length > 0) {
    dispatch(resetAttendance());
    dispatch(
      dailyattendance({
        page: 1,
        per_page: 10,
        search: text.trim(),
      })
    );
  } else {
    dispatch(resetAttendance());
    dispatch(
      dailyattendance({
        page: 1,
        per_page: 10,
      })
    );
  }
};

// 🔹 create a debounced version of searchfun
const useDebounce = (func: Function, delay: number) => {
  const timeoutRef = useRef<any>(null);

  return (...args: any) => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => {
      func(...args);
    }, delay);
  };
};

const debouncedSearch = useDebounce(searchfun, 500);
  return (
    <View style={{ flex: 1, backgroundColor: "#ffff" }}>
      <StatusBar barStyle="light-content" backgroundColor="#000" />

      {/* Header */}
      <Header title={"Punch History"} onpop={false} />
      <View style={styles.containers}>
        {/* <Text style={styles.text}>
        For latest update click refresh button
      </Text> */}
        <TouchableOpacity style={styles.button} onPress={(onRefresh)}>
          <Ionicons size={18} color="#fff" name={"refresh"} />
          <Text style={styles.buttonText}>Refresh</Text>
        </TouchableOpacity>
      </View>
      {/* Search + Filter */}
      <View style={styles.topRow}>
        <SearchBar value={search} onChange={(text:any)=>{
              setSearch(text); // make sure you store it in state

            debouncedSearch(text); // only called 500ms after typing stops

        }} />
        <TouchableOpacity style={styles.filterBtn} onPress={() => { viewModel?.setIsVisible(true) }}>
          <Ionicons name="filter" size={20} color="#fff" />
        </TouchableOpacity>
      </View>

      {/* Today Label */}
      <View style={styles.todayRow}>
        <View style={{ flexDirection: "row", marginBottom: 10 }}>
          <Ionicons name="calendar" size={18} color="#8E31EC" style={{ marginTop: 5 }} />
          <Text style={[GlobalStyle.semibold_black, styles.todayText]}>

            {!viewModel?.dateRange ? "Today" : viewModel?.dateRange}
          </Text>
        </View>
{/* 
        <TouchableOpacity style={styles.sortBtn}>
          <Ionicons name="swap-vertical" size={18} color="#FF7E00" />
          <Text style={[GlobalStyle.semibold_black, { color: "#FF7E00", marginLeft: 4, fontWeight: "700" }]}>
            Sort
          </Text>
        </TouchableOpacity> */}
      </View>


      <FlatList
        data={filteredData}
        keyExtractor={(item: any) => item.employee_id.toString()}
        renderItem={({ item }) => (
          <PunchCard
            name={item.user_name}   // adjust keys based on API
            role={item.designation_name}
            id={item.employee_id}
            time={item.latestTime ?? "00:00"}
            status={item.status}
            image={item.latestPhoto}
          />
        )}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={() => onRefresh()} />}

        onEndReached={() => {
          // console.log("dateRange...👍👍👍👍👍👍...loading",loading,"klkkllk",viewModel?.dateRange)
          if (hasMore && !loading) {
            viewModel?.daterange()
          }
        }}

        onEndReachedThreshold={0.5}
        contentContainerStyle={{ paddingBottom: 20 }}


        ListEmptyComponent={
          <View style={{ flex: 1, alignItems: "center", justifyContent: "center", marginTop: 50 }}>
            <Text style={GlobalStyle.semibold_black}>No records found</Text>
          </View>}
      />
      <Modal
        visible={viewModel?.isVisible}
        onDismiss={() => viewModel?.setIsVisible(false)}
        transparent animationType="fade"

      >
        <View style={styles.modalContainer}>
          <View >
            <View>

              <View style={styles.modalContent}>
                <TouchableOpacity
                  style={styles.closeButton}
                  onPress={() => viewModel?.setIsVisible(false)} // 👈 Pass `onClose` from parent
                >
                  <Ionicons name="close" size={24} color="#333" />
                </TouchableOpacity>
                {/* Punch Type */}
                <Text style={styles.label}>Punch Type</Text>
                <Dropdown
                  style={styles.dropdown}
                  data={viewModel?.punchTypeData}
                  labelField="label"
                  valueField="value"
                  placeholder="All types"
                  value={viewModel?.punchType}
                  onChange={(item) => viewModel?.setPunchType(item.value)}
                />

                {/* Date Range */}
                <TouchableOpacity onPress={viewModel?.showDatePicker}>
                  <CustomTextField heading={"Date range"}
                    isRequired={false}
                    readOnly={true}
                    value={viewModel?.dateRange}
                    suffixIcon="calendar"
                    onTap={viewModel?.showDatePicker}
                    hintText={"Select the Date"} onChangeText={function (text: string): void {
                      throw new Error("Function not implemented.");
                    }} />
                </TouchableOpacity>

                {/* Date Picker */}
                <DateTimePickerModal
                  isVisible={viewModel?.isDatePickerVisible}
                  mode="date"
                  onConfirm={viewModel?.handleConfirm}
                  onCancel={viewModel?.hideDatePicker}
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
                  value={viewModel?.desginaion} // should match the "value", not "label"
                  onChange={(item) => {
                    viewModel?.setdesingation(item.value);
                  }}
                />


                <Text style={styles.label}>Department {viewModel.desginaion}</Text>
                <Dropdown
                  style={[styles.dropdown, { marginBottom: 10 }]}
                  data={
                    depatment?.map((d: any) => ({
                      label: d.department_name,
                      value: d.department_name,
                    })) || []
                  }
                  labelField="label"
                  valueField="value"
                  placeholder="All Department"
                  value={viewModel?.departments}
                  onChange={(item) => viewModel?.setDepartment(item.value)}
                />

                <View style={{ flexDirection: "row", alignSelf: "center", justifyContent: "space-around" }}>
                  <CustomButton title="Refresh" onPress={() => {
                    viewModel?.setPunchType("")
                    viewModel?.setDateRange("")
                    viewModel?.setdesingation("")
                    viewModel?.setDepartment("")
                  }
                  }
                  />

                  <CustomButton title="Submit" onPress={() => {
                    viewModel?.setIsVisible(false);
                    viewModel?.filteroption();
                  }
                  }

                  />
                </View>

                <View style={{ marginBottom: 10 }}>

                </View>
              </View>

            </View>
          </View>
        </View>

      </Modal>
    </View>
  );
}



const styles = StyleSheet.create({
  containers: {
    alignItems: "flex-end",
    justifyContent: "center",
    marginTop: 20,
    marginRight: 10
  },
  text: {
    fontSize: 14,
    color: "#333",
    marginBottom: 10,
  },
  button: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: AppColors.gradient,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 8,

  },
  buttonText: {
    color: "#fff",
    marginLeft: 6,
    fontSize: 14,
    fontWeight: "600",
  },
  closeButton: {
    position: "absolute",
    top: 10,
    right: 10,
    zIndex: 1,
    padding: 5,
  },
  modalContainer: {
    flex: 1,
    width: "100%",
    justifyContent: 'center',
    padding: 10,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: "white",
    padding: 12,
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
    marginTop: 8
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
  container: { flex: 1, },
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
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30
  },
  headerText: { color: "#fff", fontSize: 18, fontWeight: "600", marginLeft: 10 },
  topRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 16,

  },
  filterBtn: {
    backgroundColor: "#C084FC",
    padding: 12,
    borderRadius: 10,
    alignSelf: "center"
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
    color: "#F9FAFB",
    borderRadius: 8,
    paddingHorizontal: 15,
    marginVertical: 15,
    elevation: 2,
    width: "80%"
  },
  input: {
    flex: 1,
    marginLeft: 8,
    paddingVertical: 12,
    color: AppColors.black

  },
  card: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FCF4FF",
    borderColor: "#F2CFFF",
    borderRadius: 12,
    borderWidth: 2,
    padding: 15,
    marginVertical: 6,

    width: width * 0.92,
    alignSelf: "center",
  },
  avatar: { width: 50, height: 50, borderRadius: 25 },
  name: { fontWeight: "600", fontSize: 16 },
  details: { color: "#777", fontSize: 13 },
  time: {
    fontSize: 12, color: AppColors.black,
    marginLeft: 5,
    marginTop: 4,
    alignSelf: "center", fontWeight: "700"
  },
  // button: {
  //   paddingHorizontal: 6,
  //   paddingVertical: 6,
  //   width:"18%",
  //   borderRadius: 4,
  // },
  // buttonText: { color: "#fff", fontWeight: "bold",fontSize:10 },

});
