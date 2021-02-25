import { pathsToModuleNameMapper } from 'ts-jest/utils';
import type { Config } from '@jest/types';

// Utils
import { loadTSConfig } from './webpack.utils';

const tsconfig = loadTSConfig();

const config: Config.InitialOptions = {
    preset: 'ts-jest',
    verbose: true,
    testEnvironment: 'node',
    moduleNameMapper: pathsToModuleNameMapper(tsconfig.compilerOptions.paths, {
        prefix: '<rootDir>/',
    }),
};

export default config;
