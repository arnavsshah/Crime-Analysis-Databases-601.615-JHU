var express = require('express');
const { pool } = require("../db");

var router = express.Router();

router.get('/', async function(req, res, next) {

  let neighborhood = 0

  try {
    neighborhood = await pool.query(
      "select distinct analysis_neighborhood as distinct_list from Crime where analysis_neighborhood is not null order by analysis_neighborhood asc"
    );
  } catch (error) {
    console.error(error)
  }

  let neighborhood_list = []
  for(var i=0; i < neighborhood.rows.length; i++) {
    neighborhood_list.push(neighborhood.rows[i]['distinct_list'])
  }


  let category = 0

  try {
    category = await pool.query(
      "select distinct incident_category as distinct_list from Crime where incident_category is not null order by incident_category asc"
    );
  } catch (error) {
    console.error(error)
  }

  let category_list = []
  for(var i=0; i < category.rows.length; i++) {
    category_list.push(category.rows[i]['distinct_list'])
  }


  let sub_category = 0

  try {
    sub_category = await pool.query(
      "select distinct incident_subcategory as distinct_list from Crime where incident_subcategory is not null order by incident_subcategory asc"
    );
  } catch (error) {
    console.error(error)
  }

  let sub_category_list = []
  for(var i=0; i < sub_category.rows.length; i++) {
    sub_category_list.push(sub_category.rows[i]['distinct_list'])
  }

  ejs_obj = {plot_graph: "false", 
    is_double_bar: "false",
    data: 0, 
    y_lim: 0, 
    num_grps: 0,
    title: 'Crime Analysis',
    neighborhood: neighborhood_list,
    category : category_list,
    sub_category : sub_category_list}

res.render('crime', ejs_obj);
});

