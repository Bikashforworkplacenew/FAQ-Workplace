var GoogleSpreadsheet = require('google-spreadsheet');
var creds = require('./client_secret.json')

var tag = "";
var meaning = "";
var know_more = "";
var related_links = "";
var eachRow = new Map();
var rowsval;


require('dotenv').config();


var doc = new GoogleSpreadsheet(process.env.Google_sheet_bot_queries);
var newquerydoc = new GoogleSpreadsheet(process.env.Google_sheet_new_queries);
var AdminworkplaceId = process.env.Admin_workplace_id;


module.exports = function (graph_api) {

    //Get messages sent to the bot by the user
    module._getMessages = function (req) {
        let msgs = [],
            data = req.body;
        // Make sure this is a page subscription
        if (data.object == 'page') {
            for (let pageEntry of data.entry) {
                for (let messagingEvent of pageEntry.messaging) {
                    if (messagingEvent.message) msgs.push(messagingEvent);
                }
            }
        }
        return msgs;
    }

    //Handle received message
    module._handleMessage = function (message) {


        let senderID = message.sender.id;
        doc.useServiceAccountAuth(creds, function (err) {

            // Get all of the rows from the spreadsheet.
            doc.getRows(1, function (err, rows) {
                console.log("console message")
                rows.forEach(function (rowValue) {
                    eachRow.set(rowValue.tag, rowValue.index)
                    rowsval = rows;
                })
            });
        });

        var incoming_message = message.message.text
        console.log(incoming_message)

        if (incoming_message.includes("Hey") || incoming_message.includes("Hello") || incoming_message.includes("Hi")) {
            this._sendMessage(senderID, "Hello !! I am the Help Bot. Please type any term that you dont know off and I can help you get more information on it :) ");

            console.log()
        } else if (incoming_message.length > 0) {

            if (incoming_message.length < 3) {

                this._sendMessage(senderID, "Sorry your message is too short for me to understand , please ensure input message spuld at least be 3 or more letters");


            } else {

                var each_word= incoming_message.split(" ");



                if (eachRow.has(incoming_message)) {
                    console.log('item present in index ' + eachRow.get(incoming_message))
                    index = eachRow.get(incoming_message) - 1;
                    tag = rowsval[index].tag;
                    meaning = rowsval[index].meaning;
                    know_more = rowsval[index].def;
                    related_links = rowsval[index].more;

                    this._sendMessage(senderID, "Hey !! You want to know about  " + incoming_message + ". I can help with you that :)" + incoming_message + " is " + meaning + ". " + know_more + " . You can read more about it in this link :  " + related_links);
                } else {
                    this._sendMessage(senderID, "Sorry I did not find that one , But dont worry I have sent it to the admin for review. It will be updated soon. ");

                    this._sendMessage(AdminworkplaceId, "Hey Admin!! The Help bot just got a question called : " + incoming_message + "  \n which it does not know the answer for. Can you update the sheet with the meaning ?  \n Quick link : https://docs.google.com/spreadsheets/d/1D7CvKvJ0o6Wy8ZxZx3Oj4RfwqUaVBs-ueWC6xWZ9-_8/edit#gid=0 .. \n Dont worry if you want" +
                        "to do it later , i have saved the query here : https://docs.google.com/spreadsheets/d/1tHDGG321U79-kzzE1OMQ17fi-OXcbJdnxv5FzVEztfU/edit#gid=0");


                    newquerydoc.useServiceAccountAuth(creds, function (err) {
                        newquerydoc.addRow(1, {tag: incoming_message}, function (err) {
                            if (err) {
                                console.log(err);
                            }
                        });

                    });

                }

            }


        }


    }

    //Send message from the bot to the user
    module._sendMessage = function (recipientId, text) {
        let messageData = {
            recipient: {
                id: recipientId
            },
            message: {
                text: text,
                metadata: 'DEVELOPER_DEFINED_METADATA'
            }
        };
        graph_api._callSendAPI(messageData);
    }

    return module;

}
