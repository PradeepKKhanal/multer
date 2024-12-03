const express = require("express");
const multer = require("multer");
const path = require("path");

// app initialization
const app = express();
app.use("/gallery", express.static(path.join(__dirname, "gallery")));
app.use(express.urlencoded({extended:true}))
// multer configuration

// setting dest
// const upload=multer({dest:'uploads'})

// setting storage
const storage = multer.diskStorage({
	destination: (req, file, cb) => {
		if (file.fieldname === "gallery") {
			cb(null, "gallery");
		} else if (file.fieldname === "avatar") {
			cb(null, "avatar");
		}
	},
	filename: (req, file, cb) => {
		const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
		cb(null, file.fieldname + "-" + uniqueSuffix + "-" + file.originalname);
	},
});
const upload = multer({
	storage,
	// fileFilter: (req, file, cb) => {
	// 	console.log(file.mimetype);
	// 	if (file.mimetype.startsWith("image")) {
	// 		cb(null, true);
	// 	} else {
	// 		cb(new Error("Only images are allowed"), false);
	// 	}
	// },
	// limits: {
	// 	fileSize: 1024,
	// },
});

const multiUpload = upload.fields([
	{ name: "avatar", maxCount: 1 },
	{ name: "gallery", maxCount: 5 },
]);

app.post("/upload", multiUpload, (req, res) => {
	console.log(req.files);
	res.send("Files uploaded successfully");
});

// app.post('/upload',upload.single('file'), (req,res)=>{
//     console.log(req.file.length)
//     res.send('File Uploaded successfully!')
// })

// app.post("/upload", (req, res) => {
// 	upload.single("file")(req, res, (err) => {
// 		if (err instanceof multer.MulterError) {
// 			return res
// 				.status(400)
// 				.json({ success: false, message: `Multer error: ${err}` });
// 		} else if (err) {
// 			return res
// 				.status(500)
// 				.json({ success: false, message: `Unknown error :${err}` });
// 		}
// 		res
// 			.status(200)
// 			.json({ success: true, message: "File uploaded successfully" });
// 	});
// });

app.post("/uploads", upload.array("files", 5), (req, res) => {
	console.log(req.files);
	res.send(`${req.files.length} files uploaded successfully`);
});

app.get('/',(req,res)=>{res.sendFile(path.join(__dirname,'index.html'))})




// app listening
app.listen(3000, (req, res) => {
	console.log("Server is working on port 3000");
});
