import asyncHandler from "express-async-handler";
import Client from "./ClientModel.js";
import checkRequired from "../../utils/checkRequired.js";

// @desc    Fetch all clients
// @route   GET /api/clients
// @access  Public
const getClients = asyncHandler(async (req, res) => {
  const pageSize = Number(process.env.LIMIT) || 10;
  const page = Number(req.query.pageNumber) || 1;
  let searchParams = {};
  searchParams["published_status"] = "PUBLISHED";
  console.log(req.query);
  if (req.query.search) {
    const searchQ = req.query.search;
    const newQData = {};
    Object.keys(searchQ).map((item) => {
      newQData[item] = {
        $regex: searchQ[item],
        $options: "i",
      };
    });
    searchParams = { ...searchParams, ...newQData };
  }
  if (req.query.exact) {
    const exactQ = req.query.exact;
    searchParams = { ...searchParams, ...exactQ };
  }
  if (req.query.conditional) {
    const conditionalQ = req.query.conditional;
    searchParams = { ...searchParams, ...conditionalQ };
  }
  console.log("searchParams", searchParams);
  const count = await Client.countDocuments({ ...searchParams });
  const clients = await Client.find({ ...searchParams })
    .limit(pageSize)
    .populate("created_by", "_id, name")
    .populate("updated_by", "_id, name")
    .skip(pageSize * (page - 1))
    .sort({ createdAt: -1 });

  res.json({ clients, page, pages: Math.ceil(count / pageSize), count: count });
});
// @desc    Fetch all clients
// @route   GET /api/clients/all
// @access  Public
const getAllClients = asyncHandler(async (req, res) => {
  const page = Number(req.query.pageNumber) || 1;
  let searchParams = {};
  searchParams["published_status"] = "PUBLISHED";
  if (req.query.term && req.query.value) {
    // searchParams[req.query.term] = req.query.value;
    searchParams[req.query.term] = {
      $regex: req.query.value,
      $options: "i",
    };
  }
  console.log(searchParams);
  const clients = await Client.find({ ...searchParams })
    .limit(100)
    .skip(100 * (page - 1))
    .sort({ createdAt: -1 });
  res.json(clients);
});

// @desc    Fetch single client
// @route   GET /api/clients/:id
// @access  Public
const getClientById = asyncHandler(async (req, res) => {
  const client = await Client.findById(req.params.id)
    .populate("created_by", "_id, name")
    .populate("updated_by", "_id, name");

  if (client && client.published_status === "PUBLISHED") {
    res.json(client);
  } else {
    res.status(404);
    throw new Error("Client not found");
  }
});

// @desc    Delete a client
// @route   DELETE /api/clients/:id
// @access  Private/Admin
const deleteClient = asyncHandler(async (req, res) => {
  const client = await Client.findById(req.params.id);

  if (client) {
    await client.remove();
    res.json({ message: "Client removed" });
  } else {
    res.status(404);
    throw new Error("Client not found");
  }
});

// @desc    Create a client
// @route   POST /api/clients
// @access  Private/Admin
const createClient = asyncHandler(async (req, res) => {
  try {
    var data = checkRequired(req.body);
    data.created_by = req.user._id;
    const client = new Client(data);
    const createdClient = await client.save();
    res.status(201).json(createdClient);
  } catch (error) {
    res.status(502);
    throw new Error("Something Went Wrong. Please try again");
  }
});

// @desc    Update a client
// @route   PUT /api/clients/:id
// @access  Private
const updateClient = asyncHandler(async (req, res) => {
  var feed = checkRequired(req.body);
  feed.updated_by = req.user._id;
  const data = await Client.findById(req.params.id);
  if (data) {
    Object.keys(feed).map((item, index) => {
      data[item] = feed[item];
    });
    const updatedClient = await data.save();
    res.json(updatedClient);
  } else {
    res.status(404);
    throw new Error("Client not found");
  }
});

export {
  getClients,
  getClientById,
  deleteClient,
  createClient,
  updateClient,
  getAllClients,
};
