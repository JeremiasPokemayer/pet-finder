import { algoliasearch } from "algoliasearch";
import * as dotenv from "dotenv";
dotenv.config();

const client = algoliasearch(
  process.env.ALGOLIA_APPLICATION_ID,
  process.env.ALGOLIA_API_KEY
);

export { client };
