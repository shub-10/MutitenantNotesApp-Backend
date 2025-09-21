const User = require('../Models/User');
const Tenant = require('../Models/Tenant');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
require("dotenv").config();

const handleUserSignup= async (req, res) =>{
    try {
      const {email, password, role, tenant} = req.body;
      const tenantslug = tenant.toLowerCase();

      const findtenant = await Tenant.findOne({slug: tenantslug});
      if(!findtenant){
        return res.status(400).json({message:"Tenant doesn't exist"});
      }

      const user = await User.findOne({email, tenantid: findtenant._id});

      if(user){
        return res.status(400).json({
          message: "User already exists"
        });
      }

      const hashed = await bcrypt.hash(password, 10);

      const newuser = await User.create({
        email, 
        password: hashed,
        role,
        tenantid: findtenant._id,
      }); 
      res.status(201).json({message: "signup successfull", userId: newuser._id});
    } 
    catch (err) {
      console.log("signup error: ", err);
      res.status(500).json({ error: err.message });
    }

}

const handleUserLogin = async(req, res) =>{
    try {
      const {email, password, tenant} = req.body;
      const tenantslug = tenant.toLowerCase();
      const findtenant = await Tenant.findOne({slug: tenantslug});

      if(!findtenant) return res.status(400).json({message: "tenant is not present"});
      const user = await User.findOne({email, tenantid: findtenant._id});
      console.log( "user: ",user);
      if(!user) return res.status(400).json({message:"User not exists in the tenant"});

      const valid = await bcrypt.compare(password, user.password);
      if(!valid) return res.status(400).json({message: "Invalid credentials"})

      const token = jwt.sign({
        userId: user._id,
        email: user.email,
        role: user.role,
        tenantid: findtenant._id
      },
       process.env.JWT_SECRET,
       {expiresIn: "2h"}
      );

      res.status(200).json({message: "LoggedIn",token})
    } 
    catch (err) {
      res.status(500).json({ error: err.message });
    }
}

const getMe = async(req, res)=>{
  try {
    // console.log("request.user: ",req.user);
    const user = await User.findById(req.user.userId).select("-password").lean();
    // console.log("user hai: ", user);
    if (!user) return res.status(404).json({ message: "User not found" });
    const tenant = await Tenant.findById(user.tenantid).lean();
    res.json({ user, tenant });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
}

module.exports = {handleUserLogin, handleUserSignup, getMe};