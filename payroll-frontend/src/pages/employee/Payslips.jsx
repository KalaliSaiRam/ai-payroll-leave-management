import { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "../../context/AuthContext";

export default function Payslips() {

  const { token } = useAuth();

  const [payslips,setPayslips]=useState([]);
  const [loading,setLoading]=useState(true);


  useEffect(()=>{

    fetchPayslips();

  },[]);



  const fetchPayslips = async()=>{

    try{

      const res = await axios.get(
        "http://localhost:5000/api/payroll/payslips",
        {
          headers:{
            Authorization:`Bearer ${token}`
          }
        }
      );

      setPayslips(res.data);

    }
    catch(err){

      console.log("Payslip Error:",err);

    }
    finally{

      setLoading(false);

    }

  };



  const formatMonth = (month,year)=>{

    const date = new Date(year,month-1);

    return date.toLocaleString("default",
      { month:"long", year:"numeric" });

  };



  return (

<div className="max-w-7xl mx-auto space-y-10">


<h1 className="text-3xl font-semibold">

Payslips

</h1>



<div className="bg-white rounded-3xl shadow-sm border border-gray-200 overflow-hidden">


{
loading ? (

<div className="p-10 text-center text-gray-500">

Loading payslips...

</div>

)

:

payslips.length===0 ? (

<div className="p-10 text-center text-gray-500">

No payslips available.

</div>

)

:

(

<table className="w-full text-sm">


<thead className="bg-gray-50 text-gray-500 uppercase text-xs tracking-wide">

<tr>

<th className="px-6 py-4 text-left">
Month
</th>

<th className="px-6 py-4 text-left">
Base Salary
</th>

<th className="px-6 py-4 text-left">
LOP Days
</th>

<th className="px-6 py-4 text-left">
LOP Deduction
</th>

<th className="px-6 py-4 text-left">
Net Salary
</th>

<th className="px-6 py-4 text-left">
Generated
</th>

</tr>

</thead>



<tbody className="divide-y divide-gray-100">


{
payslips.map((p)=>(
<tr key={p.id}
className="hover:bg-gray-50 transition"
>

<td className="px-6 py-4 font-medium">

{formatMonth(p.month,p.year)}

</td>


<td className="px-6 py-4">

₹ {p.base_salary}

</td>


<td className="px-6 py-4">

{p.lop_days}

</td>


<td className="px-6 py-4">

₹ {p.lop_deduction}

</td>


<td className="px-6 py-4 font-semibold text-green-600">

₹ {p.net_salary}

</td>


<td className="px-6 py-4 text-gray-500">

{new Date(p.generated_at)
.toLocaleDateString()}

</td>


</tr>
))
}


</tbody>


</table>

)

}


</div>


</div>

  );

}