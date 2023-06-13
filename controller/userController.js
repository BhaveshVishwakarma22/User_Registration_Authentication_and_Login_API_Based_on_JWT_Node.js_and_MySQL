const asyncHandler = require("express-async-handler");
const { constants } = require("../constants");
const connection = require("../dbConnection/connectMySQL");
const { response } = require("express");
const bcrypt = require("bcrypt");
const jwt = require('jsonwebtoken');

function parseJsonFromRespone(input){
    var jsonResponse = JSON.stringify(input);
    var jsonObj = JSON.parse(jsonResponse);

    return jsonObj;
}

//Function to compare original with hashed password
function comparePasswords(plainPassword, hashedPassword) {
    return new Promise((resolve, reject) => {
      bcrypt.compare(plainPassword, hashedPassword, (error, result) => {
        if (error) {
          reject(error);
        } else {
          resolve(result);
        }
      });
    });
}


//@desc Get All User
//route GET api/users/
//@access public
const getAlluser = asyncHandler (async (req, res, next)=>{
    
    const que = `SELECT * FROM users;`
    connection.query(que, async (err, response)=>{
        if(err) next(new Error(err.message));

        const parsedResponse = parseJsonFromRespone(response);
        res.status(200).json(parsedResponse);
    });
});


//@desc Register User
//@route POST /api/users/register
//@access public
const registerUser = asyncHandler (async (req, res, next)=>{
    //Check if all fields in body are present
    let {fname, lname, email, pass, phone, userPhoto} = req.body;

    if(!fname || !lname || !email || !pass || !phone || !userPhoto){
        res.status(constants.NOT_FOUND);
        next(new Error("All Fields are Mandatory!"));
    }

    //Check if exist
    const checkQuery = `SELECT * FROM users WHERE email = '${email}' OR phone = '${phone}' LIMIT 1;`
    connection.query(checkQuery, async (err, response)=>{
        if(err) next(new Error(err.message))

        const parsedResponse = parseJsonFromRespone(response);
        
        if(Object.keys(parsedResponse).length == 0){
            //When user not exists
            //Hashing Password
            const hashedPass = await bcrypt.hash(pass, 7);
            console.log("Hashed Password: " + hashedPass);

            const insertQuery = `INSERT INTO users (fname, lname, email, pass, phone, userPhoto)
            VALUES ('${fname}', '${lname}', '${email}', '${hashedPass}', '${phone}', '${userPhoto}');`

            connection.query(insertQuery, (err2, response2)=>{
                if(err2) next(new Error(err2));

                console.log("User Registered!");
                res.status(200).json(req.body);
            });

        }else{
            //When User exists

            res.status(constants.VALIDATION_ERROR);
            next(new Error(`User Already Exists!`));
        }

    });
});


// async function ComparePassword(pwd, existing_pwd){
//     return await bcrypt.compare(pwd, existing_pwd);
// }

//@desc Login User
//@route POST /api/users/login
//@access public
const loginUser = asyncHandler (async (req, res, next)=>{

    const {email, pass} = req.body;
    
    if(!email || !pass){
        res.status(400);
        next(new Error("All Fields are mandatory!"));
    }

    //Check if user exists
    const checkQuery = `SELECT * FROM users WHERE email = '${email}' LIMIT 1;`
    connection.query(checkQuery, async (err, response)=>{
        if(err) next(new Error(err.message));

        const parsedResponse = parseJsonFromRespone(response);
        
        if(Object.keys(parsedResponse).length == 0){
            //When user not exists
            res.status(constants.VALIDATION_ERROR);
            next(new Error("User Not Found!"));
        }else{
            //When User exists
            //Check if entered password and the hashed pass in db is same
            if(await bcrypt.compare(pass, parsedResponse[0]['pass'])){
                // res.status(200).json({
                //     message:"right"
                // });
                const accessToken = jwt.sign({
                    user:{

                        fname: parsedResponse[0]['fname'],
                        lname: parsedResponse[0]['lname'],
                        email: parsedResponse[0]['email'],
                        phone: parsedResponse[0]['phone'],
                        userPhoto: parsedResponse[0]['userPhoto']

                    },
                }, 
                process.env.ACCESS_TOKEN_SECRET,
                {expiresIn: '15m'}
                );
                res.status(200).json({ accessToken });


            }else {
                res.status(401);
                next(new Error("All Fields are Mandatory!"));
            }
            // console.log(parsedResponse);
            
        }

    });

    
});


//@desc Register USer
//@route GET /api/users/current
//@access private
const currentUser = asyncHandler (async (req, res, next)=>{
    res.json(req.user);
});

module.exports = {registerUser, loginUser, currentUser, getAlluser};
