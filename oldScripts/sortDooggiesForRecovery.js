
const Web3 = require("web3");
var fs = require('fs');

var abi = JSON.parse(fs.readFileSync("./abi.json"));
var config = JSON.parse(fs.readFileSync("./config.json"));

var dooggiesWeNeedToCapture = JSON.parse(fs.readFileSync("./oldScripts/TargetIds.json"))


var mutants = []
var moods = []
var ghosts = []
var dark = []
var basics = []

console.log(dooggiesWeNeedToCapture.length)
for (var index = 0; index < dooggiesWeNeedToCapture.length; index++) {
    var dooggiesT = dooggiesWeNeedToCapture[index].traits
    dooggiesWeNeedToCapture[index].saved = false
    for(var j = 0; j < dooggiesT.length; j++) {
        var item = dooggiesT[j]
        if(item.trait_type == "Mood") {
            moods.push(dooggiesWeNeedToCapture[index])
            break
        } else if(item.trait_type == "Skin" && (item.value == "mutant" || item.value == "Mutant")) {
            mutants.push(dooggiesWeNeedToCapture[index])
            break
        } else if(item.trait_type == "Skin" && item.value == "ghost") {
            ghosts.push(dooggiesWeNeedToCapture[index])
            break
        } else if(item.trait_type == "Skin" && item.value == "dark") {
            dark.push(dooggiesWeNeedToCapture[index])
            break
        } else if(item.trait_type == "Skin" && item.value == "basic") {
            basics.push(dooggiesWeNeedToCapture[index])
            break
        }
        
    }
}
var bossMode = mutants.concat(moods).concat(ghosts).concat(dark).concat(basics)
console.log(bossMode.length)

fs.writeFileSync("./data/DooggiesNeedSaving.json", JSON.stringify(bossMode))
console.log("Yeeeet Lets do this thing.")