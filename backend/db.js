const mongoose = require('mongoose');
 
const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URL)
            .then(() => console.log("MongoDB connected !!"))
            .catch((error) => console.log(error.message))
    } catch (error) {
        console.log(error.message);
    }
} 
module.exports = connectDB;
