const percent = require("percent");
const reports_model = require("../models/reports.model");
const settings_model = require("../models/settings.model");
const moment = require("moment");

const randomIntArrayInRange = (min, max, n = 1) =>
  Array.from(
    { length: n },
    () => Math.floor(Math.random() * (max - min + 1)) + min
  );

const pad = (string) => {
  return `0${string}`.slice(-2);
};

function isWhatPercentOf(x, y, decimals = 2) {
  return ((parseFloat(x) / parseFloat(y)) * 100).toFixed(decimals);
}

exports.getExportDocument = async function ({ body }, res) {
  const exportDocument = await reports_model.getExportDocument(body);

  var min = exportDocument.reduce(function (a, { document_start_date }) {
    return a < document_start_date ? a : document_start_date;
  });
  var max = exportDocument.reduce(function (a, { document_start_date }) {
    return a > document_start_date ? a : document_start_date;
  });

  const currentMoment = moment(min).add(543, "year").subtract(1, "month");
  const endMoment = moment(max).add(543, "year");
  while (currentMoment.isSameOrBefore(endMoment, "month")) {
    console.log(`Loop at ${currentMoment.format("MMM-YY")}`);
    currentMoment.add(1, "month");
  }

  // {
  //   "document_branch": "KB",
  //   "cus_name_th": "บริษัท ไฮโดรเจน รีท แมเนจเม้นท์ จำกัด กระทำในนามของทรัสต์เพื่อการลงทุนในอสังหาริมทรัพย์และสิทธิการเช่าไฮโดรเจน โดยได้รับมอบอำนาจจากบริษัทหลักทรัพย์จัดการกองทุน แลนด์ แอนด์ เฮ้าส์ จำกัด ในฐานะทรัสตี",
  //   "document_full_no": "HY.KB.1.001/2023",
  //   "document_start_date": "2023-09-24T17:00:00.000Z",
  //   "document_end_date": "2024-03-30T17:00:00.000Z",
  //   "document_sqm": 200,
  //   "document_lease_rate": "50.00",
  //   "document_maintain_fee_rate": "50.00",
  //   "document_monthly_lease": "10000.00",
  //   "document_maintain_monthly_fee": "50.00",
  //   "document_deposit_rental": "30000.00"
  // }

  res.status(200).json({ min, max });
};

exports.getProportion = async function ({ body }, res) {
  const graphData = [];
  const nationalityBYQuater = await reports_model.getNationalityBYQuater(body);
  const industryBYQuater = await reports_model.getIndustryBYQuater(body);
  if (nationalityBYQuater.length)
    graphData.push({
      type: "pieChart",
      series: nationalityBYQuater.map(({ count }) => count),
      labels: nationalityBYQuater.map(
        ({ nationality_name }) => nationality_name
      ),
      text: "Nationality",
      size: 6,
    });
  if (industryBYQuater.length)
    graphData.push({
      type: "pieChart",
      series: industryBYQuater.map(({ count }) => count),
      labels: industryBYQuater.map(({ industry_name }) => industry_name),
      text: "Industry",
      size: 6,
    });
  res.status(200).json(graphData);
};

exports.getProportionBySize = async function ({ body }, res) {
  const { year } = body;
  const monthDate = `${year}-01-01`;

  const graphData = [];
  const sumProportionBySize = await reports_model.getSumProportionBySize({
    monthDate,
  });

  const branch = await settings_model.getBranches();
  branch.push({
    branch_name: "ทั้งหมด",
    branch_code: "ALL",
  });

  const sqmLabel = {
    1000: "< 1,000",
    5000: "1,000 - 5,000",
    10000: "5,001 - 10,000",
    30000: "10,001 - 30,000",
    30001: "> 30,000",
  };

  branch.map((branch) => {
    const branchData = sumProportionBySize.filter(
      (propotion) => propotion.branch_code == branch.branch_code
    );
    if (branchData.length) {
      const sumMonthlyLease = branchData.reduce((p, v) => {
        return (p += parseFloat(v.sum_document_monthly_lease));
      }, 0);
      graphData.push({
        type: "pieChart",
        series: branchData.map((i) => {
          return percent.calc(
            parseInt(i.sum_document_monthly_lease),
            parseInt(sumMonthlyLease),
            2
          );
        }),
        labels: branchData.map((i) => sqmLabel[i.group_sqm]),
        text: branch.branch_name,
        size: 6,
      });
    }
  });

  res.status(200).json(graphData);
};

