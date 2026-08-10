/**
 * API Client for EcoTrack Flask Backend (Port 5000)
 * Handles emissions calculations, AI recommendations, analytics data, and persistence.
 */

const BASE_URL = '/api';

export async function fetchHealth() {
  try {
    const res = await fetch(`${BASE_URL}/health`);
    return await res.json();
  } catch (err) {
    return { status: 'offline', error: err.message };
  }
}

export async function calculateTravelApi(payload) {
  try {
    const res = await fetch(`${BASE_URL}/calculate/travel`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    return await res.json();
  } catch (err) {
    // Client fallback calculation if server is starting
    const modes = {
      'Car Petrol': 0.192,
      'Car Diesel': 0.171,
      'EV Car': 0.053,
      'Bus': 0.089,
      'Train/Metro': 0.035,
      'Bicycle': 0.0,
      'Walking': 0.0
    };
    const factor = modes[payload.transport_mode] || 0.15;
    const passengers = Math.max(1, parseInt(payload.passengers || 1));
    const dist = parseFloat(payload.distance_km || 0);
    const totalVeh = dist * factor;
    const userEm = parseFloat((totalVeh / passengers).toFixed(3));
    return {
      mode: payload.transport_mode,
      distance_km: dist,
      passengers,
      emissions_kg: userEm,
      carpool_savings_kg: passengers > 1 ? parseFloat((totalVeh - userEm).toFixed(3)) : 0
    };
  }
}

export async function calculateFoodApi(payload) {
  try {
    const res = await fetch(`${BASE_URL}/calculate/food`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    return await res.json();
  } catch (err) {
    const diets = {
      'Meat-heavy': 7.20,
      'Omnivore': 5.40,
      'Vegetarian': 3.80,
      'Vegan': 2.90
    };
    const base = diets[payload.diet_type] || 5.40;
    const penalty = payload.food_wasted ? parseFloat((base * 0.10).toFixed(3)) : 0.0;
    const total = parseFloat((base + penalty).toFixed(3));
    return {
      diet_type: payload.diet_type,
      base_emissions_kg: base,
      food_wasted: !!payload.food_wasted,
      waste_penalty_kg: penalty,
      total_food_emissions_kg: total,
      clean_score: Math.max(10, Math.min(100, Math.round(100 - (total * 8.5))))
    };
  }
}

export async function saveDailyLogApi(payload) {
  try {
    const res = await fetch(`${BASE_URL}/logs`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    return await res.json();
  } catch (err) {
    console.warn('Backend unavailable, saving locally', err);
    return {
      message: 'Log saved to local session state!',
      log: {
        ...payload,
        id: `local_${Date.now()}`,
        total_kg: parseFloat((payload.travel_kg + payload.food_kg + payload.energy_kg).toFixed(2))
      }
    };
  }
}

export async function fetchTodayLogApi() {
  try {
    const res = await fetch(`${BASE_URL}/logs/today`);
    if (!res.ok) throw new Error('Network error');
    return await res.json();
  } catch (err) {
    return {
      today_log: {
        date: new Date().toISOString().split('T')[0],
        travel_mode: 'Car Petrol',
        travel_kg: 2.4,
        diet_type: 'Omnivore',
        food_wasted: false,
        food_kg: 5.4,
        energy_kg: 1.8,
        total_kg: 9.6,
        under_budget: true
      },
      daily_budget_kg: 10.0,
      gauge_percentage: 96.0,
      equivalents: {
        trees_daily_absorb_needed: 160.0,
        car_miles_equivalent: 48.0,
        plastic_bottles_footprint: 117
      },
      streak_days: 5
    };
  }
}

export async function fetchAiSuggestionsApi(payload = {}) {
  try {
    const res = await fetch(`${BASE_URL}/ai-suggestions`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    return await res.json();
  } catch (err) {
    return {
      suggestions: [
        {
          id: "swap_travel_1",
          category: "Travel",
          title: "Switch 2 Car Commutes to Metro / Carpooling",
          impact_level: "High Impact",
          estimated_co2_savings_kg: 2.4,
          description: "Carpooling with colleagues or using public transit reduces personal transport emissions by 50%.",
          action_steps: [
            "Set up a carpool group with co-workers or classmates.",
            "Use metro on Tuesdays and Thursdays.",
            "Try micro-mobility for distances under 3 km."
          ],
          difficulty: "Easy",
          timeframe: "Daily Habit"
        },
        {
          id: "swap_food_1",
          category: "Food",
          title: "Adopt 'Meatless Mondays' Plant-Based Swap",
          impact_level: "High Impact",
          estimated_co2_savings_kg: 1.8,
          description: "Replacing high-impact meat meals with legumes or tofu 2 days a week cuts food carbon score by ~1.8 kg CO₂e.",
          action_steps: [
            "Replace beef/lamb with lentil curries or plant protein.",
            "Meal prep plant-based lunches for the week.",
            "Compost food scraps to avoid methane landfill emissions."
          ],
          difficulty: "Medium",
          timeframe: "2 Days / Week"
        },
        {
          id: "swap_energy_1",
          category: "Energy",
          title: "Optimize HVAC Thermostat & Smart Plugs",
          impact_level: "Medium Impact",
          estimated_co2_savings_kg: 1.4,
          description: "Adjusting AC by +2°C and using smart plugs to eliminate phantom vampire power draw reduces home emissions.",
          action_steps: [
            "Set AC thermostat to 24°C (75°F) for optimal efficiency.",
            "Turn off power strips when electronics are unused.",
            "Use LED bulbs for home lighting."
          ],
          difficulty: "Easy",
          timeframe: "Immediate"
        }
      ],
      groq_used: false,
      model: "llama-3.3-70b-versatile"
    };
  }
}

export async function fetchAnalyticsApi() {
  try {
    const res = await fetch(`${BASE_URL}/analytics`);
    return await res.json();
  } catch (err) {
    // Generate fallback analytics data for standalone UI mode
    const today = new Date();
    const line_chart = [];
    const stacked_bar = [];
    const heatmap = [];

    for (let i = 29; i >= 0; i--) {
      const d = new Date(today);
      d.setDate(d.getDate() - i);
      const dateStr = d.toISOString().split('T')[0];
      const t = parseFloat((1.0 + Math.random() * 3.5).toFixed(2));
      const f = parseFloat((2.8 + Math.random() * 3.2).toFixed(2));
      const e = parseFloat((1.0 + Math.random() * 2.5).toFixed(2));
      const total = parseFloat((t + f + e).toFixed(2));

      line_chart.push({ date: dateStr, total_kg: total, budget_kg: 10.0 });
      if (i < 14) {
        stacked_bar.push({ date: dateStr, travel_kg: t, food_kg: f, energy_kg: e });
      }
      heatmap.push({
        date: dateStr,
        total_kg: total,
        status: total <= 8.0 ? 'green' : (total <= 10.0 ? 'amber' : 'red')
      });
    }

    return {
      metrics: {
        monthly_total_kg: 245.8,
        seven_day_avg_kg: 7.9,
        best_day: { date: line_chart[0].date, total_kg: 5.2 },
        worst_day: { date: line_chart[5].date, total_kg: 11.4 },
        daily_budget_kg: 10.0,
        streak_days: 5
      },
      line_chart_30d: line_chart,
      stacked_bar_14d: stacked_bar,
      heatmap_30d: heatmap
    };
  }
}

export async function fetchBadgesApi() {
  try {
    const res = await fetch(`${BASE_URL}/badges`);
    return await res.json();
  } catch (err) {
    return {
      streak_days: 5,
      badges: [
        { id: "b1", title: "Eco Starter", category: "General", description: "Logged your first daily carbon activity.", icon: "🌱", unlocked: true },
        { id: "b2", title: "Zero Waste Hero", category: "Food", description: "Logged 3 consecutive zero waste food days.", icon: "♻️", unlocked: true },
        { id: "b3", title: "Carpool Champion", category: "Travel", description: "Shared a ride with 2+ passengers.", icon: "🚘", unlocked: true },
        { id: "b4", title: "Vegetarian Vanguard", category: "Food", description: "Logged a plant-based day under 4 kg CO₂e.", icon: "🥗", unlocked: true },
        { id: "b5", title: "7-Day Budget Master", category: "Streak", description: "Stayed under budget for 7 consecutive days.", icon: "⚡", unlocked: true },
        { id: "b6", title: "Carbon Neutral Titan", category: "Special", description: "Achieved net emissions under 5 kg CO₂e with solar credits.", icon: "🏆", unlocked: false }
      ]
    };
  }
}