router.post('/', async function(req, res, next) {

  // {"radio":"year",
  // "year":"","month":"February","day":"Tuesday",
  // "neighborhood":"",
  // "category":"","sub_category":""}

  let neighborhood = 0

  try {
    neighborhood = await pool.query(
      "select distinct analysis_neighborhood as distinct_list from Crime where analysis_neighborhood is not null order by analysis_neighborhood asc"
    );
  } catch (error) {
    console.error(error)
  }

  let neighborhood_list = []
  for(var i=0; i < neighborhood.rows.length; i++) {
    neighborhood_list.push(neighborhood.rows[i]['distinct_list'])
  }


  let category = 0

  try {
    category = await pool.query(
      "select distinct incident_category as distinct_list from Crime where incident_category is not null order by incident_category asc"
    );
  } catch (error) {
    console.error(error)
  }

  let category_list = []
  for(var i=0; i < category.rows.length; i++) {
    category_list.push(category.rows[i]['distinct_list'])
  }


  let sub_category = 0

  try {
    sub_category = await pool.query(
      "select distinct incident_subcategory as distinct_list from Crime where incident_subcategory is not null order by incident_subcategory asc"
    );
  } catch (error) {
    console.error(error)
  }

  let sub_category_list = []
  for(var i=0; i < sub_category.rows.length; i++) {
    sub_category_list.push(sub_category.rows[i]['distinct_list'])
  }

  var data = req.body
  let result = 0

  if(data['radio'] == 'year') {
    try {
      result = await pool.query(
        "select incident_year as grp, count (distinct incident_id) as cnt \
        from Crime as C \
        where incident_year like $1 and (extract (month from incident_date))::varchar(255) like $2 and incident_day_of_week like $3 \
        and analysis_neighborhood like $4 and incident_category like $5 and incident_subcategory like $6 \
        group by incident_year;",
        ['%' + req.body['year'] + '%', '%' + req.body['month'] + '%', '%' + req.body['day'] + '%',
        '%' + req.body['neighborhood'] + '%', '%' + req.body['category'] + '%', '%' + req.body['category'] + '%']
      );
    } catch (error) {
      console.error(error)
    }
  }
  else if(data['radio'] == 'month') {
    try {
      result = await pool.query(
        "select case \
        when extract (month from incident_date) = '1' then 'Jan' \
        when extract (month from incident_date) = '2' then 'Feb' \
        when extract (month from incident_date) = '3' then 'Mar' \
        when extract (month from incident_date) = '4' then 'Apr' \
        when extract (month from incident_date) = '5' then 'May' \
        when extract (month from incident_date) = '6' then 'Jun' \
        when extract (month from incident_date) = '7' then 'Jul' \
        when extract (month from incident_date) = '8' then 'Aug' \
        when extract (month from incident_date) = '9' then 'Sep' \
        when extract (month from incident_date) = '10' then 'Oct' \
        when extract (month from incident_date) = '11' then 'Nov' \
        when extract (month from incident_date) = '12' then 'Dec' end as grp, count (distinct incident_id) as cnt \
        from Crime as C \
        where incident_year like $1 and (extract (month from incident_date))::varchar(255) like $2 and incident_day_of_week like $3 \
        and analysis_neighborhood like $4 and incident_category like $5 and incident_subcategory like $6 \
        group by extract (month from incident_date);",
        ['%' + req.body['year'] + '%', '%' + req.body['month'] + '%', '%' + req.body['day'] + '%',
        '%' + req.body['neighborhood'] + '%', '%' + req.body['category'] + '%', '%' + req.body['category'] + '%']
      );
    } catch (error) {
      console.error(error)
    }
  }
  else if(data['radio'] == 'day') {
    try {
      result = await pool.query(
        "select incident_day_of_week as grp, count (distinct incident_id) as cnt from Crime as C \
        where incident_year like $1 and (extract (month from incident_date))::varchar(255) like $2 and incident_day_of_week like $3 \
        and analysis_neighborhood like $4 and incident_category like $5 and incident_subcategory like $6 \
        group by incident_day_of_week;",
        ['%' + req.body['year'] + '%', '%' + req.body['month'] + '%', '%' + req.body['day'] + '%',
        '%' + req.body['neighborhood'] + '%', '%' + req.body['category'] + '%', '%' + req.body['category'] + '%']
      );
    } catch (error) {
      console.error(error)
    }
  }
  else if(data['radio'] == 'time') {
    try {
      result = await pool.query(
        "select 'Morning' as grp, count(distinct incident_id) as cnt from Crime as C where C.incident_time between '6:00' and '12:00' \
        and incident_year like $1 and (extract (month from incident_date))::varchar(255) like $2 and incident_day_of_week like $3 \
        and analysis_neighborhood like $4 and incident_category like $5 and incident_subcategory like $6 \
        union \
        select 'Afternoon' as grp, count(distinct incident_id) as cnt from Crime as C where C.incident_time between '12:00' and '18:00' \
        and incident_year like $1 and (extract (month from incident_date))::varchar(255) like $2 and incident_day_of_week like $3 \
        and analysis_neighborhood like $4 and incident_category like $5 and incident_subcategory like $6 \
        union \
        select 'Evening' as grp, count(distinct incident_id) as cnt from Crime as C where C.incident_time between '18:00' and '24:00' \
        and incident_year like $1 and (extract (month from incident_date))::varchar(255) like $2 and incident_day_of_week like $3 \
        and analysis_neighborhood like $4 and incident_category like $5 and incident_subcategory like $6 \
        union \
        select 'Night' as grp, count(distinct incident_id) as cnt from Crime as C where C.incident_time between '0:00' and '6:00' \
        and incident_year like $1 and (extract (month from incident_date))::varchar(255) like $2 and incident_day_of_week like $3 \
        and analysis_neighborhood like $4 and incident_category like $5 and incident_subcategory like $6;",
        ['%' + req.body['year'] + '%', '%' + req.body['month'] + '%', '%' + req.body['day'] + '%',
        '%' + req.body['neighborhood'] + '%', '%' + req.body['category'] + '%', '%' + req.body['category'] + '%']
      );
    } catch (error) {
      console.error(error)
    }
  }
  else if(data['radio'] == 'neighborhood') {
    try {
      result = await pool.query(
        "select analysis_neighborhood as grp, count(distinct incident_id) as cnt from Crime as C \
        where incident_year like $1 and (extract (month from incident_date))::varchar(255) like $2 and incident_day_of_week like $3 \
        and analysis_neighborhood like $4 and incident_category like $5 and incident_subcategory like $6 \
        group by analysis_neighborhood;",
        ['%' + req.body['year'] + '%', '%' + req.body['month'] + '%', '%' + req.body['day'] + '%',
        '%' + req.body['neighborhood'] + '%', '%' + req.body['category'] + '%', '%' + req.body['category'] + '%']
      );
    } catch (error) {
      console.error(error)
    }
  }
  else if(data['radio'] == 'category') {
    try {
      result = await pool.query(
        "select incident_category as grp, count(distinct incident_id) as cnt from Crime as C \
        where incident_year like $1 and (extract (month from incident_date))::varchar(255) like $2 and incident_day_of_week like $3 \
        and analysis_neighborhood like $4 and incident_category like $5 and incident_subcategory like $6 \
        group by incident_category;",
        ['%' + req.body['year'] + '%', '%' + req.body['month'] + '%', '%' + req.body['day'] + '%',
        '%' + req.body['neighborhood'] + '%', '%' + req.body['category'] + '%', '%' + req.body['category'] + '%']
      );
    } catch (error) {
      console.error(error)
    }
  }
  else if(data['radio'] == 'sub_category') {
    try {
      result = await pool.query(
        "select incident_subcategory as grp, count(distinct incident_id) as cnt from Crime as C \
        where incident_year like $1 and (extract (month from incident_date))::varchar(255) like $2 and incident_day_of_week like $3 \
        and analysis_neighborhood like $4 and incident_category like $5 and incident_subcategory like $6 \
        group by incident_subcategory;",
        ['%' + req.body['year'] + '%', '%' + req.body['month'] + '%', '%' + req.body['day'] + '%',
        '%' + req.body['neighborhood'] + '%', '%' + req.body['category'] + '%', '%' + req.body['category'] + '%']
      );
    } catch (error) {
      console.error(error)
    }
  }
  else if(data['radio'] == 'covid_neighborhood') {
    try {
      if (data['year'] == '2020') {
        result = await pool.query(
          "select TN20.neighborhood_id as grp, CN20.crime_counts as cnt, TN20.test_counts as cnt2 \
          from TestByNeighborhood20 as TN20, CrimeCountsByNeighborhood2020 as CN20 \
          where TN20.neighborhood_id = CN20.analysis_neighborhood;"
        );
      }
      else if (data['year'] == '2021') {
        result = await pool.query(
          "select TN21.neighborhood_id as grp, CN21.crime_counts as cnt, TN21.test_counts as cnt2 \
          from TestByNeighborhood21 as TN21, CrimeCountsByNeighborhood2021 as CN21 \
          where TN21.neighborhood_id = CN21.analysis_neighborhood;"
        );
      }
      
    } catch (error) {
      console.error(error)
    }
  }
  else if(data['radio'] == 'fire_neighborhood') {
    try {
      if (data['year'] == '2020') {
        result = await pool.query(
          "select FN20.neighborhood_district as grp, CN20.crime_counts as cnt, FN20.fire_counts as cnt2 \
          from FireCountsByNeighborhood20 as FN20, CrimeCountsByNeighborhood2020 as CN20 \
          where FN20.neighborhood_district = CN20.analysis_neighborhood;"
        );
      }
      else if (data['year'] == '2021') {
        result = await pool.query(
          "select FN21.neighborhood_district as grp, CN21.crime_counts as cnt, FN21.fire_counts as cnt2 \
          from FireCountsByNeighborhood20 as FN21, CrimeCountsByNeighborhood2020 as CN21 \
          where FN21.neighborhood_district = CN21.analysis_neighborhood;"
        );
      }
      
    } catch (error) {
      console.error(error)
    }
  }
  else if(data['radio'] == 'housing_neighborhood') {
    try {
      result = await pool.query(
        "select HN.city_neighborhood as grp, HN.project_counts * 1000 as cnt, CN.crime_counts as cnt2 \
        from HousingCountsByNeighborhood as HN, CrimeCountsByNeighborhood as CN \
        where HN.city_neighborhood = CN.analysis_neighborhood;"
      );
    } catch (error) {
      console.error(error)
    }
  }


  let max_count = 0

  for(var i=0; i<result.rows.length; i++) {
    max_count = Math.max(max_count, result.rows[i]['cnt'])
  }

  if(data['radio'] == 'covid_neighborhood' || data['radio'] == 'fire_neighborhood' || data['radio'] == 'housing_neighborhood'){
    let max_count_cnt2 = 0
    for(var i=0; i<result.rows.length; i++) {
      max_count_cnt2 = Math.max(max_count, result.rows[i]['cnt2'])
    }
    max_count += max_count_cnt2
  }

  var is_double_bar = data['radio'] == 'covid_neighborhood' || data['radio'] == 'fire_neighborhood' || data['radio'] == 'housing_neighborhood';

  ejs_obj = {plot_graph: "true", 
            is_double_bar: is_double_bar.toString(),
            data: JSON.stringify(result.rows), 
            y_lim: max_count * 1.1, 
            num_grps: result.rows.length,
            title: 'Crime Analysis',
            neighborhood: neighborhood_list,
            category : category_list,
            sub_category : sub_category_list}
    
  res.render('crime', ejs_obj);
  

  // res.render('graph', { data: req.body})

});

module.exports = router;
