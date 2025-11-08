
export default {
  bootstrap: () => import('./main.server.mjs').then(m => m.default),
  inlineCriticalCss: true,
  baseHref: '/MyFlix-Angular-Client/',
  locale: undefined,
  routes: undefined,
  entryPointToBrowserMapping: {},
  assets: {
    'index.csr.html': {size: 23637, hash: '8f7c46a2694182c2d954f7f51658c2213c52680fd279325a737c040ca9452e9c', text: () => import('./assets-chunks/index_csr_html.mjs').then(m => m.default)},
    'index.server.html': {size: 17169, hash: '0ed0e60c48e5ebca6c56e17e2594386c06dca6a074dd7df05c92447c9ed122fb', text: () => import('./assets-chunks/index_server_html.mjs').then(m => m.default)},
    'styles-UPVOAPPL.css': {size: 7385, hash: 'U8dWGGNxXSg', text: () => import('./assets-chunks/styles-UPVOAPPL_css.mjs').then(m => m.default)}
  },
};
