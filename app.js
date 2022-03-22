
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

var currentlySendingLock = true
var idsOfDooggiesToSave = JSON.parse(fs.readFileSync(config.targetDooggiesFile));

var smartContractExecutionCost = 90000

var runningNonce = 0
web3.eth.getTransactionCount(config.currentDevPublicAddress, "pending").then(data => {
    runningNonce = data
    currentlySendingLock = false
})
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

async function fullSend(amountToSend) {
    var dooggiesToSend = []

    for(var index = 0; index < idsOfDooggiesToSave.length; index++) {
        if(dooggiesToSend.length == amountToSend) {
            break
        }

        var hasAny = await instance.methods
        .balanceOf(
            config.currentDevPublicAddress,
            idsOfDooggiesToSave[index].tokenID
        )
        .call()

        if(hasAny != 0 && idsOfDooggiesToSave[index].saved == false) {
            dooggiesToSend.push(idsOfDooggiesToSave[index])
            idsOfDooggiesToSave[index].saved = true
        } else {
            idsOfDooggiesToSave[index].saved = true
        }
    }

    if(dooggiesToSend.length == 0) {
        console.log("Yo Im done send the rest of the ETH out of the account manually...")
        return
    }

    console.log("Tx created. Waiting on it to be confirmed...")

    var calledAmount = 0
    var finishedCallback = (tx, dooggiesID) => {
        calledAmount += 1

        var currentLogs = JSON.parse(fs.readFileSync(config.logFile))
            currentLogs.push({
            txHash: tx.transactionHash,
            dooggies: dooggiesID
        })
        fs.writeFileSync(config.logFile, JSON.stringify(currentLogs))


        if(calledAmount >= dooggiesToSend.length) {
            fs.writeFileSync(config.targetDooggiesFile, JSON.stringify(idsOfDooggiesToSave))
            // all tx succeeded so we good otherwise we need to restart script
            // and have it try again
            currentlySendingLock = false
        }
    }
    
    dooggiesToSend.forEach(dooggie => {
        var walletAddress = ""
        if(parseInt(dooggie.name) < 8500) {
            walletAddress = config.newDevPublicAddress
        } else {
            walletAddress = config.communityTreasureyWallet
        }

        sendADooggiesHome(dooggie.tokenID, walletAddress, finishedCallback)

        runningNonce += 1
    })
}

function sendADooggiesHome(dooggiesID, whereToSend, finishedCallback) {
    try {
        instance.methods
        .safeTransferFrom(
            config.currentDevPublicAddress,
            whereToSend,
            dooggiesID,
            1,
            web3.utils.toHex("")
        )
        .send({
            nonce: runningNonce,
            from: web3.eth.defaultAccount,
            gas: smartContractExecutionCost,
            gasPrice: web3.utils.toHex(web3.utils.toWei(config.gweiPrice, 'gwei'))
        })
        .then(function(receipt){
            finishedCallback(receipt, dooggiesID)
        })
        .catch(err => {
            console.log(err)
            currentlySendingLock = false
        });
    } catch(err) {
        console.log(err)
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
console.log("Yeeeet. ITs TiMe To gEt ScHwIftY.")


main()