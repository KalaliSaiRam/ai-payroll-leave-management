import { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";

export default function EmployeeOverview() {

  const { token } = useAuth();
  const navigate = useNavigate();

  const [profile, setProfile] = useState(null);
  const [balance, setBalance] = useState(null);
  const [payslips, setPayslips] = useState([]);
  const [loading, setLoading] = useState(true);


  useEffect(() => {

    if(token){
      fetchData();
    }

  }, [token]);


  const fetchData = async () => {

    try {

      const config = {
        headers: {
          Authorization: `Bearer ${token}`
        }
      };

      /* Profile */
      const profileRes = await axios.get(
        "http://localhost:5000/api/employee/profile",
        config
      );

      /* Leave Balance */
      const balanceRes = await axios.get(
        "http://localhost:5000/api/leaves/balance",
        config
      );

      /* Payroll */
      const payrollRes = await axios.get(
        "http://localhost:5000/api/payroll/payslips",
        config
      );

      setProfile(profileRes.data);
      setBalance(balanceRes.data.balance);
      setPayslips(payrollRes.data);

    }
    catch (err) {

      console.log("Dashboard Error:", err);

    }
    finally {

      setLoading(false);

    }

  };


  /* Loading Screen */

  if (loading) {

    return (
      <div className="p-10 text-gray-500">
        Loading Dashboard...
      </div>
    );

  }



  return (

<div className="max-w-7xl mx-auto space-y-10">


{/* Header */}

<h1 className="text-2xl font-semibold">

Employee Dashboard

</h1>



{/* Welcome Card */}

<div className="bg-gradient-to-r from-blue-600 to-indigo-600 
text-white p-6 rounded-2xl shadow">

<h3 className="text-xl font-semibold">

Welcome {profile?.name}

</h3>

<p className="opacity-90 mt-1">

{profile?.email}

</p>

</div>




{/* Leave Balance Cards */}

<div className="grid grid-cols-1 md:grid-cols-3 gap-6">


{/* CL */}

<div className="bg-blue-50 p-6 rounded-2xl shadow-sm border border-blue-200 text-center">

<h4 className="text-blue-700 font-medium">

CL Remaining

</h4>

<p className="text-4xl font-bold mt-2 text-blue-800">

{balance?.CL ?? 0}

</p>

</div>



{/* SL */}

<div className="bg-green-50 p-6 rounded-2xl shadow-sm border border-green-200 text-center">

<h4 className="text-green-700 font-medium">

SL Remaining

</h4>

<p className="text-4xl font-bold mt-2 text-green-800">

{balance?.SL ?? 0}

</p>

</div>



{/* LOP */}

<div className="bg-purple-50 p-6 rounded-2xl shadow-sm border border-purple-200 text-center">

<h4 className="text-purple-700 font-medium">

LOP

</h4>

<p className="text-4xl font-bold mt-2 text-purple-800">

Unlimited

</p>

</div>


</div>




{/* Quick Actions */}

<div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200">

<h3 className="text-lg font-semibold mb-5">

Quick Actions

</h3>


<div className="grid grid-cols-2 md:grid-cols-4 gap-4">


<button
onClick={()=>navigate("/employee/apply-leave")}
className="bg-blue-600 text-white py-4 rounded-xl text-lg font-medium hover:bg-blue-700 transition"
>

Apply Leave

</button>



<button
onClick={()=>navigate("/employee/leaves")}
className="bg-gray-600 text-white py-4 rounded-xl text-lg font-medium hover:bg-gray-700 transition"
>

Leaves

</button>



<button
onClick={()=>navigate("/employee/payslips")}
className="bg-green-600 text-white py-4 rounded-xl text-lg font-medium hover:bg-green-700 transition"
>

Payslips

</button>



<button
onClick={()=>navigate("/employee/profile")}
className="bg-purple-600 text-white py-4 rounded-xl text-lg font-medium hover:bg-purple-700 transition"
>

Profile

</button>


</div>

</div>




{/* Latest Payroll */}

<div className="bg-yellow-50 p-6 rounded-2xl shadow-sm border border-yellow-200">

<h3 className="text-lg font-semibold text-yellow-700 mb-4">

Latest Payroll

</h3>


{
payslips.length > 0 ? (

<div className="space-y-2">


<p className="text-xl font-bold">

₹ {payslips[0].net_salary}

</p>


<p className="text-gray-700">

Month {payslips[0].month} / {payslips[0].year}

</p>


<p className="text-gray-700">

LOP Days: {payslips[0].lop_days}

</p>


</div>

)

:

<p className="text-gray-500">

No payroll generated yet.

</p>

}


</div>



</div>

  );

}