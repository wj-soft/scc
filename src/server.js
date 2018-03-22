const express = require("express")
const bodyParser = require("body-parser")
const morgan = require("morgan")
const Blockchain = require("./blockchain")

const { getBlockchain, createNewBlock } = Blockchain;

const PORT = 3000;

const app = express();

app.use(bodyParser.json());
app.use(morgan("combined"));
app.listen(PORT, ()=> console.log("서버 실행 중", PORT));
