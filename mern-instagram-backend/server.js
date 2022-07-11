import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import Pusher from 'pusher';
import dbModel from './dbModel.js'

// app config
const app = express();
const port = process.env.PORT || 8080;
const pusher = new Pusher({
  appId: "1433806",
  key: "0ee4d2e7dcc65c80faf9",
  secret: "de90d2b38d5dd3760d35",
  cluster: "us3",
  useTLS: true
});

// middlewares
app.use(express.json());
app.use(cors()); 

// DB config
const connection_url="mongodb+srv://admin:ZFErmHBbIXQHlTUw@cluster0.jrunxsv.mongodb.net/insta?retryWrites=true&w=majority"
mongoose.connect(connection_url, {});

mongoose.connection.once('open', () => {
    console.log('DB Connected')

    const changeStream = mongoose.connection.collection('posts').watch()

    changeStream.on('change', (change) => {
        console.log('Change Triggered on pusher...')
        console.log(change)
        console.log('End of Change')

        if (change.operationType === 'insert') {
            console.log('Triggering Pusher ***/IMG UPLOAD*** ')

            const postDetails = change.fullDocument;
            pusher.trigger('posts', 'inserted', {
                user: postDetails.user,
                caption: postDetails.caption,
                image: postDetails.image
            })
        } else {
            console.log ('Unkown trigger from Pusher');
        }
    });
});

// api routes
app.get('/', (req, res) => res.status(200).send('hello world'));

app.post('/upload', (req, res) => {
    const body = req.body;

    dbModel.create(body, (err, data) => {
        if (err) {
            res.status(500).send(err);
        } else {
            res.status(201).send(data);
        }
    });
});

app.get('/sync',(req, res) => {
    dbModel.find((err, data) => {
        if (err) {
            res.status(500).send(err);
        } else {
            res.status(200).send(data);
        }
    });
});

// listen
app.listen(port, () => console.log(`listening on localhost:${port}`));