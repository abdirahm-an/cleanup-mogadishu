-- Seed data for Cleanup Mogadishu project
-- Somalia > Mogadishu districts and neighborhoods

-- Insert Somalia if not exists
INSERT OR IGNORE INTO countries (id, name, code, createdAt, updatedAt) 
VALUES ('somalia_country_id', 'Somalia', 'SO', datetime('now'), datetime('now'));

-- Insert Mogadishu if not exists
INSERT OR IGNORE INTO cities (id, name, countryId, createdAt, updatedAt) 
VALUES ('mogadishu_city_id', 'Mogadishu', 'somalia_country_id', datetime('now'), datetime('now'));

-- Insert Districts
INSERT OR IGNORE INTO districts (id, name, cityId, createdAt, updatedAt) VALUES 
  ('district_hamar_weyne', 'Hamar Weyne', 'mogadishu_city_id', datetime('now'), datetime('now')),
  ('district_hamar_jajab', 'Hamar Jajab', 'mogadishu_city_id', datetime('now'), datetime('now')),
  ('district_bondhere', 'Bondhere', 'mogadishu_city_id', datetime('now'), datetime('now')),
  ('district_shibis', 'Shibis', 'mogadishu_city_id', datetime('now'), datetime('now')),
  ('district_abdiaziz', 'Abdiaziz', 'mogadishu_city_id', datetime('now'), datetime('now')),
  ('district_wardhigley', 'Wardhigley', 'mogadishu_city_id', datetime('now'), datetime('now')),
  ('district_hodan', 'Hodan', 'mogadishu_city_id', datetime('now'), datetime('now')),
  ('district_hawl_wadaag', 'Hawl Wadaag', 'mogadishu_city_id', datetime('now'), datetime('now')),
  ('district_wadajir', 'Wadajir', 'mogadishu_city_id', datetime('now'), datetime('now')),
  ('district_yaqshid', 'Yaqshid', 'mogadishu_city_id', datetime('now'), datetime('now')),
  ('district_karan', 'Karan', 'mogadishu_city_id', datetime('now'), datetime('now')),
  ('district_dharkenley', 'Dharkenley', 'mogadishu_city_id', datetime('now'), datetime('now')),
  ('district_dayniile', 'Dayniile', 'mogadishu_city_id', datetime('now'), datetime('now')),
  ('district_kahda', 'Kahda', 'mogadishu_city_id', datetime('now'), datetime('now')),
  ('district_shangani', 'Shangani', 'mogadishu_city_id', datetime('now'), datetime('now'));

-- Insert Neighborhoods
-- Hamar Weyne neighborhoods
INSERT OR IGNORE INTO neighborhoods (id, name, districtId, createdAt, updatedAt) VALUES 
  ('neighborhood_bakaaro_market', 'Bakaaro Market', 'district_hamar_weyne', datetime('now'), datetime('now')),
  ('neighborhood_hamarweyne_market', 'Hamarweyne Market', 'district_hamar_weyne', datetime('now'), datetime('now')),
  ('neighborhood_old_port_area', 'Old Port Area', 'district_hamar_weyne', datetime('now'), datetime('now')),
  ('neighborhood_historic_quarter', 'Historic Quarter', 'district_hamar_weyne', datetime('now'), datetime('now')),
  ('neighborhood_central_mosque_area', 'Central Mosque Area', 'district_hamar_weyne', datetime('now'), datetime('now'));

-- Hamar Jajab neighborhoods
INSERT OR IGNORE INTO neighborhoods (id, name, districtId, createdAt, updatedAt) VALUES 
  ('neighborhood_villa_somalia', 'Villa Somalia', 'district_hamar_jajab', datetime('now'), datetime('now')),
  ('neighborhood_k4_junction', 'K4 Junction', 'district_hamar_jajab', datetime('now'), datetime('now')),
  ('neighborhood_maka_al_mukarama_road', 'Maka al-Mukarama Road', 'district_hamar_jajab', datetime('now'), datetime('now')),
  ('neighborhood_government_quarter', 'Government Quarter', 'district_hamar_jajab', datetime('now'), datetime('now')),
  ('neighborhood_embassy_district', 'Embassy District', 'district_hamar_jajab', datetime('now'), datetime('now'));

-- Bondhere neighborhoods
INSERT OR IGNORE INTO neighborhoods (id, name, districtId, createdAt, updatedAt) VALUES 
  ('neighborhood_bondhere_market', 'Bondhere Market', 'district_bondhere', datetime('now'), datetime('now')),
  ('neighborhood_industrial_area', 'Industrial Area', 'district_bondhere', datetime('now'), datetime('now')),
  ('neighborhood_northern_residential', 'Northern Residential', 'district_bondhere', datetime('now'), datetime('now')),
  ('neighborhood_bondhere_junction', 'Bondhere Junction', 'district_bondhere', datetime('now'), datetime('now')),
  ('neighborhood_workshop_quarter', 'Workshop Quarter', 'district_bondhere', datetime('now'), datetime('now'));

