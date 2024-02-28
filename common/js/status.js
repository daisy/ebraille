
function addDAISYStatus() {

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
	
	var statusSpan = document.createElement('span');
		statusSpan.id = 'daisy-status';
		statusSpan.appendChild(document.createTextNode('DAISY ' + status[daisyStatus]));
	
	document.getElementById('w3c-state').insertAdjacentElement('afterBegin', statusSpan);

}
