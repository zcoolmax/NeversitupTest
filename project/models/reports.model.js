const { conn } = require("../database");
const { format } = require("sqlstring");

//////////////////////////////

exports.getExportDocument = function ({ start }) {
  const stringQuery = `
  SELECT
    document_branch,
    cus_name_th,
    document_full_no,
    document_start_date,
    document_end_date,
    document_sqm,
    document_lease_rate,
    document_maintain_fee_rate,
    document_monthly_lease,
    document_maintain_monthly_fee,
    document_deposit_rental
  FROM
    document
    LEFT JOIN customer ON document.cus_id =  customer.cus_id
  `;
  var sql = format(stringQuery, start);
  return conn(sql);
};

exports.getNationalityBYQuater = function ({ start }) {
  const stringQuery = `
  SELECT
    nationality_name,
    COUNT(*) AS count 
  FROM
    document
    LEFT JOIN customer ON customer.cus_id = document.cus_id
    LEFT JOIN nationality ON nationality.nationality_id = customer.nationality_id 
  WHERE
	? BETWEEN 
  CONCAT( YEAR ( document_start_date ), CASE QUARTER ( document_start_date ) WHEN 1 THEN '-01-01' WHEN 2 THEN '-04-01' WHEN 3 THEN '-07-01' ELSE '-10-01' END )
	AND 
  CONCAT( YEAR ( document_end_date ), CASE QUARTER ( document_end_date ) WHEN 1 THEN '-03-31' WHEN 2 THEN '-06-30' WHEN 3 THEN '-09-30' ELSE '-12-31' END )
  GROUP BY
    nationality_name
  `;
  var sql = format(stringQuery, start);
  return conn(sql);
};

exports.getIndustryBYQuater = function ({ start }) {
  const stringQuery = `
  SELECT
    industry_name,
    COUNT(*) AS count 
  FROM
    document
    LEFT JOIN customer ON customer.cus_id = document.cus_id
    LEFT JOIN industry ON industry.industry_id = customer.industry_id 
  WHERE
	  ? BETWEEN 
  CONCAT( YEAR ( document_start_date ), CASE QUARTER ( document_start_date ) WHEN 1 THEN '-01-01' WHEN 2 THEN '-04-01' WHEN 3 THEN '-07-01' ELSE '-10-01' END )
	AND 
  CONCAT( YEAR ( document_end_date ), CASE QUARTER ( document_end_date ) WHEN 1 THEN '-03-31' WHEN 2 THEN '-06-30' WHEN 3 THEN '-09-30' ELSE '-12-31' END )
  GROUP BY
    industry_name
  `;
  var sql = format(stringQuery, start);
  return conn(sql);
};

/*
exports.getSumMonthlyLeaseExpireBYQuater = function ({ monthDate }) {
  const stringQuery = `
  SELECT
    (COALESCE(SUM(mod(extract(MONTH FROM document_end_date) - 1, 3) + 1),0) * COALESCE(SUM(document_monthly_lease),0)) AS sum_document_monthly_lease,
    CONCAT( 'Q', COALESCE(QUARTER ( document_end_date ), QUARTER ( ? )) ) AS quarter_expire,
    YEAR ( ? ) AS year_expire
  FROM
    document
  WHERE
	? BETWEEN 
    CONCAT( YEAR ( document_end_date ), CASE QUARTER ( document_end_date ) WHEN 1 THEN '-01-01' WHEN 2 THEN '-04-01' WHEN 3 THEN '-07-01' ELSE '-10-01' END )
  AND 
    CONCAT( YEAR ( document_end_date ), CASE QUARTER ( document_end_date ) WHEN 1 THEN '-03-31' WHEN 2 THEN '-06-30' WHEN 3 THEN '-09-30' ELSE '-12-31' END )
  `;
  var sql = format(
    stringQuery,
    Array(stringQuery.split("?").length - 1).fill(monthDate)
  );
  return conn(sql);
};
*/

