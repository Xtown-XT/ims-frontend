import api from "../../services/api.js"

const giftcardsService = {
  createGiftCard: (data) => api.post('/gift/creategiftcard', data),
  getGiftCards: (params) => api.get('/gift/getAllgiftcards', { params }),
  updateGiftCard: (id, data) => api.put(`/gift/updategiftcard/${id}`, data),
  deleteGiftCard: (id) => api.delete(`/gift/deletegiftcard/${id}`)
}

export default giftcardsService;
