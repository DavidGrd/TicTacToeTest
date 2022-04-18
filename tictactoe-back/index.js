const ENDPOINT = '3t0hp0ybrb.execute-api.us-east-1.amazonaws.com/production'
const AWS = require('aws-sdk')
const client = new AWS.ApiGatewayManagementApi({ endpoint: ENDPOINT});

//var pour le chat
const names ={};

//var pour le jeu
const players = [];
const status = [Array(9).fill(null)];
const stepNumber = 0

//envoie d'une message via le websocket à un des id log dessus
const sendToOne = async (id,body) =>{
    try {
        await client.postToConnection({
            'ConnectionId':id,
            'Data':Buffer.from(JSON.stringify(body))
        }).promise();
    }
    catch(err){
        console.log(err)
    }
    
};

//envoie à tous
const sendToAll = async (ids,body) =>{
    const all = ids.map(i=> sendToOne(i,body));
    return Promise.all(all);
    
};


exports.handler = async (event) => {
    
    if(event.requestContext){
        
        const connectionId = event.requestContext.connectionId;
        const routeKey = event.requestContext.routeKey;
        let body = {}
        try {
            if(event.body){
                body = JSON.parse(event.body)
            }
        }
        catch(err){
            
        }
        
        switch(routeKey){
            case '$connect':
                break;
            case '$disconnect': //delete le user et renvoie la nouvelle liste de gens connectés
                await sendToAll(Object.keys(names), {systemMessage: `${names[connectionId]} has left the chat`})
                delete names[connectionId]
                await sendToAll(Object.keys(names), {members: Object.values(names)})
                break;
            case 'setName': // ajout d'un nouveau user et envoie la nouvelle liste de gens connectés
                names[connectionId] = body.name;
                await sendToAll(Object.keys(names), {members: Object.values(names)})
                await sendToAll(Object.keys(names), {systemMessage: `${names[connectionId]} has joined the chat`})
                break;
            case 'sendPublic': 
                await sendToAll(Object.keys(names), {publicMessage: `${names[connectionId]}: ${body.message}`})
                break;
            case 'sendPrivate':
                const to = Object.keys(names).find(key => names[key] === body.to)
                await sendToOne(to, {privateMessage: `${names[connectionId]}: ${body.message}`})
                break;
            case '$default':
                break;
            case 'connectGame': //connection à une instance de jeu, renvoie la liste des joueurs
                players.push(connectionId);
                const tab = Object.keys[names]
                players.map(i => tab.push(i))
                await sendToAll(tab, {players: players})
                break;
            case 'disconnectGame':
                players = [];
                status = [Array(9).fill(null)];
                break;
            case 'played': // maj des états du jeu pour rendre l'affichage a tous ceux sur la page
                status = body.status;
                stepNumber = body.stepNumber;
                const tab2 = Object.keys[names];
                players.map(i => tab2.push(i));
                await sendToAll(tab2, {status: status, stepNumber: stepNumber});
                break;
                
        }
    }
    
    // TODO implement
    const response = {
        statusCode: 200,
        body: JSON.stringify('Hello from Lambda!'),
    };
    return response;
};
