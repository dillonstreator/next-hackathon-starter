declare global {
	namespace NodeJS {
		interface ProcessEnv {
			DATABASE_URL: string;
			NODE_ENV: "development" | "production";
			PORT?: number;
		}
	}
}

declare namespace Express {
    export interface Request {
        token: any;
    }
    export interface Response {
        token: any;
    }
}