const User = require('../models/user.model');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const saltRounds = 10;
const nodemailer = require('nodemailer');

//mailtrap transport for nodemailer
var transport = nodemailer.createTransport({
    host: "smtp.mailtrap.io",
    port: 2525,
    auth: {
        user: "e9ea07d1640c65",
        pass: "38cfbd72333a03"
    }
});


//Gets count of documents in DB, Only a signin in user with valid token can make this api call
exports.getUsers = (__, res, token) => {
    User.find({}, { password: 0, email: 0 }).exec((err, users) => {
        if (err) return res.status(400).json({
            error: 'something went wrong!'
        });
        return res.json({
            no_of_documents: users.length
        })
    })
}

exports.signupHandler = (req, res) => {
    const { name, email, password } = req.body;
    console.log(name, email, password)

    if (!name || !email || !password) return res.status(400).json({
        error: 'Please add all fields!'
    });


    User.findOne({ email }).exec((err, user) => {
        if (err) return res.status(400).json({
            error: 'something went wrong!'
        })

        if (user) return res.status(400).json({
            error: 'user with this email already exists!'
        })

        //generate jwt token for account activation
        const token = jwt.sign({ name, email, password }, process.env.JWT_ACCOUNT_ACTIVATION_KEY, {
            expiresIn: '30m'
        });

        const activationLink = `${process.env.CLIENT_URL}/auth/activate/${token}`;

        //creating email template
        const emailTemplate = {
            to: [
                {
                    address: email,
                    name: name
                }
            ],
            from: {
                address: process.env.EMAIL_FROM,
                name: 'AM PVT LTD'
            },
            subject: 'Account activation Link',
            html: `
            <div style="display:flex; flex-direction:column">
            <h1 style="background-color: #2B2B52; color: white; text-align:center; padding:10px; font-family:Arial, Helvetica, sans-serif">Please use the following link to activate account</h1>
            <br/>
             <button style="align-self:center;padding:10px 18px; background:#0A79DF;letter-spacing:1px; cursor:pointer; outline:none; border:none; border-radius:4px"><a href=${activationLink} target="_blank" style="text-decoration: none; color: white">Activate Now</a></button>
   
            <hr/>
            <h4 style="text-align:center; color: steelblue">This email contains sensitive information.</h4>
            <p style="align-self:center;color: #192A56; font-family:Impact, Charcoal, sans-serif;letter-spacing:1px;">NOTE: link is valid for only 30 minutes.</p>
            <br/>
            <a href=${process.env.CLIENT_URL} target="_blank" style="align-self:center">Go to Site</a>
           </div>
        `
        }

        //Send Email (Account Activation link Email)
        transport.sendMail(emailTemplate, (err, info) => {
            if (err) return res.status(400).json({
                error: 'something went wrong. Could not send email.'
            })

            return res.json({
                message: `Email has been sent successfully to ${email}. Please follow the instructions provided in the email to activate your account.`
            })
        })

    })
}

exports.activateAccount = (req, res) => {
    const { token } = req.body;

    console.log('token: '+ token);
    if (token) {
        return jwt.verify(token, process.env.JWT_ACCOUNT_ACTIVATION_KEY, (err) => {
            if (err) return res.status(400).json({
                error: 'token expired. Please signup again.'
            })

            const { name, email, password } = jwt.decode(token);


            // Generate salt and hash password 
            const salt = bcrypt.genSaltSync(saltRounds);
            const hashPassword = bcrypt.hashSync(password, salt);

            const newUser = new User();
            newUser.name = name;
            newUser.email = email;
            newUser.password = hashPassword;

            User.findOne({ email }).exec((err, user) => {
                if (err) return res.status(400).json({
                    error: 'something went wrong!'
                });

                if (user) return res.status(400).json({
                    error: 'Already activated account. Please sign in.'
                });

                //creating  email template
                const emailTemplate = {
                    to: [
                        {
                            address: email,
                            name: name
                        }
                    ],
                    from: {
                        address: process.env.EMAIL_FROM,
                        name: 'AM PVT LTD'
                    },
                    subject: 'Account activation successful',
                    html: `
                            <div style="display:flex; flex-direction:column">
                            <h1 style="background-color: #26ae60; color: white; text-align:center; padding:10px; font-family:Arial, Helvetica, sans-serif">Your account is activated successfully</h1>
                            <br/>
                            <hr/>
                            <h2 style="text-align:center; color: steelblue, font-weight:500; text-transform: uppercase">Welcome ${name}</h2>
                            <br/>
                            <p style="text-align:center;">Your account is activated. Please Sign in to continue.</p>
                            <br/>
                        </div>
        `
                    }

                //Send Email (Activation Success Email)
                transport.sendMail(emailTemplate, (err, info) => {
                    if (err) return res.status(400).json({
                        error: 'something went wrong. Could not send email.'
                    })

                    return res.json({
                        message: `Email has been sent successfully to ${email}.`
                    })
                })

                newUser.save((err, user) => {
                    if (err) return res.status(400).json({
                        error: 'something went wrong!'
                    });

                    return res.json({
                        message: `Hey ${name}, your account is activated. Please signin.`,
                        user: user
                    })
                })
            })

        })
    }
    else {
        return res.status(400).json({
            error: 'token does not exist or expired'
        })
    }
}

