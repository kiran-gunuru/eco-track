"""
EcoTrack Flask REST API Server (Port 5000).
Integrates science-backed carbon calculations, Groq API (llama-3.3-70b-versatile),
and 30-day analytics history.
"""

from flask import Flask, request, jsonify
from flask_cors import CORS
from dotenv import load_dotenv
import os
from datetime import datetime

from services.carbon_calc import (
    calculate_travel_emissions,
    calculate_food_emissions,
    calculate_energy_emissions,
    calculate_health_equivalents
)
from services.ai_service import get_ai_suggestions
from services.data_store import store

load_dotenv()

app = Flask(__name__)
CORS(app, resources={r"/api/*": {"origins": "*"}})

@app.route("/api/health", methods=["GET"])
def health_check():
    return jsonify({
        "status": "healthy",
        "service": "EcoTrack Carbon API Engine",
        "groq_api_configured": bool(os.getenv("GROQ_API_KEY")),
        "timestamp": datetime.now().isoformat()
    }), 200

@app.route("/api/profile", methods=["GET", "PUT"])
def profile_handler():
    if request.method == "PUT":
        data = request.json or {}
        if "daily_budget_kg" in data:
            store.user_profile["daily_budget_kg"] = float(data["daily_budget_kg"])
        if "name" in data:
            store.user_profile["name"] = str(data["name"])
    return jsonify(store.user_profile), 200

@app.route("/api/calculate/travel", methods=["POST"])
def calculate_travel():
    """
    Scenario 1: Travel emission calculation endpoint.
    """
    data = request.json or {}
    mode = data.get("transport_mode", "Car Petrol")
    distance_km = float(data.get("distance_km", 0.0))
    passengers = int(data.get("passengers", 1))

    result = calculate_travel_emissions(mode, distance_km, passengers)
    return jsonify(result), 200

@app.route("/api/calculate/food", methods=["POST"])
def calculate_food():
    """
    Scenario 2: Food carbon score endpoint with waste penalty.
    """
    data = request.json or {}
    diet_type = data.get("diet_type", "Omnivore")
    food_wasted = bool(data.get("food_wasted", False))

    result = calculate_food_emissions(diet_type, food_wasted)
    return jsonify(result), 200

@app.route("/api/calculate/energy", methods=["POST"])
def calculate_energy():
    data = request.json or {}
    elec_kwh = float(data.get("electricity_kwh", 0.0))
    gas_kwh = float(data.get("gas_kwh", 0.0))
    solar_kwh = float(data.get("solar_kwh", 0.0))

    result = calculate_energy_emissions(elec_kwh, gas_kwh, solar_kwh)
    return jsonify(result), 200

@app.route("/api/logs", methods=["POST", "GET"])
def logs_handler():
    """
    Log habit endpoint & recent activity feed.
    """
    if request.method == "POST":
        data = request.json or {}
        
        # Calculate individual components if raw inputs provided
        travel_res = calculate_travel_emissions(
            data.get("travel_mode", "Car Petrol"),
            float(data.get("distance_km", 0.0)),
            int(data.get("passengers", 1))
        )
        food_res = calculate_food_emissions(
            data.get("diet_type", "Omnivore"),
            bool(data.get("food_wasted", False))
        )
        energy_res = calculate_energy_emissions(
            float(data.get("electricity_kwh", 0.0)),
            float(data.get("gas_kwh", 0.0)),
            float(data.get("solar_kwh", 0.0))
        )
        
        log_payload = {
            "date": data.get("date", datetime.now().strftime("%Y-%m-%d")),
            "travel_mode": travel_res["mode"],
            "travel_kg": travel_res["emissions_kg"],
            "diet_type": food_res["diet_type"],
            "food_wasted": food_res["food_wasted"],
            "food_kg": food_res["total_food_emissions_kg"],
            "energy_kg": energy_res["total_energy_emissions_kg"]
        }
        
        saved_log = store.add_log(log_payload)
        equivalents = calculate_health_equivalents(saved_log["total_kg"])
        
        return jsonify({
            "message": "Daily carbon log saved successfully!",
            "log": saved_log,
            "equivalents": equivalents,
            "profile": store.user_profile
        }), 201

    # GET logs
    return jsonify(store.logs), 200

@app.route("/api/logs/today", methods=["GET"])
def get_today_log():
    today_str = datetime.now().strftime("%Y-%m-%d")
    today_log = next((l for l in store.logs if l["date"] == today_str), None)
    
    if not today_log:
        # Default empty/last available log
        today_log = store.logs[-1] if store.logs else {
            "date": today_str,
            "travel_mode": "Car Petrol",
            "travel_kg": 2.4,
            "diet_type": "Omnivore",
            "food_wasted": False,
            "food_kg": 5.4,
            "energy_kg": 1.8,
            "total_kg": 9.6,
            "under_budget": True
        }
    
    equivalents = calculate_health_equivalents(today_log["total_kg"])
    budget_kg = store.user_profile["daily_budget_kg"]
    gauge_percentage = round(min(100.0, (today_log["total_kg"] / budget_kg) * 100), 1)

    return jsonify({
        "today_log": today_log,
        "daily_budget_kg": budget_kg,
        "gauge_percentage": gauge_percentage,
        "equivalents": equivalents,
        "streak_days": store.user_profile["streak_days"]
    }), 200

@app.route("/api/ai-suggestions", methods=["POST", "GET"])
def ai_suggestions_handler():
    """
    Scenario 3: AI Eco Suggestions using Groq llama-3.3-70b-versatile or fallback.
    """
    today_str = datetime.now().strftime("%Y-%m-%d")
    today_log = next((l for l in store.logs if l["date"] == today_str), store.logs[-1] if store.logs else {})

    summary = {
        "travel_kg": today_log.get("travel_kg", 2.5),
        "food_kg": today_log.get("food_kg", 5.4),
        "energy_kg": today_log.get("energy_kg", 2.1),
        "total_kg": today_log.get("total_kg", 10.0),
        "diet_type": today_log.get("diet_type", "Omnivore"),
        "travel_mode": today_log.get("travel_mode", "Car Petrol"),
        "budget_kg": store.user_profile["daily_budget_kg"]
    }

    if request.method == "POST":
        custom_data = request.json or {}
        summary.update(custom_data)

    suggestions = get_ai_suggestions(summary)
    return jsonify({
        "suggestions": suggestions,
        "groq_used": bool(os.getenv("GROQ_API_KEY")),
        "model": "llama-3.3-70b-versatile",
        "daily_breakdown": summary
    }), 200

@app.route("/api/analytics", methods=["GET"])
def analytics_handler():
    """
    Scenario 4: 30-day analytics trends, 14-day breakdown, 30-day heatmap calendar, and summary metrics.
    """
    data = store.get_analytics()
    return jsonify(data), 200

@app.route("/api/badges", methods=["GET"])
def badges_handler():
    return jsonify({
        "streak_days": store.user_profile["streak_days"],
        "badges": store.badges
    }), 200

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000, debug=True)
