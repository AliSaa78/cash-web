import mongoose from "mongoose";


const connectDB = async ()=>{
    try{

 await mongoose.connect(process.env.DB_CONNECTION)
console.log("Database connected");
}catch(err){
    console.log(err);
    res.status(500).json(err);
}
}

export default connectDB;