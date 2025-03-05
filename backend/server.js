
require('dotenv').config();

const bcrypt = require('bcrypt');
const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
const jwt = require("jsonwebtoken");
console.log("JWT Secret:", process.env.JWT_SECRET);
const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json()); // Parse JSON request bodies

// MySQL Connection
const db = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: process.env.DB_PORT,
    ssl: { rejectUnauthorized: true } // Required for Azure MySQL

});
// Connect to database
db.connect((err) => {
    if (err) {
        console.error('Error: Database connection failed:', err.message);
        return;
    }
    console.log('Success: Connected to Azure MySQL database.');
});

//Middleware
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

//Restrict Access to Admins Only
const isAdmin = (req, res, next) => {
    if (req.user.role !== 'admin') {
        return res.status(403).json({ error: 'Access denied. Admins only.' });
    }
    next();
};
// 🌟 API Endpoints

// 🏠 Home Route (Test API)
app.get('/', (req, res) => {
    res.send("BYTEVote is working");
});

// 📌 Get All Candidates


// 🗳️ Submit a Vote
app.post('/election', (req, res) => {
    const { voter_id, candidate_id } = req.body;

    if (!voter_id || !candidate_id) {
        return res.status(400).json({ error: 'Voter ID and Candidate ID are required' });
    }

    const sql = 'INSERT INTO votes (voter_id, candidate_id) VALUES (?, ?)';
    db.query(sql, [voter_id, candidate_id], (err, result) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ message: '✅ Vote cast successfully!' });
    });
});

// fetch dashboard
app.get('/adminDashboard', verifyToken, isAdmin, (req, res) => {
    const { data } = req.query;


    let sql;

    switch (data) {
        case 'voters':
            sql = `SELECT COUNT(*) AS count FROM voters`;
            break;
        case 'votedVoters':
            sql = `SELECT COUNT(*) AS count FROM voters WHERE voted = 1`;
            break;
        case 'votes':
            sql = `SELECT COUNT(*) AS count FROM votes`;
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

    db.query(sql, (err, result) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(result);
    });
});
//fetch voters
app.get('/getVoters', verifyToken, isAdmin, (req, res) => {
    const sql = `
   SELECT * FROM voters;
  `;
    db.query(sql, (err, result) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(result);
    });
});
//fetch voters



//Add voter
app.post("/addVoter", verifyToken, isAdmin, async (req, res) => {
    const { firstname, lastname, LRN, gender, username, password } = req.body;

    if (!firstname || !lastname || !LRN || !gender || !username || !password) {
        return res.status(400).json({ message: "All fields are required" });
    }

    try {
        // Check if LRN already exists
        const checkLRNSql = "SELECT * FROM voters WHERE LRN = ?";
        db.query(checkLRNSql, [LRN], async (err, results) => {
          if (err) {
            console.error("Database Error:", err);
            return res.status(500).json({ message: "Database error" });
          }
    
          if (results.length > 0) {
            return res.status(409).json({ message: "LRN already exists" }); // 409 Conflict
          }
    
          // If LRN does not exist, insert new voter
          const hashedPassword = await bcrypt.hash(password, 10);
          const insertSql = `INSERT INTO voters (firstname, lastname, LRN, gender, username, password) VALUES (?, ?, ?, ?, ?, ?)`;
          const values = [firstname, lastname, LRN, gender, username, hashedPassword];
    
          db.query(insertSql, values, (err, result) => {
            if (err) {
              console.error("Database Error:", err);
              return res.status(500).json({ message: "Database error" });
            }
            res.status(201).json({ message: "Voter added successfully", id: result.insertId });
          });
        });
    
      } catch (error) {
        console.error("Error:", error);
        res.status(500).json({ message: "Server error" });
      }
});

app.patch('/editVoter', verifyToken, isAdmin, async (req, res) => {
    const { voter_id, new_Firstname, new_Lastname, newLRN, newGender, newUsername, newPassword } = req.body;

    if (!voter_id || !new_Firstname || !new_Lastname || !newLRN || !newGender || !newUsername) {
        return res.status(400).json({ message: "All fields are required" });
    }

    try {
        let updateSql;
        let values;

        if (!newPassword) {
            updateSql = `UPDATE voters SET firstname = ?, lastname = ?, LRN = ?, gender = ?, username = ? WHERE voter_id = ?`;
            values = [new_Firstname, new_Lastname, newLRN, newGender, newUsername, voter_id];
        } else {
            const hashedPassword = await bcrypt.hash(newPassword, 10);
            updateSql = `UPDATE voters SET firstname = ?, lastname = ?, LRN = ?, gender = ?, username = ?, password = ? WHERE voter_id = ?`;
            values = [new_Firstname, new_Lastname, newLRN, newGender, newUsername, hashedPassword, voter_id];
        }

        db.query(updateSql, values, (err, result) => {
            if (err) return res.status(500).json({ error: err.message });
            res.json({ message: "Voter updated successfully", result });
        });
    } catch (e) {
        console.error("Error:", e);
        res.status(500).json({ message: "Server error" });
    }
});

