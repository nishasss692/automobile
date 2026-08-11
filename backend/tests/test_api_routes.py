from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)

def test_root_endpoint():
    response = client.get("/")
    assert response.status_code == 200
    assert response.json()["status"] == "online"

def test_health_check():
    response = client.get("/health")
    assert response.status_code == 200
    assert response.json() == {"status": "healthy"}

def test_get_garage():
    response = client.get("/api/v1/garage")
    assert response.status_code == 200
    data = response.json()
    assert isinstance(data, list)
    assert len(data) >= 1

def test_get_catalog():
    response = client.get("/api/v1/catalog")
    assert response.status_code == 200
    data = response.json()
    assert isinstance(data, list)
    assert len(data) >= 1

def test_fitment_check_api():
    payload = {
        "vehicle_id": 1,
        "part_id": 101,
        "existing_part_ids": []
    }
    response = client.post("/api/v1/fitment-check", json=payload)
    assert response.status_code == 200
    res_data = response.json()
    assert "compatible" in res_data
    assert "clearance_status" in res_data
