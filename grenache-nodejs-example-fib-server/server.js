'use strict'

const { PeerRPCServer } = require('grenache-nodejs-ws')
const Link = require('grenache-nodejs-link')

const link = new Link({
    grape: 'http://127.0.0.1:30001'
})

//================================================================================================
//                                  LOGIC
//================================================================================================
//utility funciton for reading from text file
function read_text_file(songname){
    //exposing the FileReader webAPI
    var fs = require("fs");
    try{
        var textByLine = fs.readFileSync('songlyrics/'+songname+'.txt', 'utf8');
        return textByLine;
    }catch(err){
        return "FILE NOT FOUND";
    }
}

//Main server function
function songlyrics(songname){
    var song_data = read_text_file(songname);
    return song_data;
}

//-------------------------------------SET UP LINK----------------------------------------------------
link.start()

const peer = new PeerRPCServer(link, {})
peer.init()

const service = peer.transport('server')
service.listen(1337)

setInterval(() => {
    link.announce('songlyrics_worker', service.port, {})
}, 1000)

service.on('request', (rid, key, payload, handler) => {
    const result = songlyrics(payload.songname)
    handler.reply(null, result)
})

