const userModel = require('../models/userModels')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const sendOtp = require('../service/sendOtp')
//1. creating user function
const createUser = async (req, res) => {
    //1. Get data drom the user(Fname,lname,email,password)
    console.log(req.body)
    //#.Destructuring
    const { firstName, lastName, email, password, phone } = req.body;
    //2. validation 
    if (!firstName || !lastName || !email || !password|| !phone) {
        return res.json({
            "Success": false,
            "message": "please enter all fields!"
        })
    }

    //Try-catch(error handeling)
    try {
        //check if the user is already exist

        const existingUser = await userModel.findOne({ email: email })
        if (existingUser) {
            return res.json({
                "success": false,
                "message": "User Already Exists!"
            })
        }
        //Hasing/encrypr the password
        const randomSalt = await bcrypt.genSalt(10)
        const hashPassword = await bcrypt.hash(password, randomSalt)

        //save the user in database
        const newUser = new userModel({
            //fields: values received from user
            firstName: firstName,
            lastName: lastName,
            email: email,
            password: hashPassword,
            phone:phone
        })

        //Actually save the user database
        await newUser.save()

        //send the success response
        res.json({
            "success": true,
            "message": "User Created Successfully"
        })


    } catch (error) {
        console.log(error)
        res.json({
            "success": false,
            "message": "internal server error!"
        })

    }


}

//2. login user function
const loginUser = async (req, res) => {
    //check incomming data
    console.log(req.body)

    //destructuring
    const { email, password } = req.body;

    //validation
    if (!email || !password) {
        return res.json({
            "Success": false,
            "message": "please enter all fields!"
        })
    }
    try {
        //1. find user , if not : stop the process
        const user = await userModel.findOne({ email: email })
        if (!user) {
            return res.json({
                "success": false,
                "message": "user not found!"
            })
        }
        //2. compare the passeord, if not:stop the process
        const isValidPassword = await bcrypt.compare(password, user.password)
        if (!isValidPassword) {
            return res.json({
                "success": false,
                "message": "Incorrect Password !"
            })
        }
        //3. generate JWT token
        //3.1 secret Decryption key(.env ma xa)
        const token = await jwt.sign(
            { id: user._id, isAdmin: user.isAdmin },
            process.env.JWT_SECRET
        )
        //4. send the token, userDate, message to the user
        res.json({
            "success": true,
            "message": "Login Successfully",
            "token": token,
            "userData": user
        })



    } catch (e) {
        console.log(error)
        res.json({
            "success": false,
            "message": "Internal server error"
        })

    }
}

//forgot password using phone number 
const forgotPassword=async(req,res)=>{
    const {phone}=req.body;
 
    if(!phone){
        res.status(400).json({
            'success':false,
            'message':'Please provide phone number!'
        })
    }
    try{
 
        //user find and validate
        const user=await userModel.findOne({phone : phone})
        if(!user){
            return res.status(400).json({
                'success':false,
                'message':'User not found!'
            })
        }
 
        //generate random otp
        const otp=Math.floor(100000+Math.random()*900000)//6 digit otp
 
 
        //update in database for verification
        user.otpReset=otp;
        user.otpResetExpires=Date.now()+3600000;
        await user.save()
 
 
        //sending otp to phone number
        // const isSent=await sendOtp(phone,otp)
        // if(!isSent){
        //     return res.status(400).json({
        //         'success':false,
        //         'message':'Error Sending OTP'
        //     })
        // }
        //Success Message
        res.status(200).json({
            'success':true,
            'message':'OTP send successfully!'
        })
 
    } catch(error){
        console.log(error)
        res.status(500).json({
            'success':false,
            'message':'Server Error!'
        })
    }
}

//verify otp and set new password
const verifyOtpAndSetPassword=async(req,res) =>{

}



//exporting
module.exports = {
    createUser,
    loginUser,
    forgotPassword,
    verifyOtpAndSetPassword
}

//task
//Controller - Routes - Index.js
//(make a productController.js)
//(make a productRoutes.js)
//(Link to index.js)