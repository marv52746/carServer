// eslint-disable-next-line no-undef
const mongoose = require('mongoose')
const {ObjectId} = mongoose.Schema; 

var userSchema = new mongoose.Schema({
    email : {
        type : String,
        required: true,
        unique: true
    },
    active : {
        type: Boolean,
    },
    password : {
        type: String,
        required: true,
        minlength: 8
    },
    username : {
        type: String,
        unique: true
    },
    address : {
        type: String,
    },
    fullname : {
        type: String,
    },
    isAdmin : {
        type: Boolean,
    },
    avatar: {
        // eslint-disable-next-line no-undef
        data: Buffer,
    },
    avatarID: {
        type: String
    },
    first_name: {
        type: String
    },
    last_name: {
        type: String
    },
    date_of_birth: {
        type: String
    },
    gender: {
        type: String
    },
    phone_number: {
        type: String
    },
    registration_date: {
        type: String
    },
    last_login: {
        type: String
    },
    account_status: {
        type: String
    },
    account_type: {
        type: String
    },
    additional_information: {
        type: String
    },
    
    store: {
        type: String,
    },

    created_on: {
        type: String,
    },
    created_by: {
        _id : {
            type :  ObjectId,
            ref :  "user"
        },
        fullname: {
            type: String
        },
        email: {
            type: String
        },
        phone_number: {
            type: String
        },
        address: {
            type: String
        },
    },
    updated_on: {
        type: String,
    },
    updated_by: {
        _id : {
            type :  ObjectId,
            ref :  "user"
        },
        fullname: {
            type: String
        },
        email: {
            type: String
        },
        phone_number: {
            type: String
        },
        address: {
            type: String
        },
    },

})


const Userdb = mongoose.model('user', userSchema)

module.exports = Userdb