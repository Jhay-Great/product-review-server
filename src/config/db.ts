import mongoose from "mongoose";

const mongoDB = async function() {
    try {
        await mongoose.connect(process.env.DB_URI || '');
        console.log('DB is live');
    } catch (error) {
        throw error;
        // console.log('Failed to connect to DB');
        // process.exit(1);
    }
};

export default mongoDB;