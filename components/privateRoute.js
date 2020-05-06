import React, { Component } from "react";

export default function privateRoute(WrappedComponent) {
	return class extends Component {
		static async getInitialProps(ctx) {
			const { res, req } = ctx;
			if (!req.isAuthenticated()) {
				res.redirect("/account/login");
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
