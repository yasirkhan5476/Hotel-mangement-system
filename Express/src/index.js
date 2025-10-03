
require("./connection.js");
var express=require("express");
var app=express();
var cors=require("cors");
var bodyParser=require("body-parser");
var multer=require("multer");
var bcrypt=require("bcrypt");
app.use(cors({
  origin: "http://localhost:5173",  
  credentials: true,                
}));
app.use(express.json());

// models links
var usermodel=require("../Models/user.js");
var roomModel=require("../Models/Room.js");
var bookingmodel=require("../Models/Booking.js");
var feedbacksmodel=require("../Models/Feedbacks.js");

//register
app.post("/register", async(req, res)=>{
  if (!req.body) {
  return res.status(404).send("No data received");
}
  const {username,email,password,role}=req.body;
  const saltRounds = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, saltRounds);
  const newuser=await usermodel.create({
    username:username,
    email:email,
    password:hashedPassword,
    role:"guest"  
  })

  if(!newuser){
    return res.status(500).send("User not created");
  }
  return res.status(201).send("User created successfully");

});
// login
app.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    const finduser = await usermodel.findOne({ email: email });
    if (!finduser) {
      return res.status(404).send("User not found");
    }

    const isMatch = await bcrypt.compare(password, finduser.password);
    if (!isMatch) {
      return res.status(401).send("Invalid credentials");
    }

    return res.status(200).json({
      message: "Login successful",
      id: finduser._id,
      username: finduser.username,
      email: finduser.email,
      role: finduser.role
    });
  } catch (err) {
    console.error(err);
    return res.status(500).send("Server error");
  }
});
app.post("/forgotpassword", async (req, res) => {
  const { email, newPassword } = req.body;
  try {
    const user = await usermodel.findOne({ email });
    if (!user) {
      return res.status(404).send("Email not found");
    }
    const saltRounds = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(newPassword, saltRounds);
    await user.save();
    res.send({ message: "Password updated successfully" });
  } catch (err) {
    res.status(500).send("Error updating password");
  }
});
app.get("/users",async(req,res)=>{
  try{
    const users=await usermodel.find();
    if(!users){
      return res.status(404).send("No users found");
    }else{
      return res.status(200).json(users);
    }
  }catch(err){
    console.error(err);
    return res.status(500).send("Server error");
  }
})
app.get("/user/:id",async(req,res)=>{
  try{
    const user=await usermodel.findById(req.params.id);
    if(!user){
      return res.status(404).send("User not found");
    }else{
      return res.status(200).json(user);
    }
  }catch(err){
    console.error(err);
    return res.status(500).send("Server error");
  }
})
// get user by email
app.get("/user/email/:email", async (req, res) => {
  try {
    const user = await usermodel.findOne({ email: req.params.email });
    if (!user) return res.status(404).send("User not found");
    return res.status(200).json(user);
  } catch (err) {
    console.error(err);
    return res.status(500).send("Server error");
  }
});

app.put("/user/:id",async(req,res)=>{
  try{
    const {role}=req.body;
    const updateuser=await usermodel.findByIdAndUpdate(req.params.id, { role: role }, { new: true });
    if(!updateuser){
      return res.status(404).send("User not found");  
    }
    res.status(200).json({
       message:"user role uopdated successfully"
    })
  }catch(err){
    console.error(err);
    return res.status(500).send("Server error");  
  }
})
app.delete("/user/:id",async(req,res)=>{
  try{
        const deleteuser= await usermodel.findByIdAndDelete(req.params.id);
    if(!deleteuser){
      return res.status(404).send("User not found");
    }
     res.status(200).json({ message: "User deleted successfully" });
  }catch(err){
    
    console.error(err);
    return res.status(500).send("Server error");
  }
})

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null,"../frontend/public/Images");
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + "-" + file.originalname);
  }
});

