const express = require("express");
const path = require("path");
const fs = require("fs");

const app = express();

const PORT = process.env.PORT || 3000;



/* =========================
   MIDDLEWARE
========================= */

app.use(express.json());

app.use(express.static(
    path.join(__dirname, "public")
));


/* =========================
   ELEMENTS API
========================= */

app.get("/api/elements", (req, res) => {

    const filePath = path.join(
        __dirname,
        "data",
        "elements.json"
    );

    fs.readFile(
        filePath,
        "utf8",
        (error, data) => {

            if (error) {

                console.error(
                    "Error reading elements.json:",
                    error
                );

                return res.status(500).json({
                    error: "خطا در خواندن اطلاعات عناصر"
                });

            }

            try {

                const elements = JSON.parse(data);

                res.json(elements);

            } catch (parseError) {

                console.error(
                    "JSON parse error:",
                    parseError
                );

                res.status(500).json({
                    error: "ساختار فایل JSON صحیح نیست"
                });

            }

        }
    );

});


/* =========================
   MAIN PAGE
========================= */

app.get("/", (req, res) => {

    res.sendFile(
        path.join(
            __dirname,
            "public",
            "index.html"
        )
    );

});


/* =========================
   SERVER
========================= */


app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on port ${PORT}`);
});
