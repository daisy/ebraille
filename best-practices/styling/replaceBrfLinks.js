var DEVELOPER_MODE = (new URLSearchParams(window.location.search).get("developer-mode") == "true");

async function replaceBrfLinks() {
	let top; {
		for (let k = 0; k < arguments.length; k++)
			if (typeof arguments[k].getElementsByClassName !== "undefined") {
				top = arguments[k];
				break;
			}
		top = top || document;
	}
	if (DEVELOPER_MODE) {
		let focus = top.getElementsByClassName("focus");
		if (focus.length > 0) {
			for (let k = 0; k < focus.length; k++)
				await replaceBrfLinks(focus.item(k));
			return;
		}
	}
	let links = top.getElementsByClassName("brf-link");
	for (let k = links.length - 1; k >= 0; k--) {
		let link = links.item(k);
		let href = new URL(link.href, document.baseURI);
		let brf = await (await fetch(href.pathname)).text();
		let table = " A1B'K2L@CIF/MSP\"E3H9O6R^DJG>NTQ,*5<-U8V.%[$+X!&;:4\\0Z7(_?W]#Y)=";
		let unicodeBraille = brf.replace(/\s+$/, "").split("").map(c => {
			let i = table.indexOf(c);
			if (i < 0)
				return c;
			else
				return String.fromCharCode(10240 + i);
		}).join("");
		// pad with blanks
		let lines = unicodeBraille.split(/\r?\n/);
		let pageWidth = Math.max.apply(null, lines.map(line => line.length));
		unicodeBraille = lines.map(line => {
			while (line.length < pageWidth)
				line += "⠀";
			return line;
		}).join("\n");
		let pre = document.createElement("pre");
		link.parentNode.replaceChild(pre, link);
		pre.innerHTML = "<code class=\"formatted-braille\">" + unicodeBraille + "</code>";
	}
}
