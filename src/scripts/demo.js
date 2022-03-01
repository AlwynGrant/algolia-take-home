const algoliasearch = require('algoliasearch');
const indexName = process.env.ALGOLIA_INDEX
const client = algoliasearch(
    process.env.ALGOLIA_APP_ID,
    process.env.ALGOLIA_API_KEY
)
const index = client.initIndex(indexName);



// populate brand & category sections
(async function settings() {
    await index.setSettings({
        attributesForFaceting: [
            'categories',
            'brand'
        ]
    })
})()


async function discountItems () {
    const { hits } = await index.search("Cameras & Camcorders"),
          objects = []

    for (let hit of hits) {
        const discount = Math.floor(hit.price - (hit.price / 100) * 20)

         objects.push({
            'price': (String(hit.price).endsWith("9")) ? discount : hit.price,
            'objectID': `${hit.objectID}`
        })
    }
    await index.partialUpdateObjects(objects)
}

discountItems()
