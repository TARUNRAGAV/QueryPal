import os
import json
import sqlite3
import warnings
from typing import Dict, Any, List, Literal
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv
from pydantic import BaseModel
from sqlalchemy import create_engine, inspect, text
from langchain_core.tools import tool
from langchain_core.messages import HumanMessage, ToolMessage, SystemMessage
from langchain_groq import ChatGroq

warnings.filterwarnings("ignore")
load_dotenv()

app = FastAPI(title="R TARUN RAGAV - ConvoDB Engine")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# --- 1. DUAL DATABASE SETUP ---
# Primary DB (Read-Only Data)
DB_PATH = os.getenv("DB_PATH", "sqlite:///./ecommerce.db")
engine = create_engine(DB_PATH)

# Secondary DB (Read/Write History & Dashboard)
HISTORY_DB = "chat_history.db"

def init_history_db():
    with sqlite3.connect(HISTORY_DB) as conn:
        conn.execute("CREATE TABLE IF NOT EXISTS queries (id INTEGER PRIMARY KEY AUTOINCREMENT, sql TEXT, timestamp DATETIME DEFAULT CURRENT_TIMESTAMP)")
        conn.execute("CREATE TABLE IF NOT EXISTS dashboard (id INTEGER PRIMARY KEY AUTOINCREMENT, type TEXT, data_json TEXT, timestamp DATETIME DEFAULT CURRENT_TIMESTAMP)")
        conn.commit()

init_history_db()

# --- 2. TOOL DEFINITIONS ---

@tool
def get_schema() -> Dict[str, Any]:
    """Retrieves the complete database schema including table names, columns, and data types."""
    inspector = inspect(engine)
    schema = {}
    for table in inspector.get_table_names():
        schema[table] = [{"name": col["name"], "type": str(col["type"])} for col in inspector.get_columns(table)]
    return schema

@tool
def execute_query(sql_query: str) -> Dict[str, Any]:
    """Executes a SQL SELECT query against the SQLite database and returns the SQL and rows."""
    try:
        with engine.connect() as conn:
            result = conn.execute(text(sql_query))
            keys = result.keys()
            data = [dict(zip(keys, row)) for row in result.fetchall()]
            
            # Save successful query to history
            with sqlite3.connect(HISTORY_DB) as hist_conn:
                hist_conn.execute("INSERT INTO queries (sql) VALUES (?)", (sql_query,))
                hist_conn.commit()
                
            return {"sql": sql_query, "data": data}
    except Exception as e:
        return {"error": str(e), "sql": sql_query}

@tool
def generate_chart(chart_type: Literal["bar", "line", "pie", "scatter"], title: str, x_axis_key: str, y_axis_key: str, data: List[Dict[str, Any]]) -> Dict[str, Any]:
    """Formats structured data for frontend chart rendering (bar, line, pie, scatter)."""
    return {"type": "chart", "chart_type": chart_type, "title": title, "x_axis_key": x_axis_key, "y_axis_key": y_axis_key, "data": data}

@tool
def generate_flowchart(diagram_type: str, mermaid_code: str) -> Dict[str, Any]:
    """Generates dynamic Mermaid.js flowchart or ER diagram markup code."""
    return {"type": "diagram", "diagram_type": diagram_type, "mermaid_code": mermaid_code}

@tool
def explain_data(insights_summary: str) -> str:
    """Provides natural language explanations and statistical summaries of database insights."""
    return insights_summary

tools = [get_schema, execute_query, generate_chart, generate_flowchart, explain_data]

# --- 3. INITIALIZE GROQ AGENT ---

api_key = os.getenv("GROQ_API_KEY")
if not api_key:
    raise ValueError("GROQ_API_KEY not found in environment variables!")

# Using your original model string
llm = ChatGroq(
    model="openai/gpt-oss-120b", 
    api_key=api_key, 
    temperature=0
)
llm_with_tools = llm.bind_tools(tools)

# --- 4. REQUEST SCHEMAS ---

class ChatRequest(BaseModel):
    message: str

class PinRequest(BaseModel):
    type: str
    data_json: str

# --- 5. API ENDPOINTS ---

@app.get("/")
def health_check():
    return {"engine": "R TARUN RAGAV AI Engine", "status": "Active"}

@app.post("/api/chat")
async def process_chat(request: ChatRequest):
    try:
        msg_lower = request.message.lower()
        is_viz_request = any(word in msg_lower for word in ["chart", "graph", "plot", "visual", "scatter", "trend"])
        
        system_prompt = SystemMessage(content="""
        You are the R TARUN RAGAV Intelligent AI Database Agent. 
        CRITICAL RULES:
        1. If asked for data, use `get_schema` first.
        2. Then use `execute_query` to fetch the data.
        3. IF asked for a chart/graph (bar, line, pie, or scatter), YOU MUST call `generate_chart`.
        4. IF asked for an ER diagram, process flowchart, or decision tree, call `generate_flowchart`.
           - The `mermaid_code` MUST contain RAW Mermaid syntax only. No markdown blocks.
        Never explain what tools you are using internally. Execute them silently.
        """)
        
        messages = [system_prompt, HumanMessage(content=request.message)]
        tool_map = {t.name: t for t in tools}

        for step in range(5): 
            response = llm_with_tools.invoke(messages)
            if not response.tool_calls:
                return {"type": "text", "reply": response.content}
                
            tool_call = response.tool_calls[0]
            tool_name = tool_call["name"]
            tool_args = tool_call["args"]
            
            if tool_name == "generate_chart":
                for ct in ["line", "bar", "pie", "scatter"]:
                    if ct in msg_lower: tool_args["chart_type"] = ct
            
            tool_result = tool_map[tool_name].invoke(tool_args)
            
            if tool_name in ["generate_chart", "generate_flowchart", "explain_data"] or (tool_name == "execute_query" and not is_viz_request):
                return {"type": "tool_execution", "tool_name": tool_name, "args": tool_args, "result": tool_result}
                
            messages.append(response) 
            messages.append(ToolMessage(content=str(tool_result), tool_call_id=tool_call["id"]))

        return {"type": "text", "reply": "Agent reached maximum reasoning capacity."}

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/queries")
def get_queries():
    with sqlite3.connect(HISTORY_DB) as conn:
        conn.row_factory = sqlite3.Row
        rows = conn.execute("SELECT * FROM queries ORDER BY id DESC LIMIT 50").fetchall()
        return [dict(r) for r in rows]

@app.get("/api/dashboard")
def get_dashboard():
    with sqlite3.connect(HISTORY_DB) as conn:
        conn.row_factory = sqlite3.Row
        rows = conn.execute("SELECT * FROM dashboard ORDER BY id DESC").fetchall()
        return [dict(r) for r in rows]

@app.post("/api/dashboard")
def save_dashboard(req: PinRequest):
    with sqlite3.connect(HISTORY_DB) as conn:
        conn.execute("INSERT INTO dashboard (type, data_json) VALUES (?, ?)", (req.type, req.data_json))
        conn.commit()
    return {"status": "success"}