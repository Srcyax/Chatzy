import axios from "axios";

export async function Delete(id: number) {
	await axios
		.post("/api/admin/forums/delete", {
			id: id,
		})
		.then((res) => console.log(res.data));
}
