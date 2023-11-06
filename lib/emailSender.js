import nodemailer from "nodemailer";

/**
 *
 * @param {string} recipient
 * @param {string} title
 * @param {string} sub_title
 * @param {string} message
 */
export const sendEmailCustom = (recipient, title, sub_title, message) => {
    const options = {
        from: "support <support@desipher.io>",
        to: recipient,
        subject: title,
        html: `
        <html>
        <head>
          <style>
            #body {
                margin: 0;
                font-family: Roboto,RobotoDraft,Helvetica,Arial,sans-serif;
            }
            .content {
                display: table;
                margin: 0 auto;
                padding: 10px;
                width: auto;
            }
            .logo {
                font-size: 30px;
                text-align: center;
                color: #3666d6;
                font-weight: bold;
            }
            .subject {
                font-size: 14px;
                font-weight: bold;
                color: #3666d6;
                text-transform: uppercase;
                margin-top: 50px;
            }
            .title {
                font-size: 32px;
                font-weight: bold;
                margin-top: 10px;
                color: black!important;
            }
            .description {
                font-size: 16px;
                line-height: 26px;
                font-weight: 300;
                margin-top: 20px;
                color: black!important;
            }
            .button-wrapper {
                padding: 50px;
            }
            .button {
                border-radius: 5px;
                padding: 8px 12px;
                line-height: 40px;
                font-size: 20px;
                font-weight: 600;
                font-weight: bold;
                color: #fff!important;
                background-color: #3666d6;
                text-align: center;
            }
          </style>
        </head>
        <body>
            <div class="content">
                <div class="logo">DESIPHER</div>
                <div class="subject">${title}</div>
                <div class="title">${sub_title}</div>
                <div class="description">
                    <div style="margin-bottom:10px">Hey ${recipient},</div>
                        ${message}
                    </div>
                </div>
            </div>
        </body>
      </html>
        `,
    };
    return;
    // mailer.sendMail(options, (error, info) => {
    //     if (error) console.log(error);
    //     else console.log("Email Sent: ", info.response);
    // });
};

/**
 * @description This function sends emails to the recipient with the message
 * @param {String} recipient
 * @returns {void}
 */
export const sendEmail = (
    recipient,
    message = {
        user: "",
        website: "",
        token: "",
    }
) => {
    const options = {
        from: "support <support@desipher.io>",
        to: recipient,
        subject: "Desipher Password Reset",
        html: `
        <html>
        <head>
          <style>
            #body {
                margin: 0;
                font-family: Roboto,RobotoDraft,Helvetica,Arial,sans-serif;
            }
            .content {
                display: table;
                margin: 0 auto;
                padding: 10px;
                width: auto;
            }
            .logo {
                font-size: 30px;
                text-align: center;
                color: #3666d6;
                font-weight: bold;
            }
            .subject {
                font-size: 14px;
                font-weight: bold;
                color: #3666d6;
                text-transform: uppercase;
                margin-top: 50px;
            }
            .title {
                font-size: 32px;
                font-weight: bold;
                margin-top: 10px;
                color: black!important;
            }
            .description {
                font-size: 16px;
                line-height: 26px;
                font-weight: 300;
                margin-top: 20px;
                color: black!important;
            }
            .button-wrapper {
                padding: 50px;
            }
            .button {
                border-radius: 5px;
                padding: 8px 12px;
                line-height: 40px;
                font-size: 20px;
                font-weight: 600;
                font-weight: bold;
                color: #fff!important;
                background-color: #3666d6;
                text-align: center;
            }
          </style>
        </head>
        <body>
            <div class="content">
                <div class="logo">DESIPHER</div>
                <div class="subject">Password Reset</div>
                <div class="title">Password Reset Received</div>
                <div class="description">
                    <div style="margin-bottom:10px">Hey ${message.user},</div>
                        Your Desipher password can be reset by clicking the link below. If you did not request a new password, please ignore this email.<br>
                        <a href="${message.website}/reset?token=${message.token}">Reset Your Password</a>
                    </div>
                </div>
            </div>
        </body>
      </html>

        `,
    };
    return;
};