exports.getSumMonthlyLeaseBYQuater = function ({ monthDate }) {
  const stringQuery = `
  SELECT
    CASE
    WHEN YEAR ( ? ) < YEAR ( document_end_date ) THEN
      SUM( document_monthly_lease * 3 ) ELSE (
      SUM( document_monthly_lease * ( MOD ( extract( MONTH FROM document_end_date ) - 1, 3 ) + 1 ) ) 
    ) 
    END AS sum_document_monthly_lease 
  FROM
    document
  WHERE
	? BETWEEN 
    CONCAT( YEAR ( document_start_date ), CASE QUARTER ( document_start_date ) WHEN 1 THEN '-01-01' WHEN 2 THEN '-04-01' WHEN 3 THEN '-07-01' ELSE '-10-01' END )
  AND 
    CONCAT( YEAR ( document_end_date ), CASE QUARTER ( document_end_date ) WHEN 1 THEN '-03-31' WHEN 2 THEN '-06-30' WHEN 3 THEN '-09-30' ELSE '-12-31' END )
  `;
  var sql = format(
    stringQuery,
    Array(stringQuery.split("?").length - 1).fill(monthDate)
  );
  return conn(sql);
};

exports.getSumMonthlyLeaseExpireAndExpireYear = function ({ monthDate }) {
  const stringQuery = `
  SELECT
	  customer.nationality_id,
	  customer.industry_id,
    CASE
      WHEN YEAR ( ? ) < YEAR ( document_end_date ) THEN
        ( document_monthly_lease * 3 )
      ELSE
        ( document_monthly_lease * ( MOD ( extract( MONTH FROM document_end_date ) - 1, 3 ) + 1 ) )
    END AS document_monthly_lease,
		YEAR ( document_end_date ) AS year_expire,
		CONCAT( 'Q', QUARTER ( document_end_date ) ) AS quarter_expire
  FROM
    document
    LEFT JOIN customer ON customer.cus_id = document.cus_id
  WHERE
	? BETWEEN 
    CONCAT( YEAR ( document_start_date ), CASE QUARTER ( document_start_date ) WHEN 1 THEN '-01-01' WHEN 2 THEN '-04-01' WHEN 3 THEN '-07-01' ELSE '-10-01' END )
  AND 
    CONCAT( YEAR ( document_end_date ), CASE QUARTER ( document_end_date ) WHEN 1 THEN '-03-31' WHEN 2 THEN '-06-30' WHEN 3 THEN '-09-30' ELSE '-12-31' END )
  AND 
    QUARTER ( document_end_date ) = QUARTER ( ? )
  `;
  var sql = format(
    stringQuery,
    Array(stringQuery.split("?").length - 1).fill(monthDate)
  );
  return conn(sql);
};

exports.getSumProportionBySize = function ({ monthDate }) {
  // const stringQuery = `
  // SELECT
  // 	SUM(document_sqm) AS sum_sqm,
  // 	CASE
  // 		WHEN document_sqm < 1000 THEN '1000'
  // 		WHEN document_sqm <= 5000 THEN '5000'
  // 		WHEN document_sqm <= 10000 THEN '10000'
  // 		WHEN document_sqm <= 30000 THEN '30000'
  // 		ELSE '30001'
  // 	END AS group_sqm,
  // 	CASE
  // 		WHEN YEAR ( document_start_date ) < YEAR ( document_end_date ) THEN
  // 			SUM( document_monthly_lease * 12 )
  // 		ELSE
  //       SUM( document_monthly_lease * ( ( MONTH ( document_end_date ) + 1 ) - 1 ) )
  // 	END AS sum_document_monthly_lease
  // FROM
  //   document
  // WHERE
  // 	YEAR ( ? ) <= YEAR( document_end_date )
  // GROUP BY group_sqm
  // ORDER BY
  // 	document_sqm
  // `;
  const stringQuery = `
  SELECT
		branch_code,
		branch_name,
		SUM(document_sqm) AS sum_sqm,
		CASE
			WHEN document_sqm < 1000 THEN '1000'
			WHEN document_sqm <= 5000 THEN '5000'
			WHEN document_sqm <= 10000 THEN '10000'
			WHEN document_sqm <= 30000 THEN '30000'
			ELSE '30001'
		END AS group_sqm,
		CASE
			WHEN YEAR ( document_start_date ) < YEAR ( document_end_date ) THEN
				SUM( document_monthly_lease * 12 )
			ELSE
        SUM( document_monthly_lease * ( ( MONTH ( document_end_date ) + 1 ) - 1 ) )
		END AS sum_document_monthly_lease
  FROM
    document
		LEFT JOIN branch ON branch.branch_id = document.branch_id
  WHERE
		YEAR ( ? ) <= YEAR( document_end_date )
	GROUP BY group_sqm,branch_code
UNION
	SELECT
		'ALL' AS branch_code,
		'ทั้งหมด' AS branch_name,
		SUM(document_sqm) AS sum_sqm,
	CASE
		WHEN document_sqm < 1000 THEN '1000'
		WHEN document_sqm <= 5000 THEN '5000'
		WHEN document_sqm <= 10000 THEN '10000'
		WHEN document_sqm <= 30000 THEN '30000'
		ELSE '30001'
	END AS group_sqm,
	CASE
		WHEN YEAR ( document_start_date ) < YEAR ( document_end_date ) THEN
			SUM( document_monthly_lease * 12 )
		ELSE
			SUM( document_monthly_lease * ( ( MONTH ( document_end_date ) + 1 ) - 1 ) )
	END AS sum_document_monthly_lease
FROM
	document
WHERE
	YEAR ( ? ) <= YEAR( document_end_date )
GROUP BY group_sqm
  `;
  var sql = format(
    stringQuery,
    Array(stringQuery.split("?").length - 1).fill(monthDate)
  );
  return conn(sql);
};

