import jwt from "jsonwebtoken"

export const generateJWT = (uid = " ", name = "", role = "") => {
    return new Promise((resolve, reject) => {
        const payload = { uid, name, role  }

        jwt.sign(
            payload,
            process.env.SECRETORPRIVATEKEY,
            {
                expiresIn: "1h"
            },
            (err, token) =>{
                if(err){
                    reject({
                        success: false,
                        message: err
                    })
                }else{
                    resolve(token)
                }
            }
        )
    })
}