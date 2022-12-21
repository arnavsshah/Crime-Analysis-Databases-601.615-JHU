-----------------------------------------crime only---------------------------------------------------------------
--select distinct district
select distinct police_district as distinct_list from Crime where police_district is not null order by police_district asc

--select distinct cateogry
select distinct incident_category as distinct_list from Crime where incident_category is not null order by incident_category asc

--select distinct sub-cateogry
select distinct incident_subcategory as distinct_list from Crime where incident_subcategory is not null order by incident_subcategory asc

-- group by year
select incident_year as grp, count (distinct incident_id) as cnt from Crime as C 
where incident_year like $1 and (extract (month from incident_date))::varchar(255) like $2 and incident_day_of_week like $3
group by incident_year;

-- group by month
select case
when extract (month from incident_date) = '1' then 'Jan'
when extract (month from incident_date) = '2' then 'Feb'
when extract (month from incident_date) = '3' then 'Mar'
when extract (month from incident_date) = '4' then 'Apr'
when extract (month from incident_date) = '5' then 'May'
when extract (month from incident_date) = '6' then 'Jun'
when extract (month from incident_date) = '7' then 'Jul'
when extract (month from incident_date) = '8' then 'Aug'
when extract (month from incident_date) = '9' then 'Sep'
when extract (month from incident_date) = '10' then 'Oct'
when extract (month from incident_date) = '11' then 'Nov'
when extract (month from incident_date) = '12' then 'Dec' end as grp, 
count (distinct incident_id) as cnt from Crime as C 
where incident_year like $1 and (extract (month from incident_date))::varchar(255) like $2 and incident_day_of_week like $3
group by extract (month from incident_date);

-- group by day
select incident_day_of_week as grp, count (distinct incident_id) as cnt from Crime as C 
where incident_year like $1 and (extract (month from incident_date))::varchar(255) like $2 and incident_day_of_week like $3
group by incident_day_of_week;

-- group by time
select 'Morning' as grp, count(distinct incident_id) as cnt
from Crime as C
where C.incident_time between '6:00' and '12:00' and incident_year like $1 and (extract (month from incident_date))::varchar(255) like $2 and incident_day_of_week like $3
union
select 'Afternoon' as grp, count(distinct incident_id) as cnt
from Crime as C
where C.incident_time between '12:00' and '18:00' and incident_year like $1 and (extract (month from incident_date))::varchar(255) like $2 and incident_day_of_week like $3
union
select 'Evening' as grp, count(distinct incident_id) as cnt
from Crime as C
where C.incident_time between '18:00' and '24:00' and incident_year like $1 and (extract (month from incident_date))::varchar(255) like $2 and incident_day_of_week like $3
union
select 'Night' as grp, count(distinct incident_id) as cnt
from Crime as C
where C.incident_time between '0:00' and '6:00'; and incident_year like $1 and (extract (month from incident_date))::varchar(255) like $2 and incident_day_of_week like $3


-- group by district
select police_district as grp, count(distinct incident_id) as cnt from Crime as C
where incident_year like $1 and (extract (month from incident_date))::varchar(255) like $2 and incident_day_of_week like $3
and police_district like $4 and incident_category like $5 and incident_subcategory like $6
group by police_district;


select incident_category as grp, count(distinct incident_id) as cnt from Crime as C
where incident_year like $1 and (extract (month from incident_date))::varchar(255) like $2 and incident_day_of_week like $3
and police_district like $4 and incident_category like $5 and incident_subcategory like $6 
group by incident_category;


select incident_subcategory as grp, count(distinct incident_id) as cnt from Crime as C
where incident_year like $1 and (extract (month from incident_date))::varchar(255) like $2 and incident_day_of_week like $3
and police_district like $4 and incident_category like $5 and incident_subcategory like $6 
group by incident_subcategory;




-----------------------------------------crime and covid---------------------------------------------------------------

/*join select from covidtests and crime on neighborhood FOR YEAR 2020*/
select TN20.neighborhood_id as grp, CN20.crime_counts as cnt1, TN20.test_counts as cnt2
from TestByNeighborhood20 as TN20, CrimeCountsByNeighborhood2020 as CN20
where TN20.neighborhood_id = CN20.analysis_neighborhood;

/*join select from covidtests and crime on neighborhood FOR YEAR 2021*/
select TN21.neighborhood_id as grp, CN21.crime_counts as cnt1, TN21.test_counts as cnt2
from TestByNeighborhood21 as TN21, CrimeCountsByNeighborhood2021 as CN21
where TN21.neighborhood_id = CN21.analysis_neighborhood;


----------------------------------------crime and fire---------------------------------------------------------------

/*join select from fire and crime on neighborhood FOR YEAR 2020*/
select FN20.neighborhood_district as grp, CN20.crime_counts as cnt, FN20.fire_counts as cnt2
from FireCountsByNeighborhood20 as FN20, CrimeCountsByNeighborhood2020 as CN20
where FN20.neighborhood_district = CN20.analysis_neighborhood;

/*join select from fire and crime on neighborhood FOR YEAR 2021*/
select FN21.neighborhood_district as grp, CN21.crime_counts as cnt, FN21.fire_counts as cnt2
from FireCountsByNeighborhood20 as FN21, CrimeCountsByNeighborhood2020 as CN21
where FN21.neighborhood_district = CN21.analysis_neighborhood;


----------------------------------------crime and housing---------------------------------------------------------------

/*join housing counts with crime counts on neighborhood*/
select HN.city_neighborhood as grp, HN.project_counts as cnt, CN.crime_counts as cnt2
from HousingCountsByNeighborhood as HN, CrimeCountsByNeighborhood as CN
where HN.city_neighborhood = CN.analysis_neighborhood;