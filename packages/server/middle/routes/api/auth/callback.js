const jwt = require("jsonwebtoken")

let route = async (req, res) => {
    try {       
        let claims = {
            //"X-Hasura-Allowed-Roles": ["user"],
            "X-Hasura-Role": "user"
        }
        /*if (process.env.EXTERNAL_GQL === "allow"){
            claims = {
                "X-Hasura-Role": "admin"
            }
            return res.status(200).send(claims) 
        }*/
        const authHeader = req.headers.authorization;
        console.log("authHeader", JSON.stringify(authHeader))
        const token = authHeader.split(' ')[1];
        let decodedToken = jwt.decode(token);
        console.log("decodeToken", decodedToken)
        if(decodedToken['https://hasura.io/jwt/claims']['x-hasura-role']) {
            claims['X-Hasura-Role'] =  decodedToken['https://hasura.io/jwt/claims']['x-hasura-role']
        }
        if(!decodedToken.iss) {
            decodedToken = jwt.verify(token, process.env.HASURA_JWT_SECRET)
            if(decodedToken['https://hasura.io/jwt/claims']['x-hasura-mobile']) {
                claims["X-Hasura-Mobile"] = decodedToken['https://hasura.io/jwt/claims']['x-hasura-mobile']
            } 
        } else {
            decodedToken = await firebase.auth().verifyIdToken(token);
            if(decodedToken['https://hasura.io/jwt/claims']['x-hasura-mobile']) {
                claims["X-Hasura-Mobile"] = decodedToken['https://hasura.io/jwt/claims']['x-hasura-mobile']
            }
        }
        if(decodedToken['https://hasura.io/jwt/claims']['x-hasura-user-id']) {
            claims["X-Hasura-User-Id"] = decodedToken['https://hasura.io/jwt/claims']['x-hasura-user-id']
        }
        return res.status(200).send(claims)    
    } catch(e) {
        console.log("ERR in auth callback")
        console.error(e)
        //logger.debug(e);
        //logger.info(`Got error while authorization, ${e.toString()}`);
        return res.status(401).send({
            message: "JWTExpired"
        })
    }
}

module.exports = route;