const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 5000;

//middleware
app.use(cors());
app.use(express.json());


//connect to db

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.73y1m.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function run() {
    try {
        await client.connect();
        const productCollection = client.db("emaJhon").collection("product");


        app.get('/products', async (req, res) => {
            console.log(req.query);
            const page = parseInt(req.query.page);
            const size = parseInt(req.query.size);
            const query = {};
            const cursor = productCollection.find(query);
            let result;
            if (page || size) {
                result = await cursor.skip(page * size).limit(size).toArray();

            }
            else {
                result = await cursor.toArray();
            }
            // const result = await cursor.limit(10).toArray(); to get limited data
            res.send(result);
        });

        app.get('/count', async (req, res) => {
            // previouly used
            // const query = {};
            // const cursor = productCollection.find(query);
            // const result = await cursor.count();

            const result = await productCollection.estimatedDocumentCount();
            res.send({ result });
        });
        app.post('/productKeys', async (req, res) => {
            const keys = req.body;
            const ids = keys.map(id => ObjectId(id));
            const query = { _id: { $in: ids } };
            const cursor = productCollection.find(query);
            const result = await cursor.toArray();
            console.log(keys);
            res.send(result);
        })

    }
    finally {

    }
}
run().catch(console.dir)


app.get('/', (req, res) => {
    res.send('Ema John Server Is Running');
});

app.listen(port, () => {
    console.log('Ema John is running in port', port)
});