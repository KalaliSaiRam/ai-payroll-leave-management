import { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "../../context/AuthContext";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from "recharts";


const COLORS = ["#2563EB", "#10B981", "#F59E0B"];


export default function EmployeeAnalytics() {

  const { token } = useAuth();

  const [selectedYear,setSelectedYear]=useState("2026");
  const [leaves,setLeaves]=useState([]);
  const [loading,setLoading]=useState(true);



  useEffect(()=>{

    fetchLeaves();

  },[]);



  const fetchLeaves = async()=>{

    try{

      const res = await axios.get(
        "http://localhost:5000/api/leaves/my",
        {
          headers:{
            Authorization:`Bearer ${token}`
          }
        }
      );

      setLeaves(res.data);

    }
    catch(err){

      console.log(err);

    }
    finally{

      setLoading(false);

    }

  };



  /* ===== Monthly Leave Calculation ===== */

  const monthlyMap={};

  leaves.forEach(l=>{

    const year=new Date(l.start_date).getFullYear();

    if(year.toString()!==selectedYear) return;

    const month=new Date(l.start_date)
    .toLocaleString("default",{month:"short"});


    const days=
    (new Date(l.end_date)-new Date(l.start_date))
    /(1000*60*60*24)+1;


    monthlyMap[month]=(monthlyMap[month]||0)+days;

  });



  const monthlyData=Object.keys(monthlyMap)
  .map(m=>({
    month:m,
    days:monthlyMap[m]
  }));



  /* ===== Leave Type Distribution ===== */

  const typeMap={
    CL:0,
    SL:0,
    LOP:0
  };


  leaves.forEach(l=>{

    const year=new Date(l.start_date).getFullYear();

    if(year.toString()!==selectedYear) return;

    const days=
    (new Date(l.end_date)-new Date(l.start_date))
    /(1000*60*60*24)+1;

    typeMap[l.leave_type]+=days;

  });



  const distributionData=[

    {name:"CL",value:typeMap.CL},
    {name:"SL",value:typeMap.SL},
    {name:"LOP",value:typeMap.LOP}

  ];



  if(loading){

    return(
      <div className="p-10 text-gray-500">
        Loading analytics...
      </div>
    );

  }



  return (

<div className="space-y-16">


<div className="space-y-4 max-w-3xl">

<h1 className="text-4xl font-semibold">

Analytics

</h1>

<p className="text-gray-500 text-lg">

Analyze your leave patterns and insights.

</p>

</div>



<div className="bg-white rounded-3xl border border-gray-200 p-12 shadow-sm space-y-12">


<div className="flex justify-between items-center">

<h2 className="text-2xl font-medium">

Leave Analytics

</h2>


<select
value={selectedYear}
onChange={(e)=>setSelectedYear(e.target.value)}
className="border border-gray-200 rounded-lg px-4 py-2 text-sm"
>

<option value="2026">2026</option>

</select>

</div>



<div className="grid grid-cols-1 lg:grid-cols-2 gap-12">



{/* Monthly Chart */}

<div className="bg-gray-50 rounded-2xl p-8">

<h3 className="mb-4 font-medium">
Monthly Leaves
</h3>

<ResponsiveContainer width="100%" height={300}>

<LineChart data={monthlyData}>

<XAxis dataKey="month"/>

<YAxis/>

<Tooltip/>

<Line
type="monotone"
dataKey="days"
stroke="#2563EB"
strokeWidth={3}
/>

</LineChart>

</ResponsiveContainer>

</div>




{/* Distribution Chart */}

<div className="bg-gray-50 rounded-2xl p-8">

<h3 className="mb-4 font-medium">
Leave Distribution
</h3>

<ResponsiveContainer width="100%" height={300}>

<PieChart>

<Pie
data={distributionData}
dataKey="value"
nameKey="name"
innerRadius={70}
outerRadius={100}
>

{distributionData.map((entry,index)=>(
<Cell
key={index}
fill={COLORS[index % COLORS.length]}
/>
))}

</Pie>

<Tooltip/>

</PieChart>

</ResponsiveContainer>

</div>



</div>


</div>


</div>

  );

}