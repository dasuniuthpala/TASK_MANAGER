import mongoose from "mongoose";

export const connectDB = async() => {
    await mongoose.connect('mongodb+srv://dasuniuthpala2002:UgiBz5kg61iy4oyt@cluster0.xehairh.mongodb.net/taskflow')
    .then (()=> console.log("DB CONNECTED"));
}