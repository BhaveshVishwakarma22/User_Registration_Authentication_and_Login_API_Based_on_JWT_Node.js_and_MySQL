const express = require("express");
const router = express.Router();
const {    
    getContact,
    getContacts, 
    createContact,
    updateContact,
    deleteContact,
    getContactsCreated
} = require("../controller/contactController");
const validateToken = require("../middleware/validateTokenHandler");


router.use(validateToken);


router.route('/').get(getContacts).post(createContact);

router.route('/all').get(getContactsCreated);

router.route('/:id').get(getContact).put(updateContact).delete(deleteContact);


module.exports = router;