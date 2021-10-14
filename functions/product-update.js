const faunadb = require('faunadb');
const verifyWebhookIntegrity = require('shopify-verify-webhook');
const axios = require('axios');

const q = faunadb.query;
const client = new faunadb.Client({
  secret: process.env.FAUNADB_SECRET,
});

//Passing functions to the cloud. An endpoint function
exports.handler = function (event, context, callback) {
  const isValid = verifyWebhookIntegrity(
    process.env.SHOPIFY_WEBHOOK_KEY,
    event.headers['x-shopify-hmac-sha256'],
    event.body
  );

  if (isValid) {
    const body = JSON.parse(event.body);
    const { id } = body;
    //Removing unnecessary data
    delete body.updated_at;

    //Cleaning up the product data
    body.variants.forEach(variant => {
      delete variant.updated_at;
      delete variant.inventory_quantity;
      delete variant.old_inventory_quantity;
    });
    const bodyString = JSON.stringify(body);

    //Checking to see if this product is in FaunaDB
    client
      .query(q.Get(q.Match(q.Index('product_by_id'), id)))
      .then(result => {
        if (result.data.product !== bodyString) {
          //updating faunaDB
          client
            .query(
              q.Update(result.ref, {
                data: {
                  product: bodyString,
                },
              })
            )
            .then(() => {
              //Calling Rebuild
              axios.post(process.env.NETLIFY_BUILD_URL);
            })
            .catch(e => {
              console.log('Error updating FaunaDB Item', e);
            });
        }
      })
      .catch(() => {
        //If the product doesn't exist in faunaDB, here is where we add it
        client
          .query(
            q.Create(q.Collection('products'), {
              data: { id, product: body.string },
            })
          )
          .then(() => {
            //Calling rebuild
            axios.post(process.env.NETLIFY_BUILD_URL);
          })
          .catch(e => {
            console.log('Error trying to add new item to FaunaDB', e);
          });
      });
  } else {
    callback(null, {
      statusCode: 403,
      body: 'Error',
    });
  }
};
