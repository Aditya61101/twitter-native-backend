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
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendEmailToken = void 0;
const client_ses_1 = require("@aws-sdk/client-ses");
const ses = new client_ses_1.SESClient({
    region: "us-east-1",
});
function createSendEmailCommand(toAddress, fromAddress, message) {
    return new client_ses_1.SendEmailCommand({
        Destination: {
            ToAddresses: [toAddress]
        },
        Source: fromAddress,
        Message: {
            Subject: {
                Charset: "UTF-8",
                Data: "Your OTP for login to twitter-native is here"
            },
            Body: {
                Text: {
                    Charset: "UTF-8",
                    Data: message
                }
            }
        }
    });
}
function sendEmailToken(email, token) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const message = `Your OTP for login is ${token}`;
            const command = createSendEmailCommand(email, "adityakumarsanni.2001@gmail.com", message);
            return yield ses.send(command);
        }
        catch (error) {
            console.log(error);
            return error;
        }
    });
}
exports.sendEmailToken = sendEmailToken;
