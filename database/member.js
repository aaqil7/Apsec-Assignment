const { Schema, model } = require('mongoose');

const memberSchema = new Schema(
    {
        name: {
            type: String,
            required: true
        },
        email: {
            type: String,
            required: true,
        },
        role: {
            type: String,
            enum: ["admin", "manager", "deliveryrider", "customer"]
        },
        password: {
            type: String,
            required: true
        }
    },
    { timestamps: true }
);

module.exports = model("member", memberSchema)

