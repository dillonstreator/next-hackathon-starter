import Link from "next/link";
import { useRouter } from "next/router";
import { useState } from "react";
import api, { snackFromError } from "../../utils/api";
import onTextChange from "../../utils/on-text-change";

const Signup = () => {
	const router = useRouter();
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [passwordConfirm, setPasswordConfirm] = useState("");

	const postSignup = async (e) => {
		e.preventDefault();
		try {
			const res = await api.POST("/api/users", {
				data: { email, password, passwordConfirm },
			});

			alert(res.data.message);
			router.push("/account/login");
		} catch (error) {
			const message = snackFromError(error);
			alert(message);
		} finally {
			setEmail("");
			setPassword("");
			setPasswordConfirm("");
		}
	};

	return (
		<div
			style={{
				flex: "auto",
				display: "flex",
				flexDirection: "column",
				alignItems: "center",
				justifyContent: "center",
			}}
		>
			<form>
				<h1>Signup</h1>
				<div className="input-group">
					<label htmlFor="email">Email</label>
					<input
						name="email"
						value={email}
						onChange={onTextChange(setEmail)}
					/>
				</div>
				<div className="input-group">
					<label htmlFor="password">Password</label>
					<input
						type="password"
						name="password"
						value={password}
						onChange={onTextChange(setPassword)}
					/>
				</div>
				<div className="input-group">
					<label htmlFor="passwordConfirm">Confirm</label>
					<input
						type="password"
						name="passwordConfirm"
						value={passwordConfirm}
						onChange={onTextChange(setPasswordConfirm)}
					/>
				</div>
				<button onClick={postSignup}>Signup</button>{" "}
				or <Link href="/account/login"><a>login</a></Link>
			</form>
		</div>
	);
};
export default Signup;
