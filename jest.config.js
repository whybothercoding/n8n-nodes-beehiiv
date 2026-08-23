/** @type {import('jest').Config} */
module.exports = {
	preset: 'ts-jest',
	testEnvironment: 'node',
	roots: ['<rootDir>/nodes', '<rootDir>/credentials'],
	testMatch: ['<rootDir>/nodes/**/*.test.ts', '<rootDir>/credentials/**/*.test.ts'],
	collectCoverageFrom: ['nodes/**/*.ts', '!nodes/**/*.test.ts'],
	modulePathIgnorePatterns: ['<rootDir>/dist/'],
	watchman: false,
	transform: {
		'^.+\\.ts$': ['ts-jest', { tsconfig: '<rootDir>/tsconfig.jest.json' }],
	},
};
