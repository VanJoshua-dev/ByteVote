
require("dotenv").config();

const bcrypt = require("bcryptjs");
const express = require("express");
const mysql = require("mysql2/promise");
const cors = require("cors");
const jwt = require("jsonwebtoken");
const path = require("path");
const fs = require("fs");

const app = express();
const PORT = process.env.PORT || 5000;

// ✅ CORS Configuration
const corsOptions = {
    origin: "https://bytevote.onrender.com",
    methods: "GET, POST, PATCH, DELETE, OPTIONS",
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
};
app.use(cors(corsOptions));
app.options("*", (req, res) => {
    res.header("Access-Control-Allow-Origin", "https://bytevote.onrender.com");
    res.header("Access-Control-Allow-Methods", "GET, POST, PATCH, DELETE, OPTIONS");
    res.header("Access-Control-Allow-Headers", "Content-Type, Authorization");
    res.sendStatus(200);
});

// ✅ Middleware to Parse JSON & URL Encoded Data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/public", express.static(path.join(__dirname, "public")));

// ✅ SSL Certificate for Azure MySQL
//key
const sslserverKeyPath = path.join(__dirname, "client-key.pem");
const serverKey = [fs.readFileSync(sslserverKeyPath, "utf8")];
//cert
const sslserverCertPath = path.join(__dirname, "client-cert.pem");
const serverCert = [fs.readFileSync(sslserverCertPath, "utf8")];
//server
const sslserverCaPath = path.join(__dirname, "server-ca.pem");
const serverCa = [fs.readFileSync(sslserverCaPath, "utf8")];

// ✅ Database Connection (Better Handling)
const conn = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: process.env.DB_PORT,
    ssl: {
        key: serverKey,
        cert: serverCert,
        ca: serverCa 
    },
});

// ✅ Verify Token Middleware
conn.getConnection((err) => {
    if (err) {
        console.error("Error: Database connection failed:", err.message);
        return;
    }
    console.log("Success: Connected to Azure MySQL database.");
});

// ✅ Middleware: Verify JWT Token
const verifyToken = (req, res, next) => {
    const authHeader = req.headers.authorization;
    console.log("Auth Header:", authHeader);

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return res.status(403).json({ error: "Access denied. No token provided." });
    }

    const token = authHeader.split(" ")[1];
    console.log("Extracted Token:", token);

    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
        if (err) {
            console.log("JWT Verification Error:", err.message);
            return res.status(401).json({ error: "Invalid or expired token." });
        }
        console.log("Decoded Token:", decoded);
        req.user = decoded;
        next();
    });
};