exports.getProportionByType = async function ({ body }, res) {
  const graphData = [];
  const sumProportionBySize = await reports_model.getSumProportionByType();
  const sumAllSqm = sumProportionBySize.reduce((p, v) => p + v.building_sqm, 0);
  ////////////////////////////////
  const arrayBranchUniqueByKey = [
    ...new Map(
      sumProportionBySize.map(({ branch_id, branch_name }) => [
        branch_id,
        { branch_id, branch_name },
      ])
    ).values(),
  ];
  const graphBranch = arrayBranchUniqueByKey.map(
    ({ branch_id, branch_name }) => {
      const sumSqm = sumProportionBySize
        .filter((fil) => fil.branch_id == branch_id)
        .reduce((p, v) => p + v.building_sqm, 0);
      return { branch_name, sumSqm };
    }
  );
  graphData.push({
    type: "pieChart",
    series: graphBranch.map((i) =>
      percent.calc(parseInt(i.sumSqm), parseInt(sumAllSqm), 2)
    ),
    labels: arrayBranchUniqueByKey.map(({ branch_name }) => branch_name),
    text: "สัดส่วนจำนวนพื้นที่แบ่งตามสาขา",
    size: 6,
  });
  ////////////////////////////////
  const arrayZoneUniqueByKey = [
    ...new Map(
      sumProportionBySize.map(({ zone_id, zone_code, zone_name }) => [
        zone_id,
        { zone_id, zone_code, zone_name },
      ])
    ).values(),
  ];
  const graphZone = arrayZoneUniqueByKey.map(({ zone_id, zone_name }) => {
    const sumSqm = sumProportionBySize
      .filter((fil) => fil.zone_id == zone_id)
      .reduce((p, v) => p + v.building_sqm, 0);
    return { zone_name, sumSqm };
  });
  graphData.push({
    type: "pieChart",
    series: graphZone.map((i) =>
      percent.calc(parseInt(i.sumSqm), parseInt(sumAllSqm), 2)
    ),
    labels: arrayZoneUniqueByKey.map(({ zone_name }) => zone_name),
    text: "สัดส่วนจำนวนพื้นที่แบ่งตามโซน",
    size: 6,
  });
  ////////////////////////////////
  const arrayInvestmentTypeUniqueByKey = [
    ...new Map(
      sumProportionBySize.map(
        ({ investment_type_id, investment_type_name }) => [
          investment_type_id,
          { investment_type_id, investment_type_name },
        ]
      )
    ).values(),
  ];
  const graphInvestmentType = arrayInvestmentTypeUniqueByKey.map(
    ({ investment_type_id, investment_type_name }) => {
      const sumSqm = sumProportionBySize
        .filter((fil) => fil.investment_type_id == investment_type_id)
        .reduce((p, v) => p + v.building_sqm, 0);
      return { investment_type_name, sumSqm };
    }
  );

  graphData.push({
    type: "pieChart",
    series: graphInvestmentType.map((i) =>
      percent.calc(parseInt(i.sumSqm), parseInt(sumAllSqm), 2)
    ),
    labels: arrayInvestmentTypeUniqueByKey.map(
      ({ investment_type_name }) => investment_type_name
    ),
    text: "สัดส่วนจำนวนพื้นที่แบ่งตามประเภทการลงทุน",
    size: 6,
  });
  ////////////////////////////////
  const arrayBuildingTypeUniqueByKey = [
    ...new Map(
      sumProportionBySize.map(({ building_type_id, building_type_name }) => [
        building_type_id,
        { building_type_id, building_type_name },
      ])
    ).values(),
  ];
  const graphBuildingType = arrayBuildingTypeUniqueByKey.map(
    ({ building_type_id, building_type_name }) => {
      const sumSqm = sumProportionBySize
        .filter((fil) => fil.building_type_id == building_type_id)
        .reduce((p, v) => p + v.building_sqm, 0);
      return { building_type_name, sumSqm };
    }
  );
  graphData.push({
    type: "pieChart",
    series: graphBuildingType.map((i) =>
      percent.calc(parseInt(i.sumSqm), parseInt(sumAllSqm), 2)
    ),
    labels: arrayBuildingTypeUniqueByKey.map(
      ({ building_type_name }) => building_type_name
    ),
    text: "สัดส่วนจำนวนพื้นที่แบ่งตามประเภทอาคาร",
    size: 6,
  });
  ////////////////////////////////
  res.status(200).json(graphData);
};

