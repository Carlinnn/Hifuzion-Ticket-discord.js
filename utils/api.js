const api = require("axios").default.create({
  baseURL: "http://127.0.0.1:3333"
});

const Messages = {
  send: (data) => {
    return api.post(`/messages?from=DIS`, data).then((res) => res.data);
  }
};
const Clients = {
  getClients: () => {
    return api.get("/clients").then((res) => res.data);
  },

  getClient: (id) => {
    return api.get(`/clients/${id}`).then((res) => res.data);
  },

  getClientOrder: (id) => {
    return api.get(`/clients/${id}/order`).then((res) => res.data);
  },

  updateClient: (id, data) => {
    return api.put(`/clients/${id}`, data).then((res) => res.data);
  },

  createClient: (data) => {
    return api.post("/clients", data).then((res) => res.data);
  },

  deleteClient: (id) => {
    return api.delete(`/clients/${id}`).then((res) => res.data);
  }
};

const Orders = {
  getOrders: () => {
    return api.get("/orders").then((res) => res.data);
  },

  getOrder: (data) => {
    return api.get(`/orders/search`, data).then((res) => res.data);
  },

  updateOrder: (data) => {
    return api.put(`/orders`, data).then((res) => res.data);
  },

  createOrder: (data) => {
    return api.post("/orders", data).then((res) => res.data);
  },

  deleteOrder: (id) => {
    return api.delete(`/orders/${id}`).then((res) => res.data);
  }
};

const Supporters = {
  getSupporters: () => {
    return api.get("/supporters").then((res) => res.data);
  },

  getSupporter: (data) => {
    return api.get(`/supporters/search`, data).then((res) => res.data);
  },

  updateSupporter: (data) => {
    return api.put(`/supporters`, data).then((res) => res.data);
  },

  createSupporter: (data) => {
    return api.post("/supporters", data).then((res) => res.data);
  },

  deleteSupporter: (id) => {
    return api.delete(`/supporters/${id}`).then((res) => res.data);
  }
};

module.exports = { Clients, Orders, Messages, Supporters };
