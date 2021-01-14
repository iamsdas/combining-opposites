// do on load
document.addEventListener('DOMContentLoaded', () => {
	// get DOM elements
	const inputForm = document.getElementById('inputForm')
	const resDiv = document.getElementById('results')
	const inputField = document.getElementById('word')
	// initialize awesomplete
	const awsomeplete = new Awesomplete(inputField)
	// reset input field on reload
	inputField.value = ""
	// get results from API
	inputForm.onsubmit = () => {
		clear(resDiv)
		resDiv.appendChild(getOpposite(inputField.value))
		resDiv.appendChild(getSimilar(inputField.value))
		// dont change the page on submit
		return false
	}
	// add suggestions while typing
	inputField.addEventListener("input", () => { autocomplete(inputField, awsomeplete) })
})

function autocomplete(input, awsomeplete) {
	// if input is not empty get suggestions
	if (input.value) {
		fetch(`https://api.datamuse.com/sug?s=${ input.value }`)
			.then(response => response.json())
			.then(arr => arr.map(obj => obj['word']))
			.then(arr => {
				awsomeplete.list = arr
			})
	}
	awsomeplete.evaluate()
}

// remove all children
function clear(element) {
	element.innerHTML = ''
}

// returns a list of opposite words and their definitions
function getOpposite(input) {
	let list = document.createElement('dl')
	list.className = "col-sm"
	list.innerHTML = "<h3>Opposite words<h3>"
	fetch(`https://api.datamuse.com/words?md=d&rel_ant=${ input }`)
		.then(response => response.json())
		.then(arr => {
			arr.forEach(pair => {
				let word = document.createElement('dt')
				word.appendChild(document.createTextNode(pair['word']))
				list.appendChild(word)
				let def = document.createElement('dd')
				def.appendChild(document.createTextNode((getFirstDef(pair['defs']))))
				list.appendChild(def)
			});
		})
		.catch(err => { console.log(err) })
	return list
}

// returns a list of similar words and their definitions
function getSimilar(input) {
	let list = document.createElement('dl')
	list.className = "col-sm"
	list.innerHTML = "<h3>Similar words<h3>"
	fetch(`https://api.datamuse.com/words?md=d&ml=${ input }`)
		.then(response => response.json())
		.then(arr => {
			arr.forEach(pair => {
				let word = document.createElement('dt')
				word.appendChild(document.createTextNode(pair['word']))
				list.appendChild(word)
				let def = document.createElement('dd')
				def.appendChild(document.createTextNode((getFirstDef(pair['defs']))))
				list.appendChild(def)
			});
		})
		.catch(err => { console.log(err) })
	return list
}

function getFirstDef(list) {
	// get first definition
	let res = list[0]
	// remove first word of sentence (for: adj, noun, v)
	return res.substr(res.indexOf("\t") + 1)
}