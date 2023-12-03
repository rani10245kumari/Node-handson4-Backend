const express = require("express");
const bcrypt = require("bcrypt");
const cors = require("cors");
const jwt = require("jsonwebtoken")

const Port = 5002;

const app = express();

app.use(express.json());

// app.use(bodyParser.json());
app.use(cors({ origin: "*" }));

const users = [];

app.get("/", (req, res) => {
    res.send("Home");
});

app.post("/register", async (req, res) => {
    const { name, phone, email, password } = req.body;
    console.log(req.body);
    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        users.push({ name, phone, email, password: hashedPassword });
        res.status(201).json({ messege: "User Registered !!" });
    } catch (error) {
        console.error("Error hashing password:", error);
        res.json({ error: "Internal Server Error" });
    }
});

app.post("/login", (req, res) => {
    const { email, password } = req.body;

    const user = users.find((u) => u.email === email);

    if (!user || !bcrypt.compareSync(password, user.password)) {
        return res.json({ error: "User is not registered" });
    }

    const token = jwt.sign({ email: user.email }, "secretKey");
    console.log(req.body);
    res.json({ message: "User has logged in successfully", token });
});

app.listen(Port, () => {
    console.log(users);
    console.log("Server Started");
});