"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const config = {
    preset: 'ts-jest',
    testEnvironment: 'node',
    clearMocks: true,
    collectCoverage: true,
    coverageDirectory: 'coverage',
    coverageProvider: 'v8',
    transform: {
        '^.+\\.ts?$': 'ts-jest',
    },
    moduleNameMapper: {
        '@/(.*)': '<rootDir>/src/$1',
    },
    globalSetup: '<rootDir>/tests/global-setup.ts',
    globalTeardown: '<rootDir>/tests/global-teardown.ts',
};
exports.default = config;
