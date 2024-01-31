const User = require('../models/userModel')

const bcrypt = require('bcrypt')

const securePassword = async (password) => {
    try {
        const passwordHash = await bcrypt.hash(password, 10)
        return passwordHash
    } catch (error) {
        console.log(error.message);
    }
}

const loadRegister = async (req, res) => {
    try {
        res.render('registration')
    } catch (error) {
        console.log(error.message + 'passs4444444444');
    }
}

const insertUser = async (req, res) => {
    try {
        let spassword = await securePassword(req.body.password);
        let user = new User({
            name: req.body.name,
            email: req.body.email,
            mobile: req.body.mobile,
            image: req.file.filename,
            password: spassword,
            is_admin: 0

        })
        let userData = await user.save();
        if (userData) {

            // res.render('register',{message:'Your registration has been successfull'})
            res.render('login')

            console.log('register happend');
        } else {
            res.render('registration', { message: 'Your registration has been failed' })

        }
    } catch (error) {
        console.log(error.message + 'here');
    }

}
//login user method starting
const loginLoad = async (req, res) => {
    try {
        console.log('ethi');
        res.render('login')

    } catch (error) {
        console.log(error.message);
    }
}

const verifyLogin = async (req, res) => {
    try {
        const email = req.body.email
        console.log(email);
        const password = req.body.password
        console.log(password);
        const userData = await User.findOne({ email: email })
        if (userData) {
            console.log("-1");
            const passwordMatch = await bcrypt.compare(password, userData.password)
            if (passwordMatch) {
                console.log("1");
                if (userData.is_verified === 1) {
                    res.render('login')
                } else {
                    req.session.user_id = userData._id;
                    res.redirect('/home')
                    console.log('this is home');
                }
            } else {
                res.render('login', { message: 'Email and password is incorrect' })

            }

        } else {
            res.render('login', { message: 'Email and password is incorrect' })
        }
    } catch (error) {
        console.log(error.message);
    }
}

const loadHome = async (req, res) => {
    try {
        const userData = await User.findById({ _id: req.session.user_id })
        if (userData) {
            res.render('home', { user: userData })
        } else {
            req.session.destroy()
            res.redirect('/')
        }
    } catch (error) {
        console.log(error.message);
    }
}
const userLogout = async (req, res) => {
    try {
        req.session.destroy();
        res.redirect('/')

    } catch (error) {
        console.log(error.message);
    }
}





module.exports = {
    loadRegister,
    insertUser,
    loginLoad,
    verifyLogin,
    loadHome,
    userLogout

}