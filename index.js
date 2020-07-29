const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const morgan = require('morgan');
require('dotenv').config();
const cors = require('cors');
const connectToDB = require('./server/config/db');
const userRoutes = require('./server/routes/user.route');x


const { NODE_ENV, NODE_PORT } = process.env;

connectToDB();

const app = express();

const PORT = process.env.PORT || NODE_PORT || 8000;


if(NODE_ENV === 'development'){
    app.use(morgan('dev'));
    app.use(cors());

}
else{
    app.use(morgan('combined'));
}



app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true}));

//In case frontend is rendered from nodejs
app.use(express.static(path.join(__dirname, '/client/build')));



app.use('/api/users', userRoutes);


//for all the client requests
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname + '/client/build/index.html'));
})


app.listen(PORT, () => console.log(`Server started in ${process.env.NODE_ENV} mode at PORT: ${PORT}`));