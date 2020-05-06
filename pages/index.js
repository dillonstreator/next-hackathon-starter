import api from "../utils/api";
import { useRouter } from "next/router";

const Home = () => {
	const router = useRouter();

	const logout = () => {
		api.DELETE("/api/sessions").finally(() => router.push("/account/login"));
	};

	return (
		<div>
			<p>Homepage!</p>
			<button onClick={logout}>logout</button>
		</div>
	);
};
export default Home;
