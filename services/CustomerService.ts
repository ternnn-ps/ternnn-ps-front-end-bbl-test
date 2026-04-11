import axios from "axios";
import { MasterCustomerCriteria, Customer } from "@/types/customer";

const BASE_URL = "http://localhost:8080";

export const CUSTOMER_API_PATH = {
  search: "/customer/search",
  create: "/customer/create",
  update: "/customer/update",
  delete: "/customer/delete",
};

export class CustomerService {

  async search(
  data: MasterCustomerCriteria,
  page: number = 0,
  size: number = 10,
  sort?: any[]
) {
  const paging = this.generatePagingStr(size, page, sort);

  const keywordParam = data?.keyword
    ? `&keyword=${encodeURIComponent(data.keyword)}`
    : "";

  const url = `${BASE_URL}${CUSTOMER_API_PATH.search}${paging}${keywordParam}`;

  try {
    const response = await axios.get(url); // ✅ FIXED
    return response.data;
  } catch (error) {
    console.error(error);
  }
}

  async create(data: Customer) {
    return axios.post(`${BASE_URL}${CUSTOMER_API_PATH.create}`, data)
      .then(res => res.data);
  }

  async update(data: Customer) {
    return axios.put(`${BASE_URL}${CUSTOMER_API_PATH.update}`, data)
      .then(res => res.data);
  }

  async delete(customerId: number) {
  return axios.post(
    `${BASE_URL}${CUSTOMER_API_PATH.delete}`,
    {
      userId: customerId
    }
  ).then(res => res.data);
}

  private generatePagingStr(size?: number, page?: number, sort?: any[]): string {
    let paging = "?";

    if (size !== undefined) paging += `size=${size}&`;
    if (page !== undefined) paging += `page=${page}&`;

    if (sort) {
      sort.forEach((s) => {
        paging += `sort=${s.field},${s.order === -1 ? "desc" : "asc"}&`;
      });
    }

    return paging.slice(0, -1);
  }
}