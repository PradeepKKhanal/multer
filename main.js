const express = require("express");
const multer = require("multer");
const path = require("path");

const app = express();

// multer configuration

const storage = multer.diskStorage({
	destination: (req, file, cb) => {
        console.log(file.fieldname)
		if (file.fieldname === "avatarImage") {
			cb(null, "avatar"); 
		} else if (file.fieldname === "galleryImage") {
			cb(null, "gallery");
		} 
        else {
			cb(new Error("Unknown field"));
		}
	},
	filename: (req, file, cb) => {
		const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
		cb(null, file.fieldname + "-" + uniqueSuffix + "-" + file.originalname);
	},
});
const fileFilter = (req, file, cb) => {
    console.log(file.mimetype)
	if (file.fieldname === "avatarImage") {
		const allowedTypes = ["image/jpeg", "image/png","image/jpg"];
		if (allowedTypes.includes(file.mimetype)) {
			cb(null, true);
		} else {
			cb(
				new Error("Invalid image format. Only JPEG and PNG are allowed", false)
			);
		}
	} else if (file.fieldname === "galleryImage") {
		const allowedTypes = ["image/jpeg","image/jpg"];
		if (allowedTypes.includes(file.mimetype)) {
			cb(null, true);
		} else {
			cb(new Error("Invalid image format. Only jpg/jpeg format is allowed.", false));
		}
	} else {
		cb(new Error("Unknown field"));
	}
};

const limits = {
	fileSize: 5* 1024 * 1024,
};

const upload = multer({ storage, fileFilter, limits });

const multiUpload = upload.fields([
	{ name: "avatarImage", maxCount: 1 },
	{ name: "galleryImage", maxCount: 5 },
]);

app.get("/", (req, res) => {
	res.sendFile(path.join(__dirname, "index.html"));
});
app.post("/formUploads", multiUpload, (req, res) => {
	console.log(req.body)
    // return res.end('hello')
	// console.log((req.files))
	if (
		!req.body.name ||
		!req.body.galleryName ||
		!req.files ||
		!req.files.avatarImage ||
		!req.files.galleryImage
	) {
		return res
			.status(400)
			.json({ success: false, message: "Please fill all the fields" });
	}
	const { name, galleryName } = req.body;
	const avatarImage = req.files.avatarImage
		? req.files.avatarImage[0].originalname
		: null;
	const galleryImage = req.files.galleryImage
		? req.files.galleryImage.map((image) => image.originalname)
		: null;
	const data = { name, galleryName, avatarImage, galleryImage }; 
    console.log(data)
	res
		.status(200)
		.json({ success: true, message: "Form submitted successfully", data });
	// res.end()
});

app.use((error, req, res, next) => {
    console.log(error)
    // console.log(error)
	if (error instanceof multer.MulterError) {
		res
			.status(400)
			.json({ success: false, message: error.message, error });
	} else if (error) {
		res
			.status(500)
			.json({
				success: false,
				message: "Internal server error occured",
				error,
			});
	}
    // res.json({message:'Nothing'})
	next();
});

app.listen(8000, () => {
	console.log("Server is listening in port 8000");
});
