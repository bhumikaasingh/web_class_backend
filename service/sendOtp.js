const axios=require('axios')
const sendOtp =async(phone,otp)=>{

    let isSent=false;

    //third party services provider 
    const url="https://api.managepoint.co/api/sms/send"

    //required payload
    const payload={
        "apiKey":"7adcbec1-3667-43f4-9482-adc32da16352",
        "to":phone,
        "message":`Your OTP for validation is ${otp}`
    }
    try{
        const res = await axios.post(url, payload);
        if(res.status == 200) {
            isSent = true;
        }
    }catch (error){
        console.log('OTP sending fail:',error.message)
    }
    return isSent;

}
module.exports=sendOtp