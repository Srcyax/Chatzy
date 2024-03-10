import { setTimeout } from "timers";

export function ValidateInput(text: string, length: number) {
	if (!text.replace(/^[\x00-\xFF]*$/, "")) {
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
