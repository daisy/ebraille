(global => {

    let currentFile = (() => {
        let scripts = document.getElementsByTagName("script");
        return scripts[scripts.length - 1].src;
    })();
    let baseCSS = new URL("base.css", currentFile).href;

    function dynamicallyLoadScript(url) {
        let script = document.createElement("script");
        script.src = new URL(url, currentFile).href;
        document.head.appendChild(script);
    }

    dynamicallyLoadScript("pixelmatch-5.3.0.min.js");
    dynamicallyLoadScript("html2canvas.min.js");

    async function html2iframe2canvas(html, options) {
        let iframe = document.createElement("iframe");
        let iframeContainer;
        if (options != null && typeof options.debugIframe === 'function')
            options.debugIframe(iframe);
        else {
            iframeContainer = document.body.appendChild(document.createElement("div"));
            iframeContainer.style.position = "absolute";
            iframeContainer.style.top = "0";
            iframeContainer.style.left = "-10000px";
            iframeContainer.appendChild(iframe);
        }
        iframe.setAttribute("src", "about:blank");
        iframe.style.width = "10000px";
        iframe.style.height = "0";
        iframe.contentWindow.document.open();
        iframe.contentWindow.document.write(html);
        iframe.contentWindow.document.close();
        await new Promise(resolve => iframe.onload = resolve);
        let canvas = await html2canvas(iframe.contentWindow.document.body, options);
        if (iframeContainer == null) {
            iframe.style.width = canvas.style.width;
            iframe.style.height = canvas.style.height;
        } else {
            iframeContainer.remove();
        }
        return canvas;
    }

    function merge() {
        let result = {};
        for (let i = 0; i < arguments.length; i++) {
            let o = arguments[i];
            if (o != null) {
                let keys = Object.keys(o);
                for (let j = 0; j < keys.length; j++) {
                    result[keys[j]] = o[keys[j]];
                }
            }
        }
        return result;
    }

    let fontSize = 36.0 / window.devicePixelRatio;

    async function braille2canvas(braille, columns, css, script, options) {
        let html = "<html><head>";
        html += "<link rel='stylesheet' type='text/css' href='" + baseCSS + "'></link>";
        if (css == null) css = "";
        css += ":root { font-size: " + fontSize + "px; }";
        html += ("<style type='text/css'>" + css + "</style>");
        if (script != null)
            html += ("<script type='text/javascript'>" + script + "</script>");
        html += "</head>";
        html += ("<body><div id='wrapper' style='width: " + columns + "ch'>" + braille + "</div></body>");
        html += "</html>";
        return await html2iframe2canvas(html, merge(options, {
            width: columns * fontSize * 1.11111 / 2.0 // value corresponds with used font and font-size
        }));
    }

    // values correspond with used font, font-size and line-height (see base.css)
    let cellWidth = window.devicePixelRatio * fontSize * 1.11111 / 2.0;
    let cellHeight = window.devicePixelRatio * fontSize;

    async function getPatternsImageData() {
        let columns = 16;
        let rows = 16;
        let braille = ""; {
            let pattern = 10240;
            for (let i = 0; i < rows; i++) {
                for (let j = 0; j < columns; j++) {
                    braille += ("&#" + pattern + ";");
                    pattern = pattern + 1;
                }
                braille += "&#xa;";
            }
        }
        // for some reason in Chrome html2canvas does not use the correct font the first time
        await braille2canvas(braille, columns);
        let canvas = (await braille2canvas(braille, columns)).getContext("2d", {willReadFrequently: true});
        let patterns = new Array(columns * rows);
        let k = 0;
        for (let i = 0; i < rows; i++) {
            for (let j = 0; j < columns; j++)
                patterns[k++] = canvas.getImageData(Math.round(j * cellWidth),
                                                    Math.round(i * cellHeight),
                                                    Math.round(cellWidth),
                                                    Math.round(cellHeight));
        }
        return patterns;
    }

    let patterns = null;

    global.formatBraille = async function(braille, columns, css, script, options) {
        if (patterns == null) patterns = (await getPatternsImageData());
        let canvas = await braille2canvas(braille, columns, css, script, options);
        if (options != null && typeof options.debugCanvas === 'function')
            options.debugCanvas(canvas);
        let rows = Math.ceil(canvas.height / cellHeight);
        canvas = canvas.getContext("2d", {willReadFrequently: true});
        let formattedBraille = "";
        let diffCanvas, diff = null; {
            if (options != null && typeof options.debugMatch === 'function') {
                diffCanvas = document.createElement('canvas');
                diffCanvas.width = columns * cellWidth;
                diffCanvas.height = rows * cellHeight;
                diff = diffCanvas.getContext("2d", {willReadFrequently: true});
            }
        }
        for (let i = 0; i < rows; i++) {
            for (let j = 0; j < columns; j++) {
                let cell = canvas.getImageData(Math.round(j * cellWidth),
                                               Math.round(i * cellHeight),
                                               Math.round(cellWidth),
                                               Math.round(cellHeight));
                let bestMatch = -1;
                let bestPattern = 0;
                for (let n = 0; n < patterns.length; n++) {
                    if (bestMatch < 0 || bestMatch > 8) {
                        let d = pixelmatch(cell.data,
                                           patterns[n].data,
                                           null,
                                           Math.round(cellWidth),
                                           Math.round(cellHeight), {
                                               threshold: 0.1,
                                               diffColor: [0, 0, 0],
                                               aaColor: [255, 255, 255],
                                               alpha: 0.02
                                           });
                        if (bestMatch < 0 || d < bestMatch) {
                            bestMatch = d;
                            bestPattern = n;
                        }
                    }
                }
                if (diff != null) {
                    let cellDiff = diff.getImageData(Math.round(j * cellWidth),
                                                     Math.round(i * cellHeight),
                                                     Math.round(cellWidth),
                                                     Math.round(cellHeight));
                    pixelmatch(cell.data,
                               patterns[bestPattern].data,
                               cellDiff.data,
                               Math.round(cellWidth),
                               Math.round(cellHeight), {
                                   threshold: 0.1,
                                   diffColor: [0, 0, 0],
                                   aaColor: [255, 255, 255],
                                   alpha: 0.02
                               });
                    diff.putImageData(cellDiff,
                                      Math.round(j * cellWidth),
                                      Math.round(i * cellHeight));
                }
                formattedBraille += "&#" + (10240 + bestPattern) + ";";
            }
            formattedBraille += "&#xa;";
        }
        if (diffCanvas != null) {
            if (window.devicePixelRatio != 1) {
                let tmpCanvas = document.createElement('canvas');
                tmpCanvas.width = diffCanvas.width / window.devicePixelRatio;
                tmpCanvas.height = diffCanvas.height / window.devicePixelRatio;
                let context = tmpCanvas.getContext("2d");
                context.scale(1.0 / window.devicePixelRatio, 1.0 / window.devicePixelRatio);
                context.drawImage(diffCanvas, 0, 0);
                diffCanvas = tmpCanvas;
            }
            options.debugMatch(diffCanvas);
        }
        return formattedBraille;
    }

})(this);
