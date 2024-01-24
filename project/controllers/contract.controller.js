const contract_model = require("../models/contract.model");

// ** Returns paginated array
const paginateArray = (array, perPage, page) =>
  array.slice((page - 1) * perPage, page * perPage);

exports.customer_search = async function ({ body: { query } }, res) {
  const customers = await contract_model.customer_search(query);
  res.status(200).json(customers);
};

exports.getCustomer = async function ({ body }, res) {
  const customers = await contract_model.customers();

  const { sort, q, sortColumn, page, perPage, status } = body;

  const dataAsc = customers.sort((a, b) =>
    a[sortColumn] < b[sortColumn] ? -1 : 1
  );

  const dataToFilter = sort === "asc" ? dataAsc : dataAsc.reverse();

  const queryLowered = q.toLowerCase();

  const filteredData = dataToFilter.filter((customer) => {
    return (
      (String(customer.cus_number).toLowerCase().includes(queryLowered) ||
        customer.cus_company.toLowerCase().includes(queryLowered) ||
        customer.cus_address.toLowerCase().includes(queryLowered) ||
        customer.cus_subDistict.toLowerCase().includes(queryLowered) ||
        customer.cus_district.toLowerCase().includes(queryLowered) ||
        customer.cus_province.toLowerCase().includes(queryLowered) ||
        customer.cus_zipcode.toLowerCase().includes(queryLowered) ||
        customer.cus_taxid.toLowerCase().includes(queryLowered)) &&
      String(customer.cus_park_id) === (status || String(customer.cus_park_id))
    );
  });

  res.status(200).json({
    total: filteredData.length,
    customers:
      filteredData.length <= perPage
        ? filteredData
        : paginateArray(filteredData, perPage, page),
  });
};
//////////////////////////////

exports.getDocuments = async function ({ body }, res) {
  const documents = await contract_model.getDocuments();
  const { sort, q, sortColumn, page, perPage, status } = body;
  const dataAsc = documents.sort((a, b) =>
    a[sortColumn] < b[sortColumn] ? -1 : 1
  );
  const dataToFilter = sort === "asc" ? dataAsc : dataAsc.reverse();
  const queryLowered = q.toLowerCase();
  const filteredData = dataToFilter.filter((document) => {
    return (
      document.document_id.toString().includes(queryLowered) ||
      document.document_full_no.toString().includes(queryLowered)
    );
  });
  res.status(200).json({
    total: filteredData.length,
    documents:
      filteredData.length <= perPage
        ? filteredData
        : paginateArray(filteredData, perPage, page),
  });
};
exports.addDocument = async function ({ body }, res) {
  const {
    affectedRows = 0,
    sqlMessage = "",
    insertId = 0,
  } = await contract_model.addDocument(body);
  if (insertId) {
    if (body.building_id !== undefined) {
      body.building_id.map(async (item) => {
        await contract_model.addAttachedBuilding({
          building_id: item,
          document_id: insertId,
        });
      });
    }
  }
  res.status(200).json({
    affectedRows,
    sqlMessage,
  });
};

exports.editDocument = async function ({ body }, res) {
  const { affectedRows = 0, sqlMessage = "" } =
    await contract_model.editDocument(body);
  if (affectedRows) {
    if (body.contract_type_id == 1) {
      await contract_model.manageAttachedBuilding(body);
    }
    // body.building_id.map(async (item) => {
    //   await contract_model.addAttachedBuilding({
    //     building_id: item,
    //     document_id: body.document_id,
    //   });
    // });
  }
  res.status(200).json({
    affectedRows,
    sqlMessage,
  });
};

exports.getDocumentById = async function ({ body }, res) {
  const [document] = await contract_model.getDocumentById(body);
  const attched = await contract_model.getAttachedBuildingById(body);
  const { contract_type_id } = document;
  if (contract_type_id == 1) {
    document.building_id = attched.map(({ building_id }) => building_id);
  } else {
    // const [document] = await this.getDocumentById({
    //   document_id,
    // });
    // document.document_id = document_id;
  }
  res.status(200).json({
    document,
  });
};

//////////////////////////////

exports.getAttachedBuildingById = async function ({ body }, res) {
  const attched = await contract_model.getAttachedBuildingById(body);
  res.status(200).json({
    attched,
  });
};
