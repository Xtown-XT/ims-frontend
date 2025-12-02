import api from "../../services/api";

const masterService = {
  getWarehouses: () =>
    api.get("/warehouse/getAllwarehouse"),

  getStores: () =>
    api.get("/store/getAllStores"),

  getProducts: () =>
    api.get("/product/getAllProducts"),
};

export default masterService;
