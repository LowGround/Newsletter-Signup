const express = require('express');
const bodyParser = require('body-parser');

const app = express();

app.use(bodyParser.urlencoded({extended: true}));

//the static method tells the computer that the statqic files are in the public folder
app.use(express.static("public"));

app.get('/', function(req, res){
    res.sendFile(__dirname + '/signup.html')
})

app.post('/', function(req, res){
    const firstName = req.body.fName;
    const lastName = req.body.lName;
    const email = req.body.email;
    const https = require('https');

    let data = {
        members: [
            {
                email_address: email,
                status: 'subscribed',
                merge_fields: {
                    FNAME: firstName,
                    LNAME: lastName
                }
            }
        ]
    };
    // we are packing the data into a json string that we will send to the mailchimp servers
    const jsonData = JSON.stringify(data);
    //add the list id to the end of the url so that we can identify our audience in the mailchimp servers
    const url =  "https://us1.api.mailchimp.com/3.0/lists/8af09e37c0";  
    const options = {
        method: "POST",
        auth: "Eddie1:ca80995e38e9fae9d89accca5fe5e25e-us1"
    }
    const request = https.request(url, options, function(response){
        response.on('data', function(data){
            console.log(JSON.parse(data));
        })

        if (response.statusCode === 200) {
            res.sendFile(__dirname + '/success.html')
        } else if (response.statusCode != 200) {
            res.sendFile(__dirname + '/failure.html')
        }
    })
    
    // request.write(jsonData);
    request.end();
})

// another POST request for our failure route
app.post('/failure', function(req, res){
    res.redirect("/")
})

// api key: ca80995e38e9fae9d89accca5fe5e25e-us1
// list/audience id: 8af09e37c0

app.listen(process.env.PORT || 3000, function() {
    console.log('running on port 3000');
})


// IMPORTANT: WE NEED THE PROCFILE SO THAT HEROKU CAN KNOW HOW TO RUN OUR APP