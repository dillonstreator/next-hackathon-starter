import { useRouter } from "next/router";
import Link from "next/link";
import { useState } from "react";
import onTextChange from "../../utils/on-text-change";
import api, { messageFromError } from "../../utils/api";

const Verify = () => {
	const router = useRouter();
	const [email, setEmail] = useState(router.query.email || "");

	const sendLink = async (e) => {
		e.preventDefault();
		try {
			const res = await api.POST("/api/users/verify", {
				data: { email },
			});

			alert(res.data.message);
			router.push("/account/login");
		} catch (error) {
			alert(messageFromError(error));
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
				<h1>Verify</h1>
				<div className="input-group">
					<label htmlFor="email">Email</label>
					<input
						name="email"
						value={email}
						onChange={onTextChange(setEmail)}
					/>
				</div>
				<button onClick={sendLink}>Email Verification Link</button> or{" "}
				<Link href="/account/login"><a>login</a></Link>
			</form>
		</div>
	);
};
export default Verify;
