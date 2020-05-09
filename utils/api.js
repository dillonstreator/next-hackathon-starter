import axios from "axios";
import _get from "lodash/get";

const makeRequest = (method) => (path, params) => {
	return axios({
		url: path,
		method,
		...params,
	});
};

export default {
	GET: makeRequest("GET"),
	POST: makeRequest("POST"),
	DELETE: makeRequest("DELETE"),
};

export const messageFromError = (error) => {
	let message = "";
	let data = _get(error, "response.data", {});
	data = { errors: [], message: "There was an issue", ...data };
	if (data.errors.length)
		message = data.errors.map(({ msg }) => `${msg}`).join("");
	else message = data.message;
	
	return message;
}
