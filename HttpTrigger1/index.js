const azure = require('azure-storage');
const uuid = require('uuid/v1');

const tableService = azure.createTableService();
const tableName = "mytable";

module.exports = function (context, req) {
    //context.log('JavaScript HTTP trigger function processed a request.');

    if (req.body.call && req.body.call.linkedId) {
        
        var call = req.body.call;

        const item = { 
            PartitionKey: call.direction,
            RowKey: call.linkedId,
            startedAt: call.startedAt,
            endedAt: call.endedAt,
            duration: call.duration
        };


        //from.number
        //from.number_e164
        //from.name
        //from.userId
        //from.departmentName

        //to.number
        //to.number_e164
        //to.name
        //to.userId
        //to.departmentName

        //item["PartitionKey"] = "Partition";
        //item["RowKey"] = uuid();


        // Use { echoContent: true } if you want to return the created item including the Timestamp & etag
        tableService.insertEntity(tableName, item, { echoContent: false }, function (error, result, response) {
            if (!error) {
                context.res.status(201).json(response);
            } else {
                context.log(error);
                context.res.status(500).json({ error: error });
            }
        });
    }
    else {
        context.res = {
            status: 400,
            body: "Please pass a name on the query string or in the request body"
        };
        context.done();
    }
};