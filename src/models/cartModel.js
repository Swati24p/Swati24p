const mongoose = require("mongoose");

const cartSchema = new mongoose.Schema(
    {
        userId: {
            type: ObjectId,
            required: true,
            ref: "user",
            trim: true,
            unique: true
        },

        items:
            [{
                productId: {
                    type: ObjectId,
                    required: true,
                    ref: "product",
                    trim: true
                },
                quantity: {
                    type: Number,
                    required: true
                }
            }],
        totalPrice: {
            type: Number,
            required: true,
            //comment: "Holds total price of all the items in the cart"
        },
        totalItems: {
            type: Number,
            required: true
            //comment: "Holds total number of items in the cart"}, 
        }

    }, { timestamps: true })


module.exports = mongoose.model('cart', cartSchema)