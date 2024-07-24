// const express = require("express");

// const app = express();
// app.get("/", (req, res) => {
//   res.send("welcome");
// });
// app.get("/test", (req, res) => {
//   res.send("welcome test");
// });
// const PORT = 3001;

// app.listen(PORT, () => {
//   console.log(`Server is running on port ${PORT}`);
// });

const express = require("express");
const cors = require("cors");
const app = express();
// app.use(cors());

const corsOptions = {
  origin: "*",
  credentials: true, //access-control-allow-credentials:true
  optionSuccessStatus: 200,
};

app.use(cors(corsOptions));

const multer = require("multer");
const fs = require("fs");
const path = require("path");
const PORT = 3001;

app.get("/", (req, res) => {
  res.send("welcome");
});
app.get("/test", (req, res) => {
  res.send("welcome test");
});

const staticPath = path.join(__dirname, "uploads");
app.use(express.static(staticPath));
// app.use(express.static("uploads"));

// Multer configuration
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    console.log("req", req.query);

    // //temp
    // let pathdirect = path.join(__dirname, "./uploads");
    // cb(null, pathdirect);
    // // cb(null, "uploads/");

    // orig
    // let path = `./uploads`;
    let path = path.join(__dirname, "./uploads");
    if (!fs.existsSync(path)) {
      fs.mkdirSync("uploads");
    }

    if (req.query?.productID) {
      console.log("It is product");
      if (!fs.existsSync(`./uploads/products`)) {
        fs.mkdirSync("uploads/products");
      }
      // if (!fs.existsSync(`./uploads/products/1231231234`)) {
      //   fs.mkdirSync("uploads/products/1231231234");
      // }
      // cb(null, "uploads/products/1231231234/");

      let folderPath1 = `./uploads/products/${req.query.productID}`;
      let folderPath2 = `uploads/products/${req.query.productID}`;
      let folderPath3 = `uploads/products/${req.query.productID}/`;

      if (!fs.existsSync(folderPath1)) {
        fs.mkdirSync(folderPath2);
      }
      cb(null, folderPath3);
    } else if (req.query?.merchantID) {
      console.log("It is merchant");
      cb(null, "uploads/");
    } else {
      console.log("It is not product and not merchant");
      cb(null, "uploads/");
    }

    // // direct to uploads folder
    // let path = `./uploads`;
    // if (!fs.existsSync(path)) {
    //   fs.mkdirSync("uploads");
    // }
    // cb(null, "uploads/");
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "--" + file.originalname);
  },
});

const upload = multer({ storage: storage });

// Handle file upload
app.post("/upload", upload.single("file"), (req, res) => {
  // File upload completed
  res.sendStatus(200);
});
// Handle multi file upload
app.post("/multi-uploads", upload.array("file"), (req, res) => {
  // File upload completed
  res.sendStatus(200);
});

// with productID serving a folder files
app.get("/get-folder/:productID", (req, res) => {
  const folderpath = req.params.productID;
  const testFolder = `./uploads/products/${folderpath}`;
  const fs = require("fs");
  const a = fs.readdirSync(testFolder);
  res.send(a);
});

// delete file in server
app.get("/delete-file", (req, res) => {
  fs.stat("./uploads/products/RS.jpg", function (err, stats) {
    console.log(stats); //here we got all information of file in stats variable

    if (err) {
      return console.error(err);
    }

    fs.unlink("./uploads/products/RS.jpg", function (err) {
      if (err) return console.log(err);
      console.log("file deleted successfully");
      res.send("file deleted successfully");
    });
  });
});

// delete folder in server
app.get("/delete-folder", (req, res) => {
  if (fs.existsSync(`./uploads/products/1231231236`)) {
    // fs.rmdir("./uploads/products/1231231236");
    fs.rmdir("./uploads/products/1231231236", { recursive: true }, (err) => {
      if (err) {
        console.error(err);
        res.send(400);
      }
      res.send(204);
    });
  } else {
    res.send("folder not exist").status(400);
  }
});

// // video chunks

app.get("/video", (req, res) => {
  // console.log("req", req);
  // const videoPath = path.join(__dirname, `uploads/${req.query.videoName}.mp4`); // Path to the video file
  //   const videoPath = path.join(__dirname, req.query.videoPath); // Path to the video file
  // console.log("videoPath", videoPath);
  const videoPath = path.join(__dirname, `uploads/Raju.mp4`); // Path to the video file
  const stat = fs.statSync(videoPath);
  const fileSize = stat.size;
  const range = req.headers.range;

  if (range) {
    const parts = range.replace(/bytes=/, "").split("-");
    const start = parseInt(parts[0], 10);
    const end = parts[1] ? parseInt(parts[1], 10) : fileSize - 1;

    const chunksize = end - start + 1;
    const file = fs.createReadStream(videoPath, { start, end });
    const head = {
      "Content-Range": `bytes ${start}-${end}/${fileSize}`,
      "Accept-Ranges": "bytes",
      "Content-Length": chunksize,
      "Content-Type": "video/mp4",
    };

    res.writeHead(206, head);
    file.pipe(res);
  } else {
    res.writeHead(200, {
      "Content-Length": fileSize,
      "Content-Type": "video/mp4",
    });
    fs.createReadStream(videoPath).pipe(res);
  }
});

app.get("/create-folder", (req, res) => {
  fs.mkdir("sjdjh");
  res.send("folder created");
});

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
