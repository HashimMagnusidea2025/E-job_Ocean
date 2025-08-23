import mongoose from 'mongoose';


const CMSSchema = mongoose.Schema({

    siteTitle:{
        type:String
    },
    logo:{
        String
    },
    contactEmail:{
        type:String
    },
    contactPhone:{
        type:String
    },
    address:{
        type:String
    },
    socialLinks:{
        facebook:String,
        twitter:String,
        Linkdin:String,
        whatsapp:String,
        
    }
})

const CMSModel = mongoose.model('CMS', CMSSchema);

export default CMSModel;