// ✅ Middleware: Admin Check
const isAdmin = (req, res, next) => {
    if (req.user.role !== "admin") {
        return res.status(403).json({ error: "Access denied. Admins only." });
    }
    next();
};
// app.use((req, res, next) => {
//     console.log(`Received ${req.method} request to ${req.path}`);
//     next();
// });
app.get("/api/test-db", async (req, res) => {
    try {
        const [results] = await conn.query("SELECT NOW() AS currentTime");

        res.json({ message: "Database connected successfully!", results });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// 🏠 Home Route (Test API)
app.get('/', (req, res) => {
    res.send("BYTEVote is working Hello world!!!!");
});



app.post("/api/login", async (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).json({ error: "Username and password are required." });
    }

    try {
        // ✅ Check Admin Table First
        const [adminResults] = await conn.query("SELECT * FROM admin WHERE username = ?", [username]);

        if (adminResults.length > 0) {
            const admin = adminResults[0];

            const isMatch = await bcrypt.compare(password, admin.password);
            if (!isMatch) return res.status(401).json({ error: "Invalid credentials" });

            const token = jwt.sign({ id: admin.admin_id, role: "admin", user: admin.username }, process.env.JWT_SECRET, { expiresIn: "1h" });

            return res.json({ message: "Admin login successful", token, role: "admin", user: admin.username });
        }

        // ✅ Check Voter Table (Only if Admin Not Found)
        const [voterResults] = await conn.query("SELECT * FROM voters WHERE username = ?", [username]);

        if (voterResults.length > 0) {
            const voter = voterResults[0];

            const isMatch = await bcrypt.compare(password, voter.password);
            if (!isMatch) return res.status(401).json({ error: "Invalid credentials" });

            const token = jwt.sign({ id: voter.voter_id, role: "voter", avatar: voter.image_path }, process.env.JWT_SECRET, { expiresIn: "1h" });

            return res.json({ message: "Voter login successful", token, role: "voter", voterID: voter.voter_id, user: voter.username, avatar: voter.image_path });
        }

        return res.status(404).json({ error: "User not found" });
    } catch (error) {
        console.error("Login Error:", error.message);
        return res.status(500).json({ error: "Internal Server Error" });
    }
});


// fetch dashboard
app.get('/api/adminDashboard', verifyToken, isAdmin, async (req, res) => {
    try {
        const { data } = req.query;

        let sql;
        switch (data) {
            case 'voters':
                sql = `SELECT COUNT(*) AS count FROM voters`;
                break;
            case 'votes':
                sql = `SELECT COUNT(DISTINCT voter_id) AS count FROM votes;`;
                break;
            case 'positions':
                sql = `SELECT COUNT(*) AS count FROM positions`;
                break;
            case 'candidates':
                sql = `SELECT COUNT(*) AS count FROM candidates`;
                break;
            case 'elections':
                sql = `SELECT COUNT(*) AS count FROM elections WHERE status = 'active'`;
                break;
            default:
                return res.status(400).json({ error: "Invalid request type." });
        }

        const [result] = await conn.query(sql); // ✅ Using promise-based query
        res.json({ count: result[0].count }); // ✅ Returning as JSON object

    } catch (error) {
        console.error("Error fetching admin dashboard data:", error);
        res.status(500).json({ error: "Internal server error" });
    }
});
//fetch Vote Counts



//fetch voters
app.get('/api/getVoters', verifyToken, isAdmin, async (req, res) => {
    try {
        const sql = `SELECT * FROM voters`;
        const [result] = await conn.query(sql); // ✅ Uses async/await instead of callback

        res.json({ success: true, voters: result });
    } catch (err) {
        console.error("Database Error:", err);
        res.status(500).json({ error: "Failed to fetch voters" });
    }
});

//fetch voters



//Add voter
app.post("/api/addVoter", verifyToken, isAdmin, async (req, res) => {
    const { firstname, lastname, LRN, gender, username, password } = req.body;

    if (!firstname || !lastname || !LRN || !gender || !username || !password) {
        return res.status(400).json({ message: "All fields are required" });
    }

    try {
        // Check if LRN already exists
        const checkLRNSql = "SELECT 1 FROM voters WHERE lrn = ?";
        const [existingVoter] = await conn.execute(checkLRNSql, [LRN]);

        if (existingVoter.length > 0) {
            return res.status(409).json({ message: "LRN already exists" }); // 409 Conflict
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 12);
        console.log(hashedPassword);
        //generate profile based on gender
        let profilePictureOptions = [];
        switch (gender.toLowerCase()) {
            case 'male':
                profilePictureOptions = ['default_profile-m1.jpg', 'default_profile-m2.jpg'];
                break;
            case 'female':
                profilePictureOptions = ['default_profile-f1.jpg', 'default_profile-f2.jpg'];
                break;
            default:
                profilePictureOptions = ['default_profile-f1.jpg', 'default_profile-2.jpg', 'default_profile-m1.jpg', 'default_profile-m2.jpg'];
                break;
        }
        const profilePicture = profilePictureOptions[Math.floor(Math.random() * profilePictureOptions.length)];
        // Insert new voter
        const insertSql = `
            INSERT INTO voters (firstname, lastname, lrn, gender, username, password, image_path) 
            VALUES (?, ?, ?, ?, ?, ?, ?)
        `;
        const [result] = await conn.execute(insertSql, [firstname, lastname, LRN, gender, username, hashedPassword, profilePicture]);

        res.status(201).json({ message: "Voter added successfully", id: result.insertId,});

    } catch (error) {
        console.error("Error:", error);
        res.status(500).json({ message: "Server error" });
    }
});

app.patch('/api/editVoter', verifyToken, isAdmin, async (req, res) => {
    const { voter_id, new_Firstname, new_Lastname, newLRN, newGender, newUsername, newPassword } = req.body;

    if (!voter_id || !new_Firstname || !new_Lastname || !newLRN || !newGender || !newUsername) {
        return res.status(400).json({ message: "All fields are required" });
    }

    try {
        // Check if new LRN already exists for a different voter
        const checkLRNSql = "SELECT 1 FROM voters WHERE lrn = ? AND voter_id != ?";
        const [existingLRN] = await conn.execute(checkLRNSql, [newLRN, voter_id]);

        if (existingLRN.length > 0) {
            return res.status(409).json({ message: "LRN is already assigned to another voter" });
        }

        let updateSql;
        let values;

        if (!newPassword) {
            updateSql = `
                UPDATE voters 
                SET firstname = ?, lastname = ?, lrn = ?, gender = ?, username = ? 
                WHERE voter_id = ?
            `;
            values = [new_Firstname, new_Lastname, newLRN, newGender, newUsername, voter_id];
        } else {
            const saltrounds = 12;
            const hashedPassword = await bcrypt.hash(newPassword, saltrounds);
            console.log(hashedPassword);
            updateSql = `
                UPDATE voters 
                SET firstname = ?, lastname = ?, lrn = ?, gender = ?, username = ?, password = ? 
                WHERE voter_id = ?
            `;
            values = [new_Firstname, new_Lastname, newLRN, newGender, newUsername, hashedPassword, voter_id];
        }

        const [result] = await conn.execute(updateSql, values);

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: "Voter not found or no changes made" });
        }

        res.json({ message: "Voter updated successfully" });

    } catch (error) {
        console.error("Error:", error);
        res.status(500).json({ message: "Server error" });
    }
});

