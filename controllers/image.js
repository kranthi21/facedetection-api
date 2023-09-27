



const handleAPI1 = (req,res) => {
    console.log('input', req.body.input);
    // Your PAT (Personal Access Token) can be found in the portal under Authentification
    const PAT = '2139bcf4dd074b5d87a1d0da705a73cc';
    // Specify the correct user_id/app_id pairings
    // Since you're making inferences outside your app's scope
    const USER_ID = 'ironspidey21';       
    const APP_ID = 'my-first-application-ygf2gv';
    // Change these to whatever model and image URL you want to use
    const MODEL_ID = 'face-detection';
    const MODEL_VERSION_ID = '6dc7e46bc9124c5c8824be4822abe105';
    const IMAGE_URL = req.body.input;

    ///////////////////////////////////////////////////////////////////////////////////
    // YOU DO NOT NEED TO CHANGE ANYTHING BELOW THIS LINE TO RUN THIS EXAMPLE
    ///////////////////////////////////////////////////////////////////////////////////

    const { ClarifaiStub, grpc } = require("clarifai-nodejs-grpc");

    const stub = ClarifaiStub.grpc();

    // This will be used by every Clarifai endpoint call
    const metadata = new grpc.Metadata();
    metadata.set("authorization", "Key " + PAT);

    stub.PostModelOutputs(
        {
            user_app_id: {
                "user_id": USER_ID,
                "app_id": APP_ID
            },
            model_id: MODEL_ID,
            version_id: MODEL_VERSION_ID, // This is optional. Defaults to the latest model version
            inputs: [
                { data: { image: { url: IMAGE_URL, allow_duplicate_url: true } } }
            ]
        },
        metadata,
        (err, response) => {
            if (err) {
                throw new Error(err);
            }

            if (response.status.code !== 10000) {
                throw new Error("Post model outputs failed, status: " + response.status.description);
            }

            // Since we have one input, one output will exist here
            const output = response.outputs[0];

            console.log("Predicted concepts:");
            // for (const concept of output.data.concepts) {
            //     console.log(concept.name + " " + concept.value);
            // }
            res.json(response);
        }

    );
}


//----------------------------------------------------------------------------------------------------------------------
   

const MODEL_ID = 'face-detection';
const setup_returnRequstOptions = (imgUrl) =>{
///////////////////////////////////////////////////////////////////////////////////////////////////
// In this section, we set the user authentication, user and app ID, model details, and the URL
// of the image we want as an input. Change these strings to run your own example.
//////////////////////////////////////////////////////////////////////////////////////////////////


  // Your PAT (Personal Access Token) can be found in the portal under Authentification
  const PAT = '2139bcf4dd074b5d87a1d0da705a73cc';
  // Specify the correct user_id/app_id pairings
  // Since you're making inferences outside your app's scope
  const USER_ID = 'ironspidey21';       
  const APP_ID = 'my-first-application-ygf2gv';
  // Change these to whatever model and image URL you want to use
  
  const IMAGE_URL = imgUrl;

  const raw = JSON.stringify({
    "user_app_id": {
        "user_id": USER_ID,
        "app_id": APP_ID
    },
    "inputs": [
        {
            "data": {
                "image": {
                    "url": IMAGE_URL
                }
            }
        }
    ]
  });

  const requestOptions = {
    method: 'POST',
    headers: {
        'Accept': 'application/json',
        'Authorization': 'Key ' + PAT
    },
    body: raw
  };

  return requestOptions;
}


const handleAPI = (req,res) => {
    console.log('input', req.body.input);
    fetch("https://api.clarifai.com/v2/models/" + MODEL_ID +  "/outputs", setup_returnRequstOptions(req.body.input))
    .then(data => {
        console.log(data.json())
        res.json(data);
    })
    .catch(err => res.status(400).json('error using API,', err));
}

const handleImage = (req, res, db) => {
    const {id} = req.body;
    
    db('users')
    .where({id})
    .increment('entires', 1)
    .returning('entires')
    .then(entires => res.json(entires[0].entires))
    .catch(err => res.status(400).json("unable to get entries"));

}

module.exports = {
    handleImage: handleImage,
    handleAPI1 : handleAPI1
};