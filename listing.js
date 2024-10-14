const typeObj = document.querySelector("#type");
const versionObj = document.querySelector("#version");
const editionObj = document.querySelector("#edition");
const downloadURL = document.querySelector("#download");

function getData(e){return fetch(e).then(e=>e.body.getReader()).then(e=>new Response(new ReadableStream({start:function(n){let a=()=>{e.read().then(({done:e,value:t})=>e?n.close():(n.enqueue(t),void a()))};a()}})).text())}

var entries = new Map();

async function populate() {
    let data = await getData("https://api.allorigins.win/raw?url=https://dl.bobpony.com/md5.txt").then(res => {
        var e = []
        res.split('\n').forEach(d => {
            let t = d.split('  ');
            if (t.length == 2)
                e[e.length] = t[1].replace("./","");
        });
        return e;
    });

    data.forEach(e => {
        let path = e.split('/');
        if (!entries.has(path[1]))
            entries.set(path[1],new Map());
        if (!entries.get(path[1]).has(path[2]))
            entries.get(path[1]).set(path[2], []);
        
        var file = "";
        for (var i = 3; i < path; i++) {
            file += `/${path[i]}`;
        }

        var files = entries.get(path[1]).get(path[2]);
        files[files.length] = file;
    });

    entries.keys().forEach(k => {
        typeObj.append(new Option(k,k));
    })
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