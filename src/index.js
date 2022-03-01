import { autocomplete, getAlgoliaResults } from '@algolia/autocomplete-js';
import algoliasearch from 'algoliasearch';

import { createAlgoliaInsightsPlugin } from '@algolia/autocomplete-plugin-algolia-insights';
import insightsClient from 'search-insights';

const appId = process.env.ALGOLIA_APP_ID;
const apiKey = process.env.ALGOLIA_API_KEY;
const searchClient = algoliasearch(appId, apiKey);

insightsClient('init', { appId, apiKey, useCookie: true })

const algoliaInsightsPlugin = createAlgoliaInsightsPlugin({ insightsClient })

autocomplete({
  container: '#autocomplete',
  placeholder: "search...",
  openOnFocus: true,
  plugins: [ algoliaInsightsPlugin ],
  getSources({ query }) {
    return [
      {
        sourceId: 'products',
        getItems() {
          return getAlgoliaResults({
            searchClient,
            queries: [
              {
                indexName: process.env.ALGOLIA_INDEX,
                query,
                params: {
                  clickAnalytics: true,
                },
              },
            ],
          });
        },
        templates: {
          item({ item, components, createElement }) {
            return createElement(
              'div',
              { className: 'aa-ItemWrapper' },
              createElement(
                'div',
                { className: 'aa-ItemIcon' },
                createElement('img', {
                  src: item.image,
                  alt: item.name,
                  width: 40,
                  height: 40,
                })
              ),
              createElement(
                'div',
                { className: 'aa-ItemContent' },
                createElement(
                  'div',
                  { className: 'aa-ItemContentTitle' },
                  components.Snippet({ hit: item, attribute: 'name' }),
                  createElement(
                    'div',
                    { className: 'aa-ItemContentDescription' },
                    components.Snippet({ hit: item, attribute: 'description' })
                  )
                )
              ),
              createElement(
                'button',
                {
                  className: 'aa-ItemActionButton aa-DesktopOnly aa-ActiveOnly',
                  type: 'button',
                },
                createElement(
                  'svg',
                  {
                    viewBox: '0 0 24 24',
                    width: 20,
                    height: 20,
                    fill: 'currentColor',
                  },
                  createElement('path', {
                    d: 'M18.984 6.984h2.016v6h-15.188l3.609 3.609-1.406 1.406-6-6 6-6 1.406 1.406-3.609 3.609h13.172v-4.031z',
                  })
                )
              )
            );
          },
        },
      },
    ];
  },
});
