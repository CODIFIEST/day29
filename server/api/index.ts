import express from "express"
import cors from "cors"
import { User } from "../domain/user";
import { v4 as uuidv4 } from 'uuid';

import {FirebaseApp, initializeApp} from "firebase/app"
import { getFirestore,deleteDoc, setDoc, doc, getDoc, getDocs, collection, addDoc } from "firebase/firestore";
import { hash, verify } from "argon2";
import * as jwt from "jsonwebtoken"

//use dotenv with process.env to hide api keys
import * as dotenv from "dotenv"
dotenv.config({ path: '../.env' });
// dotenv.config();
const jwtKey = process.env.VITE_siginingKey;

const firebaseConfig = {
    apiKey: process.env.VITE_apikey,
    authDomain: process.env.VITE_authDomain,
    projectId: process.env.VITE_projectId,
    storageBucket: process.env.VITE_storageBucket,
    messagingSenderId: process.env.VITE_messagingSenderId,
    appId: process.env.VITE_appId
};
const userApp = initializeApp(firebaseConfig);
const database = getFirestore(userApp);  

const app = express();
app.use(express.json());
app.use(cors());
app.get("/user", async (req, res) =>{
    // get a list of all the users
    let userList:User[]=[];
    console.log('we getting user list now')
    const users = await getDocs(collection(database, "day29" ))
    users.forEach((item) =>{
        let user = item.data() as any as User
        userList.push(user)
    })
    res.send(userList)
})

app.get("/user/:id", async (req, res) =>{
    //get a single user by id
    const user = await getDoc(doc(database,"day29", req.body.id ))
    console.log(user.data())
    res.send(user.data())

})

async function getUserByEmail(email:string):Promise<User>{
    let userList:User[]=[];
    console.log('we user by email now')
    const users = await getDocs(collection(database, "day29" ))
    users.forEach((item) =>{
        let user = item.data() as any as User
        userList.push(user)
    })
    console.log(userList.find(user => user.email === email))
    return userList.find(user => user.email === email)

}

app.post("/login", async (req, res)=>{
    const email = req.body.email;
    const password = req.body.password;
    //now match the passwords. Does the hash of the password match the hash stored in the database
    const user = await getUserByEmail( email)
    const passwordVerified = await verify(user.hashedPassword, req.body.password)
console.log('is password verified', passwordVerified)
    if (!passwordVerified){
        return res.status(400).send('wrong password duh')
    }
    else{
        //we need to create a valid json web token
        const token = jwt.sign({id:user.id}, jwtKey, { expiresIn: '1800s'})
        res.status(200).send({
            user:user,
            token:token
        })
    }
})

app.post("/user", async (req, res) =>{
    console.log('req.body--------------', req.body)
    const username = req.body.username;
    const email = req.body.email;
    const id = uuidv4();
    const password = req.body.password;

    
    //hash password
    const hashedPassword= await hash(password);
    console.log ('what does a hashed password look like?', hashedPassword)

    const user:User = {
        username:username,
        email:email,
        id:id,
        hashedPassword:hashedPassword,
    }
    console.log('user------------', user)
    const pushUser = await setDoc(doc(database, "day29", user.id), user)
    res.send(user)
    console.log('what is pushUser', pushUser)

})

app.put("/user/:id", async (req, res)=>{
    const id= req.body.id;
    const email = req.body.email;
    const username = req.body.username;
    const user ={
        id:id,
        email:email,
        username:username
    }
console.log(user)

    const authHeader = req.headers['authorization'];
    if (!authHeader){
       return res.status(400).send({error: "no auth header, not logged in"})
    }
    const token = authHeader && authHeader.split(' ')[1]
    if(!token) return res.status(400).send({error: "no token in auth header"})

    jwt.verify(token, jwtKey, async (err, decodedUser:{id:string})=>{
         if (err){
            return res.status(400).send({error: "invalid token"})
         }
         if (decodedUser.id !== req.body.id){
            return res.status(400).send({error: "wrong user logged in, bad id"})
         }
         const updateUser = await setDoc(doc(database, "day29", req.body.id), user,  { merge: true })

         console.log(updateUser)    
         res.send(user)
    })


})

app.listen(3999)