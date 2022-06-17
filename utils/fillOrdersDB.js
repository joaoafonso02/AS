import fs from 'fs';

const order = []
let statusArray = ["Preparing", "Ready", "Delivering", "Delivered"]

for(let i = 0; i < 50; i++) {
    order.push({
        id: "#PT" + pad(i, 10),
        email : randomEmails() + '@gmail.com',
        date: randomDate('02/5/2022', '01/01/2022'),
        total: Math.round(Math.random() * 10000) / 100,
        status: statusArray[Math.floor(Math.random() * 4)]
    });
}

// Generates a random "Gmail"
function randomEmails() {
    var chars = 'abcdefghijklmnopqrstuvwxyz1234567890';
    var string = '';

    for(var i=0; i<7; i++){
        string += chars[Math.floor(Math.random() * chars.length)];
    }
    return string;
}

function randomDate(date1, date2){
    function randomValueBetween(min, max) {
      return Math.random() * (max - min) + min;
    }
    var date1 = date1 || '01-01-1970'
    var date2 = date2 || new Date().toLocaleDateString()
    date1 = new Date(date1).getTime()
    date2 = new Date(date2).getTime()

    if( date1>date2){
        return new Date(randomValueBetween(date2,date1)).toLocaleDateString()   
    } else{
        return new Date(randomValueBetween(date1, date2)).toLocaleDateString()  

    }
}

function pad(num, size) {
    num = num.toString();
    while(num.length < size) num = "0"  + num;
    return num;
}


const jsonString = JSON.stringify(order);
    fs.writeFile('../data/orders.json', jsonString, err => {
    if (err) {
        console.log('Error writing file', err)
    } else {
        console.log('Successfully wrote file')
    }
})