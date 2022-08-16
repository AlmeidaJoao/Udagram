import express from 'express';
import bodyParser from 'body-parser';
import {filterImageFromURL, deleteLocalFiles} from './util/util';

(async () => {

  // Init the Express application
  const app = express();

  // Set the network port
  const port = process.env.PORT || 8082;
  
  // Use the body parser middleware for post requests
  app.use(bodyParser.json());

  // @TODO1 IMPLEMENT A RESTFUL ENDPOINT
  // GET /filteredimage?image_url={{URL}}
  // endpoint to filter an image from a public url.
  // IT SHOULD
  //    1
  //    1. validate the image_url query
  //    2. call filterImageFromURL(image_url) to filter the image
  //    3. send the resulting file in the response
  //    4. deletes any files on the server on finish of the response
  // QUERY PARAMATERS
  //    image_url: URL of a publicly accessible image
  // RETURNS
  //   the filtered image file [!!TIP res.sendFile(filteredpath); might be useful]

  /**************************************************************************** */
  app.get("/filteredimage/", async(req, res) => {
    try {
	    const imageUrl = req.query.image_url
	    let listOfPaths: string[] = []
	    // Return an error if the image URL is not provided
	    if (!imageUrl) {
	      return res.status(400).send("A url must be provided!")
	    }
	
	    const filteredPath = await filterImageFromURL(imageUrl)
	    listOfPaths.push(filteredPath)

	    res.sendFile(filteredPath, function(error) {
        if (error) {
          res.status(400).send("Something went wrong!")
        }
        deleteLocalFiles(listOfPaths)
      })
	      
    } catch (e) {
      res.status(400).send(e)
    }
  })
  //! END @TODO1
  
  // Root Endpoint
  // Displays a simple message to the user
  app.get( "/", async ( req, res ) => {
    res.send("try GET /filteredimage?image_url={{}}")
  } );
  

  // Start the Server
  app.listen( port, () => {
      console.log( `server running http://localhost:${ port }` );
      console.log( `press CTRL+C to stop server` );
  } );
})();