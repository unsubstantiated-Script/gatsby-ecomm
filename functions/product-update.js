//Passing functions to the cloud. An endpoint function
exports.handler = function (event, context, callback) {
  callback(null, {
    statusCode: 200,
    body: 'Hello Potato',
  });
};
