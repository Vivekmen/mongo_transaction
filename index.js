const express = require("express");
const app = express();
const dbConnect = require("./utils/database");
const router=require('./router/index')
app.use(express.json());
app.use('/api',router)


app.listen(3000, () => {
    console.log(`Server is listening on port ......`);
});

  dbConnect();