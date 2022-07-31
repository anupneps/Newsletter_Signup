require('dotenv).config();

const express = require("express");
const bodyParser = require("body-parser");
const https = require("https");
const { response } = require("express");

const app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

app.get("/", (req, res) => {
    res.sendFile(__dirname + "/signup.html");
})

app.post("/", (req, res) => {
    const name = req.body.fName;
    const lName = req.body.lName;
    const email = req.body.emailAddress;

    const data = {
        members: [{
            email_address: email,
            status: "subscribed",
            merge_fields: {
                FNAME: name,
                LNAME: lName
            }

        }]
    };

    const jsonData = JSON.stringify(data);
    const url = "https://us14.api.mailchimp.com/3.0/lists/54df4dd66c";

    const options = {
        method: "POST",
        auth: process.env.APIKEY
    }


    const request = https.request(url, options, (response) => {

        if (response.statusCode === 200) {
            res.sendFile(__dirname + "/success.html");
        } else {
            res.sendFile(__dirname + "/failure.html");
        }

        response.on("data", (data) => {
            console.log(JSON.parse(data));
        });

    })

    request.write(jsonData);
    request.end();

})

app.post("/failure", (req, res) => {
    res.redirect("/");

});



app.listen(process.env.PORT || 3000, () => {
    console.log("Server is running ......");
});