import { useDispatch, useSelector } from "react-redux";
import { dailyattendance, resetAttendance } from "../redux/slice/PunchHisSlice";
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
    { label: "Not Yet", value: "Not_Yet" },
    { label: "Punch-in", value: "IN" },
    { label: "Punch Out", value: "OUT" },
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
      const today = new Date().toISOString().split("T")[0]; // format YYYY-MM-DD
    const selectedDate = dateRange || today;
   await  dispatch(dailyattendance({  page, per_page: 20,date:selectedDate,department:departments,desgination:desginaion,status:punchType }));
  } catch (err: any) {
  }
};
////department list
const getDepartment = async () => {
  try {
   dispatch(department());
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
   try {
    new Date().toISOString().split("T")[0]; // format YYYY-MM-DD
    dispatch(resetAttendance()); // reset state
    await  dispatch(dailyattendance({  page:0, per_page:20,date:dateRange,department:departments,desgination:desginaion,status:punchType}));
    setIsVisible(false)

  } catch (err: any) {
  
  }

}

const filteroption3=async()=>{

   try {
    await  dispatch(dailyattendance({  page, per_page:20,date:dateRange,department:departments,desgination:desginaion,status:punchType}));    
    setIsVisible(false)

  } catch (err: any) { 
  }
}

const daterange=async()=>{
      dispatch(
        dailyattendance({
          page,
          per_page: 20,
          department: departments,
          desgination: desginaion,
          status: punchType,
          date: dateRange,
        })
      );
}
return{
    getDevices,closemodal,isVisible,setIsVisible,punchTypeData,desginaion, daterange,setdesingation,filteroption3,
    getDepartment,getDesignation,departmentlists,punchType, setPunchType,setDepartment,filteroption,
    ini,dateRange,isDatePickerVisible,showDatePicker,hideDatePicker ,handleConfirm,departments,setDateRange
}
}