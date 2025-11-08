import mongoose from "mongoose"

const OperatorSchema = new mongoose.Schema(
    {
        address: {
            type: String,
            required: true,
        },
        email: {
            type: String,
            required: true,
        },
        phone: {
            type: String,
            required: true,
        },
        firstname: {
            type: String,
        },
        othername: {
            type: String,
        },
        lastname: {
            type: String,
        },
        country: {
            type: String,
        },
        national: {
            type: String,
        },
        license: {
            type: String,
        },
        headshot: {
            type: String,
        },
        location: {
            type: String,
        },
        compliant: {
            type: Boolean,
            default: false,
        },
        createdAt: {
            type: Date,
            default: Date.now,
        },
        updatedAt: {
            type: Date,
            default: Date.now,
        },
    },
    {
        timestamps: true, // Add timestamps
    }

)

const Operator = mongoose.models.Operator || mongoose.model("Operator", OperatorSchema)

export default Operator