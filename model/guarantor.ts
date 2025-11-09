import mongoose from "mongoose"

const GuarantorSchema = new mongoose.Schema(
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
        location: {
            type: String,
        },
        national: {
            type: Array,
        },
        verification: {
            type: String,
            enum: ["manual", "self.xyz"],
        },
        headshot: {
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

const Guarantor = mongoose.models.Guarantor || mongoose.model("Guarantor", GuarantorSchema)

export default Guarantor