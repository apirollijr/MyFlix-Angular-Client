
export default {
  basePath: '/MyFlix-Angular-Client',
  supportedLocales: {
  "en-US": ""
},
  entryPoints: {
    '': () => import('./main.server.mjs')
  },
};
