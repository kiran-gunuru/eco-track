"""
AI Eco Suggestions Service for EcoTrack.
Uses Groq API with llama-3.3-70b-versatile model to generate 3 personalized
lifestyle swap recommendations with estimated CO2 savings.
Includes a fallback recommendation engine for offline/demo usage.
"""

import os
import json
import logging
from groq import Groq

logger = logging.getLogger(__name__)

def generate_fallback_suggestions(travel_kg: float, food_kg: float, energy_kg: float, diet_type: str, travel_mode: str) -> list:
    """
    Intelligent rule-based fallback recommendation engine if Groq API key is unconfigured.
    Generates 3 customized recommendation cards based on user's daily habits.
    """
    suggestions = []
    
    # 1. Travel Swap Suggestion
    if travel_kg > 3.0 or "car" in travel_mode.lower():
        suggestions.append({
            "id": "swap_travel_1",
            "category": "Travel",
            "title": "Switch 2 Car Commutes to Metro / Carpooling",
            "impact_level": "High Impact",
            "estimated_co2_savings_kg": round(min(travel_kg * 0.5, 3.2), 1),
            "description": f"Your current travel using {travel_mode} contributes {travel_kg} kg CO₂e. Carpooling with 2 colleagues or taking the metro reduces travel emissions by up to 50%.",
            "action_steps": [
                "Set up a carpool group with co-workers or classmates.",
                "Use public transport on Tuesdays and Thursdays.",
                "Try micro-mobility (e-bike/scooter) for distances under 3 km."
            ],
            "difficulty": "Easy",
            "timeframe": "Daily Habit"
        })
    else:
        suggestions.append({
            "id": "swap_travel_2",
            "category": "Travel",
            "title": "Combine Weekly Chores into Single Tripping",
            "impact_level": "Medium Impact",
            "estimated_co2_savings_kg": 1.1,
            "description": "Batching grocery runs and errands into a single trip avoids cold engine starts and saves up to 1.1 kg CO₂e per week.",
            "action_steps": [
                "Plan errands ahead using a shared shopping list.",
                "Combine grocery and pharmacy visits in a single route."
            ],
            "difficulty": "Easy",
            "timeframe": "Weekly"
        })

    # 2. Food Swap Suggestion
    if food_kg > 4.5 or diet_type.lower() in ["meat_heavy", "omnivore"]:
        suggestions.append({
            "id": "swap_food_1",
            "category": "Food",
            "title": "Adopt 'Meatless Mondays' Plant-Based Swap",
            "impact_level": "High Impact",
            "estimated_co2_savings_kg": round(food_kg * 0.35, 1),
            "description": f"Replacing high-impact meat meals with legumes or tofu 2 days a week cuts your food footprint by ~{round(food_kg * 0.35, 1)} kg CO₂e.",
            "action_steps": [
                "Replace beef/lamb with lentil curries, beans, or plant protein.",
                "Meal prep plant-based lunches for the work week.",
                "Compost food scraps to avoid methane in landfills."
            ],
            "difficulty": "Medium",
            "timeframe": "2 Days / Week"
        })
    else:
        suggestions.append({
            "id": "swap_food_2",
            "category": "Food",
            "title": "Zero Food Waste Prep & Storage",
            "impact_level": "Medium Impact",
            "estimated_co2_savings_kg": 0.8,
            "description": "Eliminating food waste avoids the 10% waste emission penalty and saves produce before spoilage.",
            "action_steps": [
                "Store greens in airtight containers with paper towels.",
                "Freeze leftover portions immediately for later meals."
            ],
            "difficulty": "Easy",
            "timeframe": "Daily"
        })

    # 3. Energy Swap Suggestion
    if energy_kg > 2.0:
        suggestions.append({
            "id": "swap_energy_1",
            "category": "Energy",
            "title": "Optimize HVAC Thermostat & Smart Plugs",
            "impact_level": "Medium Impact",
            "estimated_co2_savings_kg": 1.4,
            "description": "Adjusting AC by +2°C and using smart plugs to eliminate phantom vampire power draw reduces daily home emissions.",
            "action_steps": [
                "Set AC thermostat to 24°C (75°F) for optimal efficiency.",
                "Turn off power strips when electronics are not in use.",
                "Use LED bulbs for home lighting."
            ],
            "difficulty": "Easy",
            "timeframe": "Immediate"
        })
    else:
        suggestions.append({
            "id": "swap_energy_2",
            "category": "Energy",
            "title": "Switch Appliance Cycles to Off-Peak Solar Hours",
            "impact_level": "Low Impact",
            "estimated_co2_savings_kg": 0.6,
            "description": "Running washing machines during daytime hours utilizes cleaner grid energy mix when solar power peak is high.",
            "action_steps": [
                "Run full loads of laundry in cold water.",
                "Air dry clothes outdoors instead of using hot dryers."
            ],
            "difficulty": "Easy",
            "timeframe": "Daily"
        })

    return suggestions[:3]

