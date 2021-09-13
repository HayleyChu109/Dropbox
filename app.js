// Express
const express = require("express");
const app = express();

// Fileupload
const fileUpload = require("express-fileupload");
app.use(fileUpload());

 // Path
const path = require("path");

// File system
const fs = require("fs");

app.use(express.json());
app.use(express.urlencoded({extended: false}));

app.use(express.static("public"));
app.use(express.static("uploaded"));

let caches = {};

// Show the method and url
app.use("/", (req, res, next) => {
    console.log(req.method);
    console.log(req.url);
    next();
  });

// Write file promise
function writeFile(name, data) {
    return new Promise((resolve, reject) => {
        fs.writeFile(__dirname + "/uploaded/" + name, data, (error) => {
            if (error) {
                reject("Error")
            } else {
                resolve(name)   
            }
        })
    }).then(readFile)
}

// Read file promise
function readFile(name) {
    return new Promise((resolve, reject) => {
        fs.readFile(__dirname + "/uploaded/" + name, (error, data) => {
            if (error) {
                reject("Error")
            } else {
                resolve(data);
            }
        })
    })
}

// Get the name of files in the directory
app.get("/filelist", (req, res) => {
    fs.readdir(__dirname + "/uploaded", (error, files) => {
        if (error) {
            console.log("Error")
        } else {
            console.log(files);
            res.send(files)
        }
    })
})

// Sent html file to user
app.get("/", (req,res) => {
    res.sendFile(path.join(__dirname, "public", "index.html"))
})

// Upload file
app.post("/form", (req, res) => {
    let fName = req.files.file.name;
    let data = req.files.file.data;
    console.log(req.files.file);
    console.log("File name:", fName);
    console.log("Data:", data);

    // get the value (data) of requested file name
    caches[fName] = data;
    writeFile(fName, data)
        .then(() => {
            res.redirect("/")
    })
})

// Download file
app.get("/uploaded/:fileName", (req, res) => {
    if (caches[req.params.fileName]) {
        console.log("File is in cache");
        res.send(caches[req.params.fileName])
        } else {
            console.log("File is not in cache")
            caches[req.params.fileName] = readFile(req.params.fileName);
            caches[req.params.fileName]
                .then((data) => {
                    res.send(data)
                })
        }
})

// Delete file
app.get("/delete/:fileName", (req, res) => {
    console.log(req.params.fileName);
    fs.unlink(__dirname + "/uploaded/" + req.params.fileName, (error) => {
        if (error) {
            console.log("Error");
        }
    })
    res.redirect("/")
})

app.listen(8080, () => {
    console.log("Application is listening to port 8080")
})