const express = require('express');
const { getUsers , signupHandler, signinHandler, activateAccount, forgotPassword, resetPassword } = require('../controllers/user.controller');
const { authorize } = require('../auth.middleware');
const router = express.Router();

//Protected Route only signed in user with valid token can access this route
router.get('/get-users', authorize, getUsers);

router.post('/sign-up', signupHandler);

router.post('/activate-account', activateAccount);

router.post('/sign-in', signinHandler);

router.post('/forgot-password', forgotPassword);

router.post('/reset-password', resetPassword);




module.exports = router;