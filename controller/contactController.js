const asyncHandler = require("express-async-handler");
const connection = require("../dbConnection/connectMySQL");
const { response } = require("express");
const moment = require("moment-timezone");
const { constants } = require("../constants");


function parseJsonFromRespone(input){
    var jsonResponse = JSON.stringify(input);
    var jsonResponse = JSON.parse(jsonResponse);

    return jsonResponse;
}

//@desc GET all contacts
//@route GET /api/contacts
//@access private
const getContacts = asyncHandler (async (req, res, next) =>{
    

    let que = `SELECT * FROM contacts;`
    
    connection.query(que, (err, response)=>{
        if(err) next(new Error(err.message));

        res.status(200).json(response);

        console.log(response);
    })

    
});


//@desc GET all contacts
//@route GET /api/contacts/all
//@access private
const getContactsCreated = asyncHandler (async (req, res) =>{
    

    let que = `SELECT * FROM contacts WHERE user_id = '${req.user.ids}';`
    
    connection.query(que, (err, response)=>{
        if(err) next(new Error(err.message))

        res.status(200).json(response);

        console.log(response);
    })

    
});


//@desc GET
//@route GET /api/contacts/:id
//@access private
const getContact = asyncHandler (async (req, res, next) =>{

    let que = `SELECT * FROM contacts WHERE ID = ${req.params.id} AND  user_id = '${req.user.ids}' LIMIT 1;`
    connection.query(que, (err, response)=>{
        if(err) next(new Error(err.message))

        const parsedResponse = parseJsonFromRespone(response);

        if(Object.keys(parsedResponse).length == 0) {

            res.status(400);
            next(new Error("Not Found"));

        }else{
            res.status(200).json(parsedResponse);
            console.log(parsedResponse);
        }
    });

    
});

//@desc Create New contacts
//@route POST /api/contacts
//@access private
const createContact = asyncHandler (async (req, res, next) =>{


    console.log('Request body: ', req.body);
    const {fname, lname, email, phone} = req.body;


    if(!lname || !fname || !email || !phone){
        res.status(400);
        next(new Error("All Fields are Mandatory"));
    }

    const currentTime  = moment().tz('Asia/Kolkata').format('YYYY-MM-DD HH:mm:ss');
    console.log(currentTime);
    // const currentTimestamp = new Date().toISOString().slice(0, 19).replace('T', ' ');

    let que = `INSERT INTO contacts (fname, lname, email, PhoneNo, createdAt, user_id)
    VALUES ('${fname}', '${lname}', '${email}', ${phone}, '${currentTime}', '${req.user.ids}');`

    connection.query(que, (err, response)=>{
        if(err) next(new Error(err.message))
        console.log("New Row Inserted!\n");
        console.log(response);
    })
    
    res.status(201).json({message: "Create contacts"});
});


//@desc PUT Update contact
//@route PUT /api/contacts/:id
//@access private
const updateContact = asyncHandler (async (req, res, next) =>{

    let que = `SELECT * FROM contacts WHERE ID = ${req.params.id} LIMIT 1;`
    connection.query(que, (err, response)=>{
        if(err) next(new Error(err.message));

        const parsedResponse = parseJsonFromRespone(response);

        if(Object.keys(parsedResponse).length == 0) {
            res.status(constants.VALIDATION_ERROR).json({message: `404 Not Found`});
        }else{

            if(parsedResponse[0]['user_id']!=req.user.ids){
                res.status(403);
                next(new Error("User don't have permission to edit other user's contact!"));
            }else{
                const currentTime  = moment().tz('Asia/Kolkata').format('YYYY-MM-DD HH:mm:ss');
                const {fname, lname, email, phone} = req.body;

                if(!lname || !fname || !email || !phone){
                    res.status(400);
                    next(new Error("All Fields are Mandatory"));
                }else{
                    let que2 = `UPDATE contacts
                    SET fname = '${fname}',
                        lname = '${lname}',
                        email = '${email}',
                        PhoneNo = '${phone}',
                        createdAt = '${currentTime}'
                    WHERE ID = ${req.params.id};`

                    connection.query(que2, (err, response)=>{
                        res.status(200).json(parseJsonFromRespone(response));
                        console.log(parseJsonFromRespone(response));
                    });
                }
            }

        }
    });

});


//@desc Delete contacts
//@route DELETE /api/contacts/:id
//@access private
const deleteContact = asyncHandler (async (req, res, next) =>{

    let que = `SELECT * FROM contacts WHERE ID = ${req.params.id} LIMIT 1;`
    connection.query(que, (err, response)=>{
        if(err) next(new Error(err.message))

        const parsedResponse = parseJsonFromRespone(response);

        if(Object.keys(parsedResponse).length == 0) {

            res.status(constants.NOT_FOUND);
            next(new Error("Contact with specified id is Not Found"));

        }else{
            if(parsedResponse[0]['user_id']!=req.user.ids){
                res.status(403);
                next(new Error("User don't have permission to delete other user's contact!"));
            }else{
                let que2 = `DELETE FROM contacts WHERE ID = ${req.params.id} LIMIT 1;`
                connection.query(que2, (err, response2)=>{
                    if(err) next(new Error(err.message))

                    res.status(200).json({message: `Deleted contact with id = ${req.params.id}`, deleted: parsedResponse});
                });
            }
        }
    });

    
});


module.exports = {
    getContact,
    getContacts, 
    createContact,
    updateContact,
    deleteContact,
    getContactsCreated
};