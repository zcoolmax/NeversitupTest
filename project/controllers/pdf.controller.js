const pdf_model = require("../models/pdf.model");
const contract_model = require("../models/contract.model");
const settings_model = require("../models/settings.model");
const property_model = require("../models/property.model");
const ejs = require("ejs");
const htmlToPdf = require("html-pdf-node");
const path = require("path");
const moment = require("moment");
moment.locale("th");

const THBText = require("thai-baht-text");

const format = require("format-number");
const numberFormat = format();

exports.pdf = async function ({ body: { query: document_id } }, res) {
  const [documentData] = await contract_model.getDocumentById(document_id);

  const [customer] = await settings_model.getCustomerById({
    cus_id: documentData.cus_id,
  });
  const [customer_owner] = await settings_model.getCustomerById({
    cus_id: documentData.cus_owner_id,
  });
  const attachedBuilding = await property_model.getBuildingByDocumentId({
    document_id: documentData.document_id,
  });

  const [branch] = await settings_model.getBranchById({
    branch_id: documentData.branch_id,
  });
  const building = await property_model.getBuildingByArrId({
    building_id: attachedBuilding.map(({ building_id }) => building_id),
  });
  // console.log(documentData);
  // console.log(customer);
  // console.log(customer_owner);

  const building_no = building.map(({ building_no }) => building_no);
  const buildingData = {
    building_no,
    deed_cus_sub_distict: building[0].deed_cus_sub_distict,
    deed_cus_district: building[0].deed_cus_district,
    deed_cus_province: building[0].deed_cus_province,
  };
  // console.log(branch);

  // const query2 = {
  //   date_modify: "2023-02-16",
  //   date_header: "2023-01-01",
  //   title: "สัญญาเช่าอาคาร",
  //   company_lessor:
  //     "บริษัท ไฮโดรเจน รีท แมเนจเม้นท์ จำกัด กระทำในนามของทรัสต์เพื่อการลงทุนในอสังหาริมทรัพย์และสิทธิการเช่าไฮโดรเจน โดยได้รับมอบอำนาจจากบริษัทหลักทรัพย์จัดการกองทุน แลนด์ แอนด์ เฮ้าส์ จำกัด ในฐานะทรัสตี",
  //   address_lessor:
  //     "944 อาคารมิตรทาวน์ ออฟฟิศ ทาวเวอร์ ชั้นที่ 29 ห้องที่ 2907-2910 ถนนพระรามที่ 4 แขวงวังใหม่ เขตปทุมวัน กรุงเทพมหานคร 10330",
  //   company_renter: "บริษัท ฮิไรเซมิสึ (ประเทศไทย) จำกัด ",
  //   address_renter:
  //     "600/37 หมู่ที่ 11 ถนนสุขาภิบาล 8 ต.หนองขาม อ.ศรีราชา จ.ชลบุรี",
  //   amount_of_space: 4860,
  //   sqm_bath: 160,
  //   total_bath: 263541,
  //   start_rental_period: "2023-01-01",
  //   end_rental_period: "2025-12-31",
  //   pay_day: 5,
  //   utility_bills: 3500,
  // };

  const data = {
    ...documentData,
    ...buildingData,
    ...branch,
    customer,
    customer_owner,
  };

  // res.json(data);

  // console.log(data);

  const document = await ejs.renderFile(
    // path.resolve(process.cwd(), "templates", "layout.contract.ejs"),
    path.resolve(process.cwd(), "templates", "layout.basic.utilities.ejs"),
    {
      data,
      moment,
      THBText,
      numberFormat,
    },
    { async: true }
  );

  const html = await ejs.renderFile(
    path.resolve(process.cwd(), "templates", "layout.html.ejs"),
    {
      body: document,
    },
    { async: true }
  );

  let options = {
    format: "A4",
    margin: {
      top: 90,
      right: 60,
      bottom: 90,
      left: 60,
    },
    // ${moment(query.date_modify)
    headerTemplate: `
    <div style="color: red; font-size: 10px; padding-top: 5px; text-align: right; width: 100%;font-size: 16px;font-family: 'Cordia New', sans-serif;margin-right:50px">
      <span>ฉบับแก้ไข ณ วันที่ ${moment()
        .add(543, "year")
        .format("Do MMMM YYYY")}</span>
    </div>
    `,

    footerTemplate: `
    <table style="font-size: 10px; font-size: 16px; font-family: 'Cordia New', sans-serif; width: 100%">
      <tr>
        <td align="center">- <span class='pageNumber'></span> -</td>
      </tr>
      <tr>
        <td align="left" style="padding-left: 50px;">สัญญาเช่าอาคาร สัญญาเลขที่ ${data.document_full_no}</td>
      </tr>
    </table>
    `,
    displayHeaderFooter: true,
  };

  let file = { content: html };
  htmlToPdf
    .generatePdf(file, options)
    .then((pdfBuffer) => {
      res
        .writeHead(200, {
          "Content-Type": "Application/pdf",
          "Content-Disposition": "attachment",
        })
        .end(pdfBuffer);
    })
    .catch((err) => {
      res.send({ success: false, error: err });
    });
};

