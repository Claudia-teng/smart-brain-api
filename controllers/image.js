const {ClarifaiStub, grpc} = require("clarifai-nodejs-grpc");

const handleApiCall = (req, res) => {
    const stub = ClarifaiStub.grpc();
    const metadata = new grpc.Metadata();
    metadata.set("authorization", "Key bc3d45a765e84e7b9050b8bac7e50644");

    stub.PostModelOutputs(
        {
            model_id: "53e1df302c079b3db8a0a36033ed2d15",
            inputs: [{data: {image: {url: req.body.input}}}]
        },
        metadata,
        (err, response) => {
            if (err) {
                res.status(400).json('enable to work with API')
                console.log("Error: " + err);
                return;
            }
    
            if (response.status.code !== 10000) {
                console.log("Received failed status: " + response.status.description + "\n" + response.status.details);
                return;
            }
    
            console.log("Predicted concepts, with confidence values:", response)
            res.json(response.outputs[0].data.concepts);
            for (const c of response.outputs[0].data.concepts) {
                console.log(c.name + ": " + c.value);
            }
        }
    );
}

const handleImage = (req, res, db) => {
    const { id } = req.body;
    db('users').where('id', '=', id)
        .increment('entries', 1)
        .returning('entries')
        .then(entries => {
            res.json(entries[0]);
        })
        .catch(err => res.status(400).json('unable to get entries'))
}

module.exports = {
    handleImage: handleImage,
    handleApiCall: handleApiCall
}