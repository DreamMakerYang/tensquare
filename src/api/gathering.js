import request from '@/utils/request'
export default{
    getList(){
        return request({
            url:'/gathering',
            method:'get'
        });
    },

    search(page,size,searchMap){
        return request({
            url: `/gathering/search/${page}/${size}`,//ES6写法
            method: 'post',
            data: searchMap
        });
    },

    save(pojo){
        return request({
            url: `/gathering`,
            method: 'post',
            data: pojo
        })
    },

    findById(id){
        return request({
            url: `/gathering/${id}`,
            method: 'get'
        })
    },

    update(id,pojo){
        if(id == null || id == ''){
            return this.save(pojo)
        }
        return request({
            url: `/gathering/${id}`,
            method: 'put',
            data: pojo
        })
    },

    deleteById(id){
        return request({
            url:`/gathering/${id}`,
            method:'delete'
        })
    }
} 
