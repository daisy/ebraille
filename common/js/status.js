
function addDAISYStatus() {

	/* delete the default W3C sotd paragraph no matter what */
	var sotd = document.querySelector('section#sotd :nth-child(2)');
		sotd.remove();
	
	if (!respecConfig.hasOwnProperty('daisyStatus')) {
		console.log('daisyStatus property not set. No status will be added.')
		return;
	}
	
	const status = {
		'ed': 'Editor\'s Draft',
		'wd': 'Working Draft',
		'cr': 'Candidate Recommendation',
		'pr': 'Proposed Recommendation',
		'rec': 'Recommendation'
	};
	
	var daisyStatus = respecConfig.daisyStatus.toLowerCase();
	
	if (!status.hasOwnProperty(daisyStatus)) {
		console.log('Unknown status "' + daisyStatus + '" set. No status will be added.');
		return;
	}
	
	/* add status to the title */
	
	var statusSpan = document.createElement('span');
		statusSpan.id = 'daisy-status';
		statusSpan.appendChild(document.createTextNode('DAISY ' + status[daisyStatus]));
	
	document.getElementById('w3c-state').insertAdjacentElement('afterBegin', statusSpan);
	
	/* add status to placeholders */
	
	var statusLabel = document.getElementsByClassName('daisy-status');
	
	for (var i = 0; i < statusLabel.length; i++) {
		statusLabel[i].innerHTML = (daisyStatus === 'ed' ? 'an ' : 'a ') + status[daisyStatus];
	}
	
	/* add working group */

	var wgLabel = document.getElementsByClassName('daisy-wg');
	
	for (var i = 0; i < wgLabel.length; i++) {
		wgLabel[i].innerHTML = respecConfig.daisyWG;
	}
	
}
