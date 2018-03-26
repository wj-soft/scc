const WebSockets = require("ws");
  Blockchain = require("./blockchain")

const { getLastBlock } = Blockchain;

const sockets = [];

const GET_LATEST = "GET-LASTEST";
const GET_ALL = "GET_ALL";
const BLOCKCHAIN_RESPONSE = "BLOCKCHAIN_RESPONSE";

const getLatest = () => {
  return {
    type: GET_LATEST,
    data: null
  };
};

const getAll = () => {
  return {
    type: GET_ALL,
    data: null
  };
};

const blockchainResPonse = (data) => {
  return {
    type: BLOCKCHAIN_RESPONSE,
    data
  }
}

const getSockets = () => sockets;

const startP2PServer = server => {
  const wsServer = new WebSockets.Server({server});
  wsServer.on("connection", ws => {
    console.log(`Hello ${ws}`)
    initSocketConnection(ws);
  });
  console.log("p2p server running")
};

const initSocketConnection = ws =>{
  sockets.push(ws);
  handleSocketMessages(ws);
  handleSocketError(ws);
  sendMessage(ws, getLatest());
};
const parseData = data => {
  try{
    return JSON.parse(data)
  }catch(e){
    console.log(e)
    return null;
  }
}
const handleSocketMessages = ws => {
  ws.on("message", data => {
    const message = parseData(data);
    if(message === null){
      return
    }
    console.log(message);
    switch(message.type){
      case GET_LATEST:
        sendMessage(ws, getLastBlock());
        break;
    }
  })
}

const sendMessage = (ws, message) => ws.send(JSON.stringify(message))

const handleSocketError = ws => {
  const closeSocketConnection = ws => {
    ws.close()
    sockets.splice(sockets.indexOf(ws), 1);
  };
  ws.on("cloose", () => closeSocketConnection(ws));
  ws.on("error", () => closeSocketConnection(ws));
}

const connectToPeers = newPeer => {
  const ws = new WebSockets(newPeer);
  ws.on("open", ()=> {
    initSocketConnection(ws)

  })
}

module.exports ={
  startP2PServer,
  connectToPeers
}