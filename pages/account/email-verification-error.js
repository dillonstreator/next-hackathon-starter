import Link from 'next/link';

const EmailVerificationError = () => (
	<div>
		<p>The verification link in your email is either outdated or you've already confirmed your email address.</p>
        <p>If you have not yet confirmed your email address, please request a new confirmation email <Link href="/account/verify">here</Link></p>
	</div>
);
export default EmailVerificationError;
