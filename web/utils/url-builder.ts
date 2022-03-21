const staticRouteIdToUrl = {
  index: '/',
  account: '/account',
};

export function staticPageUrlBuilder(routeId: string): string {
  return staticRouteIdToUrl[routeId] || '/';
}
