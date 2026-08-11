# backend/test_main.py
from fastapi.testclient import TestClient
from main1 import app, get_schema

client = TestClient(app)

def test_health_check():
    """Verify the API is running and returns team details."""
    response = client.get("/")
    assert response.status_code == 200
    assert response.json()["team"] == "STRIKERS"
    assert response.json()["status"] == "Ready"

def test_get_schema_tool():
    """Verify the schema tool returns a valid dictionary of tables."""
    schema = get_schema.invoke({})
    assert isinstance(schema, dict)
    assert "orders" in schema or "Orders" in schema