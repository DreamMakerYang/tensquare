<template>
  <div>
    <br>
    <el-form :inline="true" >
      <el-form-item label="活动名称">
        <el-input v-model="searchMap.name"></el-input>
      </el-form-item>
      <el-form-item label="活动日期">
        <el-date-picker
          v-model="searchMap.starttime_1"
          type="date"
          placeholder="选择开始日期">
        </el-date-picker>
        <el-date-picker
          v-model="searchMap.starttime_2"
          type="date"
          placeholder="选择结束日期">
        </el-date-picker>
      </el-form-item>
      <el-button @click="fetchDate()" type="primary" plain>搜索</el-button>
      <el-button @click="dialogVisible = true;pojo={};id=''" type="primary" plain>新增</el-button>
    </el-form>

    <el-table
      :data="list"
      border
      style="width: 100%">
      <el-table-column
        prop="id"
        label="活动ID"
        width="180">
      </el-table-column>
      <el-table-column
        prop="name"
        label="活动名称"
        width="180">
      </el-table-column>
      <el-table-column
        prop="sponsor"
        label="主办方">
      </el-table-column>
      <el-table-column
        prop="address"
        label="活动地址">
      </el-table-column>
      <el-table-column
        prop="starttime"
        label="开始日期">
      </el-table-column>
      <el-table-column
        prop="endtime"
        label="结束日期">
      </el-table-column>
        <el-table-column
        fixed="right"
        label="操作"
        width="100">
        <template slot-scope="scope">
          <el-button @click="handleEdit(scope.row.id)" type="text" size="small">修改</el-button>
          <el-button @click="handleDel(scope.row.id)" type="text" size="small">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      @size-change="fetchDate"
      @current-change="fetchDate"
      :page-sizes="[5, 10, 20]"
      :page-size="10"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total">
    </el-pagination>

    <!-- 弹出窗口 -->
    <el-dialog
      title="编辑" 
      :visible.sync="dialogVisible"
      width="30%"
      >
      <el-form label-width="80px">
        <el-form-item label="活动名称">
          <el-input v-model="pojo.name" placeholder="活动名称"></el-input>
        </el-form-item>
        <el-form-item label="基本地址">
          <el-input v-model="pojo.address" placeholder="基本地址"></el-input>
        </el-form-item>
        <el-form-item label="开始日期">
          <el-date-picker type="date" v-model="pojo.starttime" placeholder="开始日期"></el-date-picker>
        </el-form-item>
        <el-form-item label="截止日期">
          <el-date-picker type="date" v-model="pojo.endtime" placeholder="截止日期"></el-date-picker>
        </el-form-item>
        <el-form-item label="报名截止">
          <el-date-picker type="date" v-model="pojo.enrolltime" placeholder="报名截止"></el-date-picker>
        </el-form-item>
        <el-form-item label="活动详情">
          <el-input type="textarea" :autosize="{ minRows: 2, maxRows: 4}" v-model="pojo.detail" placeholder="活动详情"></el-input>
        </el-form-item>
        <el-form-item label="选择城市">
          <el-select v-model="pojo.city" placeholder="请选择">
            <el-option
              v-for="item in cityList"
              :key="item.value"
              :label="item.name"
              :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="是否可见">
          <el-switch active-value=1 inactive-value=0 v-model="pojo.state"></el-switch>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">关 闭</el-button>
        <el-button type="primary" @click="handleSave()">保 存</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import gatheringApi from '@/api/gathering'
import cityApi from '@/api/city'

export default {
    data(){
        return {
            list:[],
            total: 0,
            currentPage: 1,
            pageSize: 10,
            searchMap: {},
            dialogVisible: false, //编辑窗口是否可见
            pojo:{},//编辑实体
            cityList:[],
            id: ''//当前用户修改的id
        }
    },
    created () {
        this.fetchDate();
        cityApi.getList().then(response =>{
          this.cityList = response.data
        })
    },
    methods: {
        fetchDate(){
            gatheringApi.search(this.currentPage,this.pageSize,this.searchMap).then(response =>{
                this.total = response.data.total
                this.list = response.data.rows
            })
        },
        // fetchDate(){
        //     gatheringApi.getList().then(response =>{
        //         this.list = response.data
        //     })
        // }
        handleSave(){
          gatheringApi.update(this.id,this.pojo).then(response =>{
            this.$message({
              message: response.message,
              type: (response.flag ? 'success':'error')
            });
            if(response.flag){//如果成功
              this.fetchDate()//刷新页面
            }
          })
            
          this.dialogVisible = false // 关闭窗口
        },

        handleEdit(id){
          this.id = id
          this.dialogVisible = true // 打开窗口
          gatheringApi.findById(id).then(response =>{
            if(response.flag){
              this.pojo = response.data
            }
          })
        },

        handleDel(id){
            this.$confirm('您确定要删除此记录吗?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            gatheringApi.deleteById(id).then(response =>{
              this.$message({
                message: response.message,
                type: (response.flag ? 'success':'error')
              });
              if(response.flag){
                this.fetchDate()
              }
            })
          }).catch(() => {
                
          });
          
        }
    }
}
</script>

