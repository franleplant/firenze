import { writeFile } from 'node:fs/promises'
import { CeramicClient } from '@ceramicnetwork/http-client'
import { ModelManager } from '@glazed/devtools'
import { DID } from 'dids'
import { Ed25519Provider } from 'key-did-provider-ed25519'
import { getResolver } from 'key-did-resolver'
import { fromString } from 'uint8arrays'
import dotenv from 'dotenv'
import invariant from "ts-invariant"

import profileModel from "./schemas/profile.json"
import conversationsModel from "./schemas/conversations.json"

async function main() {
  dotenv.config();

  // The key must be provided as an environment variable
  invariant(process.env.DID_KEY);
  const key = fromString(process.env.DID_KEY, 'base16');
  
  // Create and authenticate the DID
  const did = new DID({
    provider: new Ed25519Provider(key),
    resolver: getResolver(),
  });
  await did.authenticate();
  
  console.log(`Authenticated DID ${did.id}`);
  
  // Connect to the local Ceramic node
  const ceramicNodeURL = process.env.CERAMIC_NODE || 'http://localhost:7007';
  console.log(`Connecting to Ceramic Node on: ${ceramicNodeURL}`);
  const ceramic = new CeramicClient(ceramicNodeURL);
  ceramic.did = did;
  
  // Create a manager for the model
  const manager = new ModelManager(ceramic);
  
  const profileSchemaSID = await manager.createSchema('Profile', profileModel);
  const conversationsSchemaSID = await manager.createSchema('Conversations', conversationsModel);
  
  const profileSchemaURL = manager.getSchemaURL(profileSchemaSID);
  const conversationSchemaURL = manager.getSchemaURL(conversationsSchemaSID);
  
  invariant(profileSchemaURL);
  invariant(conversationSchemaURL);
  
  await manager.createDefinition('myProfile', {
    name: 'User Profile',
    description: 'My Profile at Firenze',
    schema: profileSchemaURL,
  });

  await manager.createDefinition('myConversations', {
    name: 'User Conversations',
    description: 'My conversations at Firenze',
    schema: conversationSchemaURL,
  });
  
  // Publish model to Ceramic node
  const model = await manager.toPublished();
  
  // Write model to JSON file
  await writeFile('./published-model.json', JSON.stringify(model));
}

main().then(text => {
  console.log(text);
})
.catch(err => {
  throw err;
});