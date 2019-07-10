<template>
  <section>
      <el-row>
          <el-col :span="6">
            <!-- 新增按钮 -->
            <span>
                <el-button type="primary" round style="margin:10px" @click="handleAdd">
                    <i class="el-icon-plus"/>
                </el-button>
            </span>
          </el-col>
          <el-col :span="18">
            <!-- 查询表单 -->
            <el-form :inline="true" class="demo-form-inline" style="margin:10px;height:45px" >
                <el-form-item label="活动名称">
                    <el-input v-model="searchMap.name" placeholder="活动名称"></el-input>
                </el-form-item>
                <el-form-item label="活动日期">
                    <el-date-picker type="date" placeholder="选择开始日期" v-model="searchMap.starttime"></el-date-picker>
                    <el-date-picker type="date" placeholder="选择截止日期" v-model="searchMap.endtime"></el-date-picker>
                </el-form-item>
                <el-button type="primary" @click="loadData">查询</el-button>
            </el-form>
          </el-col>
      </el-row>
    <el-row>
      <el-col :span="24">
        <!--表格-->
        <el-table :data="list" border style="width: 100%">
          <el-table-column type="selection"></el-table-column>
          <el-table-column prop="id" label="ID" width="80"></el-table-column>
          <el-table-column prop="name" label="活动名称" width="180"></el-table-column>
          <el-table-column prop="address" label="活动地址"></el-table-column>
          <el-table-column prop="starttime" label="开始日期"></el-table-column>
          <el-table-column prop="endtime" label="截止日期"></el-table-column>
          <el-table-column label="操作">
              <template slot-scope="scope">
                <el-button @click="handleEdit(scope.row.id)" type="warning" icon="el-icon-edit" circle size="small"></el-button>
                <el-button @click="handleRemove(scope.row.id)" type="danger" icon="el-icon-delete" circle size="small"></el-button>
              </template>
          </el-table-column>
        </el-table>
        <!--增加分页栏-->
        <div class="block">
            <el-pagination 
                    @current-change="loadData"
                    :current-page="currentPage"
                    :page-size="10"
                    layout="prev, pager, next, jumper"
                    :total="total"></el-pagination>
        </div>
      </el-col>
    </el-row>
    <!-- 添加或编辑窗口 -->
  <el-dialog title="编辑" :visible.sync="dialogFormVisible">
      <el-form ref="form" :model="pojo" label-width="80px">
          <el-form-item label="活动名称">
            <el-input v-model="pojo.name"></el-input>
          </el-form-item>
          <el-form-item label="基本地点">
              <el-input v-model="pojo.address"></el-input>
          </el-form-item>
          <el-form-item label="开始日期">
              <el-date-picker type="date" placeholder="选择日期" v-model="pojo.starttime"></el-date-picker>
          </el-form-item>
          <el-form-item label="截止日期">
              <el-date-picker type="date" placeholder="选择日期" v-model="pojo.endtime"></el-date-picker>
          </el-form-item>
          <el-form-item label="报名截止">
              <el-date-picker type="date" placeholder="选择日期" v-model="pojo.enrolltime"></el-date-picker>
          </el-form-item>
          <el-form-item label="活动详情">
              <el-input v-model="pojo.detail" type="textarea"></el-input>
          </el-form-item>
          <el-form-item label="城市">
            <el-select v-model="pojo.city" placeholder="请选择">
                <el-option v-for="city in cityList" :key="city.id" :label="city.name" :value="city.id"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="是否可见" prop="delivery">
            <el-switch on-text="" off-text=""  active-value="1" inactive-value="0" v-model="pojo.status"></el-switch>
          </el-form-item>
          <el-form-item>
              <el-button type="primary" @click="handleSave">修改</el-button>
              <el-button @click="dialogFormVisible = false">取消</el-button>
          </el-form-item>
      </el-form>
  </el-dialog>
  </section>
  
</template>

<script>
import gathering from "@/api/gathering";
import city from "@/api/city";
import message from "@/utils/message";

export default {
  data() {
    return {
      list: null, // 活动数据
      listLoading: true, // 是否还在加载
      currentPage: 1, // 当前页
      total: 0, // 总条数
      searchMap: {}, // 查询条件
      dialogFormVisible: false, // 是否显示编辑窗口
      pojo: {}, // 活动实体类
      cityList: [], // 城市列表
      id: '' // 活动id
    };
  },
  created() {
    this.loadData(); // 加载活动数据
    this.loadCityData(); // 加载城市数据
  },
  methods: {
    // 加载活动数据
    loadData() {
      this.listLoading = true;
      gathering.search(this.currentPage, 10, this.searchMap).then(resp => {
        if (resp.flag == true) {
          this.list = resp.data.rows;
          this.total = resp.data.total;
        }
        this.listLoading = false;
      });
    },
    // 增加按钮事件
    handleAdd(){
        this.dialogFormVisible = true;
    },
    // 编辑按钮事件
    handleEdit(id){
        this.dialogFormVisible = true;
        this.id = id;
        if(this.id != ''){
            gathering.findById(this.id).then(resp => {
                if(resp.flag == true){
                    this.pojo = resp.data;
                }
            })
        }else{
            this.pojo = {}; // 清空表单
        }
    },
    // 保存表单数据按钮
    handleSave(){
        if(this.id != ''){
            // 抽取回调提示
            message.handleShowMessage(gathering.update(this.id,this.pojo),this);
        }else{
            message.handleShowMessage(gathering.save(this.pojo),this);
        }
    },
    // 删除按钮事件
    handleRemove(id){
        this.$confirm('确定要删除吗？','提示',{
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
        }).then(()=>{
            if(id != ''){
                // 抽取回调提示
                message.handleShowMessage(gathering.deleteById(id),this);
            } 
        })
    },
    // 已提取出去作单独的工具
    handleShowMessage(resp){
        if(resp.flag == true){
            this.$message({
                message: resp.message,
                type: 'success'
            });
            this.loadData(); // 重新刷新列表
            this.dialogFormVisible = false; // 关闭窗口
        }else{
            this.$message({
                message: resp.message,
                type:'error'
            });
        }
    },
    // 加载城市数据
    loadCityData(){
        city.getList().then(resp => {
            this.cityList = resp.data;
        })
    }
  }
};
</script>
