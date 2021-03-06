"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const common_1 = require("@nestjs/common");
const jwt_1 = require("@nestjs/jwt");
const user_service_1 = require("../users/user.service");
const sha256 = require("crypto-js/sha256");
const hmacSHA512 = require("crypto-js/hmac-sha512");
const Base64 = require("crypto-js/enc-base64");
const bcrypt = require("bcrypt");
let AuthService = class AuthService {
    constructor(userService, jwtService) {
        this.userService = userService;
        this.jwtService = jwtService;
    }
    async validateUser(email, password) {
        const user = await this.userService.getCustomer(email);
        if (user.length === 0) {
            throw new common_1.NotFoundException('user not found');
        }
        console.log(user[0].password);
        const isMatch = await bcrypt.compare(password, user[0].password);
        if (user && isMatch) {
            const _a = user[0], { password } = _a, rest = __rest(_a, ["password"]);
            console.log(rest);
            return rest;
        }
        return null;
    }
    async login(user) {
        console.log(user, "token time user");
        const payload = { firstname: user.firstName, lastname: user.lastName, email: user.email, sub: user.id };
        return {
            statusCode: common_1.HttpStatus.CREATED,
            message: 'User Login Success',
            access_token: this.jwtService.sign(payload),
        };
    }
    async generateToken() {
        try {
            const message = "helloiammihir";
            const nonce = "6b0c6924d25fd0783762dc4721306ac8";
            const path = "12345678";
            const privateKey = "3358bbcf0e5018e37bf8f5299254e442";
            const hashDigest = sha256(nonce + message);
            const hmacDigest = Base64.stringify(hmacSHA512(path + hashDigest, privateKey));
            console.log(hmacDigest);
        }
        catch (error) {
            console.log(error);
        }
    }
};
AuthService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [user_service_1.CustomerService, jwt_1.JwtService])
], AuthService);
exports.AuthService = AuthService;
//# sourceMappingURL=auth.service.js.map