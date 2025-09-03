import { useDispatch, useSelector } from "react-redux";
import { dailyattendance } from "../redux/slice/PunchHisSlice";
import { useState } from "react";
import { RootState } from "../redux/store";
import { department, desingation } from "../redux/slice/FilterSlice";

export default function PunchHistoryViewModel() {
const dispatch:any=useDispatch()
const departmentlists = useSelector((state: RootState) => state.FilterSlice.departmentlist);
const [isVisible, setIsVisible] = useState(false);
const [dateRange, setDateRange] = useState("");  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
// show / hide modal
  const showDatePicker = () => setDatePickerVisibility(true);
  const hideDatePicker = () => setDatePickerVisibility(false);
   const [punchType, setPunchType] = useState("");
    const [departments, setDepartment] = useState("");
      const [desginaion, setdesingation] = useState<any>("");

  const punchTypeData = [
    { label: "All types", value: "all" },
    { label: "Punch-in", value: "punchin" },
    { label: "Punch Out", value: "punchout" },
  ];

const { page, hasMore, loading } = useSelector((state: RootState) => state.PunchHisSlice);


  const handleConfirm = (date: Date) => {
    // format date
    const formattedDate = date.toISOString().split("T")[0]; // YYYY-MM-DD
    setDateRange(formattedDate);
    hideDatePicker();
  };
const ini=async()=>{
getDevices()
  getDepartment()
  getDesignation()
}

const getDevices = async () => {
  try {
   const value = await  dispatch(dailyattendance({  page, per_page: 20 }));
  } catch (err: any) {

  }
};
////department list
const getDepartment = async () => {
  try {
     const value =   dispatch(department());
 console.log("mulitple dep",value)   
  } catch (err: any) {

  }
};

///designation
const getDesignation = async () => {
  try {
  await dispatch(desingation());
  } catch (err: any) {
  }
};

const closemodal=async()=>{
setIsVisible(false)
}


const filteroption=async()=>{
  console.log("correctio..des....",desginaion)
   try {
    setIsVisible(false)
    await  dispatch(dailyattendance({  page, per_page: 20,date:dateRange,department:departments,desgination:desginaion,status:punchType}));



  } catch (err: any) {
  console.log("correctio...errr...",err)
  }


}
return{
    getDevices,closemodal,isVisible,setIsVisible,punchTypeData,desginaion, setdesingation,
    getDepartment,getDesignation,departmentlists,punchType, setPunchType,setDepartment,filteroption,
    ini,dateRange,isDatePickerVisible,showDatePicker,hideDatePicker ,handleConfirm,departments
}
}