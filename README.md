# Silkviser: Blockchain Cryptocurrency Visualization Dashboard

Overview

Silkviser is a full-stack web application designed to visualize blockchain-based cryptocurrency transaction data. It provides an interactive dashboard that allows users to explore blockchain structure, blocks, transactions, and addresses through dynamic visualizations. The system helps both novice and experienced users understand cryptocurrency trends and transaction relationships.

Features

Interactive blockchain dashboard

Visual exploration of blocks, transactions, and addresses

Sankey diagram to visualize transaction flow

Interactive charts for transaction and block trends

Address-level balance and transaction analytics

Search functionality for blocks, transactions, and addresses

Dataset toggle for comparing different cryptocurrency datasets

Filtering and brushing for detailed data exploration

Visualization Components
Blockchain Page

Displays recent blocks and blockchain statistics

Transaction and block generation trend charts

Timeline-based block relationship visualization

Block Page

Detailed block information

Transaction visualization using custom glyphs

Transaction size and fee distribution charts

Interactive transaction table

Transaction Page

Transaction details and metadata

Sankey diagram showing input-output address flow

Address-level transaction breakdown

Address Page

Address balance and transaction history

Monthly balance and activity trends

Interactive transaction navigation

Tech Stack
Frontend

React.js

D3.js

JavaScript

HTML/CSS

Backend

Flask (Python)

REST APIs

Data

Bitcoin Blockchain API

Custom Silubium dataset (JSON)

Tools

Git & GitHub

VS Code

Architecture

Frontend (React + D3.js) communicates with the backend (Flask) through REST APIs. The backend fetches blockchain data from external APIs and stores it in a database. The frontend visualizes this data using interactive charts and diagrams.