exports.getLeaseExpiry = async function ({ body }, res) {
  const { year } = body,
    yearArr = [],
    graphData = [];
  let quarterSumThisQuarter = {},
    calcPercentage = [],
    sumMonthlyLease = [];
  const {
    [0]: { max_expired_year },
  } = await reports_model.getMaxExpireYear();

  for (y = year; y <= max_expired_year; y++) {
    for (i = 1; i <= 4; i++) {
      const monthDate = `${y}-${pad(i * 3 - 2)}-01`;
      const sumMonthlyLeaseExpireBYQuater =
        await reports_model.getSumMonthlyLeaseExpireAndExpireYear({
          monthDate,
        });
      sumMonthlyLease = [...sumMonthlyLease, ...sumMonthlyLeaseExpireBYQuater];
    }
    yearArr.push(y);
  }

  const industry = await settings_model.getIndustry();
  const nationality = await settings_model.getNationalities();

  // console.log(year);
  // console.log(industry);
  // console.log(nationality);
  // console.log(sumMonthlyLease);

  for (i = 1; i <= 4; i++) {
    const sum_document_monthly_lease_expire = sumMonthlyLease
      .filter((f) => f.quarter_expire == `Q${i}`)
      .reduce((p, v) => (p += +v.document_monthly_lease), 0);
    quarterSumThisQuarter = {
      ...quarterSumThisQuarter,
      [`Q${i}`]: sum_document_monthly_lease_expire,
    };
  }
  const newData = sumMonthlyLease.map((item) => {
    return {
      ...item,
      percentage: percent.calc(
        parseFloat(item.document_monthly_lease),
        parseFloat(quarterSumThisQuarter[item.quarter_expire]),
        5
      ),
    };
  });
  // console.log(newData);
  for (i = 1; i <= 4; i++) {
    const dataBar = yearArr.map((year) => {
      return newData
        .filter(
          (item) => item.year_expire == year && item.quarter_expire == `Q${i}`
        )
        .reduce((p, c) => {
          return (p += c.percentage);
        }, 0);
    });
    graphData.push({
      type: "barChart",
      series: [{ data: dataBar }],
      labels: yearArr,
      text: "สัดส่วนของสัญญาเช่าที่จะหมดสัญญา Q" + i,
      size: 6,
    });
  }
  for (i = 1; i <= 4; i++) {
    const dataPieIndustry = industry.map((industry) => {
      return newData
        .filter(
          (item) =>
            item.industry_id == industry.industry_id &&
            item.quarter_expire == `Q${i}`
        )
        .reduce((p, c) => {
          // return (p += +c.document_monthly_lease);
          return (p += c.percentage);
        }, 0);
    });
    graphData.push({
      type: "pieChart",
      series: dataPieIndustry.map((percentage) => +percentage.toFixed(2)),
      labels: industry.map(({ industry_name }) => industry_name),
      text: `Industry Q${i} ${year}`,
      size: 3,
    });
  }
  for (i = 1; i <= 4; i++) {
    const dataPieNationality = nationality.map((nationality) => {
      return newData
        .filter(
          (item) =>
            item.nationality_id == nationality.nationality_id &&
            item.quarter_expire == `Q${i}`
        )
        .reduce((p, c) => {
          // return (p += +c.document_monthly_lease);
          return (p += c.percentage);
        }, 0);
    });
    graphData.push({
      type: "pieChart",
      series: dataPieNationality.map((percentage) => +percentage.toFixed(2)),
      labels: nationality.map(({ nationality_name }) => nationality_name),
      text: `Nationality Q${i} ${year}`,
      size: 3,
    });
  }
  // {
  //   type: "pieChart",
  //   series: randomIntArrayInRange(1, 100, 5),
  //   labels: ["2021", "2022", "2023", "2024", "2025"],
  //   text: "Sriracha",
  //   size: 6,
  // },

  res.status(200).json(graphData);
};
/*
exports.getLeaseExpiry = async function ({ body }, res) {
  const { year } = body,
    yearArr = [],
    graphData = [];
  let quarterSumThisYear = {},
    calcPercentage = [];
  const {
    [0]: { max_expired_year },
  } = await reports_model.getMaxExpireYear();

  for (i = 1; i <= 4; i++) {
    const monthDate = `${year}-${pad(i * 3 - 2)}-01`;
    const [sumMonthlyLeaseBYQuaterThisYear] =
      await reports_model.getSumMonthlyLeaseBYQuater({ monthDate });

    const { sum_document_monthly_lease: sum_document_monthly_lease_expire } =
      sumMonthlyLeaseBYQuaterThisYear;
    quarterSumThisYear = {
      ...quarterSumThisYear,
      [`Q${i}`]: sum_document_monthly_lease_expire,
    };
  }

  for (y = year; y <= max_expired_year; y++) {
    yearArr.push(y);
  }
  for (i = 1; i <= 4; i++) {
    const monthDate = `${year}-${pad(i * 3 - 2)}-01`;
    const sumMonthlyLeaseExpireBYQuater =
      await reports_model.getSumMonthlyLeaseExpireAndExpireYear({
        monthDate,
      });
    const newData = sumMonthlyLeaseExpireBYQuater.map((item) => {
      return {
        ...item,
        percentage: percent.calc(
          parseInt(item.document_monthly_lease),
          parseInt(quarterSumThisYear[item.quarter_expire]),
          2
        ),
      };
    });
    calcPercentage = [...calcPercentage, ...newData];
  }
  for (i = 1; i <= 4; i++) {
    const rrr = yearArr.map((year) => {
      return calcPercentage
        .filter(
          (item) => item.year_expire == year && item.quarter_expire == `Q${i}`
        )
        .reduce((p, c) => {
          return (p += c.percentage);
        }, 0);
    });
    graphData.push({
      type: "barChart",
      series: [{ data: rrr }],
      labels: yearArr,
      text: "สัดส่วนของสัญญาเช่าที่จะหมดสัญญา Q" + i,
      size: 6,
    });
  }

  res.status(200).json(graphData);
};
*/
exports.getRentalRateOcc = async function ({ body }, res) {
  const { monthYear } = body,
    yearArr = [],
    graphData = [],
    OccSum = [],
    dateArr = [],
    seriesData = [[], [], [], []];

  const [start_date, end_date] = monthYear;
  const sumRentalRateOcc = await reports_model.getSumRentalRateOcc();

  sumRentalRateOcc.push({
    branch_name: "ทั้งหมด",
    branch_code: "ALL",
    sum_building_sqm: sumRentalRateOcc.reduce((p, v) => {
      return (p += +v.sum_building_sqm);
    }, 0),
  });

  for (
    var m = moment(start_date).set("date", 1);
    m.isSameOrBefore(end_date);
    m.add(1, "months")
  ) {
    const monthDate = m.format("YYYY-MM-DD");
    dateArr.push(monthDate);
    const sumRentalRateOccByMonth =
      await reports_model.getSumRentalRateOccByMonth({
        monthDate,
      });

    sumRentalRateOccByMonth.push({
      rental_date: monthDate,
      document_branch: "ALL",
      sum_document_sqm: sumRentalRateOccByMonth.reduce((p, v) => {
        return (p += +v.sum_document_sqm);
      }, 0),
      sum_document_monthly_lease: sumRentalRateOccByMonth.reduce((p, v) => {
        return (p += +v.sum_document_monthly_lease);
      }, 0),
    });

    const ArrOccByMonth = sumRentalRateOccByMonth.map((item) => {
      return {
        ...item,
        avg_rental:
          parseFloat(item.sum_document_monthly_lease) /
          parseFloat(item.sum_document_sqm),

        occ: percent.calc(
          parseFloat(item.sum_document_sqm),
          parseFloat(
            sumRentalRateOcc.find(
              (find) => find.branch_code == item.document_branch
            ).sum_building_sqm
          ),
          2
        ),
      };
    });
    OccSum.push(...ArrOccByMonth);
  }
  sumRentalRateOcc.map(({ branch_code, branch_name }) => {
    const filter = OccSum.filter(
      ({ document_branch }) => document_branch == branch_code
    );
    const generateData = dateArr.map((date) => {
      const rentalRate = filter.find(({ rental_date }) => date == rental_date);
      return rentalRate !== undefined
        ? { avg_rental: rentalRate.avg_rental, occ: rentalRate.occ, date }
        : { avg_rental: 0, occ: 0, date };
    });
    graphData.push({
      type: "mixChart",
      series: [
        {
          name: "Rental Rate",
          type: "column",
          data: generateData.map(({ avg_rental }) => avg_rental),
        },
        {
          name: "Occ. Rate",
          type: "line",
          data: generateData.map(({ occ }) => occ),
        },
      ],
      labels: generateData.map(({ date }) => moment(date).format("MMM-YY")),
      text: branch_name,
      size: dateArr.length <= 3 ? 4 : dateArr.length <= 9 ? 6 : 12,
    });
  });

  res.status(200).json(graphData);
};

