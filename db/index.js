const mongoose = require('mongoose');
// mongoose.connect('mongodb://localhost/review_app',{
//     useNewUrlParser: true, 
//     useUnifiedTopology: true,
//     family: 4
// }).then(() => {
//     console.log("DB has been conneted! ");
// }).catch((error) => {
//     console.log("Error while connecting to databse!", error);
// })

mongoose.connect(process.env.MONGO_URI,{
    useNewUrlParser: true, 
    useUnifiedTopology: true,
    family: 4
})
.then(()=>{
    console.log("DB has been connected!");
}).catch((error)=>{
    console.log("Error while connecting to Database!",error);
})