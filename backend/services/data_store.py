"""
Data Store & Analytics Manager for EcoTrack.
Manages user activity logs, 30-day historical data generator, streaks, and badge state.
"""

from datetime import datetime, timedelta
import random

class EcoTrackDataStore:
    def __init__(self):
        self.user_profile = {
            "name": "Alex River",
            "email": "alex.eco@ecotrack.org",
            "daily_budget_kg": 10.0,
            "joined_date": "2026-07-12",
            "streak_days": 5
        }
        self.logs = []
        self.badges = [
            {
                "id": "badge_starter",
                "title": "Eco Starter",
                "category": "General",
                "description": "Logged your first daily carbon activity on EcoTrack.",
                "icon": "🌱",
                "unlocked": True,
                "unlocked_date": "2026-07-12"
            },
            {
                "id": "badge_zero_waste",
                "title": "Zero Waste Hero",
                "category": "Food",
                "description": "Logged 3 consecutive food logs with zero food waste.",
                "icon": "♻️",
                "unlocked": True,
                "unlocked_date": "2026-07-20"
            },
            {
                "id": "badge_carpool",
                "title": "Carpool Champion",
                "category": "Travel",
                "description": "Shared a car ride with 2+ passengers to divide emissions.",
                "icon": "🚘",
                "unlocked": True,
                "unlocked_date": "2026-07-25"
            },
            {
                "id": "badge_veg_vanguard",
                "title": "Vegetarian Vanguard",
                "category": "Food",
                "description": "Logged a plant-based diet day with emissions under 4 kg CO₂e.",
                "icon": "🥗",
                "unlocked": True,
                "unlocked_date": "2026-08-02"
            },
            {
                "id": "badge_budget_7day",
                "title": "7-Day Budget Master",
                "category": "Streak",
                "description": "Maintained daily footprint under 10 kg CO₂e for 7 straight days.",
                "icon": "⚡",
                "unlocked": True,
                "unlocked_date": "2026-08-08"
            },
            {
                "id": "badge_green_titan",
                "title": "Carbon Neutral Titan",
                "category": "Special",
                "description": "Achieved a net daily footprint under 5 kg CO₂e with solar credits.",
                "icon": "🏆",
                "unlocked": False,
                "unlocked_date": None
            }
        ]
        
        # Seed 30 days of realistic history data up to today
        self._seed_30_day_history()

    def _seed_30_day_history(self):
        today = datetime.now()
        modes = ["Car Petrol", "Bus", "Train/Metro", "EV Car", "Bicycle"]
        diets = ["Meat-heavy", "Omnivore", "Vegetarian", "Vegan"]
        
        for i in range(29, -1, -1):
            date_str = (today - timedelta(days=i)).strftime("%Y-%m-%d")
            
            # Create semi-random realistic variation
            random.seed(i * 42)
            travel_mode = modes[i % len(modes)]
            diet_type = diets[i % len(diets)]
            
            travel_kg = round(random.uniform(0.5, 4.8), 2)
            food_kg = round(random.uniform(2.9, 6.5), 2)
            energy_kg = round(random.uniform(1.2, 3.8), 2)
            
            total_kg = round(travel_kg + food_kg + energy_kg, 2)
            is_under_budget = total_kg <= self.user_profile["daily_budget_kg"]

            self.logs.append({
                "id": f"log_{date_str}",
                "date": date_str,
                "travel_mode": travel_mode,
                "travel_kg": travel_kg,
                "diet_type": diet_type,
                "food_wasted": (i % 7 == 0),
                "food_kg": food_kg,
                "energy_kg": energy_kg,
                "total_kg": total_kg,
                "under_budget": is_under_budget
            })

    def add_log(self, new_log: dict) -> dict:
        date_str = new_log.get("date", datetime.now().strftime("%Y-%m-%d"))
        
        # Calculate total
        travel_kg = new_log.get("travel_kg", 0.0)
        food_kg = new_log.get("food_kg", 0.0)
        energy_kg = new_log.get("energy_kg", 0.0)
        total_kg = round(travel_kg + food_kg + energy_kg, 2)
        
        is_under_budget = total_kg <= self.user_profile["daily_budget_kg"]
        
        log_entry = {
            "id": f"log_{date_str}_{int(datetime.now().timestamp())}",
            "date": date_str,
            "travel_mode": new_log.get("travel_mode", "Car Petrol"),
            "travel_kg": travel_kg,
            "diet_type": new_log.get("diet_type", "Omnivore"),
            "food_wasted": new_log.get("food_wasted", False),
            "food_kg": food_kg,
            "energy_kg": energy_kg,
            "total_kg": total_kg,
            "under_budget": is_under_budget
        }

        # Check if today's log already exists, update or append
        existing_index = next((idx for idx, log in enumerate(self.logs) if log["date"] == date_str), None)
        if existing_index is not None:
            self.logs[existing_index] = log_entry
        else:
            self.logs.append(log_entry)

        # Recalculate streak
        self._update_streak()
        return log_entry

    def _update_streak(self):
        sorted_logs = sorted(self.logs, key=lambda x: x["date"], reverse=True)
        streak = 0
        for log in sorted_logs:
            if log["under_budget"]:
                streak += 1
            else:
                break
        self.user_profile["streak_days"] = streak

    def get_analytics(self) -> dict:
        """
        Scenario 4 Analytics: 7-day average, best day, worst day, monthly total,
        30-day trend line, 14-day stacked bar breakdown, and 30-day heatmap calendar.
        """
        if not self.logs:
            return {}

        sorted_logs = sorted(self.logs, key=lambda x: x["date"])
        last_30_logs = sorted_logs[-30:]
        last_7_logs = sorted_logs[-7:]
        last_14_logs = sorted_logs[-14:]

        # Metrics
        monthly_total = round(sum(log["total_kg"] for log in last_30_logs), 2)
        seven_day_avg = round(sum(log["total_kg"] for log in last_7_logs) / len(last_7_logs), 2)
        
        best_day_log = min(last_30_logs, key=lambda x: x["total_kg"])
        worst_day_log = max(last_30_logs, key=lambda x: x["total_kg"])

        return {
            "metrics": {
                "monthly_total_kg": monthly_total,
                "seven_day_avg_kg": seven_day_avg,
                "best_day": {
                    "date": best_day_log["date"],
                    "total_kg": best_day_log["total_kg"]
                },
                "worst_day": {
                    "date": worst_day_log["date"],
                    "total_kg": worst_day_log["total_kg"]
                },
                "daily_budget_kg": self.user_profile["daily_budget_kg"],
                "streak_days": self.user_profile["streak_days"]
            },
            "line_chart_30d": [
                {
                    "date": log["date"],
                    "total_kg": log["total_kg"],
                    "budget_kg": self.user_profile["daily_budget_kg"]
                }
                for log in last_30_logs
            ],
            "stacked_bar_14d": [
                {
                    "date": log["date"],
                    "travel_kg": log["travel_kg"],
                    "food_kg": log["food_kg"],
                    "energy_kg": log["energy_kg"]
                }
                for log in last_14_logs
            ],
            "heatmap_30d": [
                {
                    "date": log["date"],
                    "total_kg": log["total_kg"],
                    "status": "green" if log["total_kg"] <= 8.0 else ("amber" if log["total_kg"] <= 10.0 else "red")
                }
                for log in last_30_logs
            ]
        }

# Global Data Store Instance
store = EcoTrackDataStore()
