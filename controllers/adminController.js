const User = require('../models/userModel')
const bcrypt = require('bcrypt')
const rendomstring = require('randomstring')




const securePassword = async (password) => {
    try {
        const passwordHash = await bcrypt.hash(password, 4)
        return passwordHash
    } catch (error) {
        console.log(error.message);
    }
}


const loadLogin = async (req, res) => {
    try {
        res.render('login')
    } catch (error) {
        console.log(error.message);
    }
}


const verifyLogin = async (req, res) => {
    try {
        const email = req.body.email
        const password = req.body.password

        const userData = await User.findOne({ email: email })
        if (userData) {
            const passwordMatch = await bcrypt.compare(password, userData.password)
            if (passwordMatch) {
                if (userData.is_admin === 0) {
                    res.render('login', { message: 'Email and Password is incorrect' })

                } else {
                    req.session.user_id = userData._id
                    res.redirect('/admin/home')

                }
            } else {
                res.render('login', { message: 'Email and Password is incorrect' })

            }
        } else {
            res.render('login', { message: 'Email and Password is incorrect' })
        }

    } catch (error) {
        console.log(error.message);
    }
}


const loadDashboard = async (req, res) => {
    try {
        const usersData = await User.findById({ _id: req.session.user_id })
        res.render('home', { admin: usersData })
        console.log('huuu');
    } catch (error) {
        console.log(error.message);
    }
}


const logout = async (req, res) => {
    try {
        req.session.destroy();
        console.log('ethunnilla');
        res.redirect('/admin')
        console.log('ethi');
    } catch (error) {
        console.log(error.message);
    }
}


const adminDashboard = async (req, res) => {
    try {
        var search = '';
        if (req.query.search) {
            search = req.query.search
        }
        const userData = await User.find({
            is_admin: 0,
            $or: [
                { name: { $regex: '.*' + search + '.*', $options: 'i' } },
                { email: { $regex: '.*' + search + '.*', $options: 'i' } },
                // { mobile: Number(search) }
                { mobile: !isNaN(search) ? Number(search) : null }

            ]
        })
        res.render('dashboard', { user: userData })
    } catch (error) {
        console.log(error.message);
    }
}

//add new user
const newUserLoad = async (req, res) => {
    try {
        res.render('new-user')
    } catch (error) {
        console.log(error.message);
    }
}


const addUser = async (req, res) => {
    try {
        const spassword = await securePassword(req.body.password);
        const name = req.body.name
        const email = req.body.email
        const mobile = req.body.mobile
        const image = req.file.filename
        // const password = rendomstring.generate(4)
        const password = spassword;


        const user = new User({
            name: name,
            email: email,
            mobile: mobile,
            image: image,
            password: password,
            is_admin: 0
        })
        const userData = await user.save()

        if (userData) {
            res.redirect('/admin/dashboard')
        } else {
            res.render('new-user', { message: 'Something wrong' })
        }

    } catch (error) {
        console.log(error.message);
    }
}
const editUserLoad = async (req, res) => {
    try {
        const id = req.query.id
        const userData = await User.findById({ _id: id })
        if (userData) {
            res.render('edit-user', { user: userData })
            // res.render('edit-user')

        } else {
            res.redirect('/admin/dashboard')
        }
    } catch (error) {
        console.log(error.message);
    }
}
const updateUsers = async (req, res) => {
    try {
        const userData = await User.findByIdAndUpdate({ _id: req.body.id }, {
            $set:
                { name: req.body.name, mobile: req.body.mobile, is_verified: req.body.verify },
        })
        res.redirect('/admin/dashboard')
    } catch (error) {
        console.log(error.message);
        // res.render('edit-user', { user: req.body,   message: 'Something went wrong' });
    }
}

const deleteUser = async (req, res) => {
    try {
        const id = req.query.id
        await User.deleteOne({ _id: id })
        res.redirect('/admin/dashboard')
    } catch (error) {
        console.log(error.message);
    }
}

module.exports = {
    loadLogin,
    verifyLogin,
    loadDashboard,
    logout,
    adminDashboard,
    newUserLoad,
    addUser,
    editUserLoad,
    updateUsers,
    deleteUser
}