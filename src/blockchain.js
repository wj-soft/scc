const CryptoJS = require("crypto-js");

class Block {
  constructor(index, hash, previousHash, timestamp, data){
    this.index = index;
    this.hash = hash;
    this.previousHash = previousHash;
    this.timestamp = timestamp;
    this.data = data;
  }
}
//hash (http://passwordsgenerator.net/sha256-hash-generator/)
const genesisBlock = new Block(
  0,
  "B71893FBD0048A2C8B27B9E7108ED788410F8FC4DF8A159BAA6061B867D2EC8A",
  null,
  1520419204194,
  "This is the genesis"
);

//블록체인 : 블록의 배열

let blockchain = [genesisBlock];

const getLastBlock = () => {
  return blockchain[blockchain.length-1];
};

const getTimeStamp = () => {
  return new Date().getTime() / 1000;
};

const getBlockchain = () => {
  return blockchain;
}

const createHash = (index, previousHash, timestamp, data) => {
  return CryptoJS.SHA256(index + previousHash + timestamp + JSON.stringify(data).toString());
};

const createNewBlock = (data) =>{
  const previousBlock = getLastBlock();
  const newBlockIndex = previousBlock.index +1;
  const newTimestame = getTimeStamp();
  const newHash = createHash(newBlockIndex, previousBlock.hash, newTimestame, data);
  const newBlock = new Block(
    newBlockIndex,
    newHash,
    previousBlock.hash,
    newTimestame,
    data
  );
  addBlockToChain(newBlock);
  return newBlock;
};

const getBlockHash = (block) => {
  return createHash(block.index, block.previousHash, block.timestamp, block.date);
}

const isNewBlockValid = (candidateBlock, latestBlock) =>{
  if(!isNewStructureValid(candidateBlock)){
    console.log("The candidate block structur is not valid")
    return false;
  } else if(latestBlock.index +1 !== candidateBlock.index){
    console.log("The candidate block doesnt have a valid index")
    return false;
  } else if(latestBlock.hash !== candidateBlock.previousHash){
    console.log("The previousHash of the candidate block is not the hash of the latest block");
    return false;
  } else if(getBlockHash() !== candidateBlock.hash){
    console.log("The hash of this block is invalid");
    return false;
  }
  return true;
}

const isNewStructureValid = (block) => {
  return (
    typeof block.index === 'number' && 
    typeof block.hash === "string" && 
    typeof block.timestamp == "number" && 
    typeof block.data === "string"
  );
};

const isChainValid = (candidateChain) =>{
  const isGenesisValid = (block)=> {
    return JSON.stringify(block) === JSON.stringify(genesisBlock);
  };
  if(!isGenesisValid(candidateChain[0])){
    console.log("The candidateChains`s genesisBlock is not the same as our genesisBlock");
    return false
  }
  for(let i = 1; i < candidateChain.length; i++){
    if(!isNewBlockValid(candidateChain[i], candidateChain[i-1])){
      return false;
    }
  }
  return true;
};

const replaceChain = (candidateChain) => {
  if(isChainValid(newChain) && newChain.length > getBlockchain().length){
    blockchain = newChain;
    return true;
  } else {
    return false;
  }
};

const addBlockToChain = (candidateBlock) => {
  if(isNewBlockValid(newBlock, getLastBlock())){
    getBlockchain().push(candidateBlock);
    return true;
  } else{
    return false;
  }
}

module.exports = {
  getBlockchain,
  createNewBlock
}