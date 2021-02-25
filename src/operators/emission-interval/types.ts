export type Options = Partial<{
    length: number;
    label: string;
    formatter: (interval: Interval) => any;
}>;

export type Interval = number[];
