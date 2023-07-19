const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const emailVerificationTokenSchema = mongoose.Schema({
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref : "User",
        required : true
    },
    token : {
        type : String,
        required : true
    },
    createAt : {
        type : Date,
        expires : 3600, //1hr
        default : Date.now()  //when "token " is stored inside the database then the time will be started.

    },
});
// Now here we hash the token 
emailVerificationTokenSchema.pre("save",async function(next) { // Here we use normal function() because in arrow function there is no "this" keyword.
    if(this.isModified("token")) {
        this.token = await bcrypt.hash(this.token,10);
    }
    next();
});
// here we check the token is matched or not .
emailVerificationTokenSchema.methods.compareToken = async function(token) {
    const result = await bcrypt.compare(token,this.token);
    return result;
}


module.exports = mongoose.model(
    "EmailVerificationToken",
    emailVerificationTokenSchema
);




// verificationToken : {
//     owner : _id,
//     token : otp (needs to be in hashed format),
//     expiryDate : 1hr 
// }