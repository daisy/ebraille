let DEVELOPER_MODE = (new URLSearchParams(window.location.search).get("developer-mode") == "true");

let getPopupHolder = (function() {
	let popupHolder = null;
	return function() {
		if (popupHolder == null) {
			popupHolder = document.body.appendChild(document.createElement("div"));
			popupHolder.id = "popup-holder";
		}
		return popupHolder;
	};
})();

function createPopup(title) {
	let popup = getPopupHolder().appendChild(document.createElement("div"));
	popup.classList.add("popup");
	if (title != null)
		popup.title = title;
	let closeButton = popup.appendChild(document.createElement("button"));
	closeButton.innerHTML = "✕";
	closeButton.onclick = function() {
		closeButton.onclick = null;
		popup.remove();
	}
	return popup;
}

function decodeHTML(html) {
	var txt = document.createElement("textarea");
	txt.innerHTML = html;
	return txt.value;
}

async function validateExamples() {
	if (DEVELOPER_MODE) {
		let examples = document.getElementsByClassName("example");
		for (let k = 0; k < examples.length; k++) {
			let example = examples.item(k);
			let content = example.getElementsByClassName("html");
			let style = example.getElementsByClassName("css");
			let result = example.getElementsByClassName("formatted-braille");
			if (content.length > 0 && style.length > 0 && result.length > 0) {
				content = content.item(0).textContent;
				style = style.item(0);
				result = result.item(0);
				let columns = parseInt(style.getAttribute("page-width"));
				style = style.textContent;
				let expected = result.innerHTML.replace(/\s+$/, "");
				result.innerHTML = "<div style=\"position: relative;\">"
					+ expected
					+ "<button style=\"position: absolute; top: 0; right: 0;\">"
					+ "<em style=\"font-family: initial; font-size: initial\">Click to validate.</em>"
					+ "</button>";
					+ "</div>";
				let button = result.children.item(0).children.item(0);
				button.onclick = async function() {
					button.onclick = null;
					let formatted = await formatBraille(content, columns, style, {
						debugIframe: iframe => createPopup("iframe").appendChild(iframe),
						debugCanvas: canvas => createPopup("canvas").appendChild(canvas),
						debugMatch: canvas => createPopup("match").appendChild(canvas)
					});
					formatted = decodeHTML(formatted).replace(/\s+$/, "");
					result.innerHTML = expected;
					if (formatted == expected) {
						result.style.border = "2px solid green";
					} else {
						result.style.border = "2px solid red";
						let code = "<pre><code class=\"formatted-braille\">" + formatted + "</code></pre>";
						navigator.clipboard.writeText(code);
						// window.alert("Actual result does not match expected result. "
						// 			 + "To adapt expected result, replace `pre' element with clipboard contents.");
					}
				};
			}
		}
	}
}
