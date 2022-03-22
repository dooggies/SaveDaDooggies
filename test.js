
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
const account = web3.eth.accounts.privateKeyToAccount('0x' + config.privateKey);

web3.eth.accounts.wallet.add(account);
web3.eth.defaultAccount = account.address;

var timeOutLock = 1000
var timeIntervalToReset = timeOutLock

var currentlySendingLock = false
var idsOfDooggiesToSave = JSON.parse(fs.readFileSync(config.targetDooggiesFile));

var smartContractExecutionCost = 90000

async function main() {
    setInterval(async () => {
        if(currentlySendingLock) { return }
        currentlySendingLock = true

        web3.eth.getBalance(account.address, function (error, wei) {
            if (!error) {
                var weiAmount = web3.utils.toWei(config.gweiPrice, 'gwei') * smartContractExecutionCost
                var amountCanSend = new web3.utils.BN(wei).div(new web3.utils.BN(weiAmount))
                if(amountCanSend > 0) {
                    fullSend(amountCanSend)
                } else {
                    console.log("Im just chilling waiting for ETH...")
                    currentlySendingLock = false
                }
            } else {
                console.log("Im just chilling waiting for ETH...")
                currentlySendingLock = false
            }
        });
    }, timeIntervalToReset);
}

async function fullSend(amountCanSend) {
    var qtyArray = []
    var dooggiesToSend = []

    for(var index = 0; index < idsOfDooggiesToSave.length; index++) {
        if(dooggiesToSend.length == 1) {
            break
        }

        var hasAny = await instance.methods
        .balanceOf(
            config.currentDevPublicAddress,
            idsOfDooggiesToSave[index].dooggiesId
        )
        .call()

        if(hasAny != 0 && idsOfDooggiesToSave[index].saved == false) {
            dooggiesToSend.push(idsOfDooggiesToSave[index].dooggiesId)
            idsOfDooggiesToSave[index].saved = true
        } else {
            idsOfDooggiesToSave[index].saved = true
        }
    }

    for(var index = 0; index < dooggiesToSend.length; index++) {
        qtyArray.push("1")
    }

    if(dooggiesToSend.length == 0) {
        console.log("Yo Im done send the rest of the ETH out of the account manually...")
        currentlySendingLock = false
        return
    }

    console.log("Tx created. Waiting on it to be confirmed...")

    try {
        instance.methods
        .safeBatchTransferFrom(
            config.currentDevPublicAddress,
            config.newDevPublicAddress,
            dooggiesToSend,
            qtyArray,
            '0x'
        )
        .send({
            from: web3.eth.defaultAccount,
            gas: smartContractExecutionCost * dooggiesToSend.length,
            gasPrice: web3.utils.toHex(web3.utils.toWei(config.gweiPrice, 'gwei'))
        })
        .then(function(receipt){
            fs.writeFileSync(config.targetDooggiesFile, JSON.stringify(idsOfDooggiesToSave))

            var currentLogs = JSON.parse(fs.readFileSync(config.logFile))
            currentLogs.push({
                txHash: receipt.transactionHash,
                dooggies: dooggiesToSend
            })
            fs.writeFileSync(config.logFile, JSON.stringify(currentLogs))

            console.log("Okay close the program and see if it worked....")
            //currentlySendingLock = false
        })
        .catch(err => {
            console.log(err)
            currentlySendingLock = false
        });
    } catch {
        currentlySendingLock = false
    }
}


var idsOfDooggiesToSave = JSON.parse(fs.readFileSync(config.targetDooggiesFile));
var dooggiesToSave = idsOfDooggiesToSave
for(var index = 0; index < 10000; index++) {
    var dooggiesToLookAt = idsOfDooggiesToSave[index]
    if(dooggiesToLookAt == null || dooggiesToLookAt == undefined) { continue }
    dooggiesToSave[index].saved = false
}
fs.writeFileSync(config.targetDooggiesFile, JSON.stringify(dooggiesToSave))
console.log("Yeeeet Lets do this thing.")


main()