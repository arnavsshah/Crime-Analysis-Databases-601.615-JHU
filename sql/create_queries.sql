DROP TABLE IF EXISTS Crime CASCADE;
CREATE TABLE Crime 
(incident_datetime varchar,
incident_date date,
incident_time time,
incident_year varchar,
incident_day_of_week varchar,
report_datetime varchar,
row_id varchar,
incident_id varchar,
incident_number varchar,
CAD_number varchar,
report_type_code varchar,
report_type_description varchar,
filed_online varchar,
incident_code varchar,
incident_category varchar,
incident_subcategory varchar,
incident_description varchar,
resolution varchar,
intersection varchar,
CNN varchar,
police_district varchar,
analysis_neighborhood varchar,
supervisor_district varchar,
latitude varchar,
longitude varchar,
point varchar,
neighborhoods varchar,
ESNCAG_boundary_file varchar,
central_market_tenderloin_boundary_polygon_updated varchar,
civic_center_harm_reduction_project_boundary varchar,
HSOC_zones_as_of_2018_06_05 varchar,
invest_in_neighborhoodsIIN_areas varchar,
current_spervisor_districts varchar,
current_police_districts varchar
);


COPY Crime 
FROM '/home/arnav/Documents/projects/Crime-Analysis-Databases-601.615-JHU/csv/crime.csv'
DELIMITER ','
CSV HEADER;

-- psql -h localhost -U arnav -d crime -c "\copy Crime FROM '/home/arnav/Documents/projects/Crime-Analysis-Databases-601.615-JHU/csv/crime.csv' DELIMITER ',' CSV HEADER;"

/*crime counts by neighborhood 2020*/
create or replace view CrimeCountsByNeighborhood2020 as 
select C.analysis_neighborhood, count(distinct incident_id) as crime_counts
from Crime as C
where C.incident_year = '2020'
group by C.analysis_neighborhood;

/*crime counts by neighborhood 2021*/
create or replace view CrimeCountsByNeighborhood2021 as 
select C.analysis_neighborhood, count(distinct incident_id) as crime_counts
from Crime as C
where C.incident_year = '2021'
group by C.analysis_neighborhood;




/*load the COVID testing data file*/
drop table if exists COVIDTest cascade;
create table COVIDTest
(specimen_collection_date varchar,
area_type varchar,
neighborhood_id varchar,
acs_population varchar,
new_tests int,
cumulative_tests varchar,
new_positive_tests varchar,
cumulative_positive_tests varchar,
new_negative_tests varchar,
cumulative_negative_tests varchar,
new_interminate_tests varchar,
cumulative_interminate_tests varchar,
cumulative_testing_rate varchar, 
last_updated_at varchar,
data_loaded_at varchar
);

COPY COVIDTest
FROM '/home/arnav/Documents/projects/Crime-Analysis-Databases-601.615-JHU/csv/covid_testing.csv'
DELIMITER ','
CSV HEADER;

-- set datestyle to "ISO, MDY";
-- psql -h localhost -U arnav -d crime -c "\copy COVIDTest FROM '/home/arnav/Documents/projects/Crime-Analysis-Databases-601.615-JHU/csv/covid_testing.csv' DELIMITER ',' CSV HEADER;"


/*test counts by neighborhood FOR YEAR 2020*/
create or replace view TestByNeighborhood20 as
select CT.neighborhood_id, sum(CT.new_tests) as test_counts
from COVIDTest as CT
where CT.specimen_collection_date = '2020'
group by CT.neighborhood_id;

/*test counts by neighborhood FOR YEAR 2021*/
create or replace view TestByNeighborhood21 as
select CT.neighborhood_id, sum(CT.new_tests) as test_counts
from COVIDTest as CT
where CT.specimen_collection_date = '2021'
group by CT.neighborhood_id;




/*load in the fire table*/
drop table if exists Fire cascade;
create table Fire
(incident_number varchar,
incident_id varchar,
address varchar,
incident_date timestamp,
alarm_time varchar,
primary_situation varchar,
neighborhood_district varchar);

COPY Fire
FROM '/home/arnav/Documents/projects/Crime-Analysis-Databases-601.615-JHU/csv/fire.csv'
DELIMITER ','
CSV HEADER;

-- psql -h localhost -U arnav -d crime -c "\copy Fire FROM '/home/arnav/Documents/projects/Crime-Analysis-Databases-601.615-JHU/csv/fire.csv' DELIMITER ',' CSV HEADER;"

/* fire counts in 2020 by neighborhood */
create or replace view FireCountsByNeighborhood20 as
select F.neighborhood_district, count(distinct incident_number) as fire_counts
from Fire as F
where extract(year from F.incident_date) = '2020'
group by F.neighborhood_district;

/* fire counts in 2021 by neighborhood */
create or replace view FireCountsByNeighborhood21 as
select F.neighborhood_district, count(distinct incident_number) as fire_counts
from Fire as F
where extract(year from F.incident_date) = '2021'
group by F.neighborhood_district;



/*load affordable housing table*/
drop table if exists AffordableHousing cascade;
create table AffordableHousing 
(project_id varchar,
project_name varchar,
street_num varchar,
stree_name varchar,
street_type varchar,
zipcode varchar,
supervisor varchar,
city_neighborhood varchar,
plan_neighborhood varchar
);
 
COPY AffordableHousing
FROM '/home/arnav/Documents/projects/Crime-Analysis-Databases-601.615-JHU/csv/housing.csv'
DELIMITER ','
CSV HEADER;

-- psql -h localhost -U arnav -d crime -c "\copy AffordableHousing FROM '/home/arnav/Documents/projects/Crime-Analysis-Databases-601.615-JHU/csv/housing.csv' DELIMITER ',' CSV HEADER;"


/*count housing projects by neighborhood*/
create or replace view HousingCountsByNeighborhood as 
select AH.city_neighborhood, count(distinct project_id) as project_counts
from AffordableHousing as AH
group by AH.city_neighborhood;

/*crime counts by neighborhood */
create or replace view CrimeCountsByNeighborhood as 
select C.analysis_neighborhood, count(distinct incident_id) as crime_counts
from Crime as C
group by C.analysis_neighborhood;
