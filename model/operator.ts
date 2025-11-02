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
        firstname: {
            type: String,
        },
        othername: {
            type: String,
        },
        lastname: {
            type: String,
        },
        phone: {
            type: String,
            required: true,
        },
        country: {
            type: String,
            required: true,
        },
        national: {
            type: String,
            required: true,
        },
        license: {
            type: String,
            required: true,
        },
        headshot: {
            type: String,
            required: true,
        },
        location: {
            type: String,
            required: true,
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