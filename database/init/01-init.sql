-- Initialisation de la base de données Smart Watering
-- Ce script s'exécute automatiquement lors du premier démarrage du conteneur PostgreSQL

-- Extension pour UUID
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Fonction pour mise à jour automatique du timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Table des types de plantes (énumérations)
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'plant_type') THEN
        CREATE TYPE plant_type AS ENUM (
            'succulent',
            'tropical', 
            'mediterranean',
            'temperate',
            'desert',
            'aquatic'
        );
    END IF;
END $$;

DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'schedule_status') THEN
        CREATE TYPE schedule_status AS ENUM (
            'pending',
            'completed',
            'skipped',
            'cancelled'
        );
    END IF;
END $$;

-- Table des plantes
CREATE TABLE IF NOT EXISTS plants (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    type plant_type NOT NULL,
    description TEXT,
    image_url VARCHAR(500),
    thumbnail_url VARCHAR(500),
    scientific_name VARCHAR(255),
    family VARCHAR(100),
    genus VARCHAR(100),
    image_source VARCHAR(50),
    base_watering_frequency_days INTEGER NOT NULL DEFAULT 7 CHECK (base_watering_frequency_days > 0),
    base_water_amount_ml DECIMAL(5,2) NOT NULL DEFAULT 250.00 CHECK (base_water_amount_ml > 0),
    spring_multiplier DECIMAL(3,2) NOT NULL DEFAULT 1.0 CHECK (spring_multiplier > 0),
    summer_multiplier DECIMAL(3,2) NOT NULL DEFAULT 1.2 CHECK (summer_multiplier > 0),
    autumn_multiplier DECIMAL(3,2) NOT NULL DEFAULT 0.8 CHECK (autumn_multiplier > 0),
    winter_multiplier DECIMAL(3,2) NOT NULL DEFAULT 0.5 CHECK (winter_multiplier > 0),
    min_temperature DECIMAL(5,2) NOT NULL DEFAULT 15.0,
    max_temperature DECIMAL(5,2) NOT NULL DEFAULT 30.0,
    ideal_humidity DECIMAL(5,2) NOT NULL DEFAULT 50.0 CHECK (ideal_humidity >= 0 AND ideal_humidity <= 100),
    rain_threshold_mm DECIMAL(5,2) NOT NULL DEFAULT 5.0 CHECK (rain_threshold_mm >= 0),
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    
    CONSTRAINT check_temperature_range CHECK (min_temperature < max_temperature)
);

-- Table des données météorologiques
CREATE TABLE IF NOT EXISTS weather_data (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    date DATE NOT NULL,
    temperature_min DECIMAL(5,2) NOT NULL,
    temperature_max DECIMAL(5,2) NOT NULL,
    temperature_avg DECIMAL(5,2) NOT NULL,
    humidity DECIMAL(5,2) NOT NULL CHECK (humidity >= 0 AND humidity <= 100),
    precipitation_mm DECIMAL(6,2) NOT NULL DEFAULT 0.0 CHECK (precipitation_mm >= 0),
    wind_speed DECIMAL(5,2) CHECK (wind_speed >= 0),
    uv_index DECIMAL(6,2) CHECK (uv_index >= 0),
    weather_condition VARCHAR(100),
    is_forecast BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    
    CONSTRAINT check_temperature_consistency CHECK (temperature_min <= temperature_avg AND temperature_avg <= temperature_max)
);

