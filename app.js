const express = require("express")
const bodyParser = require("body-parser")
const mailchimp = require("@mailchimp/mailchimp_marketing");


const app = express()

//static file (css / img)
app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }))

//mailchimp API

// KEY 60ddf32ea34facd0fcba20dbda6c0cb3-us14
// list id 24f08cd023

mailchimp.setConfig({
    apiKey: "60ddf32ea34facd0fcba20dbda6c0cb3-us14",
    server: "us14",
});


// ROUTES 

app.get("/", (req, res) => {
    res.sendFile(__dirname + "/signup.html")
})


app.post("/", (req, res) => {

    const lastName = req.body.lastName
    const firstName = req.body.firstName
    const email = req.body.email


    const run = async () => {
        try {
            const response = await mailchimp.lists.addListMember("24f08cd023", {
                email_address: email,
                status: "subscribed",
                merge_fields: {
                    FNAME: firstName,
                    LNAME: lastName
                }
            });
            console.log(response);
            res.sendFile(__dirname + "/success.html");

        } catch (err) {
            console.log(err.status);
            res.sendFile(__dirname + "/failure.html");
        }

    };

    run();

})



app.listen(process.env.PORT || 3000, () => {
    console.log("server running ")
}) 