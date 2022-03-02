var express = require('express');
var router = express.Router();
process.env.NODE_TLS_REJECT_UNAUTHORIZED = 0


router.get('/parse_json_special', async (req, res) => {
	const fs = require("fs")
	const BLACKLIST = [
		"test",
		"some",
	]
	const WHEREIS = [
		"name",
		"image",
	]
	fs.readdir("./json", (err, files) => {
		files.sort((a,b) => parseInt(a.split(".")[0]) > parseInt(b.split(".")[0]) ? 1 : -1).forEach((file, i) => {
			let index = i + 1
			fs.readFile("./json/" + file, 'utf8', (err, content) =>{
				let fileContent = JSON.parse(content),
						names = fileContent.name.split("#"),
						images = fileContent.image.split("/")
				fileContent.name = names[0] + "#" + index
				fileContent.image = images[0] + "//" + images[2] + "/" + index + ".png"
				fileContent.edition = index

				WHEREIS.forEach(key => {
					BLACKLIST.forEach(word => {
						if(fileContent[key])
							fileContent[key].replace(word, "")
							if(fileContent.attributes[0][key])
								fileContent.attributes.forEach(x => {
									x[key].replace(word, "")
								})
					})
				})

				fileContent.name = names[0] + "#" + index

				fs.writeFile("./json_final/" + index + ".json", JSON.stringify(fileContent, null, 2), err => {
					if (err) throw err
					console.log(index)
				})
			})
		})
	})
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
module.exports = router;