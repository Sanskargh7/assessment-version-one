import cluster from "cluster";
import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import mongoose from "mongoose";
import os from "os";
import path from "path";
import { fileURLToPath } from "url";
import userRoutes from "./routes/userRoute.js";
import node_cron from "node-cron";
import Questions from "./controller/Question.js";
// // import { sendEmailTemplate } from "./controller/email.js";
const numberOfWorker = os.cpus().length;

node_cron.schedule('* 23 * * *', () => {
  Questions.discardPendingExamInOneDay()

  console.log('Running a task every minute');
});

//env config
dotenv.config();
const app = express();
//set cross origin middleware
app.use(cors());

app.set('view engine', 'handlebars');
app.set('views', 'views');
app.use(express.json());
// //database config
mongoose
  .connect(
    "mongodb+srv://gaurav:3gANONaT61B5g4RP@cluster0.94qn5u5.mongodb.net/assessment_db_dev",
    {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    }
  )
  .then((response) => {
    console.log("database connected successfully");
  })
  .catch((error) => {
    console.log(error);
  });
const __dirname = path.dirname(fileURLToPath(import.meta.url));
app.use(express.static(path.join(__dirname, "../front-end/build")));

app.use("/api/v2", userRoutes);


// app.use("*", (req, res) => {
//   res.sendFile(path.join(__dirname, "../front-end/build/index.html"));
// });
//setup cluster for Scalling the Application
if (cluster.isPrimary) {
  //for worker process
  for (let i = 0; i < numberOfWorker; i++) {
    cluster.fork();
  }
  //Handle worker exists and restart them
  cluster.on("exit", (worker) => {
    console.log(`Worker ${worker.process.pid} died`);
    cluster.fork();
  });
} else {
  app.listen(4000, () => {
    console.log("listening on port 4000");
  });
}





