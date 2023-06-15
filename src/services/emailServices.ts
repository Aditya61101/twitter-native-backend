import { SESClient, SendEmailCommand } from "@aws-sdk/client-ses";

const ses = new SESClient({
    region: "us-east-1",
});
function createSendEmailCommand(toAddress: string, fromAddress: string, message: string) {
    return new SendEmailCommand({
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
export async function sendEmailToken(email: string, token: string) {
    try {
        const message = `Your OTP for login is ${token}`;
        const command = createSendEmailCommand(email, "adityakumarsanni.2001@gmail.com", message);
        return await ses.send(command);
    } catch (error) {
        console.log(error);
        return error;
    }
}