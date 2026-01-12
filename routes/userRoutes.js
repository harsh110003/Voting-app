const express = require('express')
const router = express.Router()
const User = require('./../models/user')
const {jwtAuth , generateToken} = require('./../jwt')


router.post('/signup' , async(req,res) => {
    try{
        const data = req.body
        const person = new User(data)
        const response = await person.save()
        console.log('data saved')
        const payload = {
            id : response.id
        }
        console.log(JSON.stringify(payload))
        const token = generateToken(payload)
        console.log('token is :', token)
        res.status(200).json({response : response , token : token})
    }
    catch(err){
        console.log(err)
        res.status(500).json({error : 'Internal Server Error'})
    }
})

//login
router.post('/login', async(req,res) => {
    try{
        const {aadharCardNumber, password} = req.body
        const user = await User.findOne({aadharCardNumber : aadharCardNumber})
        if(!user || !(await user.comparePassword(password))){
            return res.status(401).json({error : 'Invalid credentials'})
        }
        const payload = {
            id : user.id,
            username : user.username
        }
        const token = generateToken(payload)
        res.status(200).json({token})
    }
    catch(err){
        console.log(err)
        res.status(500).json({error : 'Internal Server Error'})
    }
})

//profile
router.get('/profile', jwtAuth, async(req,res) => {
    try{
        const userData = req.user
        const userId = userData.id 
        const response = await User.findById(userId)
        res.status(200).json(response)
    }
    catch(err){
        console.log(err)
        res.status(500).json({error : 'Internal Server Error'})
    }
})



router.put('/profile/password', async(req,res) => {
    try{
        const userId = req.params.id  //Extract the id from the token
        const {currentPassword, newPassword} = req.body //Extract the current password and a new password from the request body

        //find the user by userID
        const user = await User.findById(userId);
        //if password does not match return error
        if(!(await user.comparePassword(currentPassword))){
            return res.status(401).json({error : 'Invalid credentials'})
        }

        //update the user's password
         user.password = newPassword
         await user.save()
        console.log('password updated')
        res.status(200).json({message : 'Password updated successfully'})
    }
    catch(err){
        console.log(err)
        res.status(500).json({error : 'Internal Server Error'})
    }
})

router.get('/', async(req,res) => {
    try{
        const response = await User.find()
        res.status(200).json(response)
    }
    catch(err){
        console.log(err)
        res.status(500).json({error : 'Internal Server Error'})
    }
})

//hii welcome to personRoute of hotel
module.exports = router