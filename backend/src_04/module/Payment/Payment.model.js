import mongoose from "mongoose";


const PaymentSchema = mongoose.Schema({

    r_payment_id: {
        type: String,
        required: true
    },
    method: {
        type: String,
        required: true
    },
    currency: {
        type: String,
        required: true
    },
    gst: {
        type: Number,
        default: 0
    },
    
    amount: {
        type: Number
    },
    json_response: {
        type: Object
    },
    registration_id: { type: mongoose.Schema.Types.ObjectId, ref: "WebinarRegistration", },

    course_id: { type: mongoose.Schema.Types.ObjectId, ref: "one_to_one", },

    user_email: {
        type: String,
        required: true
    },
    type: {
        type: String

    }

},
    { timestamps: true }
)


const PaymentModel = mongoose.model('Payment', PaymentSchema);

export default PaymentModel;