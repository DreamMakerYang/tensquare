import { Message } from 'element-ui'
export default {
    handlerShowMessage(obj, vue) {
        obj.then(resp =>{
            if(resp.flag === true){
                Message({
                    message: resp.message,
                    type: 'success'
                });
                vue.loadData();
                vue.dialogFormVisible = false; // 成功关闭窗口
            }else{
                Message({
                    message: resp.message,
                    type: 'error'
                })
            }
        })
    }
}