const pool = require("../config/db");
const bcrypt = require("bcrypt");

/* ===============================
   GET PROFILE
================================= */

exports.getProfile = async (req,res)=>{

try{

const userId=req.user.userId;

const result=await pool.query(
`
SELECT 
u.name,
u.email,
e.department,
e.created_at
FROM users u
JOIN employees e
ON u.id=e.user_id
WHERE u.id=$1
`,
[userId]
);

if(result.rows.length===0){

return res.status(404).json({
message:"Employee not found"
});

}

res.json(result.rows[0]);

}catch(err){

console.error(err);

res.status(500).json({
message:"Server error"
});

}

};



/* ===============================
   UPDATE PROFILE
================================= */

exports.updateProfile=async(req,res)=>{

try{

const userId=req.user.userId;

const {name,department}=req.body;

await pool.query(
`
UPDATE users
SET name=$1
WHERE id=$2
`,
[name,userId]
);

await pool.query(
`
UPDATE employees
SET department=$1
WHERE user_id=$2
`,
[department,userId]
);


const updated=await pool.query(
`
SELECT 
u.name,
u.email,
e.department,
e.created_at
FROM users u
JOIN employees e
ON u.id=e.user_id
WHERE u.id=$1
`,
[userId]
);

res.json(updated.rows[0]);

}catch(err){

console.error(err);

res.status(500).json({
message:"Server error"
});

}

};



/* ===============================
   MANAGER TEAM ⭐
================================= */

exports.getTeam=async(req,res)=>{

try{

const userId=req.user.userId;


/* Manager Employee ID */

const manager=await pool.query(
"SELECT id FROM employees WHERE user_id=$1",
[userId]
);

if(manager.rows.length===0){

return res.status(404).json({
message:"Manager not found"
});

}


const managerId=manager.rows[0].id;


/* Team Members */

const result=await pool.query(
`
SELECT 
u.name,
u.email,
e.department,
e.designation,
e.created_at
FROM employees e
JOIN users u
ON e.user_id=u.id
WHERE e.manager_id=$1
ORDER BY u.name
`,
[managerId]
);


res.json(result.rows);


}catch(err){

console.error(err);

res.status(500).json({
message:"Server error"
});

}

};


/* ===============================
   HR: GET ALL EMPLOYEES
================================= */

exports.getAllEmployees = async(req, res) => {
  try {
    const result = await pool.query(`
      SELECT 
        u.id,
        u.name,
        u.email,
        u.department,
        e.designation,
        e.base_salary,
        u.doj
      FROM users u
      LEFT JOIN employees e ON u.id = e.user_id
      WHERE u.role_id = 2 OR u.role_id = 1
      ORDER BY u.created_at DESC
    `);
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

/* ===============================
   HR: CREATE EMPLOYEE
================================= */

exports.createEmployee = async(req, res) => {
  const client = await pool.connect();
  try {
    const { name, email, department, designation, base_salary, manager_id } = req.body;
    
    await client.query("BEGIN");
    
    // Automate hashpass structure as requested
    const salt = await bcrypt.genSalt(10);
    const password_hash = await bcrypt.hash("Welcome@123", salt);
    
    // Insert into users
    const userRes = await client.query(
      `INSERT INTO users (name, email, password_hash, role_id, department) 
       VALUES ($1, $2, $3, 2, $4) RETURNING id`,
      [name, email, password_hash, department]
    );
    
    const userId = userRes.rows[0].id;
    
    // Insert into employees
    await client.query(
      `INSERT INTO employees (user_id, manager_id, department, designation, base_salary)
       VALUES ($1, $2, $3, $4, $5)`,
      [userId, manager_id || null, department, designation || 'Employee', base_salary || 50000]
    );
    
    // Initialize leave balance
    await client.query(
      `INSERT INTO leave_balances (employee_id, year, cl_balance, sl_balance)
       VALUES ($1, extract(year from current_date), 12, 12)`,
      [userId]
    );
    
    await client.query("COMMIT");
    res.status(201).json({ message: "Employee created successfully with default password 'Welcome@123'" });
  } catch (err) {
    await client.query("ROLLBACK");
    console.error(err);
    if (err.code === '23505') {
      return res.status(400).json({ message: "Email already exists" });
    }
    res.status(500).json({ message: "Server error" });
  } finally {
    client.release();
  }
};