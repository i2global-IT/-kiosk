import React, { useState } from "react";
import { View, TextInput, StyleSheet, FlatList, Image, StatusBar, ImageBackground } from "react-native";
import Ionicons from "@react-native-vector-icons/ionicons";

import {  Text, TouchableOpacity, Dimensions } from "react-native";

const { width } = Dimensions.get("window");

import { AppColors } from "../uitility/color";
import GlobalStyle from "../uitility/GlobalStyle";
import { SafeAreaView } from "react-native-safe-area-context";
import { images } from "../uitility/image";


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
          <Text style={[GlobalStyle.semibold_black,{fontWeight:"800", flex: 1, textAlign: "center", color: "#fff", fontSize: 18 }]}>
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
      <Image source={{ uri: image }} style={styles.avatar} />

      <View style={{ flex: 1, marginLeft: 12 }}>
        <Text style={[GlobalStyle.semibold_black,styles.name]}>{name}</Text>
        <Text style={[GlobalStyle.regular_Font,styles.details]}>{role} • {id}</Text>
        <Text style={[GlobalStyle.regular_FontMedium,styles.time]}>🕒 {time}</Text>
      </View>

      <TouchableOpacity
        style={[
          styles.button,
          { backgroundColor: isPunchIn ? "#4CAF50" : "#E53935" },
        ]}
      >
        <Text style={[GlobalStyle.regular_Font,styles.buttonText]}>{status}</Text>
      </TouchableOpacity>
    </View>
  );
};




const mockData = [
  {
    id: "1",
    name: "Olivia Bennett",
    role: "Marketing",
    empId: "ID:010203",
    time: "09:08 AM",
    status: "Punch In",
    image: "https://randomuser.me/api/portraits/women/1.jpg",
  },
  {
    id: "2",
    name: "Olivia Bennett",
    role: "Marketing",
    empId: "ID:010203",
    time: "09:08 AM",
    status: "Punch Out",
    image: "https://randomuser.me/api/portraits/women/2.jpg",
  },
];

export default function PunchHistory() {
  const [search, setSearch] = useState("");

  const filteredData = mockData.filter(item =>
    item.name.toLowerCase().includes(search.toLowerCase()) ||
    item.empId.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <View style={{ flex: 1, backgroundColor: "#f5f5f5" }}>
      {/* Header */}
      <Header title={"Punch History"} />

      {/* Search + Filter */}
      <View style={styles.topRow}>
        <SearchBar value={search} onChange={setSearch} />
        <TouchableOpacity style={styles.filterBtn}>
          <Ionicons name="filter" size={20} color="#fff" />
        </TouchableOpacity>
      </View>

      {/* Today Label */}
      <View style={styles.todayRow}>
        <View style={{ flexDirection: "row" }}>
          <Ionicons name="calendar" size={18} color="#8E31EC" />
          <Text style={[GlobalStyle.semibold_black, styles.todayText]}> Today</Text>
        </View>

        <TouchableOpacity style={styles.sortBtn}>
          <Ionicons name="swap-vertical" size={18} color="#FF7E00" />
          <Text style={[GlobalStyle.semibold_black, { color: "#FF7E00", marginLeft: 4, fontWeight: "700" }]}>
            Sort
          </Text>
        </TouchableOpacity>
      </View>

      {/* List */}
      <FlatList
        data={filteredData}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <PunchCard
            name={item.name}
            role={item.role}
            id={item.empId}
            time={item.time}
            status={item.status}
            image={item.image}
          />
        )}
        contentContainerStyle={{ paddingBottom: 20 }}
      />
    </View>
  );
}


const styles = StyleSheet.create({
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
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 10,
  },
  buttonText: { color: "#fff", fontWeight: "bold" },

});