const upload = multer({ storage: storage });
app.post("/rooms",upload.single("roomImage"),async(req,res)=>{
    try{
      var {roomName,roomNumber, roomType, price, description} = req.body;
      var image=req.file ?req.file.filename : null;
      var newroom=new roomModel({
        roomName:roomName,
        roomNumber: roomNumber,
        roomType: roomType,
        price: price,
        description: description,
        image: image
      });
      await newroom.save();
      res.status(201).json({ message: "Room created successfully", room: newroom });
    }catch (err) {
    res.status(500).json({ error: err.message });
  }
})
app.get("/viewroom",async(req,res)=>{
   try{
    var rooms =await roomModel.find();
    if(!rooms){
      return res.status(404).send("No rooms found");  
    }
   return res.status(200).json(rooms);
   }catch(err){
    console.error(err);
    return res.status(500).send("Server error");  
  }
})
app.get("/editrooms/:id",async(req,res)=>{
   try{
    var editrooms= await roomModel.findById(req.params.id);
    if(!editrooms){
       return res.status(404).send("No rooms found");  
    }
    res.json(editrooms);
   }catch(error){
    
    return res.status(500).send("Server error");  
   }
})
app.put("/updateroom/:id", upload.single("roomImage"), async (req, res) => {
  try {
    const { roomName,roomNumber, roomType, price, description } = req.body;
    const image = req.file ? req.file.filename : null;

    // Fetch the room
    const room = await roomModel.findById(req.params.id);
    if (!room) {
      return res.status(404).json({ error: "Room not found" });
    }

    // Update fields
    room.roomName=roomName || room.roomName;
    room.roomNumber = roomNumber || room.roomNumber;
    room.roomType = roomType || room.roomType;
    room.price = price || room.price;
    room.description = description || room.description;
    if (image) {
      room.image = image; 
    }

    await room.save();

    res.status(200).json({ message: "Room updated successfully", room });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

app.delete("/deleteroom/:id", async (req, res) => {
  try {
    const { id } = req.params;
    await roomModel.findByIdAndDelete(id);
    res.json({ success: true, message: "Room deleted successfully" });
  } catch (err) {
    res.status(500).json({ success: false, message: "Error deleting room" });
  }
});

app.post("/book", async (req, res) => {
  try {
    const {  roomId,guestName,guestEmail,checkIn,checkOut,adults,children,roomCount,dynamicPrice,guestId,staffId } = req.body;


    const room = await roomModel.findById(roomId);
    if (!room) {
      return res.status(404).json({ message: "Room not found" });
    }

    // Check if the room is already reserved in the given date range
    const existingBooking = await bookingmodel.findOne({
      room: roomId,
      $or: [
        { checkIn: { $lte: checkOut }, checkOut: { $gte: checkIn } }
      ]
    });

    if (existingBooking) {
      return res.status(400).json({ message: "Room is already reserved for the selected dates." });
    }

    // Save booking
    const newBooking = new bookingmodel({
      guest: guestId || null,
      guestName,
      guestEmail,
      room: roomId,
      checkIn,
      checkOut,
      adults,
      children,
      roomCount,
      dynamicPrice,
      createdBy: staffId || guestId,
      role: staffId ? "receptionist" : "guest",
    });

    await newBooking.save();

    // Update room status to reserved
    room.status = "reserved";
    await room.save();

    res.status(201).json({ message: "Booking successful", booking: newBooking });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Something went wrong", error });
  }
});

app.post("/adminbook", async (req, res) => {
  try {
    const {
      guestName,
      guestEmail,
      roomId,
      checkIn,
      checkOut,
      adults,
      children,
      roomCount,
      dynamicPrice,
      createdBy, // this is email from frontend
      role,
    } = req.body;

    // Only admin/receptionist can create bookings
    if (!["admin", "receptionist"].includes(role)) {
      return res.status(403).json({ message: "Not authorized to create bookings" });
    }

    // ✅ find the staff user by email (createdBy)
    const staffUser = await usermodel.findOne({ email: createdBy });
    if (!staffUser) {
      return res.status(400).json({ message: "Staff user not found" });
    }

    // Find room
    const room = await roomModel.findById(roomId);
    if (!room || !room.isAvailable) {
      return res.status(400).json({ message: "Room not available" });
    }

    // Create guest user if not exists
    let guestUser = null;
    if (guestEmail) {
      guestUser = await usermodel.findOne({ email: guestEmail });
      if (!guestUser) {
        guestUser = new usermodel({
          username: guestName,
          email: guestEmail,
          password: "default123", 
          role: "guest",
        });
        await guestUser.save();
      }
    }

    // Save booking
    const booking = new bookingmodel({
      guest: guestUser ? guestUser._id : null,
      guestName,
      guestEmail,
      room: room._id,
      checkIn,
      checkOut,
      adults,
      children,
      roomCount,
      dynamicPrice,
      createdBy: staffUser._id,
      role,
    });

    await booking.save();

    // Update room status
    room.isAvailable = false;
    room.status = "reserved";
    await room.save();

    res.status(201).json({
      message: "Booking created successfully",
      booking,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
});



app.post("/available", async (req, res) => {
  const { checkIn, checkOut } = req.body;

  if (!checkIn || !checkOut) {
    return res
      .status(400)
      .json({ success: false, message: "Please provide checkIn and checkOut dates" });
  }

  try {
    const checkInDate = new Date(checkIn);
    const checkOutDate = new Date(checkOut);

    if (isNaN(checkInDate.getTime()) || isNaN(checkOutDate.getTime())) {
      return res.status(400).json({ success: false, message: "Invalid date format" });
    }

    const overlappingBookings = await bookingmodel.find({
      checkIn: { $lt: checkOutDate },
      checkOut: { $gt: checkInDate },
    }).select("room");

    const bookingroomsid = overlappingBookings.map((b) => b.room);

    console.log("Overlapping Bookings:", overlappingBookings);
    console.log("Blocked Room IDs:", bookingroomsid);

    const availableroom = await roomModel.find({
      _id: { $nin: bookingroomsid },
      isAvailable: true,
    });

    res.json({ success: true, rooms: availableroom });
  } catch (err) {
    console.error("Error in /available route:", err);
    res.status(500).json({ success: false, message: "Server error", error: err.message });
  }
});
app.get("/invoice/:email", async (req, res) => {
  try {
    const email = req.params.email;

    // Case-insensitive match
    const bookings = await bookingmodel.find({
      guestEmail: { $regex: new RegExp(`^${email}$`, "i") }
    })
    .populate("guest", "username email")
    .populate("room", "roomNumber roomType price image")
    .sort({ createdAt: -1 });

    if (!bookings || bookings.length === 0) {
      return res.status(404).json({ success: false, message: "No bookings found for this guest" });
    }

    res.status(200).json({ success: true, bookings });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Server error", error: error.message });
  }
});
app.post("/feedbacks", async (req, res) => {
  try {
    const { userId, rating, comments } = req.body;

  

    const user = await usermodel.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const feedback = new feedbacksmodel({
      guest: user._id,
      guestEmail: user.email,
      rating,
      comments
    });

    await feedback.save();
    res.status(201).json({ message: "Feedback submitted successfully", feedback });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

app.get("/fetchfeedbacks", async (req, res) => {
  try {
    const feedbacks = await feedbacksmodel.find()
      .populate("guest", "username email")   
      

    res.json(feedbacks);
  } catch (error) {
    console.error("Error fetching feedbacks:", error);
    res.status(500).json({ message: "Error fetching feedbacks", error });
  }
});


app.get("/admin/dashboard-stats", async (req, res) => {
  try {
    const totalUsers = await usermodel.countDocuments();
    const totalBookings = await bookingmodel.countDocuments();
    const totalRevenueAgg = await bookingmodel.aggregate([
      { $group: { _id: null, total: { $sum: "$dynamicPrice" } } }
    ]);
    const totalRevenue = totalRevenueAgg[0] ? totalRevenueAgg[0].total : 0;
    const totalFeedbacks = await feedbacksmodel.countDocuments();

    res.json({
      success: true,
      stats: { totalUsers, totalBookings, totalRevenue, totalFeedbacks }
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

app.listen(4000)