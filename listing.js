const debug = true;

const typeObj = document.querySelector("#type");
const versionObj = document.querySelector("#version");
const editionObj = document.querySelector("#edition");
const downloadURL = document.querySelector("#download");

function getData(e){return fetch(e).then(e=>e.body.getReader()).then(e=>new Response(new ReadableStream({start:function(n){let a=()=>{e.read().then(({done:e,value:t})=>e?n.close():(n.enqueue(t),void a()))};a()}})).text())}

async function getListing(folder = "", obj = typeObj) {
	let links = await getData(`${debug ? "https://api.allorigins.win/raw?url=" : ""}https://dl.bobpony.com/${folder}`).then(a => {
		let dir = document.createElement("div");
		dir.innerHTML = a;
		return dir.getElementsByTagName("a");
	});
	for (var l = 0; l < links.length; l++) {
		if (obj == editionObj) {
			if (!links[l].innerText.startsWith(".."))
				if (links[l].innerText.endsWith("/")) {
					let innerDir = await getListing(`${folder}/${links[l].innerText}`, obj);
					for (var il = 0; il < innerDir.length; il++) {
						if (!innerDir[il].innerText.startsWith("..") & innerDir[il].innerText != "_h5ai.header.html")
							obj.append(new Option(innerDir[il].innerText.substring(0, innerDir[il].innerText.lastIndexOf(".")), innerDir[il].innerText));
					}
				}
			else if (links[l].innerText != "_h5ai.header.html")
				obj.append(new Option(links[l].innerText.substring(0, links[l].innerText.lastIndexOf(".")), links[l].innerText));
		} else if (links[l].innerText.endsWith("/") & !links[l].innerText.startsWith(".."))
			obj.append(new Option(links[l].innerText.replace("/", ""), links[l].innerText.replace("/", "")));
	}
}

function updateVersions() {
	const versionOptions = document.querySelectorAll("#version option");
	for (const i of versionOptions) {
		if (!i.disabled) i.remove();
	}
	document.querySelector("#version option[value='placeholder']").selected = true;
	getListing(typeObj.value, versionObj);
	updateEditions();
}

function updateEditions() {
	let editionOptions = document.querySelectorAll("#edition option");
	for (let i of editionOptions) {
		if (!i.disabled) i.remove();
	}
	document.querySelector("#edition option[value='placeholder']").selected = true;
	getListing(typeObj.value + "/" + versionObj.value, editionObj);
	updateURL();
}

function updateURL() {
	if (typeObj.value && versionObj.value && editionObj.value)
		downloadURL.href = `https://dl.bobpony.com/${typeObj.value}/${versionObj.value}/${editionObj.value}`;
	else {
		downloadURL.removeAttr("href");
		downloadURL.disabled = true;
	}
}

getListing();
