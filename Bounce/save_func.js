//globals:
// u - UnityObject2

// taken from a StackOverflow answer
function PromptDownload(text)
{
	var pom = document.createElement('a');
	pom.setAttribute('href', 'data:text/plain;charset=UTF-8,' + encodeURIComponent(text));
	pom.setAttribute('download', 'BounceSaveData.sav');

	pom.style.display = 'none';
	document.body.appendChild(pom);

	pom.click();

	document.body.removeChild(pom);
}

function RequestUpload()
{
	var fileinput = document.createElement('input');
	fileinput.setAttribute('type', 'file');
	fileinput.setAttribute('id', 'BounceFileSelecter');
	fileinput.style.display = 'none';
	document.body.appendChild(fileinput);
	fileinput.setAttribute('onchange', 'HandleUpload()');
	//console.log('clicking invisible file button');
	fileinput.click();	
}

function HandleUpload()
{
	//console.log('in handle method')
	var fileinput = document.getElementById("BounceFileSelecter");
	var file = fileinput.files[0];
	if (file) {
		var reader = new FileReader();
		reader.readAsText(file, "UTF-8");
		reader.onload = function (evt) {
			//console.log('sending load message');
			u.getUnity().SendMessage("MenuObj", "WebLoadGame", evt.target.result);
		}
		reader.onerror = function (evt) {
			alert("Error reading save file. =(");
		}
	}
	document.body.removeChild(fileinput);
}