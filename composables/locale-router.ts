export function useLocaleRouteName () {
  const { locale } = useI18n()

  return (routeNameRaw: TRouteNames) => `${routeNameRaw}___${locale.value}` as TRouteNamedMapKeys
}