//delete voters

app.delete('/api/deleteVoter/:id', verifyToken, isAdmin, async (req, res) => {
    const { id } = req.params;

    if (!id) {
        return res.status(400).json({ message: "Voter ID is required" });
    }

    try {
        // Check if voter exists before deleting
        const checkSql = "SELECT 1 FROM voters WHERE voter_id = ?";
        const [existingVoter] = await conn.execute(checkSql, [id]);

        if (existingVoter.length === 0) {
            return res.status(404).json({ message: "Voter not found" });
        }

        // Delete the voter
        const deleteSql = "DELETE FROM voters WHERE voter_id = ?";
        const [result] = await conn.execute(deleteSql, [id]);

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: "Voter not found" });
        }

        res.json({ message: "Voter deleted successfully" });

    } catch (error) {
        console.error("Error:", error);
        res.status(500).json({ message: "Server error" });
    }
});

//fetch position 

app.get('/api/getPositions', verifyToken, isAdmin, async (req, res) => {
    try {
        const sql = 'SELECT * FROM positions';
        const [rows] = await conn.execute(sql); // ✅ Use `execute()` for MySQL2
        res.json(rows);
    } catch (err) {
        console.error("Error fetching positions:", err);
        res.status(500).json({ error: "Internal Server Error" });
    }
});
//edit postion

