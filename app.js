'use strict'

const express = require('express');
const bodyParser = require('body-parser');
const request = require('request');
const access_token = "EAARTkoBvVZCYBABK2aQLIeAFxZCMPE7BLH4euYwQcr28vf8I29WMDvMgpilyie20ajtGZAPXBeDeN6Vtern8VJMZAg0lhFk3diAs1ymQWwHamDyLTbMk8289uSDiwVBYQnua234d1WfcuZCiaQAzGpH1so2y3E2o6Pfaeg0EQ9QZDZD"

const app = express();

app.set('port', 5000);
app.use(bodyParser.json());

app.get('/', function(req, response){
    response.send('Hola Mundo cuadrado!');
})

app.get('/webhook', function(req, response){
    if(req.query['hub.verify_token'] === 'mrseplom_token'){
        response.send(req.query['hub.challenge']);
    } else {
        response.send('No ingreses tienes permisos.')
    }
})

//HANDEL EVENT
app.post('/webhook/', function(req, res){
    const webhook_event = req.body.entry[0];
    if(webhook_event.messaging) {
        webhook_event.messaging.forEach(event => {
            handleEvent(event.sender.id, event);
        })
    }
    res.sendStatus(200);
})

//Verificaion de code

app.listen(app.get('port'), function(){
    console.log('Nuestro servidor esta funcionando en esta xd', app.get('port'));
})


//Respuesta automatica
function handleMessage(event){
    const senderId = event.sender.id;
    const messageText = event.message.text;
    const messageData = {
        recipient: {
            id: senderId
        },
        message: {
            text: messageText
        }
    }
    callSendApi(messageData);
}


//callSendApi
function callSendApi(response) {
    request({
        "uri": "https://graph.facebook.com/me/messages",
        "qs": {
            "access_token": access_token
        },
        "method": "POST",
        "json": response
    },
    function(err) {
        if(err) {
            console.log('Ha ocurrido un error')
        } else {
            console.log('Mensaje enviado')
        }
    }
)
}

//Handle Event
function handleEvent(senderId, event){
    if(event.message){
        handleMessage(senderId, event.message)
    }else if(event.postback) {
        handlePostback(senderId, event.postback.payload)
    }
}

//get start

//function handlePostback(senderId, payload){
 //   switch (payload) {
  //      case "GET_STARTED_OLSEPLOM":
    //        console.log(payload)
      //  break;
    //}
//}

//HandleMessage
function handleMessage(senderId, event){
    if(event.text){
        messageImage(senderId);
    } else if (event.attachments) {
        handleAttachments(senderId, event)
    }
}


//Defaultmessage
function defaultMessage(senderId) {
    const messageData = {
        "recipient": {
            "id": senderId
        },
        "message": {
            "text": "Hola te saluda SEPLOM Plomería Inmediata y en breve te atenderemos.",
           
        }
    }
    senderActions(senderId);
    setTimeout(function(){  
    callSendApi(messageData); },);
}

//Sender Actions
function senderActions(senderId) {
    const messageData = {
        "recipient": {
            "id": senderId
        },
        "sender_action": "typing_on"
    }
    callSendApi(messageData);
    
}


//HANDLE POSTBACK



function handleAttachments(senderId, event) {
    let attachment_type = event.attachments[0].type;
    switch (attachment_type) {
        case "image":
            console.log(attachment_type);
            break;
    
        case "video":
            console.log(attachment_type);
            break;

        case "audio":
            console.log(attachment_type);
            break;

        case "file":
            console.log(attachment_type);
            break;
    }
}


//ContactSupport
function contactSuppport(senderId) {
    const messageData = {
        "recipient": {
            "id": senderId
        },
        "message": {
            "attachment": {
                "type": "template",
                "payload": {
                    "template_type": "button",
                    "text": "Este es el número de uno de nuestros asesores, ¿quieres llamarnos?",
                    "buttons": [ 
                        {
                            "type": "web_url",
                            "title": "WhatsApp",
                            "url": "https://wa.link/oga2dh",
                            "webview_height_ratio": "full"
                            
                        }
                    ]
                    
                }
            }
        }
    }
    callSendApi(messageData);
}




//imagnes de envio
function messageImage(senderId) {
    const messageData = {
        "recipient": {
            "id": senderId
        },
        "message": {
            "attachment": {
                "type": "image",
                "payload": {
                    "url": "https://media.giphy.com/media/1dOIvm5ynwYolB2Xlh/giphy.gif"
                }
            }
        }
    }
    callSendApi(messageData);
}



//https://seplom--app.herokuapp.com/ 