"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const uuid_1 = require("uuid");
const app_1 = require("firebase/app");
const firestore_1 = require("firebase/firestore");
const argon2_1 = require("argon2");
const jwt = __importStar(require("jsonwebtoken"));
//use dotenv with process.env to hide api keys
const dotenv = __importStar(require("dotenv"));
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
const userApp = (0, app_1.initializeApp)(firebaseConfig);
const database = (0, firestore_1.getFirestore)(userApp);
const app = (0, express_1.default)();
app.use(express_1.default.json());
app.use((0, cors_1.default)());
app.get("/user", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    // get a list of all the users
    let userList = [];
    console.log('we getting user list now');
    const users = yield (0, firestore_1.getDocs)((0, firestore_1.collection)(database, "day29"));
    users.forEach((item) => {
        let user = item.data();
        userList.push(user);
    });
    res.send(userList);
}));
app.get("/user/:id", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    //get a single user by id
    const user = yield (0, firestore_1.getDoc)((0, firestore_1.doc)(database, "day29", req.body.id));
    console.log(user.data());
    res.send(user.data());
}));
function getUserByEmail(email) {
    return __awaiter(this, void 0, void 0, function* () {
        let userList = [];
        console.log('we user by email now');
        const users = yield (0, firestore_1.getDocs)((0, firestore_1.collection)(database, "day29"));
        users.forEach((item) => {
            let user = item.data();
            userList.push(user);
        });
        console.log(userList.find(user => user.email === email));
        return userList.find(user => user.email === email);
    });
}
app.post("/login", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const email = req.body.email;
    const password = req.body.password;
    //now match the passwords. Does the hash of the password match the hash stored in the database
    const user = yield getUserByEmail(email);
    const passwordVerified = yield (0, argon2_1.verify)(user.hashedPassword, req.body.password);
    console.log('is password verified', passwordVerified);
    if (!passwordVerified) {
        return res.status(400).send('wrong password duh');
    }
    else {
        //we need to create a valid json web token
        const token = jwt.sign({ id: user.id }, jwtKey, { expiresIn: '1800s' });
        // document.cookie=`token=${token}`;
        res.status(200).send({
            user: user,
            token: token
        });
    }
}));
app.post("/user", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    console.log('req.body--------------', req.body);
    const username = req.body.username;
    const email = req.body.email;
    const id = (0, uuid_1.v4)();
    const password = req.body.password;
    //hash password
    const hashedPassword = yield (0, argon2_1.hash)(password);
    console.log('what does a hashed password look like?', hashedPassword);
    const user = {
        username: username,
        email: email,
        id: id,
        hashedPassword: hashedPassword,
    };
    console.log('user------------', user);
    const pushUser = yield (0, firestore_1.setDoc)((0, firestore_1.doc)(database, "day29", user.id), user);
    res.send(user);
    console.log('what is pushUser', pushUser);
}));
app.put("/user/:id", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = req.body.id;
    const email = req.body.email;
    const username = req.body.username;
    const user = {
        id: id,
        email: email,
        username: username
    };
    console.log(user);
    const authHeader = req.headers['authorization'];
    if (!authHeader) {
        return res.status(400).send({ error: "no auth header, not logged in" });
    }
    const token = authHeader && authHeader.split(' ')[1];
    if (!token)
        return res.status(400).send({ error: "no token in auth header" });
    jwt.verify(token, jwtKey, (err, decodedUser) => __awaiter(void 0, void 0, void 0, function* () {
        if (err) {
            return res.status(400).send({ error: "invalid token" });
        }
        if (decodedUser.id !== req.body.id) {
            return res.status(400).send({ error: "wrong user logged in, bad id" });
        }
        const updateUser = yield (0, firestore_1.setDoc)((0, firestore_1.doc)(database, "day29", req.body.id), user, { merge: true });
        console.log(updateUser);
        res.send(user);
    }));
}));
app.listen(3999);
