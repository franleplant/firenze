import { compileFromFile } from 'json-schema-to-typescript'
import * as fs from 'fs';

const schemaPath = "./schemas/";

fs.readdirSync(schemaPath).forEach((file) => {
  let fileName = file.substring(0, file.lastIndexOf('.'));
  compileFromFile(`${schemaPath}${file}`)
    .then(ts => fs.writeFileSync(`../src/model/${fileName}.ts`, ts));
})
