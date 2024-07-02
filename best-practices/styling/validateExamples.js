var DEVELOPER_MODE = (new URLSearchParams(window.location.search).get("developer-mode") == "true");

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

function createButton(text, onclick) {
	let button = document.createElement("button");
	button.setAttribute("style", "display: block; margin-bottom: 5px; float: right; clear: right");
	button.innerHTML = "<em style=\"font-family: initial; font-size: initial\">" + text + "</em>";
	button.onclick = onclick;
	return button;
}

async function validateExamples() {
	if (DEVELOPER_MODE) {
		let top; {
			for (let k = 0; k < arguments.length; k++)
				if (typeof arguments[k].getElementsByClassName !== "undefined") {
					top = arguments[k];
					break;
				}
			top = top || document;
		}
		let focus = top.getElementsByClassName("focus");
		if (focus.length > 0) {
			for (let k = 0; k < focus.length; k++)
				await validateExamples(focus.item(k));
			return;
		}
		let examples = !(top instanceof HTMLDocument) && top.classList.contains("example")
			? [top]
			: Array.from(top.getElementsByClassName("example"));
		examples.forEach(example => {
			let content = example.getElementsByClassName("html");
			let style = example.getElementsByClassName("css");
			let result = example.getElementsByClassName("formatted-braille");
			if (result.length > 0) {
				result = result.item(0);
				let buttons = [];
				let unicodeBraille = result.textContent;
				if (content.length > 0 && style.length > 0) {
					content = content.item(0).textContent;
					let columns = parseInt(style.item(0).dataset.pageWidth);
					style = Array.from(style).reduce(
						(textContent, s) => textContent + s.textContent,
						""
					);
					let script = example.getElementsByClassName("javascript");
					script = script.length > 0 ? script.item(0).textContent : null;
					if (script != null)
						buttons.push(
							createButton("Validate without JS", async function() {
								this.onclick = null;
								let formatted = await formatBraille(content, columns, style, null, {
									debugIframe: iframe => createPopup("iframe").appendChild(iframe),
									debugCanvas: canvas => createPopup("canvas").appendChild(canvas),
									debugMatch: canvas => createPopup("match").appendChild(canvas)
								});
								formatted = decodeHTML(formatted).replace(/[\u2800\n]+$/, "").replace(/\s+$/, "");
								let expected = unicodeBraille.replace(/[\u2800\n]+$/, "").replace(/\s+$/, "");
								if (formatted == expected) {
									result.style.border = "2px solid green";
								} else {
									result.style.border = "2px solid red";
								}
								this.parentNode.removeChild(this);
							})
						);
					buttons.push(
						createButton(script != null ? "Validate with JS" : "Validate", async function() {
							this.onclick = null;
							let formatted = await formatBraille(content, columns, style, script, {
								debugIframe: iframe => createPopup("iframe").appendChild(iframe),
								debugCanvas: canvas => createPopup("canvas").appendChild(canvas),
								debugMatch: canvas => createPopup("match").appendChild(canvas)
							});
							formatted = decodeHTML(formatted).replace(/[\u2800\n]+$/, "").replace(/\s+$/, "");
							let expected = unicodeBraille.replace(/[\u2800\n]+$/, "").replace(/\s+$/, "");
							if (formatted == expected) {
								result.style.border = "2px solid green";
							} else {
								result.style.border = "2px solid red";
								let code = "<pre><code class=\"formatted-braille\">" + formatted + "</code></pre>";
								navigator.clipboard.writeText(code);
								// window.alert("Actual result does not match expected result. "
								// 			 + "To adapt expected result, replace `pre' element with clipboard contents.");
							}
							this.parentNode.removeChild(this);
						})
					);
				}
				// also add button to copy HTML code to clipboard
				{
					buttons.push(
						createButton("Copy to clipboard", function() {
							navigator.clipboard.writeText("<pre><code class=\"formatted-braille\">" + unicodeBraille + "</code></pre>");
						})
					);
				}
				// also add button to render the braille in ASCII
				{
					buttons.push(
						createButton("Show ASCII", function() {
							let table = " A1B'K2L@CIF/MSP\"E3H9O6R^DJG>NTQ,*5<-U8V.%[$+X!&;:4\\0Z7(_?W]#Y)=";
							let asciiBraille = unicodeBraille.replace(/\s+$/, "").split("").map(c => {
								let code = c.charCodeAt(0) - 10240;
								if (code >= 0 && code < 64)
									return table.charAt(code);
								else
									return c;
							}).join("");
							let pre = document.createElement("pre");
							let code = pre.appendChild(document.createElement("code"));
							code.textContent = asciiBraille;
							createPopup("ascii").appendChild(pre);
						})
					);
				}
				result.style.overflow = "visible";
				result.parentNode.style.overflow = "visible";
				result.innerHTML = "<div style=\"position: relative\">"
					+ result.innerHTML
					+ "<div class=\"buttons\" style=\"position: absolute; top: 0; right: 0\">"
					+ "</div>"
					+ "</div>";
				let buttonsDiv = result.firstChild.lastChild;
				buttons.forEach(button => buttonsDiv.appendChild(button));
			}
		});
	}
}
