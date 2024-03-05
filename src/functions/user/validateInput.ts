export function ValidateInput(text: string, length: number) {
	if (!text.replace(/[^a-zA-Z0-9 ]/g, "")) {
		return false;
	}

	if (!text.trim()) {
		return false;
	}

	if (text.length > length) {
		return false;
	}

	return true;
}
