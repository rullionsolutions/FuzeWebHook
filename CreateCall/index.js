const azure = require('azure-storage');
const uuid = require('uuid/v1');

const tableService = azure.createTableService();
const tableName = "calls";

module.exports = function (context, req) {
    context.log('Recieved call back from Fuze');
    context.log(req.body);
    if (req.body.content && req.body.content.linkedId) {
        
        var retrievalId = req.body.retrievalId;
        var call = req.body.content;

        //remove this once we understand the content properly
        //context.log(call);

        const item = { 
            PartitionKey: call.direction,
            RowKey: retrievalId,

            startedAt: call.startedAt,
            endedAt: call.endedAt,
            duration: call.duration,

            from_number: call.from.number,
            from_number_e164: call.from.number_e164,
            from_name: call.from.name || "",
            from_userId: call.from.userId || "",
            

            to_number: call.to.number,
            to_number_e164: call.to.number_e164,
            to_name: call.to.name || "",
            to_userId: call.to.userId || "",
            
            name: call.from.name || call.to.name,
            userid : call.from.userId || call.ti.userid,

            departmentName: call.from.departmentName || call.to.departmentName
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