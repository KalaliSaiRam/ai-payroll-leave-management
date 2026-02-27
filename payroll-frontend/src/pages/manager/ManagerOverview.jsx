import { useEffect,useState } from "react";
import axios from "axios";
import { useAuth } from "../../context/AuthContext";

export default function ManagerOverview(){

const { token } = useAuth();

const [teamCount,setTeamCount]=useState(0);
const [pending,setPending]=useState(0);
const [approved,setApproved]=useState(0);

useEffect(()=>{

fetchStats();

},[]);


const fetchStats=async()=>{

try{

const res=await axios.get(
"http://localhost:5000/api/leaves/manager",
{
headers:{
Authorization:`Bearer ${token}`
}
}
);

const leaves=res.data;

setPending(
leaves.filter(l=>l.status==="PENDING").length
);

setApproved(
leaves.filter(l=>l.status==="APPROVED").length
);

}
catch(err){

console.log(err);

}

};


return(

<div className="space-y-10">

<h1 className="text-3xl font-semibold">

Manager Dashboard

</h1>



<div className="grid grid-cols-3 gap-6">


<div className="bg-white p-6 rounded-2xl shadow border text-center">

<h3>Pending Leaves</h3>

<p className="text-3xl font-bold">

{pending}

</p>

</div>



<div className="bg-white p-6 rounded-2xl shadow border text-center">

<h3>Approved Leaves</h3>

<p className="text-3xl font-bold">

{approved}

</p>

</div>



<div className="bg-white p-6 rounded-2xl shadow border text-center">

<h3>Team Leaves</h3>

<p className="text-3xl font-bold">

{pending+approved}

</p>

</div>


</div>


</div>

);
}