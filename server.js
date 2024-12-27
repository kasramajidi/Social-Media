const app = require("./src/app")
const mongoose = require("mongoose")
const dotenv = require("dotenv")

//* Load ENV

const productionMode = process.env.MODE_ENV === "production"

if (!productionMode) {
    dotenv.config()
}

//* DataBase
async function dataBase() {
    try {

        await mongoose.connect(process.env.MONGO__URI)
        console.log(`mongodb connected ${mongoose.connection.host}`)

    } catch (err) {
        console.error("error in database -> ", err)
        process.exit(1);
    }
}

function startServer() {
    const port = +process.env.PORT || 5000;
    app.listen(port, () => {
        console.log(`server running in ${productionMode ? "production" : "development"
            } on port ${port}`)
    })
}


function run() {
    startServer();
    dataBase();
}


run()