exports.pdf_preview = async function ({ body: { query: document_id } }, res) {
  const [documentData] = await contract_model.getDocumentById(document_id);

  const [customer] = await settings_model.getCustomerById({
    cus_id: documentData.cus_id,
  });
  const [customer_owner] = await settings_model.getCustomerById({
    cus_id: documentData.cus_owner_id,
  });
  const attachedBuilding = await property_model.getBuildingByDocumentId({
    document_id: documentData.document_id,
  });

  const [branch] = await settings_model.getBranchById({
    branch_id: documentData.branch_id,
  });
  const building = await property_model.getBuildingByArrId({
    building_id: attachedBuilding.map(({ building_id }) => building_id),
  });
  // console.log(documentData);
  // console.log(customer);
  // console.log(customer_owner);

  const building_no = building.map(({ building_no }) => building_no);
  const buildingData = {
    building_no,
    deed_cus_sub_distict: building[0].deed_cus_sub_distict,
    deed_cus_district: building[0].deed_cus_district,
    deed_cus_province: building[0].deed_cus_province,
  };
  // console.log(branch);

  // const query2 = {
  //   date_modify: "2023-02-16",
  //   date_header: "2023-01-01",
  //   title: "สัญญาเช่าอาคาร",
  //   company_lessor:
  //     "บริษัท ไฮโดรเจน รีท แมเนจเม้นท์ จำกัด กระทำในนามของทรัสต์เพื่อการลงทุนในอสังหาริมทรัพย์และสิทธิการเช่าไฮโดรเจน โดยได้รับมอบอำนาจจากบริษัทหลักทรัพย์จัดการกองทุน แลนด์ แอนด์ เฮ้าส์ จำกัด ในฐานะทรัสตี",
  //   address_lessor:
  //     "944 อาคารมิตรทาวน์ ออฟฟิศ ทาวเวอร์ ชั้นที่ 29 ห้องที่ 2907-2910 ถนนพระรามที่ 4 แขวงวังใหม่ เขตปทุมวัน กรุงเทพมหานคร 10330",
  //   company_renter: "บริษัท ฮิไรเซมิสึ (ประเทศไทย) จำกัด ",
  //   address_renter:
  //     "600/37 หมู่ที่ 11 ถนนสุขาภิบาล 8 ต.หนองขาม อ.ศรีราชา จ.ชลบุรี",
  //   amount_of_space: 4860,
  //   sqm_bath: 160,
  //   total_bath: 263541,
  //   start_rental_period: "2023-01-01",
  //   end_rental_period: "2025-12-31",
  //   pay_day: 5,
  //   utility_bills: 3500,
  // };

  const data = {
    ...documentData,
    ...buildingData,
    ...branch,
    customer,
    customer_owner,
  };

  // res.json(data);

  // console.log(data);

  const document = await ejs.renderFile(
    path.resolve(process.cwd(), "templates", "layout.contract.ejs"),
    {
      data,
      moment,
      THBText,
      numberFormat,
    },
    { async: true }
  );

  const html = await ejs.renderFile(
    path.resolve(process.cwd(), "templates", "layout.html.ejs"),
    {
      body: document,
    },
    { async: true }
  );

  let options = {
    format: "A4",
    margin: {
      top: 90,
      right: 60,
      bottom: 90,
      left: 60,
    },
    // ${moment(query.date_modify)
    headerTemplate: `
    <div style="color: red; font-size: 10px; padding-top: 5px; text-align: right; width: 100%;font-size: 16px;font-family: 'Cordia New', sans-serif;margin-right:50px">
      <span>ฉบับแก้ไข ณ วันที่ ${moment()
        .add(543, "year")
        .format("Do MMMM YYYY")}</span>
    </div>
    `,

    footerTemplate: `
    <table style="font-size: 10px; font-size: 16px; font-family: 'Cordia New', sans-serif; width: 100%">
      <tr>
        <td align="center">- <span class='pageNumber'></span> -</td>
      </tr>
      <tr>
        <td align="left" style="padding-left: 50px;">สัญญาเช่าอาคาร สัญญาเลขที่ ${data.document_full_no}</td>
      </tr>
    </table>
    `,
    displayHeaderFooter: true,
  };

  res.send(html);

  // let file = { content: html };
  // htmlToPdf
  //   .generatePdf(file, options)
  //   .then((pdfBuffer) => {
  //     res
  //       .writeHead(200, {
  //         "Content-Type": "Application/pdf",
  //         "Content-Disposition": "attachment",
  //       })
  //       .end(pdfBuffer);
  //   })
  //   .catch((err) => {
  //     res.send({ success: false, error: err });
  //   });
};

exports.pdf_editor = async function ({ body: { query: document_id } }, res) {
  const [documentData] = await contract_model.getDocumentById(document_id);

  const [customer] = await settings_model.getCustomerById({
    cus_id: documentData.cus_id,
  });
  const [customer_owner] = await settings_model.getCustomerById({
    cus_id: documentData.cus_owner_id,
  });
  const attachedBuilding = await property_model.getBuildingByDocumentId({
    document_id: documentData.document_id,
  });

  const [branch] = await settings_model.getBranchById({
    branch_id: documentData.branch_id,
  });
  const building = await property_model.getBuildingByArrId({
    building_id: attachedBuilding.map(({ building_id }) => building_id),
  });

  const building_no = building.map(({ building_no }) => building_no);
  const buildingData = {
    building_no: building_no.join(","),
    deed_cus_sub_distict: building[0].deed_cus_sub_distict,
    deed_cus_district: building[0].deed_cus_district,
    deed_cus_province: building[0].deed_cus_province,
  };

  const data = {
    ...documentData,
    ...buildingData,
    ...branch,
    customer,
    customer_owner,
  };

  res.json(data);
};

exports.get_template = async function ({ params }, res) {
  const template = await pdf_model.get_template_by_id(params);
  res.status(200).json(template.length ? template[0] : {});
};
