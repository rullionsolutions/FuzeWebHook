const azure = require('azure-storage');
const uuid = require('uuid/v1');

const tableService = azure.createTableService();
const tableName = "calls";

module.exports = function (context, req) {
    context.log('Recieved call back from Fuze');

    if (req.body.call && req.body.call.linkedId) {
        
        var call = req.body.call;

        //remove this once we understand the content properly
        context.log(call);

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

        //We may need to derive the user no matter the direction?

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
            body: "no call.linkedId found in the body of the request"
        };
        context.done();
    }
};