-- Shibis neighborhoods
INSERT OR IGNORE INTO neighborhoods (id, name, districtId, createdAt, updatedAt) VALUES 
  ('neighborhood_shibis_market', 'Shibis Market', 'district_shibis', datetime('now'), datetime('now')),
  ('neighborhood_radio_mogadishu_area', 'Radio Mogadishu Area', 'district_shibis', datetime('now'), datetime('now')),
  ('neighborhood_shibis_junction', 'Shibis Junction', 'district_shibis', datetime('now'), datetime('now')),
  ('neighborhood_educational_quarter', 'Educational Quarter', 'district_shibis', datetime('now'), datetime('now')),
  ('neighborhood_residential_zone', 'Residential Zone', 'district_shibis', datetime('now'), datetime('now'));

-- Abdiaziz neighborhoods
INSERT OR IGNORE INTO neighborhoods (id, name, districtId, createdAt, updatedAt) VALUES 
  ('neighborhood_abdiaziz_junction', 'Abdiaziz Junction', 'district_abdiaziz', datetime('now'), datetime('now')),
  ('neighborhood_commercial_center', 'Commercial Center', 'district_abdiaziz', datetime('now'), datetime('now')),
  ('neighborhood_mosque_district', 'Mosque District', 'district_abdiaziz', datetime('now'), datetime('now')),
  ('neighborhood_residential_area', 'Residential Area', 'district_abdiaziz', datetime('now'), datetime('now')),
  ('neighborhood_market_zone', 'Market Zone', 'district_abdiaziz', datetime('now'), datetime('now'));

-- Wardhigley neighborhoods
INSERT OR IGNORE INTO neighborhoods (id, name, districtId, createdAt, updatedAt) VALUES 
  ('neighborhood_wardhigley_market', 'Wardhigley Market', 'district_wardhigley', datetime('now'), datetime('now')),
  ('neighborhood_airport_road', 'Airport Road', 'district_wardhigley', datetime('now'), datetime('now')),
  ('neighborhood_villa_baidoa', 'Villa Baidoa', 'district_wardhigley', datetime('now'), datetime('now')),
  ('neighborhood_northern_suburbs', 'Northern Suburbs', 'district_wardhigley', datetime('now'), datetime('now')),
  ('neighborhood_industrial_zone', 'Industrial Zone', 'district_wardhigley', datetime('now'), datetime('now'));

-- Hodan neighborhoods
INSERT OR IGNORE INTO neighborhoods (id, name, districtId, createdAt, updatedAt) VALUES 
  ('neighborhood_hodan_market', 'Hodan Market', 'district_hodan', datetime('now'), datetime('now')),
  ('neighborhood_university_area', 'University Area', 'district_hodan', datetime('now'), datetime('now')),
  ('neighborhood_stadium_district', 'Stadium District', 'district_hodan', datetime('now'), datetime('now')),
  ('neighborhood_hodan_junction', 'Hodan Junction', 'district_hodan', datetime('now'), datetime('now')),
  ('neighborhood_residential_quarter', 'Residential Quarter', 'district_hodan', datetime('now'), datetime('now'));

-- Hawl Wadaag neighborhoods
INSERT OR IGNORE INTO neighborhoods (id, name, districtId, createdAt, updatedAt) VALUES 
  ('neighborhood_hawl_wadaag_market', 'Hawl Wadaag Market', 'district_hawl_wadaag', datetime('now'), datetime('now')),
  ('neighborhood_southern_port', 'Southern Port', 'district_hawl_wadaag', datetime('now'), datetime('now')),
  ('neighborhood_fishing_quarter', 'Fishing Quarter', 'district_hawl_wadaag', datetime('now'), datetime('now')),
  ('neighborhood_coastal_area', 'Coastal Area', 'district_hawl_wadaag', datetime('now'), datetime('now')),
  ('neighborhood_traditional_housing', 'Traditional Housing', 'district_hawl_wadaag', datetime('now'), datetime('now'));

-- Wadajir neighborhoods
INSERT OR IGNORE INTO neighborhoods (id, name, districtId, createdAt, updatedAt) VALUES 
  ('neighborhood_wadajir_market', 'Wadajir Market', 'district_wadajir', datetime('now'), datetime('now')),
  ('neighborhood_bus_station', 'Bus Station', 'district_wadajir', datetime('now'), datetime('now')),
  ('neighborhood_transport_hub', 'Transport Hub', 'district_wadajir', datetime('now'), datetime('now')),
  ('neighborhood_commercial_zone', 'Commercial Zone', 'district_wadajir', datetime('now'), datetime('now')),
  ('neighborhood_eastern_residential', 'Eastern Residential', 'district_wadajir', datetime('now'), datetime('now'));

