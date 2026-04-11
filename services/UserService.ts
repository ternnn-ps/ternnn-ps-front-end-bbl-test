import { User, UserCriteria } from "@/types/user";
import axios from "axios";

const BASE_URL = "http://localhost:8080";

export const USER_API_PATH = {
  search: "/user/search",
  create: "/user/create",
  update: "/user/update",
  delete: "/user/delete",
};

export class UserService {

  async search(
  data: UserCriteria,
  page: number = 0,
  size: number = 10,
  sort?: any[]
) {
  const paging = this.generatePagingStr(size, page, sort);

  const keywordParam = data?.keyword
    ? `&keyword=${encodeURIComponent(data.keyword)}`
    : "";

  const url = `${BASE_URL}${USER_API_PATH.search}${paging}${keywordParam}`;

  try {
    const response = await axios.get(url);
    return response.data;
  } catch (error) {
    console.error(error);
  }
}

  async create(data: User) {
    return axios.post(`${BASE_URL}${USER_API_PATH.create}`, data)
      .then(res => res.data);
  }

  async update(data: User) {
    return axios.put(`${BASE_URL}${USER_API_PATH.update}`, data)
      .then(res => res.data);
  }

  async delete(userId: number) {
  return axios.post(
    `${BASE_URL}${USER_API_PATH.delete}`,
    {
      userId: userId
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