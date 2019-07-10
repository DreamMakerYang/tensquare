import request from '@/utils/request'
export default {
    getList(){
        return request({
            url: '/city',
            method:'get'
        });
    }
}