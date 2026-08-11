# QueryPal by STRIKERS ⚡

**An Intelligent LLM Agent for Natural-Language Database Interaction & Visualization**

QueryPal is an end-to-end conversational AI system designed to bridge the gap between non-technical users and complex databases. By leveraging Large Language Models, QueryPal allows anyone to extract insights, generate dynamic charts, and map out entity relationships using plain English—democratizing business intelligence without requiring a single line of SQL.

---

## Table of Contents

* [Overview](https://www.google.com/search?q=%23overview)
* [Key Features](https://www.google.com/search?q=%23key-features)
* [System Architecture](https://www.google.com/search?q=%23system-architecture)
* [Repository Structure](https://www.google.com/search?q=%23repository-structure)
* [Prerequisites](https://www.google.com/search?q=%23prerequisites)
* [Quick Start](https://www.google.com/search?q=%23quick-start)
* [Backend Setup](https://www.google.com/search?q=%23backend-setup)
* [Frontend Setup](https://www.google.com/search?q=%23frontend-setup)
* [Agent Tools Reference](https://www.google.com/search?q=%23agent-tools-reference)
* [API Reference](https://www.google.com/search?q=%23api-reference)
* [Sample Database & Adding Your Own Data](https://www.google.com/search?q=%23sample-database--adding-your-own-data)
* [Demo Walkthrough & Use Cases](https://www.google.com/search?q=%23demo-walkthrough--use-cases)
* [Agent & Safety Model Summary](https://www.google.com/search?q=%23agent--safety-model-summary)
* [Operational Limits and Constraints](https://www.google.com/search?q=%23operational-limits-and-constraints)
* [Hackathon Requirements Coverage](https://www.google.com/search?q=%23hackathon-requirements-coverage)
* [Troubleshooting](https://www.google.com/search?q=%23troubleshooting)
* [Tech Stack](https://www.google.com/search?q=%23tech-stack)

---

## Overview

QueryPal serves as a clean, conversational interface in front of a SQLite database. When a user enters a plain-English prompt, an AI-powered agent dynamically chooses which tool to invoke—executing queries, visualizing data via charts, drawing diagrams, or summarizing insights—and outputs structured responses alongside the raw data backing them up.

End-to-end user request pipeline:

1. The user enters a natural language query into the chat interface input.
2. The input message is transmitted to the FastAPI backend API endpoint.
3. A custom tool-calling loop provides the LLM with the live database schema and callable tools, empowering it to make autonomous execution choices.
4. Tool executions—including generated SQL text, returned rows, and chart configurations—are processed and sent back to the frontend.
5. The frontend cleanly parses and renders the tabular data, SQL transparency panels, and interactive visualizations natively.

---

## Key Features

* **Conversational Data Interface:** A clean, modern chat layout optimized for natural language data exploration.


* **Five LLM-Callable Tools:** Implements `get_schema`, `execute_query`, `generate_chart`, `generate_flowchart`, and `explain_data` as strongly typed functions.


* **Dynamic Visualizations:** Supports bar charts for categorical comparisons, line charts for trends, pie charts for proportions, and scatter plots for correlations.


* **Mermaid.js Flowcharts & ER Diagrams:** Automatically drafts and renders entity-relationship schemas and processing flowcharts.


* **SQL Transparency Ledger:** Displays the exact SQL query executed right above results for complete system transparency.


* **Executive Control Panel (Dashboard):** Pins important charts and diagrams into a persistent, unified dashboard grid.


* **Query Ledger:** Logs all executed SQL queries with exact timestamps for audit tracking and reuse.


* **Data Export Utilities:** Instantly download charts as PNG images or export table results directly to clean CSV files.


* **Voice Dictation Integration:** Supports native browser speech-to-text functionality for hands-free query input.

---

## System Architecture

```
 Browser — React / Vite (Frontend Interface)
        │
        │  POST /api/chat (JSON Payload)
        ▼
 FastAPI — main1.py (Backend Server)
        │  Binds 5 tools to LangChain Agent
        ▼
 Agent Loop & Tool Handlers
        │
        ├──▶ ecommerce.db   (Primary SQLite Database - Read Only)
        └──▶ chat_history.db (Secondary SQLite Database - Query Logs & Dashboard Pins)

```

* **Frontend:** Built with React, Vite, Recharts, and Mermaid.js for rich client-side rendering.


* **Backend:** FastAPI handling RESTful operations, CORS policy management, and database routing.
* **Agent Framework:** LangChain integration with custom tool binding loops.


* **Storage Layer:** Dual-database architecture separating core application data from user logs and saved dashboard items.

---

## Repository Structure

```text
QueryPal/
├── backend/
│   ├── main1.py               # FastAPI application logic and tool route bindings
│   ├── ecommerce.db           # Sample e-commerce SQLite dataset
│   ├── chat_history.db        # Secondary local store for query history and dashboard pins
│   └── requirements.txt       # Python package dependencies
├── frontend/
│   ├── src/
│   │   ├── App.jsx            # Main user interface, components, and state management
│   │   ├── index.css          # Styling tokens and minimalist theme layout
│   │   └── main.jsx           # React root entry point
│   ├── package.json           # Node package dependencies
│   └── vite.config.js         # Vite configuration settings
├── .gitignore                 # Excluded system, environment, and cache files
└── README.md                  # Comprehensive project documentation

```

---

## Prerequisites

* **Node.js** (v18 or higher) and **npm** for the frontend.


* **Python** (v3.11 or higher) and **pip** for the backend.


* An active OpenAI API key (`OPENAI_API_KEY`).



---

## Quick Start

To run the system locally, open two separate terminal windows.

### Terminal 1: Backend Server

```bash
cd backend
python -m venv venv
# Windows:
venv\Scripts\activate
# Mac/Linux:
# source venv/bin/activate

pip install -r requirements.txt
# Create a .env file with your OPENAI_API_KEY
uvicorn main1:app --reload

```

### Terminal 2: Frontend Client

```bash
cd frontend
npm install
npm run dev

```

Open your browser at `http://localhost:5173` (or the port specified by Vite) to access QueryPal.

---

## Backend Setup

1. Navigate to the `backend` folder.


2. Create and activate a Python virtual environment.


3. Install the required libraries using pip:
```bash
pip install fastapi uvicorn sqlalchemy langchain-core langchain-openai python-dotenv pytest httpx html2canvas

```


4. Create a `.env` file inside the `backend` directory with the following configuration:


```env
OPENAI_API_KEY=your_openai_api_key_here
DB_PATH=sqlite:///./ecommerce.db

```


5. Launch the FastAPI server:
```bash
uvicorn main1:app --reload

```



---

## Frontend Setup

1. Navigate to the `frontend` folder.


2. Install node dependencies:
```bash
npm install

```


3. Run the development build:
```bash
npm run dev

```



---

## Agent Tools Reference

| Tool Name | Purpose | Expected Output |
| --- | --- | --- |
| `get_schema` | Retrieves table names, columns, and datatype definitions.

 | JSON schema layout

 |
| `execute_query` | Runs validated read-only SQL statements against the database.

 | Structured rows / tabular JSON

 |
| `generate_chart` | Formats data for visual rendering (Bar, Line, Pie, Scatter).

 | Rendered chart component

 |
| `generate_flowchart` | Constructs dynamic Mermaid.js syntax for ER and process diagrams.

 | Rendered architectural diagram

 |
| `explain_data` | Summarizes statistical distributions and language insights.

 | Conversational explanation

 |

---

## API Reference

Base URL: `[http://127.0.0.1:8000](http://127.0.0.1:8000)`

* **`GET /`**: System health check endpoint.
* **`POST /api/chat`**: Accepts natural language payloads, processes through the LangChain agent loop, and returns tool execution results.
* **`GET /api/queries`**: Fetches the ledger of all executed SQL statements.
* **`GET /api/dashboard`**: Retrieves all pinned charts and diagrams stored in the local cache.
* **`POST /api/dashboard`**: Saves/pins a visualization or flowchart to the dashboard storage matrix.

---

## Sample Database & Adding Your Own Data

QueryPal comes pre-configured with a local SQLite database (`ecommerce.db`) containing standard e-commerce tables:

* `customers` (id, name, email, city, signup_date)


* `products` (id, name, category, price)


* `orders` (id, customer_id, product_id, quantity, order_date)


* `inventory` (id, product_id, quantity_in_stock, warehouse_location)



You can easily swap out or query additional SQLite databases by updating the `DB_PATH` parameter in your backend configuration file.

---

## Demo Walkthrough & Use Cases

### Use Case 1: Sales Analysis

* **User Prompt:** *"Show me the top 5 products by revenue this quarter"*

* **Agent Behavior:** Introspects schema, executes aggregation SQL, returns a formatted bar chart accompanied by analytical breakdowns.



### Use Case 2: Database Schema Exploration

* **User Prompt:** *"Draw me the ER diagram for this database"*

* **Agent Behavior:** Invokes `get_schema`, translates foreign key relationships into Mermaid.js format, and renders a complete Entity-Relationship diagram.



### Use Case 3: Process Flow Insights

* **User Prompt:** *"Create a flowchart showing how orders flow through our system"*

* **Agent Behavior:** Analyzes foreign key dependencies across customers, products, and inventory to map an order pipeline diagram.



---

## Agent & Safety Model Summary

* **Strict Read-Only Enforcement:** The database engine layer blocks non-SELECT queries, preserving data integrity.
* **Isolated Tool Loop:** Bounded execution rounds prevent infinite agent recursion loops.
* **Dual Persistence Strategy:** Client chat sessions and query execution logs operate on independent local database connections to ensure stability.

---

## Operational Limits and Constraints

* **Execution Scope:** Limited strictly to read-only `SELECT` statements.


* **CORS Constraints:** Configured securely for local deployment between ports `5173` and `8000`.


* **Browser Compatibility:** Voice recognition features rely on the Web Speech API (best supported on Google Chrome and Microsoft Edge).



---

## Hackathon Requirements Coverage

| Requirement Category | Status | Details |
| --- | --- | --- |
| **Chat Interface** | Completed | ChatGPT-style messaging layout with streaming support

 |
| **Agent Tools** | Completed | 5/5 mandatory tools fully implemented (`get_schema`, `execute_query`, `generate_chart`, `generate_flowchart`, `explain_data`)

 |
| **Visualizations** | Completed | Bar, Line, Pie, and Scatter plots fully functional

 |
| **Flowcharts / Diagrams** | Completed | Mermaid.js engine rendering ER and Process diagrams

 |
| **Bonus Features** | Completed | SQL transparency logging, query ledger history, and custom dashboard pinning enabled

 |

---

## Troubleshooting

* **Connection Refused:** Ensure your FastAPI backend server is running actively on port `8000` before submitting prompts from the frontend.


* **API Key Errors:** Verify that your `OPENAI_API_KEY` is properly formatted within the backend `.env` file.


* **Microphone Inactive:** Confirm you are running the app on a supported browser (Chrome/Edge) with microphone permissions enabled.



---

## Tech Stack

* **Frontend:** React, Vite, Recharts, Mermaid.js, HTML2Canvas


* **Backend:** Python, FastAPI, SQLAlchemy, SQLite


* **AI & Orchestration:** LangChain, OpenAI API (`gpt-4o-mini`)



---

## Team

Built for the Hackathon by **Team STRIKERS**.

* **R TARUN RAGAV** — Computer Science and Engineering, Sri Sairam Engineering College
