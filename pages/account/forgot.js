import { useRouter } from "next/router";
import Link from "next/link";
import { useState } from "react";
import onTextChange from "../../utils/on-text-change";
import api, { snackFromError } from "../../utils/api";

const Forgot = () => {
	const [email, setEmail] = useState("");

	const sendLink = async (e) => {
		e.preventDefault();
		try {
			const res = await api.POST("/api/users/forgot", {
				data: { email },
			});

			alert(res.data.message);
		} catch (error) {
			alert(snackFromError(error));
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
				<h1>Forgot</h1>
				<div className="input-group">
					<label htmlFor="email">Email</label>
					<input
						name="email"
						value={email}
						onChange={onTextChange(setEmail)}
					/>
				</div>
				<button onClick={sendLink}>Email Reset Password Link</button> or{" "}
				<Link href="/account/login">
					<a>login</a>
				</Link>
			</form>
		</div>
	);
};
export default Forgot;
