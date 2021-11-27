# firenze-ceramic-management

This project contains scripts for managing Ceramic Network Data Model elements such as schemas, definitions and tiles. 
Current scripts:

- `create-update-model.ts`: Main script used for uploading the current version of schemas (found in `./schemas`) and returning a JSON file containing information related to these updated models. If any changes are done to previously-existing schema files, this script should be executed in order to upload them to the network and have firenze pick up the new versions. 

## Create-Update-Model.ts

Running `create-update-model` requires a Ceramic node to be running and a valid DID key. 

By defining CERAMIC_NODE on the .env files, you can choose which environment you can deploy the schema nodes to:

- testnet: https://ceramic-clay.3boxlabs.com
- local: http://localhost:7007; or wherever you are hosting the node

### Run Ceramic Node locally

You can skip this step if you are trying to connect to the testnet.
Ceramic CLI installation:

```bash
npm install -g @ceramicnetwork/cli
```
 
Local node execution (by default on localhost:7007):

```bash
ceramic daemon
```

### DID Key

(Skip if already done. Note that the team should share the same DID for working with the Data Model that is going to be published on testnet or mainnet)

For operating with glaze we need a DID.
Take into account that only the creator DID can manipulate existing models.
The DID should be stored securely since it is a private credential.

Install CLI
```bash
npm install --global @glazed/cli
```

Generate a DID
```bash
glaze did:create
```

### Creating the Data Model

Schemas are defined in `./schemas` and need to be JSON-schema files. 

- For more information: <https://developers.ceramic.network/tools/glaze/datamodel/>

The output of the script will be `published-model.json` which contains stream IDs for the updated schema 

### Running the script

After the above requirements are met, you can run the script with `ts-node create-update-model.ts` or from the parent project by doing `yarn ceramic-create-update-model`.