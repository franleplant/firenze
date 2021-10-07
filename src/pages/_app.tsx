import "../styles/globals.css";
import "reflect-metadata";
import { createConnection } from "typeorm";

import type { AppProps } from "next/app";
import { AuthorProfile } from "../orm/entity/AuthorProfile";

function MyApp({ Component, pageProps }: AppProps) {
  return <Component {...pageProps} />;
}

createConnection().then(connection => {
  console.log(`connected, synced entities? ${ connection.options.synchronize }`);

  let profile = new AuthorProfile();
  profile.author = "nach";
  profile.isDeleted = false;
  profile.profile = "";

  return connection.manager
          .save(profile)
          .then(profile => {
              console.log("prof has been saved. ", profile.author);
          });

}).catch(error => console.log(error));

export default MyApp;
