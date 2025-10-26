const express = require('express');
const jwt = require('jsonwebtoken');
const session = require('express-session')
const customer_routes = require('./router/auth_users.js').authenticated;
const genl_routes = require('./router/general.js').general;

const app = express();

app.use(express.json());

app.use("/customer",session({secret:"fingerprint_customer",resave: true, saveUninitialized: true}))

app.use("/customer/auth/*", function auth(req,res,next){
    // Check for token in session or Authorization header
    const sessionToken = req.session.authorization;
    const headerToken = req.headers['authorization'];
    
    // Get token from either source
    let token;
    if (sessionToken && sessionToken.accessToken) {
        token = sessionToken.accessToken;
    } else if (headerToken && headerToken.startsWith('Bearer ')) {
        token = headerToken.split(' ')[1];
    }

    if(token) {
        jwt.verify(token, "access", (err, user) => {
            if(!err){
                req.user = user;
                next();
            }
            else{
                return res.status(403).json({message: "User not authenticated"});
            }
        });
    }
    else {
        return res.status(401).json({message: "User not authenticated"});
    }
});
 
const PORT =4000;

app.use("/customer", customer_routes);
app.use("/", genl_routes);

app.listen(PORT,()=>console.log("Server is running"));
