import nodemailer from "nodemailer";

var transporter = nodemailer.createTransport({
  // service: 'mail.fairleadertechnologies.com',

  host: "mail.fairleadertechnologies.com",
  port: 465,
  secure: true,
  auth: {
    user: "brij@fairleadertechnologies.com",
    pass: "Welcome@1211",
  },
});

const sendEmail = ({ to, subject, text }) => {
  var mailOptions = {
    from: "brij@fairleadertechnologies.com",
    to: to,
    subject: subject,
    text: text,
  };

  transporter.sendMail(mailOptions, function (error, info) {
    if (error) {
      console.log("Not Working!! TRY SOMETHING NEW" + error);
    } else {
      console.log("Email sent: " + info.response);
    }
  });
};

export default sendEmail;