exports.getTimeRange = async function ({ body }, res) {
  const [timeRange] = await reports_model.getTimeRange();
  res.status(200).json(timeRange);
};

exports.getReportFirst = async function ({ body }, res) {
  res.status(200).json(
    [
      {
        type: "donutChart",
        series: randomIntArrayInRange(1, 100, 5),
        labels: ["Jan-23", "Feb-23", "Mar-23", "Apr-23", "MAY-23"],
        text: "Sriracha",
        size: 6,
      },
      {
        type: "donutChart",
        series: randomIntArrayInRange(1, 100, 5),
        labels: ["2021", "2022", "2023", "2024", "2025"],
        text: "Sriracha",
        size: 6,
      },
      {
        type: "donutChart",
        series: randomIntArrayInRange(1, 100, 5),
        labels: ["2021", "2022", "2023", "2024", "2025"],
        text: "Sriracha",
        size: 6,
      },
      {
        type: "pieChart",
        series: randomIntArrayInRange(1, 100, 5),
        labels: ["2021", "2022", "2023", "2024", "2025"],
        text: "Sriracha",
        size: 6,
      },
      {
        type: "donutChart",
        series: randomIntArrayInRange(1, 100, 5),
        labels: ["2021", "2022", "2023", "2024", "2025"],
        text: "Sriracha",
        size: 6,
      },
    ].sort(() => Math.random() - 0.5)
  );
};

