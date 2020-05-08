import Link from "next/link";
import { useRouter } from "next/router";
import { useState } from "react";
import api, { snackFromError } from "../../utils/api";
import onTextChange from "../../utils/on-text-change";

const Login = () => {
	const router = useRouter();
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");

	const postLogin = async (e) => {
		e.preventDefault();
		try {
			const res = await api.POST("/api/sessions", {
				data: { email, password },
			});

			alert(res.data.message);
			router.push("/");
		} catch (error) {
			const message = snackFromError(error);
			alert(message);
		} finally {
			setEmail("");
			setPassword("");
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
				<h1>Login</h1>
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
				<button onClick={postLogin}>Login</button> or{" "}
				<Link href="/account/signup">
					<a>signup</a>
				</Link>
				<div className="input-group">
					<Link href="/account/forgot">
						<a>forgot password?</a>
					</Link>
					<Link href="/account/verify">
						<a>email verification</a>
					</Link>
				</div>
			</form>
		</div>
	);
};
export default Login;
