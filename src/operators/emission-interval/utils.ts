import { Options, Interval } from './types';

export const fillOptions = (options: Options): Required<Options> => {
    const length = typeof options.length === 'number' && !isNaN(options.length) ? options.length : 10;
    const label = typeof options.label === 'string' ? options.label : 'Emission interval';
    const formatter = typeof options.formatter === 'function' ? options.formatter : (v: Interval) => v;
    return {
        length,
        label,
        formatter,
    };
};
