(async function() {

	let currentFile = (() => {
		let scripts = document.getElementsByTagName("script");
		return scripts[scripts.length - 1].src;
	})();

	function dynamicallyLoadScript(url) {
		let script = document.createElement("script");
		script.src = new URL(url, currentFile).href;
		script.type = "text/javascript";
		script.async = true;
		return new Promise(resolve => {
			script.addEventListener("load", resolve);
			document.head.appendChild(script);
		});
	}

	await dynamicallyLoadScript("border-image-generator/index.js");

	async function asyncReplace(str, regex, asyncReplacer) {
		let replacements = [];
		str.replaceAll(regex, (match, ...groups) => {
			replacements.push(asyncReplacer(match, ...groups));
			return match;
		});
		replacements = await Promise.all(replacements);
		return str.replaceAll(regex, () => replacements.shift());
	}

	document.querySelectorAll("style").forEach(async (style) => {
		style.innerHTML = await asyncReplace(
			style.innerHTML,
			/url\(["']?https?:\/\/(?:www\.)?daisy\.org\/ebraille\/border-image(\?[^=]+=[^&"')]+(?:&[^=]+=[^&"')]+)*)["']?\)/g,
			async (_, query) => {
				return await BorderImageGenerator.generate(
					Object.fromEntries(new Map(
						Array.from(query.matchAll(/[?&](pattern=[\u2800-\u28ff]{8}|w=[0-9]+|h=[0-9]+)/g))
						     .map(param => param[1].split("=")))));
			}
		);
	});

})();
