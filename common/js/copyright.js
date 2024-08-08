
function addCopyrightYear() {

	var copyrightYearSpan = document.getElementById('copyYear');
	var copyrightYear = copyrightYearSpan.innerText;
	var currentYear = new Date().getFullYear();
	
	if (Number(copyrightYear) === currentYear) {
		return;
	}
	
	copyrightYearSpan.innerText = copyrightYear + '-' + currentYear;

}
