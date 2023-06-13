# User Registration Authentication and Login API Based on JWT Node.js and MySQL
This is a Node.js, Express.js, MySQL and JWT based user registration, authentication and login API. JWT token span time is 15 min currently, but it can be updated through controller/userController: {expiresIn:'15m'}.

**# Routes**
_**User Routes**_
1. _POST /api/users/register_ : Create new user in the database.
2. _POST /api/users/login_ : Login Api generates Authentication token.
3. _GET api/users/_ : Get all the user information from the database.
4. _GET /api/users/current_ : Get the information of user from databased based on JWT authentication token.


_**Contact Routes**_
1. _GET /api/contacts_ : Get all the contacts information from the database.
2. _GET /api/contacts/all_ : Get all the contacts created by logined user.
3. _POST /api/contacts_ : Create new contact.
4._ GET /api/contacts/:id_ : Get contact based on ID*.
5. _PUT /api/contacts/:id_ : Update contact based on ID*.
6. _DELETE /api/contacts/:id_ : Deleted contact based on ID*.

**_Note:_**
* Based on the authentication token (Currently Loginned user).
