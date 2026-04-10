const mongoose = require("mongoose")

const productSchema = mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true,
        maxLength: [100, 'Product Name cannot exceed 100 characters']
    },
    description: {
        type: String,
        trim: true,
        maxLength: [500, 'Product description cannot exceed 500 characters']
    },
    price: {
        type: Number,
        required: true,
        min: [0, "Price cannot be negative"]
    },
    category: {
        type: String,
        enum: ["electronics", "clothing", "books", "other"],
        default: "other"
    },
    imageUrl:{  
        type: String,
        default: null
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    }
}, {timestamps: true})

productSchema.index({user: 1})

module.exports = mongoose.model("Product", productSchema)