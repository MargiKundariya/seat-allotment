const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();
const PORT = process.env.PORT || 5000;
mongoose.connect("mongodb+srv://projecttiral7_db_user:seatallotment_0102@cluster0.ro8zthy.mongodb.net/seatAllotmentDB")
  .then(() => console.log("MongoDB Altas connected"))
  .catch((err) => console.log(err));

app.use(cors());
app.use(express.json());

app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/cutoff", require("./routes/cutoffRoutes"));
app.use("/api/searchcutoff", require("./routes/searchRoutes"));

app.get("/", (req, res) => {  
  res.send("Seat Allotment API is running");  
});

app.listen(PORT, () => {
  console.log("Server running");

});
