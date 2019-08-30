var GoogleSpreadsheet = require('google-spreadsheet');
var creds = require('./client_secret.json');


require('dotenv').config();

// Create a document object using the ID of the spreadsheet - obtained from its URL.
//var doc = new GoogleSpreadsheet('1D7CvKvJ0o6Wy8ZxZx3Oj4RfwqUaVBs-ueWC6xWZ9-_8');


var doc = new GoogleSpreadsheet('1tHDGG321U79-kzzE1OMQ17fi-OXcbJdnxv5FzVEztfU');

console.log(process.env.Google_sheet)

// Authenticate with the Google Spreadsheets API.
doc.useServiceAccountAuth(creds, function (err) {


    doc.getRows(1, function (err, rows) {
        //console.log(rows);


         var eachRow = new Map();
        //
         rows.forEach(function (rowValue) {
             eachRow.set(rowValue.tag, rowValue.index)
         })


        // var eachRow = rows.map(rowValue => rowValue.acronym, );
        //
        // console.log(eachRow)


        if(eachRow.has('PSM')){
            console.log('item present in index ' + eachRow.get('PSM'))
            // console.log('Here is you r data' + rows[(eachRow.get('PSM'))-1].meaning)
        }
        else{
            console.log('item not present')
        }


        // console.log(rows[0].acronym);

        index=eachRow.get('PSM')-1;

        // console.log(rows[index].meaning);
        // console.log(rows[index].def);
        // console.log(rows[index].more);


        doc.addRow(1, { acronym: 'Agnew' }, function(err) {
            if(err) {
                console.log(err);
            }
        });

    });
 });

