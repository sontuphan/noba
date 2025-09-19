export type MaybePromise<T> = void | T | Promise<void | T>

export type Func<I, O> = (opts: I) => MaybePromise<O>
