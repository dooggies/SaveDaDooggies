var fs = require('fs');
var idsOfDooggiesToSave = JSON.parse(fs.readFileSync("./data/OGDooggiesToSave.json"));
var idCache = []
var dooggiesToSave = idsOfDooggiesToSave
for(var index = 0; index < 10000; index++) {
    var dooggiesToLookAt = idsOfDooggiesToSave[index]
    if(dooggiesToLookAt == null || dooggiesToLookAt == undefined) { continue }

    if(idCache.indexOf(idsOfDooggiesToSave[index].dooggiesId) == -1) {
        idCache.push(idsOfDooggiesToSave[index].dooggiesId)
    } else {
        dooggiesToSave.splice(index, 1)
    }
}
console.log(dooggiesToSave.length)
fs.writeFileSync("./data/OGDooggiesToSaveConfirm.json", JSON.stringify(dooggiesToSave))
console.log("Yeeeet")