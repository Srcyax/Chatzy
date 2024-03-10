import axios from "axios";
import { Trash2 } from "lucide-react";

export function DeleteComment() {
	return (
		<>
			<Trash2 className="cursor-pointer hover:text-orange-400" width={13} />
		</>
	);
}
