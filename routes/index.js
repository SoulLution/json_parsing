var express = require('express');
var router = express.Router();
process.env.NODE_TLS_REJECT_UNAUTHORIZED = 0


router.get('/parse_json_special', async (req, res) => {
	const fs = require("fs")
	var Filequeue = require('filequeue');
	var fq = new Filequeue(200);
	const BLACKLIST = [
		["QmQgtGsfr6T9uxXa9Lz6XXVzYdKjRFeGzjkmodPjFGcfpq", "test"],
		// ["some", "new"],
	]
	
	let files = await fs.readdirSync("./json")
	files = files.sort((a,b) => parseInt(a.split(".")[0]) > parseInt(b.split(".")[0]) ? 1 : -1)
	let i = 0,
			final = []
	for(let file of files) {
		let index = i + 1
		i++
		try {
		let fileContent = JSON.parse(await fs.readFileSync("./json/" + file, 'utf-8')),
				names = fileContent.name.split("#"),
				images = fileContent.image.split("/")

				fileContent.name = names[0] + "#" + index
				fileContent.image = images[0] + "//" + images[2] + "/" + index + ".png"
				fileContent.edition = index
				fileContent.name = names[0] + "#" + index

				Object.keys(fileContent).forEach(key => {
					BLACKLIST.forEach(words => {
						if(typeof fileContent[key] !== "object" && ~(fileContent[key]  + "").search(words[0])) {
							fileContent[key] = fileContent[key].replace(words[0], words[1])
							final.push("В " + file + " заменён " + key + " " + words[0] + " на " + words[1])
						}
					})
				})
				fileContent.attributes.forEach(j => {
					Object.keys(j).forEach(x => {
						BLACKLIST.forEach(words => {
							if(~(j[x]  + "").search(words[0])) {
								j[x] = j[x].replace(words[0], words[1])
								final.push("В " + file + " заменён attributes." + key + " " + words[0] + " на " + words[1])
							}
						})
					})
				})
				fs.writeFileSync("./json_final/" + index + ".json", JSON.stringify(fileContent, null, 2))
			}
			catch (e) {
				console.error("error", file, e)
			} 
		}
	console.log(final)
	res.end(JSON.stringify(final))
})

router.get('/parse_json_special_all', async (req, res) => {
	const fs = require("fs")
	let final = []
	fs.unlink("./json_final/all.json", err => {
		if(err) console.error(err); // не удалось удалить файл
			console.log('Файл успешно удалён')
	})
	fs.readdir("./json_final", (err, files) => {
		for(let index = 1; index <= files.length; index++) {
			let fileContent = JSON.parse(fs.readFileSync("./json_final/" + index + ".json", 'utf8'))
			final.push(fileContent)
		}
		fs.writeFile("./json_final/all.json", JSON.stringify(final, null, 2), err => {
			if (err) throw err
			console.log('Файл успешно сохранён')
		})
	})
})
router.get('/find', async (req, res) => {
	const fs = require("fs")
	let final = [],
			predicate = req.query.predicate
	let files = await fs.readdirSync("./json_final")
	for(let index = 1; index < files.length; index++) {
		let fileContent = JSON.parse(fs.readFileSync("./json_final/" + index + ".json", 'utf8'))
		Object.keys(fileContent).forEach(x => {
			if(typeof fileContent[x] !== "object")
				if(~(fileContent[x]  + "").search(predicate)){
					final.push(index + ".json")
				}
		})
		fileContent.attributes.forEach(j => {
			Object.keys(j).forEach(x => {
				if(typeof j[x] !== "object")
					if(~(j[x]  + "").search(predicate)) {
						final.push(index + ".json")
					}
			})
		})
	}
	console.log(final)
	res.end(JSON.stringify(final))
})
module.exports = router;