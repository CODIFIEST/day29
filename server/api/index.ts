import express from "express"
import cors from "cors"
import { User } from "../domain/user";
import { v4 as uuidv4 } from 'uuid';

import {initializeApp} from "firebase/app"
import { getFirestore,deleteDoc, setDoc, doc, getDoc, getDocs, collection, addDoc } from "firebase/firestore";
//use dotenv with process.env to hide api keys
import * as dotenv from "dotenv"
dotenv.config({ path: '../.env' });
// dotenv.config();

  console.log(process.env.VITE_apikey)
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

app.post("/user", async (req, res) =>{
    console.log('req.body--------------', req.body)
    const username = req.body.username;
    const email = req.body.email;
    const id = uuidv4();

    const user:User = {
        username:username,
        email:email,
        id:id,
    }
    console.log('user------------', user)
    const pushUser = await setDoc(doc(database, "day29", user.id), user)
    res.send(pushUser)

})
app.put("/user/:id", async (req, res)=>{
    const id= req.body.id;
    const email = req.body.email;
    const username = req.body.username;
    const user:User ={
        id:id,
        email:email,
        username:username
    }
console.log(user)
const updateUser = await setDoc(doc(database, "day29", req.body.id), user)
console.log(updateUser)    
res.send(updateUser)
})

app.listen(3999)