def get_ai_suggestions(daily_summary: dict) -> list:
    """
    Scenario 3: Groq API llama-3.3-70b-versatile integration.
    Submits daily footprint breakdown to Groq API and formats 3 styled recommendation cards.
    """
    api_key = os.getenv("GROQ_API_KEY")
    
    travel_kg = daily_summary.get("travel_kg", 2.5)
    food_kg = daily_summary.get("food_kg", 5.4)
    energy_kg = daily_summary.get("energy_kg", 2.1)
    total_kg = daily_summary.get("total_kg", travel_kg + food_kg + energy_kg)
    diet_type = daily_summary.get("diet_type", "Omnivore")
    travel_mode = daily_summary.get("travel_mode", "Car Petrol")
    daily_budget = daily_summary.get("budget_kg", 10.0)

    if not api_key:
        logger.info("GROQ_API_KEY not found. Using intelligent fallback recommendation engine.")
        return generate_fallback_suggestions(travel_kg, food_kg, energy_kg, diet_type, travel_mode)

    try:
        client = Groq(api_key=api_key)
        
        prompt = f"""
You are an expert AI Sustainability Advisor for EcoTrack.
The user's daily carbon log is:
- Total Footprint: {total_kg} kg CO2e (Daily Budget Target: {daily_budget} kg CO2e)
- Travel: {travel_kg} kg CO2e (Mode: {travel_mode})
- Food: {food_kg} kg CO2e (Diet: {diet_type})
- Energy: {energy_kg} kg CO2e

Generate EXACTLY 3 personalized, highly actionable eco-friendly lifestyle swap recommendations.
Return valid JSON only as an array of 3 objects with these keys:
- "id": string
- "category": string ("Travel", "Food", or "Energy")
- "title": string (concise swap title)
- "impact_level": string ("High Impact", "Medium Impact", or "Low Impact")
- "estimated_co2_savings_kg": number (float, e.g. 1.8)
- "description": string (2 sentences explaining why this swap helps)
- "action_steps": array of strings (3 actionable bullet points)
- "difficulty": string ("Easy", "Medium", or "Challenging")
- "timeframe": string (e.g. "Daily Habit", "Weekly", "Immediate")
"""

        completion = client.chat.completions.create(
            model="llama-3.3-70b-versatile",
            messages=[
                {"role": "system", "content": "You are a helpful sustainability AI assistant that returns strict JSON arrays."},
                {"role": "user", "content": prompt}
            ],
            temperature=0.7,
            max_tokens=1000,
            response_format={"type": "json_object"}
        )
        
        raw_response = completion.choices[0].message.content
        parsed = json.loads(raw_response)
        
        # Handle wrapping object or direct array
        if isinstance(parsed, dict):
            for key in ["suggestions", "recommendations", "swaps", "data"]:
                if key in parsed and isinstance(parsed[key], list):
                    return parsed[key][:3]
            # fallback to array values
            return list(parsed.values())[0][:3] if parsed else generate_fallback_suggestions(travel_kg, food_kg, energy_kg, diet_type, travel_mode)
        elif isinstance(parsed, list):
            return parsed[:3]
            
        return generate_fallback_suggestions(travel_kg, food_kg, energy_kg, diet_type, travel_mode)

    except Exception as e:
        logger.error(f"Error calling Groq API: {e}")
        return generate_fallback_suggestions(travel_kg, food_kg, energy_kg, diet_type, travel_mode)