-- Table des planifications d'arrosage
CREATE TABLE IF NOT EXISTS watering_schedules (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    plant_id UUID NOT NULL REFERENCES plants(id) ON DELETE CASCADE,
    scheduled_date DATE NOT NULL,
    water_amount_ml DECIMAL(5,2) NOT NULL CHECK (water_amount_ml > 0),
    status schedule_status NOT NULL DEFAULT 'pending',
    reason TEXT,
    actual_water_amount_ml DECIMAL(5,2) CHECK (actual_water_amount_ml > 0),
    completed_at TIMESTAMP WITH TIME ZONE,
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Table de l'historique d'arrosage
CREATE TABLE IF NOT EXISTS watering_history (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    plant_id UUID NOT NULL REFERENCES plants(id) ON DELETE CASCADE,
    watered_at TIMESTAMP WITH TIME ZONE NOT NULL,
    water_amount_ml DECIMAL(5,2) NOT NULL CHECK (water_amount_ml > 0),
    was_scheduled BOOLEAN NOT NULL DEFAULT FALSE,
    schedule_id UUID REFERENCES watering_schedules(id) ON DELETE SET NULL,
    notes TEXT,
    soil_moisture_level DECIMAL(5,2) CHECK (soil_moisture_level >= 0 AND soil_moisture_level <= 100),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Index pour optimiser les performances
CREATE INDEX IF NOT EXISTS idx_plants_active ON plants(is_active);
CREATE INDEX IF NOT EXISTS idx_plants_type ON plants(type);

CREATE UNIQUE INDEX IF NOT EXISTS idx_weather_data_date_forecast ON weather_data(date, is_forecast);
CREATE INDEX IF NOT EXISTS idx_weather_data_date ON weather_data(date);
CREATE INDEX IF NOT EXISTS idx_weather_data_forecast ON weather_data(is_forecast);

CREATE UNIQUE INDEX IF NOT EXISTS idx_watering_schedules_plant_date ON watering_schedules(plant_id, scheduled_date);
CREATE INDEX IF NOT EXISTS idx_watering_schedules_date ON watering_schedules(scheduled_date);
CREATE INDEX IF NOT EXISTS idx_watering_schedules_status ON watering_schedules(status);
CREATE INDEX IF NOT EXISTS idx_watering_schedules_plant_id ON watering_schedules(plant_id);

CREATE INDEX IF NOT EXISTS idx_watering_history_plant_id ON watering_history(plant_id);
CREATE INDEX IF NOT EXISTS idx_watering_history_watered_at ON watering_history(watered_at);
CREATE INDEX IF NOT EXISTS idx_watering_history_scheduled ON watering_history(was_scheduled);

-- Triggers pour mise à jour automatique des timestamps
CREATE TRIGGER update_plants_updated_at 
    BEFORE UPDATE ON plants 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_watering_schedules_updated_at 
    BEFORE UPDATE ON watering_schedules 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

-- Données de démo (optionnel)
INSERT INTO plants (
    name, type, description, 
    base_watering_frequency_days, base_water_amount_ml,
    spring_multiplier, summer_multiplier, autumn_multiplier, winter_multiplier,
    min_temperature, max_temperature, ideal_humidity, rain_threshold_mm
) VALUES 
(
    'Monstera Deliciosa', 'tropical', 'Plante tropicale d''intérieur avec de grandes feuilles perforées',
    7, 300.00, 
    1.2, 1.5, 0.8, 0.6,
    18.0, 27.0, 65.0, 3.0
),
(
    'Aloe Vera', 'succulent', 'Plante grasse aux propriétés médicinales',
    14, 150.00,
    1.0, 1.1, 0.7, 0.5,
    10.0, 35.0, 40.0, 8.0
),
(
    'Lavande', 'mediterranean', 'Plante aromatique méditerranéenne',
    10, 200.00,
    1.3, 1.0, 0.9, 0.4,
    5.0, 30.0, 45.0, 10.0
),
(
    'Basilic', 'temperate', 'Herbe aromatique pour la cuisine',
    3, 100.00,
    1.4, 1.6, 1.0, 0.8,
    15.0, 25.0, 70.0, 2.0
) ON CONFLICT DO NOTHING;

-- Vue pour les statistiques rapides
CREATE OR REPLACE VIEW plant_statistics AS
SELECT 
    COUNT(*) as total_plants,
    COUNT(*) FILTER (WHERE is_active = true) as active_plants,
    COUNT(*) FILTER (WHERE is_active = false) as inactive_plants,
    COUNT(*) FILTER (WHERE type = 'tropical') as tropical_plants,
    COUNT(*) FILTER (WHERE type = 'succulent') as succulent_plants,
    COUNT(*) FILTER (WHERE type = 'mediterranean') as mediterranean_plants,
    COUNT(*) FILTER (WHERE type = 'temperate') as temperate_plants,
    COUNT(*) FILTER (WHERE type = 'desert') as desert_plants,
    COUNT(*) FILTER (WHERE type = 'aquatic') as aquatic_plants,
    AVG(base_watering_frequency_days) as avg_watering_frequency,
    AVG(base_water_amount_ml) as avg_water_amount
FROM plants;

-- Vue pour les statistiques de planification
CREATE OR REPLACE VIEW schedule_statistics AS
SELECT 
    COUNT(*) as total_schedules,
    COUNT(*) FILTER (WHERE status = 'pending') as pending_schedules,
    COUNT(*) FILTER (WHERE status = 'completed') as completed_schedules,
    COUNT(*) FILTER (WHERE status = 'skipped') as skipped_schedules,
    COUNT(*) FILTER (WHERE status = 'cancelled') as cancelled_schedules,
    COUNT(*) FILTER (WHERE scheduled_date = CURRENT_DATE) as today_schedules,
    COUNT(*) FILTER (WHERE scheduled_date < CURRENT_DATE AND status = 'pending') as overdue_schedules,
    COALESCE(SUM(actual_water_amount_ml) FILTER (WHERE status = 'completed'), 0) as total_water_used
FROM watering_schedules;

-- Fonction pour nettoyer les anciennes données
CREATE OR REPLACE FUNCTION cleanup_old_data()
RETURNS void AS $$
BEGIN
    -- Supprimer les données météo de plus de 90 jours
    DELETE FROM weather_data 
    WHERE date < CURRENT_DATE - INTERVAL '90 days' 
    AND is_forecast = false;
    
    -- Supprimer les planifications terminées de plus de 1 an
    DELETE FROM watering_schedules 
    WHERE scheduled_date < CURRENT_DATE - INTERVAL '1 year' 
    AND status IN ('completed', 'skipped', 'cancelled');
    
    -- Supprimer l'historique de plus de 2 ans
    DELETE FROM watering_history 
    WHERE watered_at < CURRENT_TIMESTAMP - INTERVAL '2 years';
    
    RAISE NOTICE 'Nettoyage des anciennes données terminé';
END;
$$ LANGUAGE plpgsql;

-- Permissions pour l'utilisateur de l'application
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO postgres;
GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO postgres;
GRANT EXECUTE ON ALL FUNCTIONS IN SCHEMA public TO postgres;

-- Message de confirmation
DO $$
BEGIN
    RAISE NOTICE 'Base de données Smart Watering initialisée avec succès!';
    RAISE NOTICE 'Tables créées: plants, weather_data, watering_schedules, watering_history';
    RAISE NOTICE 'Index et triggers configurés pour les performances';
    RAISE NOTICE 'Données de démonstration ajoutées';
END $$;