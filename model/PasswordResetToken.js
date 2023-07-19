const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const passwordResetTokenSchema = mongoose.Schema({
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
passwordResetTokenSchema.pre("save",async function(next) { // Here we use normal function() because in arrow function there is no "this" keyword.
    if(this.isModified("token")) {
        this.token = await bcrypt.hash(this.token,10);
    }
    next();
});

passwordResetTokenSchema.methods.compareToken = async function(token) {
    const result = await bcrypt.compare(token,this.token);
    return result;
}


module.exports = mongoose.model(
    "PasswordResetToken",
    passwordResetTokenSchema
);




// verificationToken : {
//     owner : _id,
//     token : otp (needs to be in hashed format),
//     expiryDate : 1hr 
// }