-- Yaqshid neighborhoods
INSERT OR IGNORE INTO neighborhoods (id, name, districtId, createdAt, updatedAt) VALUES 
  ('neighborhood_yaqshid_market', 'Yaqshid Market', 'district_yaqshid', datetime('now'), datetime('now')),
  ('neighborhood_medical_center', 'Medical Center', 'district_yaqshid', datetime('now'), datetime('now')),
  ('neighborhood_hospital_district', 'Hospital District', 'district_yaqshid', datetime('now'), datetime('now')),
  ('neighborhood_health_quarter', 'Health Quarter', 'district_yaqshid', datetime('now'), datetime('now')),
  ('neighborhood_northern_commercial', 'Northern Commercial', 'district_yaqshid', datetime('now'), datetime('now'));

-- Karan neighborhoods
INSERT OR IGNORE INTO neighborhoods (id, name, districtId, createdAt, updatedAt) VALUES 
  ('neighborhood_karan_market', 'Karan Market', 'district_karan', datetime('now'), datetime('now')),
  ('neighborhood_agricultural_area', 'Agricultural Area', 'district_karan', datetime('now'), datetime('now')),
  ('neighborhood_livestock_market', 'Livestock Market', 'district_karan', datetime('now'), datetime('now')),
  ('neighborhood_rural_outskirts', 'Rural Outskirts', 'district_karan', datetime('now'), datetime('now')),
  ('neighborhood_farm_district', 'Farm District', 'district_karan', datetime('now'), datetime('now'));

-- Dharkenley neighborhoods
INSERT OR IGNORE INTO neighborhoods (id, name, districtId, createdAt, updatedAt) VALUES 
  ('neighborhood_dharkenley_market', 'Dharkenley Market', 'district_dharkenley', datetime('now'), datetime('now')),
  ('neighborhood_idp_settlement', 'IDP Settlement', 'district_dharkenley', datetime('now'), datetime('now')),
  ('neighborhood_refugee_quarter', 'Refugee Quarter', 'district_dharkenley', datetime('now'), datetime('now')),
  ('neighborhood_temporary_housing', 'Temporary Housing', 'district_dharkenley', datetime('now'), datetime('now')),
  ('neighborhood_aid_distribution_center', 'Aid Distribution Center', 'district_dharkenley', datetime('now'), datetime('now'));

-- Dayniile neighborhoods
INSERT OR IGNORE INTO neighborhoods (id, name, districtId, createdAt, updatedAt) VALUES 
  ('neighborhood_dayniile_center', 'Dayniile Center', 'district_dayniile', datetime('now'), datetime('now')),
  ('neighborhood_agricultural_plots', 'Agricultural Plots', 'district_dayniile', datetime('now'), datetime('now')),
  ('neighborhood_rural_settlement', 'Rural Settlement', 'district_dayniile', datetime('now'), datetime('now')),
  ('neighborhood_farming_community', 'Farming Community', 'district_dayniile', datetime('now'), datetime('now')),
  ('neighborhood_pastoral_area', 'Pastoral Area', 'district_dayniile', datetime('now'), datetime('now'));

-- Kahda neighborhoods
INSERT OR IGNORE INTO neighborhoods (id, name, districtId, createdAt, updatedAt) VALUES 
  ('neighborhood_kahda_market', 'Kahda Market', 'district_kahda', datetime('now'), datetime('now')),
  ('neighborhood_mixed_settlement', 'Mixed Settlement', 'district_kahda', datetime('now'), datetime('now')),
  ('neighborhood_agricultural_zone', 'Agricultural Zone', 'district_kahda', datetime('now'), datetime('now')),
  ('neighborhood_suburban_area', 'Suburban Area', 'district_kahda', datetime('now'), datetime('now')),
  ('neighborhood_community_center', 'Community Center', 'district_kahda', datetime('now'), datetime('now'));

-- Shangani neighborhoods
INSERT OR IGNORE INTO neighborhoods (id, name, districtId, createdAt, updatedAt) VALUES 
  ('neighborhood_shangani_beach', 'Shangani Beach', 'district_shangani', datetime('now'), datetime('now')),
  ('neighborhood_historic_lighthouse', 'Historic Lighthouse', 'district_shangani', datetime('now'), datetime('now')),
  ('neighborhood_coastal_villas', 'Coastal Villas', 'district_shangani', datetime('now'), datetime('now')),
  ('neighborhood_old_italian_quarter', 'Old Italian Quarter', 'district_shangani', datetime('now'), datetime('now')),
  ('neighborhood_waterfront_district', 'Waterfront District', 'district_shangani', datetime('now'), datetime('now'));