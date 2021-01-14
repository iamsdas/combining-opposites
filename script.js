// do on load
document.addEventListener('DOMContentLoaded', () => {
	// get DOM elements
	const inputForm = document.getElementById('inputForm')
	const resDiv = document.getElementById('results')
	const inputField = document.getElementById('word')
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
	inputField.addEventListener("input", autocomplete)
})

function autocomplete(event) {
	const datalist = document.getElementById('suggestions')
	// clear suggestions list on change
	clear(datalist)
	// if input is not empty get suggestions
	if (event.target.value) {
		fetch(`https://api.datamuse.com/sug?s=${ event.target.value }`)
			.then(response => response.json())
			.then(arr => arr.map(obj => obj['word']))
			.then(arr => {
				arr.forEach(word => {
					let option = document.createElement('option')
					option.value = word
					datalist.appendChild(option)
				});
			})
	}
}

// remove all children
function clear(element) {
	element.innerHTML = ''
}

// returns a list of opposite words and their definitions
function getOpposite(input) {
	let list = document.createElement('dl')
	list.className = "col-sm"
	list.innerHTML = "<h2>Opposite words<h2>"
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
	list.innerHTML = "<h2>Similar words<h2>"
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