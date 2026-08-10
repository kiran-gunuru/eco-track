"""
Carbon Emission Calculation Engine for EcoTrack.
Provides science-backed emission factors based on IPCC, EPA, and UK DEFRA standards.
"""

# Emission Factors (in kg CO2e per unit)
TRAVEL_COEFFICIENTS = {
    "car_petrol": 0.192,   # kg CO2e per km
    "car_diesel": 0.171,   # kg CO2e per km
    "car_ev": 0.053,       # kg CO2e per km (grid average)
    "car_hybrid": 0.108,   # kg CO2e per km
    "motorbike": 0.103,    # kg CO2e per km
    "bus": 0.089,          # kg CO2e per passenger-km
    "train_metro": 0.035,  # kg CO2e per passenger-km
    "flight": 0.255,       # kg CO2e per passenger-km
    "bicycle": 0.0,        # Zero direct emissions
    "walking": 0.0         # Zero direct emissions
}

FOOD_DIET_DAILY = {
    "meat_heavy": 7.20,  # High beef/lamb consumption
    "omnivore": 5.40,    # Balanced meat and plant diet
    "pescatarian": 4.20, # Fish + veggies
    "vegetarian": 3.80, # Dairy/eggs + plant
    "vegan": 2.90        # Pure plant-based
}

ENERGY_COEFFICIENTS = {
    "electricity_kwh": 0.475,  # Grid average kg CO2e / kWh
    "natural_gas_kwh": 0.202,  # Heating kg CO2e / kWh
    "solar_offset_kwh": -0.450 # Clean solar generation offset
}

def calculate_travel_emissions(mode: str, distance_km: float, passengers: int = 1) -> dict:
    """
    Scenario 1: Travel emissions calculation with passenger carpooling division.
    """
    mode_key = mode.lower().replace(" ", "_")
    coef = TRAVEL_COEFFICIENTS.get(mode_key, 0.150)
    passengers_count = max(1, int(passengers))
    
    # Calculate total for vehicle, then divide by passengers for carpooling split
    total_vehicle_emission = distance_km * coef
    user_emission = round(total_vehicle_emission / passengers_count, 3)
    savings_vs_solo = round(total_vehicle_emission - user_emission, 3) if passengers_count > 1 else 0.0

    return {
        "mode": mode,
        "distance_km": distance_km,
        "passengers": passengers_count,
        "coefficient": coef,
        "emissions_kg": user_emission,
        "carpool_savings_kg": savings_vs_solo
    }

def calculate_food_emissions(diet_type: str, food_wasted: bool = False) -> dict:
    """
    Scenario 2: Food carbon score calculation with 10% waste penalty.
    """
    diet_key = diet_type.lower().replace(" ", "_")
    base_emissions = FOOD_DIET_DAILY.get(diet_key, 5.40)
    
    penalty = 0.0
    if food_wasted:
        penalty = round(base_emissions * 0.10, 3)  # 10% penalty for food waste
    
    total_food_emissions = round(base_emissions + penalty, 3)
    
    # Score calculation out of 100 (higher is cleaner)
    # 2.9 kg (vegan, zero waste) -> 95 score
    # 7.92 kg (meat heavy + waste) -> 35 score
    clean_score = max(10, min(100, int(100 - (total_food_emissions * 8.5))))

    return {
        "diet_type": diet_type,
        "base_emissions_kg": base_emissions,
        "food_wasted": food_wasted,
        "waste_penalty_kg": penalty,
        "total_food_emissions_kg": total_food_emissions,
        "clean_score": clean_score
    }

def calculate_energy_emissions(electricity_kwh: float = 0.0, gas_kwh: float = 0.0, solar_kwh: float = 0.0) -> dict:
    """
    Energy usage emissions calculation with solar clean energy credits.
    """
    elec_emissions = electricity_kwh * ENERGY_COEFFICIENTS["electricity_kwh"]
    gas_emissions = gas_kwh * ENERGY_COEFFICIENTS["natural_gas_kwh"]
    solar_credit = solar_kwh * abs(ENERGY_COEFFICIENTS["solar_offset_kwh"])
    
    net_energy_emissions = round(max(0.0, elec_emissions + gas_emissions - solar_credit), 3)

    return {
        "electricity_kwh": electricity_kwh,
        "gas_kwh": gas_kwh,
        "solar_kwh": solar_kwh,
        "elec_emissions_kg": round(elec_emissions, 3),
        "gas_emissions_kg": round(gas_emissions, 3),
        "solar_credit_kg": round(solar_credit, 3),
        "total_energy_emissions_kg": net_energy_emissions
    }

def calculate_health_equivalents(total_kg_co2: float) -> dict:
    """
    Computes tangible real-world environmental & health equivalents.
    """
    # 1 mature tree absorbs ~0.06 kg CO2 per day (~22 kg/year)
    trees_needed = round(total_kg_co2 / 0.06, 1)
    # Average gasoline car emits ~0.20 kg CO2 / mile
    car_miles_equiv = round(total_kg_co2 / 0.20, 1)
    # Manufacturing 1 plastic bottle generates ~0.082 kg CO2
    plastic_bottles_equiv = round(total_kg_co2 / 0.082, 0)

    return {
        "trees_daily_absorb_needed": trees_needed,
        "car_miles_equivalent": car_miles_equiv,
        "plastic_bottles_footprint": int(plastic_bottles_equiv)
    }
