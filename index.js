const express = require("express");
const userRoute = require('./Routes/user');
const notesRoute = require('./Routes/notes');
const tenantRoute = require('./Routes/tenant');
const connectDB = require('./utils/db');
require('dotenv').config();
const cors = require('cors');

const allowedOrigin = process.env.FRONTEND_URL


const app = express();
app.use(express.json());
app.use(cors({
  origin: allowedOrigin,
  credentials: true,
}))
connectDB();

app.use('/api/', userRoute); 
app.use('/api/notes', notesRoute);
app.use('/api/tenants', tenantRoute);
app.get("/api/health", (req, res) => res.json({ status: "ok" }));
app.get('/', (req, res) => {
  res.send('Backend is running!');
});


app.listen(process.env.PORT, ()=>console.log("backend running at port : 3000"));