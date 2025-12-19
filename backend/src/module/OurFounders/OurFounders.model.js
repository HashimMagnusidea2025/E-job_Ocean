import mongoose from 'mongoose';

const OurFoundersSchema = new mongoose.Schema({

    name: {
        type: String,
        required: true
    },
    image: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    desgination:{
        type: String,
        required: true
    }
}, { timestamps: true });

const OurFoundersSchemaModel = mongoose.model('our-founders', OurFoundersSchema);

export default OurFoundersSchemaModel;

