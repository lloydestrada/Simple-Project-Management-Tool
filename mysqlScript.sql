-- Database
CREATE DATABASE IF NOT EXISTS pmtool_db;
USE pmtool_db;

-- Members (Authentication / Authorization)
CREATE TABLE IF NOT EXISTS members (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id VARCHAR(100) NOT NULL UNIQUE,
    username VARCHAR(100) NOT NULL,
    email VARCHAR(150) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);


-- Projects
CREATE TABLE IF NOT EXISTS projects (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(200) NOT NULL,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    owner_id BIGINT,
    FOREIGN KEY (owner_id) REFERENCES members(id) ON DELETE SET NULL
);

-- Tasks
CREATE TABLE IF NOT EXISTS tasks (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    project_id BIGINT NOT NULL,
    title VARCHAR(200) NOT NULL,
    description TEXT,
    status ENUM('Todo','In Progress','Done') DEFAULT 'Todo',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE
);

-- Change Log
CREATE TABLE IF NOT EXISTS change_log (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    task_id BIGINT NOT NULL,
    action VARCHAR(200) NOT NULL,
    old_value VARCHAR(200),
    new_value VARCHAR(200),
    changed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (task_id) REFERENCES tasks(id) ON DELETE CASCADE
);

-- Seed Members
INSERT INTO members (user_id, username, email, password) VALUES
('lloyd01', 'lloyd', 'lloyd@example.com', 'lloyd123'),
('john01', 'john', 'john@example.com', 'john123'),
('doe01', 'doe', 'doe@example.com', 'doe123');

