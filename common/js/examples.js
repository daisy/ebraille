
function fixExampleHeaders() {

	var examples = document.getElementsByClassName('marker');
	
	for (var i = 0; i < examples.length; i++) {
		var hd = examples[i];
		if (hd.parentElement.tagName.toLowerCase() !== 'aside') {
			continue;
		}
		
		var parent = hd.closest('section').querySelector('h1,h2,h3,h4,h5,h6');
		var hd_num = parent.tagName.substring(1);
		
		if (hd_num < 6) {
			hd_num = Number(hd_num) + 1;
		}
		
		hd.setAttribute('role', 'heading');
		hd.setAttribute('aria-level', hd_num);
	}
}
