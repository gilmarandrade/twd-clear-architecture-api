module.exports = {
	roots: ["/src"],
	clearMocks: true,
	coverageDirectory: "coverage",
	coverageProvider: "v8",
	collectCoverageFrom: ["/src/**/*.ts"],
	testEnvironment: "node",
	transform: {
		".+\\.ts$": "ts-jest",
	},
}