const azure = require('azure-storage');
const uuid = require('uuid/v1');

const tableService = azure.createTableService();
const tableName = "mytable";

module.exports = function (context, req) {
    context.log('JavaScript HTTP trigger function processed a request.');

    if (req.query.name || (req.body && req.body.name)) {
        
        const item = { 
            name = (req.query.name || req.body.name) 
        };
        
        item["PartitionKey"] = "Partition";
        item["RowKey"] = uuid();

        // Use { echoContent: true } if you want to return the created item including the Timestamp & etag
        tableService.insertEntity(tableName, item, { echoContent: true }, function (error, result, response) {
            if (!error) {
                context.res.status(201).json(response);
            } else {
                context.res.status(500).json({ error: error });
            }
        });

        context.res.body = "Hello " + (req.query.name || req.body.name) + " we have saved something";
    }
    else {
        context.res = {
            status: 400,
            body: "Please pass a name on the query string or in the request body"
        };
    }

    context.done();
};