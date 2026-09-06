CREATE DATABASE IF NOT EXISTS cyber_dominion;
USE cyber_dominion;

CREATE TABLE users (id INT PRIMARY KEY AUTO_INCREMENT, username VARCHAR(50) NOT NULL UNIQUE, email VARCHAR(120) NOT NULL UNIQUE, password_hash VARCHAR(255) NOT NULL, created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP);
CREATE TABLE levels (id INT PRIMARY KEY, title VARCHAR(120) NOT NULL, concept VARCHAR(120) NOT NULL, difficulty VARCHAR(30) NOT NULL, description TEXT NOT NULL, mission TEXT NOT NULL, xp INT NOT NULL, coins_reward INT NOT NULL DEFAULT 0);
CREATE TABLE lab_tasks (id INT PRIMARY KEY AUTO_INCREMENT, level_id INT NOT NULL, task_order INT NOT NULL, prompt VARCHAR(255) NOT NULL, answer VARCHAR(120) NOT NULL, FOREIGN KEY (level_id) REFERENCES levels(id));
CREATE TABLE user_progress (user_id INT NOT NULL, level_id INT NOT NULL, completed BOOLEAN DEFAULT FALSE, tasks_completed INT DEFAULT 0, xp_earned INT DEFAULT 0, coins_earned INT DEFAULT 0, completed_at TIMESTAMP NULL, PRIMARY KEY (user_id, level_id), FOREIGN KEY (user_id) REFERENCES users(id), FOREIGN KEY (level_id) REFERENCES levels(id));
CREATE TABLE achievements (id INT PRIMARY KEY AUTO_INCREMENT, name VARCHAR(80) NOT NULL, description VARCHAR(255) NOT NULL, icon VARCHAR(10) NOT NULL);

INSERT INTO levels VALUES
(1,'Command Line Recon','Linux fundamentals','INITIATE','Build confidence in a safe, simulated shell environment.','Locate the training server evidence file without touching a real filesystem.',100,50),
(2,'Signal in the Noise','Log analysis','OPERATIVE','Learn to spot authentication patterns in structured server records.','Find the suspicious authentication sequence in the simulated access log.',120,60),
(3,'The Input Boundary','Web security concepts','ANALYST','Practice reasoning about validation, authentication, and safe application design.','Identify which controls protect a simulated web form.',130,65),
(4,'Packet Watch','Network security','SPECIALIST','Understand ports, protocols, and suspicious traffic patterns.','Classify the simulated event and recommend a containment action.',140,70),
(5,'Blackout Protocol','Incident response','COMMANDER','Build an evidence-led response to a simulated security incident.','Reconstruct the timeline and select the first response actions.',150,75);
INSERT INTO achievements (name,description,icon) VALUES ('First Signal','Complete your first lab','◎'),('Log Reader','Complete Log Analysis','◌'),('Command Ready','Complete all ten labs','✦');
INSERT INTO levels VALUES
(6,'Code Under Glass','Web security basics II','ANALYST','Recognize safe and unsafe patterns in a simulated application review.','Identify the validation and output-encoding controls in a code review.',160,80),
(7,'Protocol Atlas','Network security I','SPECIALIST','Map simulated ports and protocols to their intended roles.','Identify the protocol used by each simulated service.',170,85),
(8,'Watchtower','Network security II','SPECIALIST','Use defensive signals to recognize suspicious traffic patterns.','Find the event that should trigger an alert.',180,90),
(9,'Evidence Locker','Incident response I','COMMANDER','Preserve evidence and reconstruct a simulated compromise.','Identify the first evidence-preservation action.',190,95),
(10,'Root Cause','Incident response II','COMMANDER','Complete a full simulated response from timeline to remediation.','Determine root cause and select the final remediation step.',200,100);
