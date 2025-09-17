import mongoose from "mongoose";
import { Schema } from "mongoose";

const employeeSchema = new Schema({
    firstname: {
        type: String,
        required: true
    },
    lastname: {
        type: String,
        required: true
    }
});

export default mongoose.model("Employee", employeeSchema);