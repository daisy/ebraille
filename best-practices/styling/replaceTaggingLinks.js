var DEVELOPER_MODE = (new URLSearchParams(window.location.search).get("developer-mode") == "true");

async function replaceTaggingLinks() {
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
				await replaceTaggingLinks(focus.item(k));
			return;
		}
	}
	let links = top.getElementsByClassName("tagging-link");
	for (let k = 0; k < links.length; k++) {
		let link = links.item(k);
		let href = new URL(link.href, document.baseURI);
		let doc = new DOMParser().parseFromString(await (await fetch(href.pathname)).text(), "text/html");
		let example = doc.getElementById(href.hash.substring(1));
		if (example != null) {
			let title = example.getAttribute("title");
			if (title != null) {
				let htmlCode = example.getElementsByClassName("html");
				if (htmlCode.length > 0) {
					htmlCode = htmlCode.item(0);
					htmlCode.innerHTML = htmlCode.innerHTML.replace(/\s*(\.\.\.|…)/, "");
					let pre = document.createElement("pre");
					pre.appendChild(htmlCode);
					link.parentNode.insertBefore(pre, link.nextSibling);
					link.innerHTML = title;
					let span = document.createElement("span");
					span.innerHTML = "Refer to the “" + link.outerHTML + "” example from [[TAGGING]]:"
					link.parentNode.replaceChild(span, link);
				}
			}
		}
	}
}
