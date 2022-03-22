var fs = require('fs');
var idsOfDooggiesToSave = JSON.parse(fs.readFileSync("./dooggiesToSave.json"));
var dooggiesToSave = []
for(var index = 1; index < 10000; index++) {
    var dooggiesToLookAt = idsOfDooggiesToSave[index]
    if(dooggiesToLookAt == null || dooggiesToLookAt == undefined) {
        dooggiesToSave.push(index)
    }
}
fs.writeFileSync("./missingIDS.json", JSON.stringify(dooggiesToSave))
console.log("Yeeeet")