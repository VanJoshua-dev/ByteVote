
require('dotenv').config();

const bcrypt = require("bcryptjs");
const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
const jwt = require("jsonwebtoken");
const path = require('path');
const fs = require('fs');
console.log("JWT Secret:", process.env.JWT_SECRET);
const app = express();
const PORT = process.env.PORT || 5000;
// const pool = require('./db');
// Middleware
const corsOptions = {
    origin: "*", // Allow only your frontend
    methods: "GET, POST, PUT, DELETE, OPTIONS",
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true // ✅ Allow credentials (important for cookies/JWTs)
};
app.use(cors(corsOptions));

// ✅ Handle preflight requests
app.options("*", (req, res) => {
    res.header("Access-Control-Allow-Origin", "http://localhost:5176");
    res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
    res.header("Access-Control-Allow-Headers", "Content-Type, Authorization");
    res.header("Access-Control-Allow-Credentials", "true");
    res.sendStatus(200);
});
app.use(express.json()); // Parse JSON request bodies
app.use("/public", express.static(path.join(__dirname, "public")));
// MySQL Connection
const pool = mysql.createPool({
    connectionLimit: 10,
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: process.env.DB_PORT || 3306,
    ssl: {
        ca: fs.readFileSync("./DigiCertGlobalRootG2.crt.pem") // ✅ Load the SSL certificate
    }
}).promise();
// Connect to database
pool.getConnection((err) => {
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
app.get("/api/test-db", async (req, res) => {
    try {
        const [results] = await pool.query("SELECT NOW() AS currentTime");
        res.json({ message: "Database connected successfully!", results });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});
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

app.post('/api/login', async (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).json({ error: 'Username and Password are required' });
    }

    try {
        // Check voters table
        const [voterResults] = await pool.promise().query('SELECT * FROM voters WHERE username = ?', [username]);

        if (voterResults.length > 0) {
            const voter = voterResults[0];
            const isMatch = await bcrypt.compare(password, voter.password);

            if (!isMatch) {
                return res.status(401).json({ error: 'Invalid username or password' });
            }

            const token = jwt.sign(
                { id: voter.voter_id, role: voter.role, user: voter.username, avatar: voter.avatar },
                process.env.JWT_SECRET,
                { expiresIn: "5h" }
            );

            return res.json({ message: "✅ Voter login successful!", token, role: voter.role, user: voter.username, avatar: voter.avatar, voterID: voter.voter_id });
        }

        // Check admin table
        const [adminResults] = await pool.promise().query('SELECT * FROM admin WHERE username = ?', [username]);

        if (adminResults.length > 0) {
            const admin = adminResults[0];
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

        // If not found in either table
        return res.status(401).json({ error: 'Invalid username or password' });

    } catch (error) {
        console.error('Database Query Error:', error);
        return res.status(500).json({ error: 'Internal server error' });
    }
});

//register
app.post('/api/signup', async (req, res) => {
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
            let profilePictureOptions = [];
            switch (gender) {
                case 'Male':
                    profilePictureOptions = ['default_profile-m1.jpg', 'default_profile-m2.jpg'];
                    break;
                case 'Female':
                    profilePictureOptions = ['default_profile-f1.jpg', 'default_profile-f2.jpg'];
                    break;
                default:
                    profilePictureOptions = ['default_profile-f1.jpg', 'default_profile-2.jpg', 'default_profile-m1.jpg', 'default_profile-m2.jpg'];
                    break;
            }

            // Select a random profile picture
            const profilePicture = profilePictureOptions[Math.floor(Math.random() * profilePictureOptions.length)];
            // Insert user into the database
            const sql = 'INSERT INTO voters (firstname, lastname, lrn, gender, username, password, avatar) VALUES (?, ?, ?, ?, ?, ?, ?)';
            db.query(sql, [firstname, lastname, lrn, gender, username, hashedPassword, profilePicture], (err, result) => {
                if (err) return res.status(500).json({ error: err.message });

                res.json({ message: '✅ Registration successful! You can now log in.' });
            });
        });
    });
});