exports.signinHandler = (req, res) => {

    const { email, password } = req.body;

    if (!email || !password) return res.status(400).json({
        error: 'Please add all fields!'
    })

    User.findOne({ email }).exec((err, user) => {
        if (err) return res.status(400).json({
            error: 'something went wrong.'
        })

        if (!user) return res.status(400).json({
            error: 'user does not exist'
        })

        const isMatched = bcrypt.compareSync(password, user.password);
        if (!isMatched) {
            return res.status(400).json({
                error: 'password does not match.'
            })
        }

        const token = jwt.sign({ user: user.name }, process.env.JWT_SECRET_KEY, { expiresIn: '1d' });


        return res.json({
            token,
            user: user.name
        })

    });
}

exports.forgotPassword = (req, res) => {
    const { email } = req.body;

    User.findOne({ email }).exec((err, user) => {
        if (err) return res.status(400).json({
            error: 'Something went wrong'
        })

        if (!user) return res.status(400).json({
            error: 'User does not exist with this email.'
        })

        const token = jwt.sign({ email }, process.env.JWT_RESET_PASSWORD_KEY, {
            expiresIn: '30m'
        });

        const resetPasswordLink = `${process.env.CLIENT_URL}/reset-password/${token}`;

        //creating email template
        const emailTemplate = {
            to: [
                {
                    address: email
                }
            ],
            from: {
                address: process.env.EMAIL_FROM,
                name: 'Auth App'
            },
            subject: 'Reset Password Link',
            html: `
         <div>
           <h1>Please use the following link to reset your password</h1>
           <br/>
           <span>Link:</span> <a href=${resetPasswordLink} target="_blank">${resetPasswordLink}</a>
  
           <hr/>
           <h4>This email contains sensitive information.</h4>
           <p>NOTE: link is valid for only 30 minutes.</p>
           <br/>
           <a href=${process.env.CLIENT_URL} target="_blank">${process.env.CLIENT_URL}</a>
         </div>
        `
        }

        //Send Email
        transport.sendMail(emailTemplate, (err, info) => {
            if (err) return res.status(400).json({
                error: 'something went wrong. Could not send email.'
            })

            return res.json({
                message: `Email has been sent successfully to ${email}. Please follow the instructions provided in the email to reset password.`
            })
        })
    })
}

exports.resetPassword = (req, res) => {
    const { token, newPassword } = req.body;

    if (!token || !newPassword) return res.status(400).json({
        error: 'token or password is missing. Failed to proceed reset password.'
    });

    if (token) {
        return jwt.verify(token, process.env.JWT_RESET_PASSWORD_KEY, (err) => {
            if (err) return res.status(400).json({
                error: 'token expired.'
            });

            const { email } = jwt.decode(token);

            User.findOne({ email }).exec((err, user) => {
                if (err) return res.status(400).json({
                    error: 'something went wrong.'
                });

                if (!user) return res.status(400).json({
                    error: 'User with the provided email does not exist.'
                });

                // Generate salt and hash password 
                const salt = bcrypt.genSaltSync(saltRounds);
                const hashPassword = bcrypt.hashSync(newPassword, salt);

                user.update({ $set: { password: hashPassword } }).exec((err, user) => {
                    if (err) return res.status(400).json({
                        error: 'something went wrong. failed to update password.'
                    });

                    return res.json({
                        message: 'Password updated successfully.'
                    })
                })


            })
        })
    }


}





