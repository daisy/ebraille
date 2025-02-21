var BorderImageGenerator = BorderImageGenerator || (function() {

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

	let loadHtml2Canvas = dynamicallyLoadScript("html2canvas.min.js");

	let fontSrc = new URL("odt2braille8.ttf", currentFile).href;
	let fontAspectRatio = 0.5;

	async function braille2canvas(braille, columns, cellHeight, cellWidth) {
		let fontScale = cellWidth / cellHeight / fontAspectRatio;
		let html = `
<html>
	<head>
		<style type="text/css">
			@font-face {
				font-family: 'odt2braille8';
				src: url('${fontSrc}') format('truetype');
			}
			:root {
				font-size: ${cellHeight * 1.0 / window.devicePixelRatio}px;
			}
			* {
				font-family: 'odt2braille8', monospace;
				font-size: ${fontScale}rem;
				font-weight: normal;
				line-height: 1rem;
				letter-spacing: 0;
				margin: 0;
				padding: 0;
				border: none;
				list-style: none;
				color: black;
				text-decoration: none;
			}
			#wrapper {
				all: revert;
			}
		</style>
	</head>
	<body>
		<div id="wrapper">${braille}</div>
	</body>
</html>`;
		let iframe = document.createElement("iframe");
		let iframeContainer = document.body.appendChild(document.createElement("div"));
		iframeContainer.style.position = "absolute";
		iframeContainer.style.top = "0";
		iframeContainer.style.left = "-10000px";
		iframeContainer.appendChild(iframe);
		iframe.setAttribute("src", "about:blank");
		iframe.style.width = "10000px";
		iframe.style.height = "0";
		iframe.contentWindow.document.open();
		iframe.contentWindow.document.write(html);
		iframe.contentWindow.document.close();
		await new Promise(resolve => iframe.onload = resolve);
		await loadHtml2Canvas;
		let canvas = await html2canvas(iframe.contentWindow.document.body, {
			width: columns * cellWidth
		});
		iframeContainer.remove();
		return canvas;
	}

	function crop(img, x, y, sWidth, sHeight, dWidth, dHeight) {
		var canvas = document.createElement("canvas");
		canvas.width = dWidth;
		canvas.height = dHeight;
		canvas.getContext("2d").drawImage(img, x, y, sWidth, sHeight, 0, 0, dWidth, dHeight);
		return canvas;
	}

	return {
		generate: async function({pattern, h, w}) {
			if (pattern === undefined) {
				console.log("No pattern specified");
				return "none";
			}
			if (!pattern.match(/^[\u2800-\u28ff]{8}$/)) {
				console.log("Invalid pattern: " + pattern);
				return "none";
			}
			pattern = pattern.replace(/\u2800/g, " ");
			if ((h === undefined) != (w === undefined)) {
				console.log("Height and width must both be specified, or not");
				return "none";
			}
			let cellHeight = h || 72;
			let cellWidth = w || 40;
			let canvas = await braille2canvas(
				`
${pattern.substring(0, 1)}${pattern.substring(1, 2)}${pattern.substring(2, 3)} <br/>${
pattern.substring(7, 8)} ${pattern.substring(3, 4)}<br/>${pattern.substring(6, 7)}${
pattern.substring(5, 6)}${pattern.substring(4, 5)}<br/> `,
				4, cellHeight, cellWidth);
			canvas = crop(canvas, 0, 2, 3 * cellWidth, 3 * cellHeight, 3 * cellWidth, 3 * cellHeight);
			return "url('" + canvas.toDataURL("image/png") + "')";
		}
	};
}());
