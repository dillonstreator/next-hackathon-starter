import { useRouter } from "next/router";
import Link from "next/link";
import { useState } from "react";
import onTextChange from "../../utils/on-text-change";
import api, { snackFromError } from "../../utils/api";

const Reset = () => {
	const router = useRouter();
	const [password, setPassword] = useState("");

	const resetPassword = async (e) => {
		e.preventDefault();
		try {
			const { token } = router.query;
			const res = await api.POST(`/api/users/reset/${token}`, {
				data: { password },
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
				<h1>Reset</h1>
				<div className="input-group">
					<label htmlFor="password">New Password</label>
					<input
						name="password"
						type="password"
						value={password}
						onChange={onTextChange(setPassword)}
					/>
				</div>
				<button onClick={resetPassword}>Reset Password</button> or{" "}
				<Link href="/account/login">
					<a>login</a>
				</Link>
				<div className="input-group">
					<Link href="/account/forgot">
						<a>new reset link</a>
					</Link>
				</div>
			</form>
		</div>
	);
};
export default Reset;
