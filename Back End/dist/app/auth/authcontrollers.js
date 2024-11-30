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
exports.registration = void 0;
const user_model_1 = __importDefault(require("../../modules/user/user.model"));
const registration = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { username, email, password, bio, profilePicture } = req.body;
    const existingUser = yield user_model_1.default.findOne({ email });
    if (existingUser) {
        return res.status(400).json({ message: "Email already exists" });
    }
    const existingUsername = yield user_model_1.default.findOne({ username });
    if (existingUsername) {
        return res.status(400).json({ message: "Username already exists" });
    }
    const salt = yield bcrypt.genSalt(10);
    const hashedPassword = yield bcrypt.hash(password, salt);
    const newUser = new user_model_1.default({
        username,
        email,
        password: hashedPassword,
        bio,
        profilePicture,
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
