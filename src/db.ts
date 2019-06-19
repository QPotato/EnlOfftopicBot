import { MongoClient, Db } from "mongodb";

if (process.env.MONGO === undefined)
  throw new Error('No mongo url in environment')
  
const mongourl = process.env.MONGO;
class DbClient {

    public db!: Db;

    public async connect() {
        let client = await MongoClient.connect(mongourl, { useNewUrlParser: true })
        this.db = client.db() ;
        return this.db;
    }
}

const mongo = new DbClient();
export default mongo;