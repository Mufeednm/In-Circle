"use strict";
//user signup
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
exports.login = exports.registration = void 0;
const user_model_1 = __importDefault(require("../../modules/user/user.model"));
const bcrypt_1 = __importDefault(require("bcrypt"));
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
    const validUser = yield user_model_1.default.findOne({ email });
    if (!validUser) {
        return res.status(400).json({ message: "User not found" });
    }
    const validpassword = bcrypt_1.default.compareSync(password, validUser.password);
    if (!validpassword) {
        return res.status(400).json({ message: "Password is wrong" });
    }
    return res.status(200).json({ message: "Password is correct" });
});
exports.login = login;