//delete voters

app.delete('/deleteVoter', verifyToken, isAdmin, async (req, res) => {
    const { voterID } = req.body;

    if (!voterID) {
        return res.status(400).json({ message: "Voter ID is required" });
    }

    try {
        const deleteSql = "DELETE FROM voters WHERE voter_id =?";
        db.query(deleteSql, [voterID], (err, result) => {
            if (err) return res.status(500).json({ error: err.message });
            res.json({ message: "Voter deleted successfully" });
        });
    } catch (e) {
        console.error("Error:", e);
        res.status(500).json({ message: "Server error" });
    }
});

//fetch position 

app.get('/getPositions', verifyToken, isAdmin, (req, res) => {
    const sql = 'SELECT * FROM positions';
    db.query(sql, (err, result) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(result);
    });
});
//edit postion

app.patch('/editPosition', verifyToken, isAdmin, async (req, res) => {
    const { positionID, newPosName } = req.body;

    if (!positionID || !newPosName) {
        return res.status(400).json({ message: "All fields are required" });
    }

    const sql = 'UPDATE positions SET position_name = ? WHERE position_id = ?';

    db.query(sql, [newPosName, positionID], (err, result) => {
        if (err) return res.status(500).json({ error: err.message });

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: "Position not found" });
        }

        res.json({ message: "Position updated successfully", result });
    });
});

//delete positions
app.delete('/deletePosition', verifyToken, isAdmin, async (req, res) => {
    const { positionID } = req.body;

    if (!positionID) {
        return res.status(400).json({ message: "Position ID is required" });
    }

    const sql = 'DELETE FROM positions WHERE position_id =?';

    db.query(sql, [positionID], (err, result) => {
        if (err) return res.status(500).json({ error: err.message });

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: "Position not found" });
        }

        res.json({ message: "Position deleted successfully" });
    });
});

//Add position 
app.post("/addPosition", verifyToken, isAdmin, (req, res) => {
    const { positionName } = req.body;
    if (!positionName) {
        return res.status(400).json({ message: "Position name is required" });
    }

    const sql = 'INSERT INTO positions (position_name) VALUES (?)';
    db.query(sql, [positionName], (err, result) => {
        if (err) {
            if (err.code === 'ER_DUP_ENTRY') {
                return res.status(400).json({ message: "Position already exists" });
            }
            return res.status(500).json({ error: err.message });
        }
        res.json({ message: "Position added successfully", id: result.insertId });
    });
});



// fetch voters voted
app.get('/getCandidates', verifyToken, isAdmin, (req, res) => {
    const sql = "SELECT c.candidate_id, c.firstname, c.lastname, c.gender, p.position_name AS position, c.credibility, c.platform FROM candidates c JOIN positions p ON c.position_id = p.position_id;";
    db.query(sql, (err, result) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(result);
    });
});

//add candidate
app.post("/addCandidate", (req, res) => {
    const { firstname, lastname, gender, position_id, credibility, platform } = req.body;
    if (!firstname ||!lastname ||!gender ||!position_id ||!credibility ||!platform) {
        return res.status(400).json({ message: "All fields are required" });
    }
    const sql = "INSERT INTO candidates (firstname, lastname, gender, position_id, credibility, platform) VALUES (?,?,?,?,?,?)";
});

// Fetch Votes (With Optional Search)
app.get("/votes", (req, res) => {
    const searchQuery = req.query.search ? `%${req.query.search}%` : "%";

    const sql = `
      SELECT 
    v.vote_id, 
    CONCAT(c.firstname, ' ', c.lastname) AS candidate_name, 
    p.position_name, 
    v.vote_time
    FROM votes v
    JOIN candidates c ON v.candidate_id = c.candidate_id
    JOIN positions p ON v.position_id = p.position_id
    WHERE CONCAT(c.firstname, ' ', c.lastname) LIKE '%' OR p.position_name LIKE '%';
    `;

    db.query(sql, [searchQuery, searchQuery], (err, results) => {
        if (err) {
            console.error("Database Error:", err); // Log for debugging
            return res.status(500).json({ error: "Internal Server Error" });
        }

        // Ensure response is always an array
        res.json(Array.isArray(results) ? results : []);
    });
});

// Delete a Vote
app.delete("/votes/:id", (req, res) => {
    const voteId = req.params.id;
    const sql = "DELETE FROM votes WHERE vote_id = ?";

    db.query(sql, [voteId], (err, result) => {
        if (err) return res.status(500).json({ error: err.message });
        if (result.affectedRows === 0) {
            return res.status(404).json({ error: "Vote not found" });
        }
        res.json({ message: "Vote deleted successfully" });
    });
});

