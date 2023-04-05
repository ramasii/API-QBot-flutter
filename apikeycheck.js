const apikey = require('./apikey.json');

function checkKey(client, key){
    // cek apakah parameter terpenuhi
    if(client == undefined || key == undefined){
        console.log('client or apikey undefined/wrong');
        return false
    }
    else{
        try{
            // cek apakah client dengan apikey benar
            if(key == apikey[client]['apikey']){
                console.log('true', `client: ${client}, key: ${key}`);
                return true
            }

            // jika apikey salah
            else{
                console.log('apikey salah, apikey', key);
                return false
            }
        }
        // jika client salah
        catch{
            console.log(`client salah, client: ${client}`);
            return false
        }
    }
}

module.exports = {checkKey}