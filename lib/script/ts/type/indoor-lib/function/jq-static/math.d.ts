interface JQueryStatic {
	gx_sum1: (arr: number[] | string[] | Array<number | string>) => number;
	gx_avg1: (arr: number[] | string[] | Array<number | string>) => number;

	gx_sum2: (arr: number[] | string[] | Array<number | string>) => number;

	gx_math: {
		sum: (arr: number[] | string[] | Array<number | string>) => number;
		avg: (arr: number[] | string[] | Array<number | string>) => number;
	};
}