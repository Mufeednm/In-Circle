"use strict";
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
exports.googleLogin = exports.login = exports.registration = void 0;
const user_model_1 = __importDefault(require("../user/user.model"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const dotenv_1 = __importDefault(require("dotenv"));
const google_auth_library_1 = require("google-auth-library");
dotenv_1.default.config();
const registration = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { name, email, password, } = req.body;
    if (!name || !email || !password) {
        return res.status(404).json({ message: 'Please requird ' });
    }
    const existingUser = yield user_model_1.default.findOne({ email });
    if (existingUser) {
        return res.status(400).json({ message: "Email already exists" });
    }
    const salt = yield bcrypt_1.default.genSalt(10);
    const hashedPassword = yield bcrypt_1.default.hash(password, salt);
    const newUser = new user_model_1.default({
        name,
        email,
        password: hashedPassword,
    });
    yield newUser.save();
    return res.status(201).json({
        message: "User registered successfully",
        data: {
            user: newUser,
        },
    });
});
exports.registration = registration;
const login = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password, } = req.body;
    if (!email || !password) {
        return res.status(404).json({ message: 'Please requird ' });
    }
    const user = yield user_model_1.default.findOne({ email });
    if (!user) {
        return res.status(400).json({ message: "User not found" });
    }
    const validpassword = bcrypt_1.default.compareSync(password, user.password);
    if (!validpassword) {
        return res.status(400).json({ message: "Password is wrong" });
    }
    const token = jsonwebtoken_1.default.sign({ id: user === null || user === void 0 ? void 0 : user._id }, process.env.JWT_SECRET_USER, {
        expiresIn: "1h",
    });
    return res.status(200).json({ message: "Password is correct",
        data: {
            token: token,
            userid: user.id,
            email: user.email
        }
    });
});
exports.login = login;
//
const client = new google_auth_library_1.OAuth2Client(process.env.GOOGLE_CLIENT_ID);
const googleLogin = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { token } = req.body;
    const ticket = yield client.verifyIdToken({
        idToken: token,
        audience: process.env.GOOGLE_CLIENT_ID,
    });
    console.log(ticket.getPayload(), "log ticket");
    const { email, name } = ticket.getPayload();
    let user = yield user_model_1.default.findOne({ email });
    if (!user) {
        user = new user_model_1.default({ email, name: name });
        yield user.save();
    }
    const JWttoken = jsonwebtoken_1.default.sign({ id: user === null || user === void 0 ? void 0 : user._id }, process.env.JWT_SECRET_USER, {
        expiresIn: "1h",
    });
    res.status(200).json({ message: "from backend google auth",
        token: JWttoken,
        user,
    });
});
exports.googleLogin = googleLogin;