app.patch('/api/editPosition', verifyToken, isAdmin, async (req, res) => {
    try {
        const { positionID, newPosName } = req.body;

        if (!positionID || !newPosName) {
            return res.status(400).json({ message: "All fields are required" });
        }

        const sql = 'UPDATE positions SET position_name = ? WHERE position_id = ?';
        const [result] = await conn.execute(sql, [newPosName, positionID]); // ✅ Use `execute()`

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: "Position not found" });
        }

        res.json({ message: "Position updated successfully" });
    } catch (err) {
        console.error("Error updating position:", err);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

//delete positions
app.delete('/api/deletePosition', verifyToken, isAdmin, async (req, res) => {
    try {
        const { positionID } = req.body;

        if (!positionID) {
            return res.status(400).json({ message: "Position ID is required" });
        }

        const sql = 'DELETE FROM positions WHERE position_id = ?';
        const [result] = await conn.execute(sql, [positionID]); // ✅ Use `execute()`

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: "Position not found" });
        }

        res.json({ message: "Position deleted successfully" });
    } catch (err) {
        console.error("Error deleting position:", err);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

//Add position 
app.post("/api/addPosition", verifyToken, isAdmin, async (req, res) => {
    try {
        let { positionName } = req.body;

        if (!positionName) {
            return res.status(400).json({ message: "Position name is required" });
        }

        positionName = positionName.trim(); // ✅ Trim whitespace
        if (positionName.length === 0) {
            return res.status(400).json({ message: "Position name cannot be empty" });
        }

        const sql = 'INSERT INTO positions (position_name) VALUES (?)';

        const [result] = await conn.execute(sql, [positionName]); // ✅ Use `execute()`

        res.json({ message: "Position added successfully", id: result.insertId });
    } catch (err) {
        console.error("Error adding position:", err);

        if (err.code === 'ER_DUP_ENTRY') {
            return res.status(400).json({ message: "Position already exists" });
        }

        res.status(500).json({ error: "Internal Server Error" });
    }
});



// fetch voters voted
app.get('/api/getCandidates', verifyToken, isAdmin, async (req, res) => {
    try {
        const sql = `
            SELECT 
                c.candidate_id, 
                c.firstname, 
                c.lastname, 
                c.gender, 
                c.avatar,  
                p.position_name AS position, 
                c.credibilities, 
                c.platform 
            FROM candidates c 
            JOIN positions p ON c.position_id = p.position_id;
        `;

        const [result] = await conn.execute(sql); // ✅ Use `execute()` instead of `query()`
        res.json(result);
    } catch (err) {
        console.error("Error fetching candidates:", err);
        res.status(500).json({ error: "Internal server error" });
    }
});

//add candidate
app.post("/api/addCandidate", verifyToken, isAdmin, async (req, res) => {
    try {
        const { firstName, lastName, gender, candidatePosition, credibility, platform } = req.body;

        // Validate required fields
        if (!firstName || !lastName || !gender || !candidatePosition || !credibility || !platform) {
            return res.status(400).json({ message: "All fields are required" });
        }

        // Normalize gender input (make it case-insensitive)
        const normalizedGender = gender.toLowerCase();

        // Default profile pictures
        let profilePictureOptions = [];
        switch (normalizedGender) {
            case 'male':
                profilePictureOptions = ['default_profile-m1.jpg', 'default_profile-m2.jpg'];
                break;
            case 'female':
                profilePictureOptions = ['default_profile-f1.jpg', 'default_profile-f2.jpg'];
                break;
            default:
                profilePictureOptions = ['default_profile-f1.jpg', 'default_profile-f2.jpg', 'default_profile-m1.jpg', 'default_profile-m2.jpg'];
                break;
        }

        // Select a random profile picture
        const profilePicture = profilePictureOptions[Math.floor(Math.random() * profilePictureOptions.length)];

        // Check if the position ID exists before inserting
        const checkPositionSQL = "SELECT * FROM positions WHERE position_id = ?";
        const [positionResult] = await conn.execute(checkPositionSQL, [candidatePosition]);

        if (positionResult.length === 0) {
            return res.status(400).json({ message: "Invalid position ID" });
        }

        // Insert candidate
        const insertSQL = "INSERT INTO candidates (firstname, lastname, gender, position_id, credibilities, platform, avatar) VALUES (?, ?, ?, ?, ?, ?, ?)";
        const [result] = await conn.execute(insertSQL, [firstName, lastName, gender, candidatePosition, credibility, platform, profilePicture]);

        res.status(201).json({ message: "Candidate added successfully", candidateId: result.insertId });
    } catch (err) {
        console.error("Error inserting candidate:", err);
        res.status(500).json({ message: "Database error" });
    }
});
//edit candidate
app.patch("/api/editCandidate", verifyToken, isAdmin, async (req, res) => {
    try {
        const { candidate_id, new_FirstName, new_LastName, new_Position, new_Gender, new_Credibility, new_Platform } = req.body; // Use the correct field names

        console.log(candidate_id, new_FirstName, new_LastName, new_Position, new_Gender, new_Credibility, new_Platform);

        // Check if all required fields are present
        if (!candidate_id || !new_FirstName || !new_LastName || !new_Position || !new_Gender || !new_Credibility || !new_Platform) {
            return res.status(400).json({ message: "❌ All fields are required" });
        }

        // Normalize gender input (convert to lowercase for consistency)
        const normalizedGender = new_Gender.toLowerCase();

        // Validate if candidate exists
        const checkCandidateSQL = "SELECT * FROM candidates WHERE candidate_id = ?";
        const [candidateResult] = await conn.execute(checkCandidateSQL, [candidate_id]);

        if (candidateResult.length === 0) {
            return res.status(404).json({ message: "❌ Candidate not found" });
        }

        // Validate if position exists
        const checkPositionSQL = "SELECT * FROM positions WHERE position_id = ?";
        const [positionResult] = await conn.execute(checkPositionSQL, [new_Position]);

        if (positionResult.length === 0) {
            return res.status(400).json({ message: "❌ Invalid position ID" });
        }

        // Update candidate
        const updateSQL = `
            UPDATE candidates 
            SET firstname = ?, lastname = ?, gender = ?, position_id = ?, credibilities = ?, platform = ? 
            WHERE candidate_id = ?
        `;
        const [updateResult] = await conn.execute(updateSQL, [new_FirstName, new_LastName, normalizedGender, new_Position, new_Credibility, new_Platform, candidate_id]);

        if (updateResult.affectedRows === 0) {
            return res.status(404).json({ message: "❌ Candidate update failed" });
        }

        res.status(200).json({ message: "✅ Candidate updated successfully" });
    } catch (err) {
        console.error("Error updating candidate:", err);
        res.status(500).json({ message: "❌ Database error" });
    }
});

//delete candidate
app.delete("/api/deleteCandidate/:candidateID", verifyToken, isAdmin, async (req, res) => {
    try {
        const { candidateID } = req.params; // Use params instead of body

        if (!candidateID) {
            return res.status(400).json({ message: "❗ Candidate ID is required" });
        }

        // Check if the candidate exists
        const checkSQL = "SELECT * FROM candidates WHERE candidate_id = ?";
        const [candidateResult] = await conn.execute(checkSQL, [candidateID]);

        if (candidateResult.length === 0) {
            return res.status(404).json({ message: "❌ Candidate not found" });
        }

        // Delete the candidate
        const deleteSQL = "DELETE FROM candidates WHERE candidate_id = ?";
        await conn.execute(deleteSQL, [candidateID]);

        res.status(200).json({ message: "✅ Candidate deleted successfully" });
    } catch (err) {
        console.error("❌ Error deleting candidate:", err);
        res.status(500).json({ message: "❌ Database error" });
    }
});

// Fetch Votes (With Optional Search)
app.get("/api/votes", async (req, res) => {
    console.log("🔵 API /api/votes called");

    const searchQuery = req.query.search ? `%${req.query.search}%` : "%";

    const sql = `
    SELECT 
        v.vote_id,
        CONCAT(vtr.firstname, ' ', vtr.lastname) AS voter_name, 
        CONCAT(c.firstname, ' ', c.lastname) AS candidate_name, 
        p.position_name, 
        v.vote_time
    FROM votes v
    JOIN candidates c ON v.candidate_id = c.candidate_id
    JOIN positions p ON v.position_id = p.position_id
    JOIN voters vtr ON v.voter_id = vtr.voter_id
    WHERE CONCAT(c.firstname, ' ', c.lastname) LIKE ? 
       OR p.position_name LIKE ? 
       OR CONCAT(vtr.firstname, ' ', vtr.lastname) LIKE ?;
`;

    try {
        const [results] = await conn.execute(sql, [searchQuery, searchQuery, searchQuery]);
        res.json(results || []);
    } catch (err) {
        console.error("Database Query Error:", err);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

// Delete a Vote
app.delete("/api/votes/:id", (req, res) => {
    const voteId = parseInt(req.params.id, 10);

    // Validate that voteId is a number
    if (isNaN(voteId)) {
        return res.status(400).json({ error: "Invalid vote ID" });
    }

    const sql = "DELETE FROM votes WHERE vote_id = ?";

    conn.query(sql, [voteId], (err, result) => {
        if (err) {
            console.error("Database Error:", err); // Log error for debugging
            return res.status(500).json({ error: "Internal Server Error" });
        }

        if (result.affectedRows === 0) {
            return res.status(404).json({ error: "Vote not found" });
        }

        res.json({ message: "Vote deleted successfully" });
    });
});

// Reset Votes (Delete All Votes)
app.post("/api/votesReset", async (req, res) => {
    const { confirm } = req.body;

    if (confirm !== "RESET_VOTES") {
        return res.status(400).json({ error: "Invalid reset confirmation" });
    }

    try {
        const [result] = await conn.execute("DELETE FROM votes");  // Use execute() for promise-based queries
        res.json({ message: "All votes reset successfully", affectedRows: result.affectedRows });
    } catch (err) {
        console.error("Database Error:", err);
        res.status(500).json({ error: "Internal Server Error" });
    }
});


//fetch votes in each candidates in each position
app.get('/api/voteTally', async (req, res) => {
    const query = `
        SELECT 
            p.position_id,
            p.position_name AS position, 
            c.candidate_id,
            CONCAT(c.firstname, ' ', c.lastname) AS name, 
            COALESCE(COUNT(v.vote_id), 0) AS vote 
        FROM positions p
        LEFT JOIN candidates c ON p.position_id = c.position_id
        LEFT JOIN votes v ON c.candidate_id = v.candidate_id
        GROUP BY p.position_id, p.position_name, c.candidate_id, c.firstname, c.lastname
        ORDER BY p.position_id, vote DESC;
    `;

    try {
        const [results] = await conn.query(query); // ✅ Use `await` with promise-based query

        // ✅ Transform results into an array of positions, each with a list of candidates
        const groupedResults = results.reduce((acc, row) => {
            let position = acc.find((p) => p.position_id === row.position_id);
            if (!position) {
                position = {
                    position_id: row.position_id,
                    position_name: row.position,
                    candidates: [],
                };
                acc.push(position);
            }

            // ✅ Ensure candidates are always included
            if (row.candidate_id) {
                position.candidates.push({
                    candidate_id: row.candidate_id,
                    name: row.name,
                    vote: row.vote,
                });
            }

            return acc;
        }, []);

        res.json(groupedResults);
    } catch (error) {
        console.error("Error fetching vote tally:", error);
        res.status(500).json({ error: "Internal server error" });
    }
});

//check if already voted

app.get('/api/checkVote', verifyToken, async (req, res) => {
    const { voterID } = req.query; // Use query parameters for GET requests
    console.log("voter id " + voterID);
    if (!voterID) {
        return res.status(400).json({ error: "Voter ID is required" });
    }

    const sql = "SELECT * FROM votes WHERE voter_id = ?";
    
    try {
        const [result] = await conn.execute(sql, [voterID]);

        return res.json({ hasVoted: result.length > 0, votes: result });
    } catch (err) {
        console.error("Database Query Error:", err);
        return res.status(500).json({ error: "Internal Server Error" });
    }
});


//creating a election
app.post("/api/createElection", verifyToken, isAdmin, async (req, res) => {
    try {
        const { title, desc, endDate } = req.body;

        // Check for missing fields
        if (!title?.trim() || !desc?.trim() || !endDate?.trim()) {
            return res.status(400).json({ error: "❌ All fields are required" });
        }

        // Validate date format (YYYY-MM-DD expected)
        if (!/^\d{4}-\d{2}-\d{2}$/.test(endDate)) {
            return res.status(400).json({ error: "❌ Invalid date format (YYYY-MM-DD required)" });
        }

        // Insert into database
        const sql = "INSERT INTO elections (title, description, end_date) VALUES (?, ?, ?)";
        const [result] = await conn.execute(sql, [title.trim(), desc.trim(), endDate]);

        res.status(201).json({
            message: "✅ Election created successfully",
            election_id: result.insertId,
        });
    } catch (err) {
        console.error("❌ Error creating election:", err);
        res.status(500).json({ error: "❌ Database error" });
    }
});

//fetch the election

app.get('/api/getElection', async (req, res) => {
    try {
        const sql = `SELECT * FROM elections 
                     WHERE LOWER(status) IN ("pending", "active") 
                     ORDER BY start_date DESC`;

        const [results] = await conn.execute(sql);

        if (results.length === 0) {
            return res.status(200).json([]); // ✅ Returns an empty array instead of 404
        }

        res.status(200).json(results);
    } catch (err) {
        console.error("❌ Error fetching elections:", err);
        res.status(500).json({ error: "❌ Internal server error" });
    }
});


app.get("/api/getActiveElection", async (req, res) => {
    const sql = 'SELECT * FROM elections WHERE status = "active"';
    try {
        const [results] = await conn.query(sql); // ✅ Direct query, no `promise()`

        if (results.length === 0) {
            return res.status(404).json({ message: "No active election found." });
        }

        res.json(results);
    } catch (error) {
        console.error("Error fetching active election:", error);
        res.status(500).json({ error: "Internal server error" });
    }
});
//setActive election

app.patch('/api/updateStatus', verifyToken, isAdmin, async (req, res) => {
    const { election_ID, status, title, desc } = req.body;

    if (!election_ID || !status || !title || !desc) {
        return res.status(400).json({ error: 'Election ID, status, and title are required' });
    }

    const connection = await conn.getConnection(); // Get a connection from the pool

    try {
        await connection.beginTransaction(); // Start transaction

        if (status === "ended") {
            // Move election to history
            const moveToHistorySQL = `
                INSERT INTO election_history (election_id, election_title, election_desc)
                VALUES (?, ?, ?);
            `;

            await connection.execute(moveToHistorySQL, [election_ID, title, desc]);

            const endedSQL = "UPDATE elections SET status = ? WHERE election_id = ?";
            await connection.execute(endedSQL, [status, election_ID]);
        } else {
            // Just update status if not closing the election
            const updateSQL = "UPDATE elections SET status = ? WHERE election_id = ?";
            await connection.execute(updateSQL, [status, election_ID]);
        }

        await connection.commit(); // Commit transaction
        res.json({ message: `Election status updated to ${status} successfully` });
    } catch (err) {
        await connection.rollback(); // Rollback on error
        console.error("❌ Error updating election status:", err);
        res.status(500).json({ error: "Internal server error" });
    } finally {
        connection.release(); // Release connection back to the pool
    }
});



//fetch history

app.get('/api/getHistory', async (req, res) => {
    try {
        const sql = 'SELECT * FROM election_history';
        const [results] = await conn.execute(sql); // Use async/await for better handling
        res.json(results);
    } catch (err) {
        console.error("❌ Error fetching election history:", err);
        res.status(500).json({ error: "❌ Database error", details: err.message });
    }
});

//fetch candidate by position
app.get('/api/electionCandidates', async (req, res) => {
    const sql = `
      SELECT p.position_id, p.position_name, c.candidate_id, 
             c.firstname, c.lastname, c.gender, c.platform, 
             c.credibilities, c.avatar
      FROM positions p
      LEFT JOIN candidates c ON p.position_id = c.position_id
      ORDER BY p.position_id;
    `;

    try {
        const [results] = await conn.execute(sql); // Using `execute()` for async/await support

        // Group candidates by position
        const positionsMap = {};
        results.forEach((row) => {
            if (!positionsMap[row.position_id]) {
                positionsMap[row.position_id] = {
                    position_id: row.position_id,
                    position_name: row.position_name,
                    candidates: [],
                };
            }
            if (row.candidate_id) {
                positionsMap[row.position_id].candidates.push({
                    candidate_id: row.candidate_id,
                    name: `${row.firstname} ${row.lastname}`,
                    gender: row.gender,
                    platform: row.platform,
                    credibility: row.credibilities,
                    avatar: row.avatar,
                });
            }
        });

        res.json(Object.values(positionsMap)); // Send grouped data

    } catch (err) {
        console.error("❌ Database error:", err);
        res.status(500).json({ message: 'Database error', error: err.message });
    }
});
//handle vote
app.post("/api/electionVote", verifyToken, async (req, res) => {
    const { votes, voter_id } = req.body;

    console.log("Received votes:", votes);
    console.log("Extracted voter_id:", voter_id);

    if (!voter_id) {
        return res.status(400).json({ message: "Missing voter ID" });
    }

    if (!votes || votes.length === 0) {
        return res.status(400).json({ message: "No votes provided" });
    }

    const connection = await conn.getConnection();

    try {
        await connection.beginTransaction();
        console.log("Transaction started");

        const sql = `INSERT INTO votes (voter_id, candidate_id, position_id) VALUES (?, ?, ?)`;

        for (const vote of votes) {
            console.log(`Processing vote for position ${vote.position_id}`);

            const checkSQL = `SELECT * FROM votes WHERE voter_id = ? AND position_id = ?`;
            const [existingVote] = await connection.execute(checkSQL, [voter_id, vote.position_id]);

            if (existingVote.length > 0) {
                console.error(`Duplicate vote detected for position ID: ${vote.position_id}`);
                throw new Error(`Duplicate vote detected for position ID: ${vote.position_id}`);
            }

            await connection.execute(sql, [voter_id, vote.candidate_id, vote.position_id]);
            console.log(`Vote inserted for position ${vote.position_id}`);
        }

        await connection.commit();
        console.log("Transaction committed successfully");
        res.json({ message: "Vote submitted successfully!" });

    } catch (error) {
        console.error("Vote submission error:", error);
        await connection.rollback();
        res.status(500).json({ message: "Vote submission failed", error: error.message });
    } finally {
        connection.release();
    }
});









//register
app.post('/api/signup', async (req, res) => {
    try {
        const { firstname, lastname, lrn, gender, username, password } = req.body;

        // ✅ Check if all required fields are provided
        if (!firstname || !lastname || !lrn || !gender || !username || !password) {
            return res.status(400).json({ error: 'All fields are required' });
        }

        // ✅ Check if the username already exists
        const [existingUser] = await conn.query('SELECT * FROM voters WHERE username = ?', [username]);
        if (existingUser.length > 0) {
            return res.status(400).json({ error: 'Username is already taken' });
        }

        // ✅ Check if the LRN is unique
        const [existingLRN] = await conn.query('SELECT * FROM voters WHERE lrn = ?', [lrn]);
        if (existingLRN.length > 0) {
            return res.status(400).json({ error: 'LRN is already registered' });
        }

        // ✅ Hash password before storing
        const hashedPassword = await bcrypt.hash(password, 12);

        // ✅ Assign a random profile picture based on gender
        let profilePictureOptions = [];
        switch (gender.toLowerCase()) {
            case 'male':
                profilePictureOptions = ['default_profile-m1.jpg', 'default_profile-m2.jpg'];
                break;
            case 'female':
                profilePictureOptions = ['default_profile-f1.jpg', 'default_profile-f2.jpg'];
                break;
            default:
                profilePictureOptions = ['default_profile-f1.jpg', 'default_profile-2.jpg', 'default_profile-m1.jpg', 'default_profile-m2.jpg'];
                break;
        }
        const profilePicture = profilePictureOptions[Math.floor(Math.random() * profilePictureOptions.length)];

        // ✅ Insert user into the database
        const sql = 'INSERT INTO voters (firstname, lastname, lrn, gender, username, password, image_path) VALUES (?, ?, ?, ?, ?, ?, ?)';
        await conn.query(sql, [firstname, lastname, lrn, gender, username, hashedPassword, profilePicture]);

        // ✅ Success Response
        res.json({ message: '✅ Registration successful! You can now log in.' });

    } catch (error) {
        console.error('Error during registration:', error.message);
        res.status(500).json({ error: 'Internal server error' });
    }
});


app.listen(5000, () => {
    console.log(`✅ Server running on http://localhost:5000`);
});