// 🗳️ Submit a Vote
app.post('/api/election', (req, res) => {
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
app.get('/api/adminDashboard', verifyToken, isAdmin, (req, res) => {
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
//fetch Vote Counts
app.get("/api/getVoteCounts", (req, res) => {
    const sql = `
      SELECT 
    p.position_id, 
    p.position_name, 
    c.candidate_id, 
    CONCAT(c.firstname, ' ', c.lastname) AS candidate_name, 
    COUNT(v.vote_id) AS votes
    FROM positions p
    LEFT JOIN candidates c ON p.position_id = c.position_id
    LEFT JOIN votes v ON c.candidate_id = v.candidate_id
    GROUP BY p.position_id, c.candidate_id
    ORDER BY p.position_id, votes DESC;
    `;
  
    db.query(sql, (err, results) => {
      if (err) {
        console.error("Error fetching vote counts:", err);
        return res.status(500).json({ error: "Internal server error" });
      }
  
      // Format results to group by position
      const groupedResults = results.reduce((acc, row) => {
        let position = acc.find((p) => p.position_id === row.position_id);
        if (!position) {
          position = {
            position_id: row.position_id,
            position_name: row.position_name,
            candidates: [],
          };
          acc.push(position);
        }
  
        if (row.candidate_id) {
          position.candidates.push({
            candidate_id: row.candidate_id,
            candidate_name: row.candidate_name,
            votes: row.votes,
          });
        }
  
        return acc;
      }, []);
  
      res.json(groupedResults);
    });
  });

//fetch voters
app.get('/api/getVoters', verifyToken, isAdmin, (req, res) => {
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
app.post("/api/addVoter", verifyToken, isAdmin, async (req, res) => {
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

app.patch('/api/editVoter', verifyToken, isAdmin, async (req, res) => {
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

app.delete('/api/deleteVoter', verifyToken, isAdmin, async (req, res) => {
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

app.get('/api/getPositions', verifyToken, isAdmin, (req, res) => {
    const sql = 'SELECT * FROM positions';
    db.query(sql, (err, result) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(result);
    });
});
//edit postion

app.patch('/api/editPosition', verifyToken, isAdmin, async (req, res) => {
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
app.delete('/api/deletePosition', verifyToken, isAdmin, async (req, res) => {
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
app.post("/api/addPosition", verifyToken, isAdmin, (req, res) => {
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
app.get('/api/getCandidates', verifyToken, isAdmin, (req, res) => {
    const sql = "SELECT c.candidate_id, c.firstname, c.lastname, c.gender, c.avatar , p.position_name AS position, c.credibility, c.platform FROM candidates c JOIN positions p ON c.position_id = p.position_id;";
    db.query(sql, (err, result) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(result);
    });
});

//add candidate
app.post("/api/addCandidate",verifyToken, isAdmin, (req, res) => {
    const { firstName, lastName, gender, candidatePosition, credibility, platform } = req.body;

    if (!firstName || !lastName || !gender || !candidatePosition || !credibility || !platform) {
        return res.status(400).json({ message: "All fields are required" });
    }

    const sql = "INSERT INTO candidates (firstname, lastname, gender, position_id, credibility, platform, avatar) VALUES (?, ?, ?, ?, ?, ?, ?)";
    let profilePictureOptions = [];
            switch (gender) {
                case 'Male':
                    profilePictureOptions = ['default_profile-m1.jpg', 'default_profile-m2.jpg'];
                    break;
                case 'Female':
                    profilePictureOptions = ['default_profile-f1.jpg', 'default_profile-f2.jpg'];
                    break;
                default:
                    profilePictureOptions = ['default_profile-f1.jpg', 'default_profile-f2.jpg', 'default_profile-m1.jpg', 'default_profile-m2.jpg'];
                    break;
            }

            // Select a random profile picture
    const profilePicture = profilePictureOptions[Math.floor(Math.random() * profilePictureOptions.length)];
    db.query(sql, [firstName, lastName, gender, candidatePosition, credibility, platform, profilePicture], (err, result) => {
        if (err) {
            console.error("Error inserting candidate:", err);
            return res.status(500).json({ message: "Database error" });
        }
        res.status(201).json({ message: "Candidate added successfully", candidateId: result.insertId });
    });
});
//edit candidate
app.patch("/api/editCandidate", verifyToken, isAdmin, (req, res) => {
   const {candidate_id, new_FirstName, new_LastName, new_Position, new_Gender, new_Credibility, new_Platform} = req.body;
    console.log(candidate_id);
    console.log(new_FirstName);
    console.log(new_LastName);
    console.log(new_Position);
    console.log(new_Gender);
    console.log(new_Credibility);
    console.log(new_Platform);

   if ( !candidate_id || !new_FirstName || !new_LastName || !new_Position || !new_Gender || !new_Credibility || !new_Platform) {
        return res.status(400).json({ message: "❌ All fields are required" });
    }

    const sql = `
        UPDATE candidates 
        SET firstname = ?, lastname = ?, gender = ?, position_id = ?, credibility = ?, platform = ? 
        WHERE candidate_id = ?
    `;

    db.query(sql, [new_FirstName, new_LastName, new_Gender, new_Position, new_Credibility, new_Platform, candidate_id], (err, result) => {
        if (err) {
            console.error("Error updating candidate:", err);
            return res.status(500).json({ message: "Database error" });
        }
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: "Candidate not found" });
        }
        res.status(200).json({ message: "Candidate updated successfully" });
    });
});
//delete candidate
app.delete("/api/deleteCandidate", verifyToken, isAdmin, (req, res) => {
    const { candidateID } = req.body;
    if (!candidateID) {
        return res.status(400).json({ message: "❗ Candidate ID is required" });
    }
    const sql = "DELETE FROM candidates WHERE candidate_id = ?";
    db.query(sql, [candidateID], (err, result) => {
        if (err) {
            console.error("❌ Error deleting candidate:", err);
            return res.status(500).json({ message: "❌ Database error" });
        }
        res.status(201).json({ message: "✅ Candidate added successfully"});
    });
})
// Fetch Votes (With Optional Search)
app.get("/api/votes", (req, res) => {
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
app.delete("/api/votes/:id", (req, res) => {
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
app.post("/api/votes/reset", (req, res) => {
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
app.get('/api/voteTally', (req, res) => {
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


//creating a election
app.post("/api/createElection", verifyToken, isAdmin, (req, res) => {
    const { title, desc, endDate } = req.body;
    if (!title || !desc || !endDate) {
        return res.status(400).json({ error: 'All fields are required' });
    }
    const sql = 'INSERT INTO elections (title, description, end_date) VALUES (?,?,?)';
    db.query(sql, [title, desc, endDate], (err, result) => {
        if (err) return res.status(500).json({ error: err.message });
        res.status(201).json({ message: 'Election created successfully', election_id: result.insertId });
    });
});

//fetch the election

app.get('/api/getElection', (req, res) => {
    const sql = 'SELECT * FROM elections WHERE status = "pending" OR status = "active"';
    db.query(sql, (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(results);
    });
});

app.get('/api/getActiveElection', (req, res) => {
    const sql = 'SELECT * FROM elections WHERE status = "active"';
    db.query(sql, (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(results);
    });
});
//setActive election

app.patch('/api/updateStatus', verifyToken, isAdmin, (req, res) => {
    const { election_ID, status, title, desc } = req.body;

    if (!election_ID || !status || !title || !desc) {
        return res.status(400).json({ error: 'Election ID, status, and title are required' });
    }

    if (status === "ended") {
        // Move election to history
        const moveToHistorySQL = `
        INSERT INTO election_history (election_id, election_title, election_desc)
        VALUES (?,?,?);
        `;

        console.log("Inserting into election_history:", { election_ID, title, desc }); // Debugging Log

        db.query(moveToHistorySQL, [election_ID, title, desc], (err, result) => {
            if (err) {
                console.error("Error inserting into election_history:", err);
                return res.status(500).json({ error: err.message });
            }
            const  endedSQL = "UPDATE elections SET status = ? WHERE election_id = ?";
            db.query(endedSQL, [status, election_ID], (err, result) => {
                if (err) return res.status(500).json({ error: err.message });
    
                if (result.affectedRows === 0) {
                    return res.status(404).json({ error: 'Election not found' });
                }
                console.log(`Election status updated to ${status} successfully`);
                res.json({ message: `Election status updated to ${status} successfully` });
            });
        });
    } else {
        // Just update status if not closing the election
        const updateSQL = 'UPDATE elections SET status = ? WHERE election_id = ?';

        console.log("Updating election status:", { election_ID, status });

        db.query(updateSQL, [status, election_ID], (err, result) => {
            if (err) return res.status(500).json({ error: err.message });

            if (result.affectedRows === 0) {
                return res.status(404).json({ error: 'Election not found' });
            }
            console.log(`Election status updated to ${status} successfully`);
            res.json({ message: `Election status updated to ${status} successfully` });
        });
    }
});

//fetch history

app.get('/api/getHistory', (req, res) => {
    const sql = 'SELECT * FROM election_history';
    db.query(sql, (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(results);
    });
});

//fetch candidate by position
app.get('/api/election/candidates', (req, res) => {
    const sql = `
      SELECT p.position_id, p.position_name, c.candidate_id, 
             c.firstname, c.lastname, c.gender, c.platform, 
             c.credibility, c.avatar
      FROM positions p
      LEFT JOIN candidates c ON p.position_id = c.position_id
      ORDER BY p.position_id;
    `;
  
    db.query(sql, (err, results) => {
      if (err) return res.status(500).json({ message: 'Database error', error: err });
  
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
            credibility: row.credibility,
            avatar: row.avatar,
          });
        }
      });
  
      res.json(Object.values(positionsMap));
    });
  });
  //handle vote
  app.post('/api/election/vote', (req, res) => {
    const { votes } = req.body;
  
    if (!votes || votes.length === 0) {
      return res.status(400).json({ message: 'No votes provided' });
    }
  
    const sql = `INSERT INTO votes (voter_id, candidate_id, position_id) VALUES ?`;
    const values = votes.map(vote => [vote.voter_id, vote.candidate_id, vote.position_id]);
  
    db.query(sql, [values], (err, result) => {
      if (err) {
        return res.status(500).json({ message: 'Database error', error: err });
      }
      res.json({ message: 'Vote submitted successfully!' });
    });
  });
//handle login request

app.listen(PORT, () => {
    console.log(`✅ Server running on http://localhost:${PORT}`);
});

module.exports = app;