exports.getReportSecond = async function ({ body }, res) {
  res.status(200).json(
    [
      {
        type: "pieChart",
        series: randomIntArrayInRange(1, 100, 5),
        labels: ["2021", "2022", "2023", "2024", "2025"],
        text: "Sriracha",
        size: 6,
      },
      {
        type: "columnChart",
        series: [
          {
            name: "Expiry",
            data: randomIntArrayInRange(1, 100, 4),
          },
          {
            name: "Expiry Include option to renew",
            data: randomIntArrayInRange(1, 100, 4),
          },
        ],
        labels: ["2021", "2022", "2023", "2024", "2025"],
        text: "Sriracha",
        size: 6,
      },
      {
        type: "barChart",
        series: [{ data: randomIntArrayInRange(1, 100, 4) }],
        labels: [2004, 2005, 2006, 2007],
        text: "Sriracha",
        size: 6,
      },
      {
        type: "pieChart",
        series: randomIntArrayInRange(1, 100, 5),
        labels: ["2021", "2022", "2023", "2024", "2025"],
        text: "Sriracha",
        size: 6,
      },
      {
        type: "table",
        series: [
          {
            device: "Dell XPS 15",
            location: "United States",
            browser: "Chrome on Windows",
            activity: "10, Jan 2021 20:07",
          },
          {
            location: "Ghana",
            device: "Google Pixel 3a",
            browser: "Chrome on Android",
            activity: "11, Jan 2021 10:16",
          },
          {
            location: "Mayotte",
            device: "Apple iMac",
            browser: "Chrome on MacOS",
            activity: "11, Jan 2021 12:10",
          },
          {
            location: "Mauritania",
            device: "Apple iPhone XR",
            browser: "Chrome on iPhone",
            activity: "12, Jan 2021 8:29",
          },
        ],
        labels: [
          {
            label: "Browser",
            style: "text-start",
          },
          {
            label: "Device",
            style: "",
          },
        ],
        text: "Sriracha",
        size: 6,
      },
    ].sort(() => Math.random() - 0.5)
  );
};

