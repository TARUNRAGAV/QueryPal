\# QueryPal by STRIKERS ⚡



\*\*An Intelligent LLM Agent for Natural-Language Database Interaction \& Visualization\*\*



QueryPal is an end-to-end conversational AI system designed to bridge the gap between non-technical users and complex databases. By leveraging Large Language Models, QueryPal allows anyone to extract insights, generate dynamic charts, and map out entity relationships using plain English—democratizing business intelligence without requiring a single line of SQL.



\---



\## 🚀 Key Features



\*   \*\*Conversational Data Engine:\*\* Query complex databases using natural language.

\*   \*\*Dual-Database Architecture:\*\* Operates safely on read-only business data while persisting chat and query history to a dedicated local SQLite instance.

\*   \*\*Dynamic Visualizations:\*\* Automatically generates Bar, Line, Scatter, and Pie charts using Recharts based on context.

\*   \*\*Mermaid.js Integrations:\*\* Automatically infers schema relationships to draw ER Diagrams and Process Flowcharts.

\*   \*\*Executive Control Panel:\*\* Pin high-value charts and diagrams to a persistent dashboard.

\*   \*\*SQL Transparency Ledger:\*\* Logs every executed query for auditing and trust.

\*   \*\*Data Export:\*\* One-click CSV and PNG exports for all tabular and visual data.

\*   \*\*Hardware-Inspired UI:\*\* A stark, minimalist aesthetic utilizing a crisp white, red, and orange palette.



\---



\## 🧠 Agent Architecture \& Tooling



The AI agent is powered by \*\*OpenAI\*\* via LangChain, utilizing a strict tool-calling loop. The agent evaluates the user's natural language input and intelligently routes it through 5 custom-built tools:



1\.  `get\_schema`: Introspects the SQLite database to retrieve tables, columns, and datatypes.

2\.  `execute\_query`: Safely executes read-only SQL SELECT queries and returns tabular JSON data.

3\.  `generate\_chart`: Formats structured data and selects the optimal chart type (bar, line, pie, scatter) for frontend rendering.

4\.  `generate\_flowchart`: Writes raw Mermaid.js syntax to map entity relationships and decision trees.

5\.  `explain\_data`: Provides natural language summaries and statistical insights based on returned data.



\---



\## 🛠️ Tech Stack



\*   \*\*Frontend:\*\* React, Vite, Recharts (Data Viz), Mermaid.js (Diagrams), HTML2Canvas.

\*   \*\*Backend:\*\* Python, FastAPI, SQLAlchemy, SQLite.

\*   \*\*AI / LLM:\*\* LangChain, OpenAI API.



\---



\## ⚙️ Local Setup Instructions



\### 1. Clone the Repository

\\`\\`\\`bash

git clone https://github.com/TARUNRAGAV/QueryPal.git

cd QueryPal

\\`\\`\\`



\### 2. Backend Environment Setup

Navigate to the backend directory, set up your Python environment, and configure your API keys.

\\`\\`\\`bash

cd backend

python -m venv venv



\# Windows

venv\\Scripts\\activate



pip install -r requirements.txt

\\`\\`\\`

Create a `.env` file in the `backend` folder:

\\`\\`\\`env

OPENAI\_API\_KEY=your\_openai\_api\_key\_here

DB\_PATH=sqlite:///./ecommerce.db

\\`\\`\\`

Start the FastAPI Server:

\\`\\`\\`bash

uvicorn main1:app --reload

\\`\\`\\`



\### 3. Frontend Environment Setup

Open a new terminal, navigate to the frontend directory, install dependencies, and start the Vite development server.

\\`\\`\\`bash

cd frontend

npm install

npm run dev

\\`\\`\\`