exports.getSumProportionByType = function () {
  const stringQuery = `
  SELECT
    building_sqm,
    investment_type.investment_type_id,
    investment_type.investment_type_name,
    building_type.building_type_id,
    building_type.building_type_name,
    zone.zone_id,
    zone.zone_code,
    zone.zone_name,
    branch.branch_id,
    branch.branch_code,
    branch.branch_name 
  FROM
    building
    LEFT JOIN investment_type ON investment_type.investment_type_id = building.investment_type_id
    LEFT JOIN building_type ON building_type.building_type_id = building.building_type_id
    LEFT JOIN deed ON deed.deed_id = building.deed_id
    LEFT JOIN branch ON branch.branch_id = deed.branch_id
    LEFT JOIN zone ON zone.zone_id = branch.zone_id
  `;
  var sql = format(stringQuery);
  return conn(sql);
};

exports.getSumRentalRateOcc = function () {
  const stringQuery = `
  SELECT
    branch_name,
    branch_code,
    SUM( building_sqm ) AS sum_building_sqm 
  FROM
    building
    LEFT JOIN deed ON deed.deed_id = building.deed_id
    LEFT JOIN branch ON branch.branch_id = deed.branch_id 
  GROUP BY
    branch_code
  `;
  var sql = format(
    stringQuery,
    Array(stringQuery.split("?").length - 1).fill("monthDate")
  );
  return conn(sql);
};

exports.getSumRentalRateOccByMonth = function ({ monthDate }) {
  const stringQuery = `
  SELECT
    ? AS rental_date,
    document_branch,
    SUM( document_sqm ) AS sum_document_sqm ,
    SUM( document_monthly_lease ) AS sum_document_monthly_lease
  FROM
    document 
  WHERE
    ? BETWEEN DATE_FORMAT(document_start_date,'%Y-%m')  
    AND DATE_FORMAT(document_end_date,'%Y-%m') 
  GROUP BY
    document_branch
  `;
  var sql = format(
    stringQuery,
    Array(stringQuery.split("?").length - 1).fill(monthDate)
  );
  return conn(sql);
};

/*
exports.getSumMonthlyLeaseBYQuater = function ({ year }) {
  const stringQuery = `
  SELECT
    SUM(document_monthly_lease * ( MOD ( extract( MONTH FROM document_end_date ) - 1, 3 ) + 1 ) ) AS sum_document_monthly_lease,
		YEAR ( document_end_date ) AS year_expire,
		CONCAT( 'Q', QUARTER ( document_end_date ) ) AS quarter_expire
  FROM
    document
  WHERE
		YEAR( document_end_date ) = ?
	GROUP BY
		quarter_expire
  `;
  var sql = format(stringQuery, year);
  return conn(sql);
};
*/
exports.getMaxExpireYear = function () {
  const stringQuery = `
  SELECT
    YEAR( MAX( document_end_date ) ) AS max_expired_year
  FROM
    document
  `;
  var sql = format(stringQuery);
  return conn(sql);
};

exports.getTimeRange = function () {
  const stringQuery = `
  SELECT
    YEAR( MIN( document_start_date ) ) AS min_time_range,
    YEAR( MAX( document_end_date ) ) AS max_time_range
  FROM
    document
  `;
  var sql = format(stringQuery);
  return conn(sql);
};
