module.exports = {
    testEnvironment: 'jsdom',
    roots: ['<rootDir>/tests'],
    testMatch: ['**/*.test.ts', '**/*.test.tsx', '**/*.test.js'],
    transform: {
        '^.+\\.(ts|tsx)$': ['babel-jest', {
            presets: [
                '@babel/preset-env',
                '@babel/preset-react',
                '@babel/preset-typescript'
            ]
        }],
        '^.+\\.(js|jsx)$': ['babel-jest', {
            presets: [
                '@babel/preset-env',
                '@babel/preset-react'
            ]
        }]
    },
    moduleNameMapper: {
        '^@/(.*)$': '<rootDir>/app/$1',
        '\\.(css|less|scss|sass)$': '<rootDir>/tests/__mocks__/styleMock.js',
        '\\.(jpg|jpeg|png|gif|svg)$': '<rootDir>/tests/__mocks__/fileMock.js'
    },
    setupFilesAfterEnv: ['<rootDir>/tests/setup.js'],
    collectCoverageFrom: [
        'app/**/*.{ts,tsx}',
        'api/**/*.{ts,js}',
        '!**/*.d.ts',
        '!**/node_modules/**'
    ],
    reporters: [
        'default',
        ['jest-junit', {
            outputDirectory: '.',
            outputName: 'junit.xml',
            classNameTemplate: '{classname}',
            titleTemplate: '{title}'
        }]
    ]
};

