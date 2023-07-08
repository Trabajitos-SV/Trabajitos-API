const { MailtrapClient } = require('mailtrap');

const TOKEN = process.env.EMAIL_PASSWORD;
const ENDPOINT = process.env.EMAIL_ENDPOINT;
const SENDER_EMAIL = process.env.EMAIL_SENDER;

const client = new MailtrapClient({ endpoint: ENDPOINT, token: TOKEN });

const sender = { name: "Trabajitos Support", email: SENDER_EMAIL };

const sendEmailv2 = async (recipientMail, code) => {
    client
        .send({
            from: sender,
            to: [{ email: recipientMail }],
            template_uuid: "501a7b62-4b0c-44c2-b040-28c781bdffb8",
            template_variables: {
                user_email: recipientMail,
                code: code
            },
        })
        .then(console.log, console.error);
}

module.exports = sendEmailv2;