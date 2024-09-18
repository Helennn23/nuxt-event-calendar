type TRouteNamedMapKeys = keyof import('vue-router/auto/routes').RouteNamedMap

type TStripLanguage<T> = T extends `${infer Route}___${string}` ? Route : never;

type TRouteNames = TStripLanguage<TRouteNamedMapKeys>
