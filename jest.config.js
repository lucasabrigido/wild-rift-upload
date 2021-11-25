module.exports = {
    verbose: true,
    noStackTrace: true,
    testEnvironment: 'node',
    collectCoverage: false,
    collectCoverageFrom: ['src/*.js', 'src/**/*.js'],
    testMatch: ['<rootDir>/__tests__/*.spec.js', '<rootDir>/__tests__/**/*.spec.js'],
};
