import axios from "axios";
import { URL } from "@/config";
const API_URL = URL + "api/member/";

class MemberService {
  // 小幫手頁route
  getHelperInfo(user_id) {
    // console.log(user_id);
    return axios.get(API_URL + "helper", { params: { user_id } });
  }
  handleHelperValid(valid, user_id) {
    // const valid = true;
    // console.log(valid);
    return axios.patch(API_URL + "helper/valid", { valid, user_id });
  }
  handleHelperEdit(formData) {
    return axios.put(API_URL + "/helper", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
  }

  // reserve頁route
  getReserve(user_id, status) {
    // const user = 1;
    return axios.get(API_URL + "reserve", {
      params: { user_id, status },
    });
  }

  // selling頁route
  getSelling(user_id, status) {
    // const user = 1;
    return axios.get(API_URL + "selling", {
      params: { user_id, status },
    });
  }

  // selling & reserve detail頁
  getReserveDetail(oid) {
    return axios.get(`${API_URL}reserve/detail/${oid}`);
  }
  setReserveStatus(oid, status) {
    console.log(status);
    return axios.patch(API_URL + "reserve/detail/status", {
      oid,
      status,
    });
  }
  createReview(case_id, user_id, helper_id, review_content, star_rating) {
    return axios.post(API_URL + "reserve/review", {
      case_id,
      user_id,
      helper_id,
      review_content,
      star_rating,
    });
  }
  getReview(case_id) {
    return axios.get(API_URL + "reserve/review", {
      params: { case_id },
    });
  }
}
export default new MemberService();
