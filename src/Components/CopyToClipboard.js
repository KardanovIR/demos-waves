export function copyToClipboard(value) {
	const input = document.createElement('input');
	input.setAttribute('value', value);
	document.body.appendChild(input);
	input.select();
	const result = document.execCommand('copy');
	document.body.removeChild(input);
	return result;
}