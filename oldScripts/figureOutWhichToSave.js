
const Web3 = require("web3");
var fs = require('fs');

var abi = JSON.parse(fs.readFileSync("./abi.json"));
var config = JSON.parse(fs.readFileSync("./config.json"));

var projectID = config.projectID
var mainnet = config.ethNodeURL
var realNet = config.contractAddress

let web3 = new Web3(
  new Web3.providers.WebsocketProvider(mainnet + projectID)
);

const instance = new web3.eth.Contract(abi, realNet);

var idsOfDooggiesToSave = JSON.parse(fs.readFileSync("./data/OGDooggiesToSave.json"));
async function fullSend() {
    var dooggiesToSave = []
    // for(var index = 1; index < 10000; index++) {
    //     var dooggiesToLookAt = idsOfDooggiesToSave[index]
    //     if(dooggiesToLookAt == null || dooggiesToLookAt == undefined) { continue }

        // var hasAny = await instance.methods
        // .balanceOf(
        //     config.currentDevPublicAddress,
        //     idsOfDooggiesToSave[index]
        // )
        // .call()
        // if(hasAny != 0) {
        //     console.log("Saving " + index)
        //     dooggiesToSave.push({
        //         dooggiesNum: index,
        //         dooggiesId: idsOfDooggiesToSave[index]
        //     })
        // }
    // }
    // fs.writeFileSync("./data/DooggiesToSaveConfirm.json", JSON.stringify(dooggiesToSave))
    // console.log("Yeeeet")
    for(var index = 0; index < idsOfDooggiesToSave.length; index++) {
        var dooggiesToLookAt = idsOfDooggiesToSave[index].dooggiesId
        if(dooggiesToLookAt == null || dooggiesToLookAt == undefined) { continue }
            console.log("Saving " + index)
            dooggiesToSave.push({
                dooggiesNum: idsOfDooggiesToSave[index].dooggiesNum,
                dooggiesId: idsOfDooggiesToSave[index].dooggiesId
            })
    }

    console.log(dooggiesToSave.length)
    fs.writeFileSync("./data/DooggiesToSaveConfirm.json", JSON.stringify(dooggiesToSave))
}


fullSend()