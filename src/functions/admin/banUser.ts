import axios from "axios";

export async function Ban(id: number) {
	await axios
		.post("/api/admin/users/ban", {
			id: id,
		})
		.then((res) => console.log(res.data));
}
