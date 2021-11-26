# firenze-ceramic-management

This project contains scripts for managing Ceramic Network Data Model elements such as schemas, definitions and tiles. 
Current scripts:

- `create-model.ts`: Main script used for uploading the current version of schemas (found in `./schemas`) and returning a JSON file containing information related to these updated models.

## Create-Model

Running `create-model` requires a Ceramic node to be running locally.

### Run Ceramic Node locally

Ceramic CLI installation:

```bash
npm install -g @ceramicnetwork/cli
```
 
Local node execution (by default on localhost:7007):

```bash
ceramic daemon
```

### Creating the Data Model

(WIP)

- For more information: <https://developers.ceramic.network/tools/glaze/datamodel/>

### Key DID

(Note that the team should share the same DID for working with the Data Model that is going to be published on testnet or mainnet)

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

