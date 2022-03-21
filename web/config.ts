export const config = {
  site: {
    title: 'TeamSpirit',
    url: process.env.NEXT_PUBLIC_SITE_URL || 'https://maxtestabc123.loca.lt',
    articles: {
      pagePrefix: 'blog',
      pageSize: 5,
    },
    auth: {
      signInPath: 'login',
    },
  },
  cms: {
    dataset:
      process.env.NEXT_PUBLIC_SANITY_DATASET === 'staging'
        ? 'staging'
        : 'production',
    projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID, // sanity project id
    useCdn: process.env.NODE_ENV === 'production',
    // useCdn == true gives fast, cheap responses using a globally distributed cache.
    // Set this to false if your application require the freshest possible
    // data always (potentially slightly slower and a bit more expensive).
  },
  munin: {
    url: process.env.NEXT_PUBLIC_SUPABASE_URL,
    key: process.env.NEXT_PUBLIC_SUPABASE_KEY,
  },
  cookies: {
    comingSoon: {
      name: 'user',
      lifetime: 1,
    },
    acceptCookies: {
      name: 'accept_cookies',
      lifetime: 8760,
    },
  },
};
