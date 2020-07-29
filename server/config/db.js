const mongoose = require('mongoose');

//Connect to DB  (Async Function)
const connectToDB = async () => {
  try{
    const result = await mongoose.connect(process.env.MONGODB_URI,{
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useCreateIndex: true,
        useFindAndModify: true
    });
    console.log(`MongoDB Connected: ${result.connection.host}`)
  }
  catch(err){
     console.log(`error: ${err.message}`);
     process.exit(1);
  }
}

module.exports = connectToDB;