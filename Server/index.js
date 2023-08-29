const express = require("express");
const http = require("http");
const app = express();
const router = require("./router");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const cors = require("cors");
const crypto = require('crypto');

const dotenv = require("dotenv");
const bcrypt = require("bcrypt");
const jwt=require("jsonwebtoken")
dotenv.config();

// Define salt value for bcrypt
const salt = bcrypt.genSaltSync(10);

const PORT =  5000 ||process.env.PORT

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cors());
app.use(cors({
  origin: ['http://localhost:3000', 'https://chat-app-frontend-pg59.onrender.com'],
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true  
}));
app.use(express.json());
mongoose.set("strictQuery", false);
mongoose.connect(
  process.env.MONGO_URL,
  { useNewUrlParser: true, useUnifiedTopology: true ,socketTimeoutMS: 30000,
    connectTimeoutMS: 30000},
  () => {
    console.log("database connected");
  }
);

const Userschema = new mongoose.Schema({
  username: { type: String },
  email: { type: String },
  password: { type: String },
});

const user = mongoose.model("User", Userschema);

const { addup, getuser } = require("./users.js");
const server = http.createServer(app);
const io = require("socket.io")(server, {
  cors: {
    origin: ['http://localhost:3000', 'https://chat-app-frontend-pg59.onrender.com'],
  },
});




let connectedUsers = [];

const encryptionKey = 'hey'; // Replace with your encryption key

// Define the encryption and decryption functions
function encrypt(text) {
  const cipher = crypto.createCipher('aes-256-cbc', encryptionKey);
  let encrypted = cipher.update(text, 'utf8', 'hex');
  encrypted += cipher.final('hex');
  return encrypted;
}

function decrypt(encryptedText) {
  try {
    const decipher = crypto.createDecipher('aes-256-cbc', encryptionKey);
    let decrypted = decipher.update(encryptedText, 'hex', 'utf8');
    decrypted += decipher.final('utf8');
    return decrypted;
  } catch (error) {
    console.error('Decryption error:', error);
    return null;
  }
}

io.on("connection", (socket) => {
  console.log("connected");

  socket.on("join", ({ username, room }, callback) => {
    const { error, user } = addup({ id: socket.id, username, room });

    if (error) return callback(error);

    socket.emit("message", {
      user: "admin",
      text: `Welcome, ${user.username}! You have joined the chat in ${user.room}.`,
    });

    socket.broadcast
      .to(user.room)
      .emit("message", { user: "admin", text: `${user.username} has joined the chat` });

    socket.join(user.room);

    // Add user to the connectedUsers array
    connectedUsers.push(user);

    io.to(user.room).emit("users", connectedUsers);

    callback();
  });

  

socket.on("sendmessage", (message, callback) => {
  const user = getuser(socket.id);
  const encryptedMessage = encrypt(message);

  const encryptionKey = 'hey'; // Replace with your encryption key

  const decryptedMessage = decrypt(encryptedMessage, encryptionKey);

  io.to(user.room).emit("message", { user: user.username, text: decryptedMessage });

  callback();
});


  socket.on("disconnect", () => {
    console.log("user is no longer here");

    const user = getuser(socket.id);

    if (user) {
      connectedUsers = connectedUsers.filter((u) => u.id !== socket.id);

      io.to(user.room).emit("users", connectedUsers);
      io.to(user.room).emit("message", { user: "admin", text: `${user.username} has left the chat` });
    }
  });

});

app.post("/login", async (req, res) => {
    try {
      const { email, password } = req.body;
      if (!email && password) {
        return res.status(400).json({
          status: "failed",
          message: "All fields required",
        });
      }
      const data = await user.findOne({ email });
      if (!data) {
        return res.status(400).json({
          status: "failed",
          message: "User not registered",
        });
      }
      bcrypt.compare(password, data.password, function (err, result) {
        if (err) {
          return res.status(400).json({
            status: "failed",
            message: err.message,
          });
        }
        if (result) {
          const token = jwt.sign(
            {
              payload: data._id,
            },
            process.env.SECRET_KEY
          );
          return res.status(200).json({
            status: "success",
            message: "Login Succesfull",
            token,
            id: data._id,
          });
        } else {
          return res.status(400).json({
            status: "failed",
            message: "Invalid password",
          });
        }
      });
    } catch (error) {
      return res.status(400).json({
        status: "failed",
        message: error.message,
      });
    }
  });
  
app.post("/register", async (req, res) => {
    try {
        const { username,email, password, confirmpassword } = req.body;
        if (!username||!email || !password || !confirmpassword) {
            return res.status(400).json({
                status: "failed",
                message: "All fields are mandatory",
            });
        }
        const present = await user.findOne({ email });
        if (present) {
            return res.status(400).json({
                status: "failed",
                message: "User already registered",
            });
        }
        if (password !== confirmpassword) {
            return res.status(400).json({
                status: "failed",
                message: "Passwords do not match",
            });
        }
        //HASHING PASSWORD
        bcrypt.hash(password, salt, async function (err, hash) {
            if (err) {
                return res.status(400).json({
                    mesaage: err.message
                })
            }
            //INSERTING NEW USER
            const userData = await user.create({
                username,
                email,
                password: hash
            })
            return res.status(200).json({
                message: "Successfully Registered",
                userData
            })

        });
    } catch (e) {
        return res.status(500).json({
            mesaage: "failed"
        })
    }
})


app.use(router)
server.listen(PORT,()=>console.log("server is up"))