// Reset Votes (Delete All Votes)
app.post("/votes/reset", (req, res) => {
    const { confirm } = req.body;
    if (confirm !== "RESET_VOTES") {
        return res.status(400).json({ error: "Invalid reset confirmation" });
    }

    const sql = "DELETE FROM votes";
    db.query(sql, (err, result) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ message: "All votes reset successfully" });
    });
});


//fetch votes in each candidates in each position
app.get('/voteTally', (req, res) => {
    const query = `
        SELECT p.position_name AS position, c.firstname AS name, COUNT(v.vote_id) AS vote 
        FROM votes v 
        JOIN candidates c ON v.candidate_id = c.candidate_id 
        JOIN positions p ON c.position_id = p.position_id
        GROUP BY p.position_name, c.candidate_id;
    `;

    db.query(query, (err, results) => {
        if (err) return res.status(500).json({ error: err.message });

        // Transform results into a structured format { position: [...candidates] }
        const groupedResults = results.reduce((acc, row) => {
            if (!acc[row.position]) acc[row.position] = [];
            acc[row.position].push({ name: row.name, vote: row.vote });
            return acc;
        }, {});

        res.json(groupedResults);
    });
});

//handle login request
app.post('/login', (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).json({ error: 'Username and Password are required' });
    }

    // Check voters table
    const checkVoterQuery = 'SELECT * FROM voters WHERE username = ?';
    db.query(checkVoterQuery, [username], async (err, voterResults) => {
        if (err) return res.status(500).json({ error: err.message });

        if (voterResults.length > 0) {
            const voter = voterResults[0];

            // Compare hashed password
            const isMatch = await bcrypt.compare(password, voter.password);
            if (!isMatch) {
                return res.status(401).json({ error: 'Invalid username or password' });
            }

            const token = jwt.sign(
                { id: voter.voter_id, role: voter.role, user: voter.username, avatar: voter.avatar },
                process.env.JWT_SECRET,
                { expiresIn: "5h" }
            );

            return res.json({ message: "✅ Voter login successful!", token, role: voter.role, user: voter.username, avatar: voter.avatar });
        }

        // If not found in voters, check admin table
        const checkAdminQuery = 'SELECT * FROM admin WHERE username = ?';
        db.query(checkAdminQuery, [username], async (err, adminResults) => {
            if (err) return res.status(500).json({ error: err.message });

            if (adminResults.length > 0) {
                const admin = adminResults[0];

                // Compare hashed password
                const isMatch = await bcrypt.compare(password, admin.password);
                if (!isMatch) {
                    return res.status(401).json({ error: 'Invalid username or password' });
                }

                const token = jwt.sign(
                    { id: admin.admin_id, role: admin.role, user: admin.username },
                    process.env.JWT_SECRET,
                    { expiresIn: "5h" }
                );

                return res.json({ message: "✅ Admin login successful!", token, role: admin.role, user: admin.username });
            }

            // If username does not exist in either table, return error
            res.status(401).json({ error: 'Invalid username or password' });
        });
    });
});

//register
app.post('/signup', async (req, res) => {
    const { firstname, lastname, lrn, gender, username, password } = req.body;

    if (!firstname || !lastname || !lrn || !gender || !username || !password) {
        return res.status(400).json({ error: 'All fields are required' });
    }

    // Check if username already exists
    db.query('SELECT * FROM voters WHERE username = ?', [username], (err, results) => {
        if (err) return res.status(500).json({ error: err.message });

        if (results.length > 0) {
            return res.status(400).json({ error: 'Username is already taken' });
        }

        // Check if LRN is unique
        db.query('SELECT * FROM voters WHERE lrn = ?', [lrn], async (err, lrnResults) => {
            if (err) return res.status(500).json({ error: err.message });

            if (lrnResults.length > 0) {
                return res.status(400).json({ error: 'LRN is already registered' });
            }

            //Hash password before storing
            const hashedPassword = await bcrypt.hash(password, 10);
            const maleAvatars = [
                "/assets/userprofile/default_profile-m1.jpg",
                "/assets/userprofile/default_profile-m2.jpg",
            ];
            const femaleAvatars = [
                "/assets/userprofile/default_profile-f1.jpg",
                "/assets/userprofile/default_profile-f2.jpg",
            ];
            let profilePicture = gender === "Male"
                ? maleAvatars[Math.floor(Math.random() * maleAvatars.length)]
                : femaleAvatars[Math.floor(Math.random() * femaleAvatars.length)];
            // Insert user into the database
            const sql = 'INSERT INTO voters (firstname, lastname, lrn, gender, username, password, avatar) VALUES (?, ?, ?, ?, ?, ?, ?)';
            db.query(sql, [firstname, lastname, lrn, gender, username, hashedPassword, profilePicture], (err, result) => {
                if (err) return res.status(500).json({ error: err.message });

                res.json({ message: '✅ Registration successful! You can now log in.' });
            });
        });
    });
});


app.listen(PORT, () => {
    console.log(`✅ Server running on http://localhost:${PORT}`);
});
