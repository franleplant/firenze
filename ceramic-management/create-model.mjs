import { writeFile } from 'node:fs/promises'
import { CeramicClient } from '@ceramicnetwork/http-client'
import { ModelManager } from '@glazed/devtools'
import { DID } from 'dids'
import { Ed25519Provider } from 'key-did-provider-ed25519'
import { getResolver } from 'key-did-resolver'
import { fromString } from 'uint8arrays'
import dotenv from 'dotenv'

dotenv.config()
// The key must be provided as an environment variable
const key = fromString(process.env.DID_KEY, 'base16')

// Create and authenticate the DID
const did = new DID({
  provider: new Ed25519Provider(key),
  resolver: getResolver(),
})
await did.authenticate()

console.log(`Authenticated DID ${did.id}`)

// Connect to the local Ceramic node
const ceramic = new CeramicClient('http://localhost:7007')
ceramic.did = did

// Create a manager for the model
const manager = new ModelManager(ceramic)

import profileModel from "./schemas/profile.json"
import conversationsModel from "./schemas/conversations.json"

const profileSchemaSID = await manager.createSchema('Profile', profileModel)
const conversationsSchemaSID = await manager.createSchema('Conversations', conversationsModel)

await manager.createDefinition('myProfile', {
  name: 'User Profile',
  description: 'My Profile at Firenze',
  schema: manager.getSchemaURL(profileSchemaSID),
})

await manager.createDefinition('myConversations', {
  name: 'User Conversations',
  description: 'My conversations at Firenze',
  schema: manager.getSchemaURL(conversationsSchemaSID),
})

// Publish model to Ceramic node
const model = await manager.toPublished()

// Write model to JSON file
await writeFile('./published-model.json', JSON.stringify(model))