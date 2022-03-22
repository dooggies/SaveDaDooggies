
const Web3 = require("web3");
var fs = require('fs');

var dooggiesWeNeedToCapture = []
for (var index = 1; index <= 11; index++) {
    var foundData = JSON.parse(fs.readFileSync("./bsScrape/scrape" + index + ".json"))
    foundData.assets.forEach(item => {
        dooggiesWeNeedToCapture.push({
            name: item.name,
            tokenID: item.token_id
            //traits: item.traits
        })
    })
}
console.log(dooggiesWeNeedToCapture.length)
fs.writeFileSync("../data/allIds.json", JSON.stringify(dooggiesWeNeedToCapture))
console.log("Yeeeet Lets do this thing.")