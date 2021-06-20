import axios from 'axios';

export const getOrderitems = (orderID) => {
  return axios.get(`/api/orderitems/${orderID}`);
};
