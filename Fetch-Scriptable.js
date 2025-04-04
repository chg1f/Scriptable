// Variables used by Scriptable.
// These must be at the very top of the file. Do not edit.
// icon-color: cyan; icon-glyph: magic;
// encoding=utf-8

async function inputUrl() {
	const alert = new Alert();
	alert.title = "Scriptable URL";
	alert.addTextField("url", Pasteboard.paste());
	alert.addAction("Fetch");
	alert.addCancelAction("Cancel");
	return alert.textFieldValue(await alert.presentAlert());
}

function getName(url) {
	const fileName = url.split('/').pop();
	return fileName.endsWith(".js") ? fileName.slice(0, -3) : fileName;
}

async function getContent(url) {
	const req = new Request(url);
	return await req.loadString();
}

async function createScriptable(fileName, fileContent) {
	const fm = FileManager.iCloud();
	const filePath = fm.joinPath(fm.documentsDirectory(), fileName);
	await fm.writeString(filePath, fileContent);
}

async function editScriptable(name) {
	const callbackUrl = "scriptable:///open/" + encodeURIComponent(name);
	const callback = new CallbackURL(callbackUrl);
	await callback.open();
}

const url = await inputUrl();
if (url) {
	const fileName = getName(url)
	const fileContent = await getContent(url);
	await createScriptable(fileName + ".js", fileContent);
	await editScriptable(fileName);
}
Script.complete();
