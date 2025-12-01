
import api from "../../services/api";

const printqrcodeService={
    createqrcode:(data)=>api.post("/qrcode/createQRCode",data),
    getQrcodes: () => api.get("/qrcode/getAllQRCodes")

}

export default printqrcodeService;