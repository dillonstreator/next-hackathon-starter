import React, { Component } from "react";

export default function privateRoute(
	WrappedComponent,
	{
		isAllowed = ({ req }) => req.isAuthenticated(),
		redirectTo = "/account/login",
	}
) {
	return class extends Component {
		static async getInitialProps(ctx) {
			const { res } = ctx;
			if (!isAllowed(ctx)) {
				res.redirect(redirectTo);
				return;
			}

			if (WrappedComponent.getInitialProps) {
				const wrappedProps = await WrappedComponent.getInitialProps(ctx);
				return { ...wrappedProps };
			}
			return {};
		}

		render() {
			return <WrappedComponent {...this.props} />;
		}
	};
}
