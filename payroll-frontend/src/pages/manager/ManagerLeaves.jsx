import { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "../../context/AuthContext";

export default function ManagerLeaves(){

const { token } = useAuth();

const [leaves,setLeaves]=useState([]);
const [loading,setLoading]=useState(true);


useEffect(()=>{

fetchLeaves();

},[]);



const fetchLeaves=async()=>{

try{

const res=await axios.get(
"http://localhost:5000/api/leaves/manager",
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



const updateStatus=async(id,status)=>{

try{

await axios.put(
`http://localhost:5000/api/leaves/${id}/status`,
{status},
{
headers:{
Authorization:`Bearer ${token}`
}
}
);

fetchLeaves();

}
catch(err){

console.log(err);

}

};



if(loading){

return(
<div className="p-10 text-gray-500">
Loading leave requests...
</div>
);

}



return(

<div className="max-w-7xl mx-auto space-y-10">


<h1 className="text-3xl font-semibold">

Team Leave Requests

</h1>



<div className="bg-white rounded-3xl shadow-sm border border-gray-200 overflow-hidden">


<table className="w-full text-sm">


<thead className="bg-gray-50 text-gray-500 uppercase text-xs">

<tr>

<th className="px-6 py-4 text-left">
Employee
</th>

<th className="px-6 py-4 text-left">
Type
</th>

<th className="px-6 py-4 text-left">
Start Date
</th>

<th className="px-6 py-4 text-left">
End Date
</th>

<th className="px-6 py-4 text-left">
Status
</th>

<th className="px-6 py-4 text-left">
Action
</th>

</tr>

</thead>



<tbody className="divide-y divide-gray-100">


{
leaves.map(l=>(
<tr key={l.id}
className="hover:bg-gray-50"
>

<td className="px-6 py-4">

{l.employee_email}

</td>


<td className="px-6 py-4">

{l.leave_type}

</td>


<td className="px-6 py-4">

{new Date(l.start_date)
.toLocaleDateString()}

</td>


<td className="px-6 py-4">

{new Date(l.end_date)
.toLocaleDateString()}

</td>


<td className="px-6 py-4">

<span className={
l.status==="PENDING"
? "text-yellow-600 font-medium"
: l.status==="APPROVED"
? "text-green-600 font-medium"
: "text-red-600 font-medium"
}>

{l.status}

</span>

</td>


<td className="px-6 py-4 space-x-2">


{
l.status==="PENDING" && (

<>

<button
onClick={()=>updateStatus(l.id,"APPROVED")}
className="bg-green-600 text-white px-3 py-1 rounded-lg hover:bg-green-700"
>

Approve

</button>



<button
onClick={()=>updateStatus(l.id,"REJECTED")}
className="bg-red-600 text-white px-3 py-1 rounded-lg hover:bg-red-700"
>

Reject

</button>

</>

)

}


</td>


</tr>
))
}


</tbody>

</table>


</div>


</div>

);
}