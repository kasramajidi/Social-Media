const app = require("./src/app")
const mongoose = require("mongoose")
require("dotenv").config()

const port = process.env.PORT;



(async () => {
    await mongoose.connect(process.env.MONGO__URI)
    console.log("mongodb connected")
})();

app.listen(port, () => {
    console.log(`server started on port ${port}`)
})