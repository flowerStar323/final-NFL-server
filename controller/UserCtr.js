'use strict';

const UserModel = require("../models/UserModel");
const ActionModel = require("../models/ActionModel");
// Set your secret key. Remember to switch to your live secret key in production.
// See your keys here: https://dashboard.stripe.com/apikeys
const stripe = require('stripe')('sk_test_51JNpgZDBj7KAGNwd6DfswotYbx53o8WOtTZoTKJmWSh0H6WdapZLa4y3Yd4IdH3pvQB3tVVbfiVRNorU2wQ7mfXc00Z76V8mUH');
const jwt = require("jsonwebtoken");
const path = require('path')
var aws = require('aws-sdk');

// Provide the full path to your config.json file. 
// process.env.HOME + '/.ec2/credentials.json';
const dirPath = path.join(__dirname, '../config/aws.json')

console.log(dirPath)
aws.config.loadFromPath(dirPath);
// aws.config.loadFromPath('../config/aws.json');

const SendEmail = () => {
  // Replace sender@example.com with your "From" address.
  // This address must be verified with Amazon SES.
  const sender = "Ted Ibarra <workdevcreator@gmail.com>";

  // Replace recipient@example.com with a "To" address. If your account 
  // is still in the sandbox, this address must be verified.
  const recipient = "yammt.dev@gmail.com";

  // Specify a configuration set. If you do not want to use a configuration
  // set, comment the following variable, and the 
  // ConfigurationSetName : configuration_set argument below.
  const configuration_set = "ConfigSet";

  // The subject line for the email.
  const subject = "Amazon SES Test (AWS SDK for JavaScript in Node.js)";

  // The email body for recipients with non-HTML email clients.
  const body_text = "Amazon SES Test (SDK for JavaScript in Node.js)\r\n"
    + "This email was sent with Amazon SES using the "
    + "AWS SDK for JavaScript in Node.js.";

  // The HTML body of the email.
  const body_html = `<html>
    <head></head>
    <body>
    <h1>Amazon SES Test (SDK for JavaScript in Node.js)</h1>
    <p>This email was sent with
      <a href='https://aws.amazon.com/ses/'>Amazon SES</a> using the
      <a href='https://aws.amazon.com/sdk-for-node-js/'>
      AWS SDK for JavaScript in Node.js</a>.</p>
    </body>
    </html>`;

  // The character encoding for the email.
  const charset = "UTF-8";

  // Create a new SES object. 
  var ses = new aws.SES();

  // Specify the parameters to pass to the API.
  var params = {
    Source: sender,
    Destination: {
      ToAddresses: [
        recipient
      ],
    },
    Message: {
      Subject: {
        Data: subject,
        Charset: charset
      },
      Body: {
        Text: {
          Data: body_text,
          Charset: charset
        },
        Html: {
          Data: body_html,
          Charset: charset
        }
      }
    },
    ConfigurationSetName: configuration_set
  };

  console.log(params)

  //Try to send the email.
  ses.sendEmail(params, function (err, data) {
    // If something goes wrong, print an error message.
    if (err) {
      console.log(err.message);
    } else {
      console.log("Email sent! Message ID: ", data.MessageId);
    }
  });
}

exports.ChargeEntry = async (req, res) => {
  // Token is created using Stripe Checkout or Elements!
  // Get the payment token ID submitted by the form:
  const { id, token, amount, description } = req.body; // Using Express

  const charge = await stripe.charges.create({
    amount: parseFloat(amount),
    currency: 'usd',
    description,
    source: token,
  });

  if (charge) {
    UserModel.findById(id, 'countANDpay').then(e => {
      const newArr = e.countANDpay.concat({
        "count": amount > 2500 ? 7 : (amount > 1000 ? 3 : 1),
        "pay": amount
      })

      UserModel.findByIdAndUpdate(id, { countANDpay: newArr })
        .then(user => {
          const payload = {
            id: user._id,
            email: user.email,
            pass: user.password,
            name: user.name,
            countANDpay: user.countANDpay,
            status: user.status,
            role: user.role
          };

          jwt.sign(
            payload,
            'secret',
            { expiresIn: '1h' },
            (err, token) => {
              if (err) throw err;
              res.json({ token });

            }
          )
        })
        .catch(er => console.log(er));;
    });
  }
}
exports.getUser = (req, res) => {
  UserModel.find({ role: 'user' }).then(e => res.json(e)).catch(er => console.log(er));
}
exports.getAction = (req, res) => {
  ActionModel.findById(req.body.id).then(e => res.json(e)).catch(er => console.log(er));
}
exports.EditUser = (req, res) => {
  UserModel.findById(req.body.id).then(e => {
    e.email = req.body.email;
    e.name = req.body.name;
    e.save().then(ee => res.json(ee)).catch(es => console.log(es));
  }).catch(er => console.log(er));
}
exports.actionUser = (req, res) => {
  ActionModel.findOne({ userID: req.body.userID, weekNo: req.body.weekNum, entryname: req.body.entryname }).then(e => {
    if (e) {
      e.selectTeamNo = req.body.id;
      e.save().then(ee => res.json("update")).catch(es => console.log(es));
    } else {
      new ActionModel({
        selectTeamNo: req.body.id,
        userID: req.body.userID,
        entryname: req.body.entryname,
        weekNo: req.body.weekNum
      })
        .save()
        .then(v => res.json("add"))
        .catch(err => console.log(err));
    }
  }).catch(er => console.log(er));
}
exports.DeleteUser = (req, res) => {
  UserModel.findById(req.body.id).then(e => {
    e.status = req.body.flag === "del" ? 2 : 1;
    e.save().then(resa => res.json(resa)).catch(err => console.log(err))
    // e.countANDpay.push({ count: 3, pay: 50 });
    // e.save().then();
  }).catch(er => console.log(er));

}
exports.registerUser = (req, res) => {
  UserModel.findOne({ email: req.body.email })
    .then(e => {
      if (e) res.status(400).json("already exists.");
      else {
        new UserModel({
          email: req.body.email,
          name: req.body.name,
          password: req.body.password
        })
          .save()
          .then(e => res.json(e))
          .catch(err => console.log(err))
      }
    })
    .catch(er => console.log(er));
}

exports.forgotPass = (req, res) => {
  SendEmail();
}

exports.loginUser = (req, res) => {
  const { email, password } = req.body;
  UserModel.findOne({ email }).then(user => {
    if (user) {
      if (user.status == 1 || user.status == 2) {
        res.status(400).json("You can't login in this site.")
      }
      else if (user.password != password) {
        res.status(400).json("incorrect password")
      }
      const payload = {
        id: user._id,
        email: user.email,
        pass: user.password,
        name: user.name,
        countANDpay: user.countANDpay,
        status: user.status,
        role: user.role
      };
      jwt.sign(
        payload,
        'secret',
        { expiresIn: '1h' },
        (err, token) => {
          if (err) throw err;
          res.json({ token });

        }
      )
    } else {
      res.status(400).json("not exists.");
    }
  }).catch(err => console.log(err));
}
exports.editprofile = (req, res) => {
  UserModel.findOne({ email: req.body.email }).then(e => {
    if (e) {
      e.name = req.body.name;
      e.password = req.body.password;
      e.save().then(e => res.json(e)).catch(er => console.log(er))
    }
  }).catch(err => console.log(err))
}