exports.getReportThird = async function ({ body }, res) {
  res.status(200).json([
    {
      type: "mixChart",
      series: [
        {
          name: "Rental Rate",
          type: "column",
          data: randomIntArrayInRange(1, 100, 4),
        },
        {
          name: "Occ. Rate",
          type: "line",
          data: randomIntArrayInRange(1, 100, 4),
        },
      ],
      labels: ["Jan-23", "Feb-23", "Mar-23", "Apr-23"],
      text: "Sriracha",
      size: 6,
    },
    {
      type: "mixChart",
      series: [
        {
          name: "Rental Rate",
          type: "column",
          data: randomIntArrayInRange(1, 100, 4),
        },
        {
          name: "Occ. Rate",
          type: "line",
          data: randomIntArrayInRange(1, 100, 4),
        },
      ],
      labels: ["Jan-23", "Feb-23", "Mar-23", "Apr-23"],
      text: "Kabinburi",
      size: 6,
    },
    {
      type: "mixChart",
      series: [
        {
          name: "Rental Rate",
          type: "column",
          data: randomIntArrayInRange(1, 100, 4),
        },
        {
          name: "Occ. Rate",
          type: "line",
          data: randomIntArrayInRange(1, 100, 4),
        },
      ],
      labels: ["Jan-23", "Feb-23", "Mar-23", "Apr-23"],
      text: "Measot",
      size: 6,
    },
    {
      type: "mixChart",
      series: [
        {
          name: "Rental Rate",
          type: "column",
          data: randomIntArrayInRange(1, 100, 4),
        },
        {
          name: "Occ. Rate",
          type: "line",
          data: randomIntArrayInRange(1, 100, 4),
        },
      ],
      labels: ["Jan-23", "Feb-23", "Mar-23", "Apr-23"],
      text: "TSDC",
      size: 6,
    },
  ]);
};
