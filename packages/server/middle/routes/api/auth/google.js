const admin = require('firebase-admin');
const config = process.env.CONFIG
const serviceAccount = require(`${config}/firebase-admin.json`)
const {postToGraphQL} = require("../../../lib/helper");
const jwt = require("jsonwebtoken")

const route = async(req, res) => {
  try {
    const { idToken } = req.body;
    const customClaims = await admin.auth().verifyIdToken(idToken);
    console.log("google adminn auth verifyIDToken", customClaims)
            if(!customClaims.email) {
                let user = await firebase.auth().getUser(customClaims.uid);
                customClaims.email = user.providerData[0].email;
            }
            let claims = {
              "x-hasura-allowed-roles": ["user"],
              "x-hasura-role": "user",
              "x-hasura-default-role": "user"
          }
          //console.log("req.body.account", req.body.account)
          //if(req.body.account) {
              claims['x-hasura-user-id'] = customClaims.email;
          //}
          const currentTimestamp = new Date().toISOString();
              const resp = await postToGraphQL({
                  query: `
                  mutation addUser(
          $google_id: String, 
          $email: String, 
          $display_name: String, 
          $photo_url: String, 
          $last_login: timestamptz, 
          $updated_at: timestamptz
        ) {
          insert_users_one(
            on_conflict: {
              constraint: users_email_key, 
              update_columns: [last_login, updated_at]
            }, 
            object: {
              google_id: $google_id, 
              email: $email, 
              display_name: $display_name, 
              photo_url: $photo_url, 
              last_login: $last_login,
              updated_at: $updated_at
            }
          ) {
            id, isAdmin, status
          }
        }                     
                      `,
                  variables: {
                    google_id: customClaims.sub,
                    email: customClaims.email,
                    display_name: customClaims.name,
                    photo_url: customClaims.picture,
                    last_login: currentTimestamp,
                    updated_at: currentTimestamp  
                  }
              })
              console.log("insert resp", resp)
              const isAdmin = resp.data.insert_users_one.isAdmin
              if (isAdmin){
                claims['x-hasura-role'] = "admin"
                claims['x-hasura-allowed-roles'] = ["admin", "user"]
                claims['x-hasura-default-role'] = "admin"
              }
              let secret = process.env.HASURA_JWT_SECRET;
              let response = { }
              
            response.token = jwt.sign(
                {
                    "https://hasura.io/jwt/claims": claims
                }, 
                secret, 
                {
                    expiresIn: '2d'
                }
            )
        

    res.json({ 
      token: response.token,
      userGoogle: {
        uid: customClaims.sub,
        email: customClaims.email,
        name: customClaims.name,
        picture: customClaims.picture,
        isAdmin
      }
    }).status(200);
  } catch (error) {
    console.error('Authentication error:', error);
    res.status(401).json({ error: 'Authentication failed' });
  }
}
module.exports = route