document.addEventListener('DOMContentLoaded', () => {
	// get DOM elements
	const inputForm = document.getElementById('inputForm')
	const resDiv = document.getElementById('results')
	const inputField = document.getElementById('word')
	// reset input field on reload
	inputField.value = ""
	// get results from API
	inputForm.onsubmit = () => {
		let resultLine
		fetch(`https://api.datamuse.com/words?rel_ant=${ inputField.value }`)
			.then(response => response.json())
			.then(arr => arr.map(obj => obj['word']))
			.then(arr => {
				resultLine = ""
				for (const word of arr) {
					resultLine += word + " "
				}
				resDiv.innerText = `The opposite words of ${ inputField.value } are ` + resultLine
			})
			.catch(err => { console.log(err) })
		// dont change the page on submit
		return false
	}
	// add suggestions while typing
	inputField.addEventListener("input", autocomplete)
})

function autocomplete(event) {
	const datalist = document.getElementById('suggestions')
	// clear suggestions list on change
	datalist.innerHTML = ''
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