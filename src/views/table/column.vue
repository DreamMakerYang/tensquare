<template>
<div>
  <br>
  <el-form :inline="true">
          <el-form-item label="专栏名称">
<el-input v-model="searchMap.name" placeholder="专栏名称"></el-input></el-form-item>
          <el-form-item label="专栏简介">
<el-input v-model="searchMap.summary" placeholder="专栏简介"></el-input></el-form-item>
          <el-form-item label="用户ID">
<el-input v-model="searchMap.userid" placeholder="用户ID"></el-input></el-form-item>
          <el-form-item label="申请日期">
<el-input v-model="searchMap.createtime" placeholder="申请日期"></el-input></el-form-item>
          <el-form-item label="审核日期">
<el-input v-model="searchMap.checktime" placeholder="审核日期"></el-input></el-form-item>
          <el-form-item label="状态">
<el-input v-model="searchMap.state" placeholder="状态"></el-input></el-form-item>

    <el-button type="primary" @click="fetchData()">查询</el-button>
    <el-button type="primary" @click="handleEdit('')">新增</el-button>
  </el-form>
  <el-table
    :data="list"
    border
    style="width: 100%">
          <el-table-column prop="id" label="ID" width="80"></el-table-column>
          <el-table-column prop="name" label="专栏名称" width="200"></el-table-column>
          <el-table-column prop="summary" label="专栏简介" width="380"></el-table-column>
          <el-table-column prop="userid" label="用户ID" width="80"></el-table-column>
          <el-table-column prop="createtime" label="申请日期" width="80"></el-table-column>
          <el-table-column prop="checktime" label="审核日期" width="80"></el-table-column>
          <el-table-column prop="state" label="状态" width="50"></el-table-column>

    <el-table-column
      fixed="right"
      label="操作"
      width="100">
      <template slot-scope="scope">
        <el-button @click="handleExamine(scope.row.id)" type="text" size="small">审核</el-button>
      </template>
    </el-table-column>
  </el-table>
      <el-pagination
      @size-change="fetchData"
      @current-change="fetchData"
      :current-page="currentPage"
      :page-sizes="[5,10,20]"
      :page-size="10"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total">
    </el-pagination>  
  <el-dialog title="编辑" :visible.sync="dialogFormVisible">
    <el-form label-width="80px">
        <el-form-item label="专栏名称"><el-input v-model="pojo.name"></el-input></el-form-item>
        <el-form-item label="专栏简介"><el-input v-model="pojo.summary"></el-input></el-form-item>
        <el-form-item label="用户ID"><el-input v-model="pojo.userid"></el-input></el-form-item>
        <el-form-item label="申请日期"><el-input v-model="pojo.createtime"></el-input></el-form-item>
        <el-form-item label="审核日期"><el-input v-model="pojo.checktime"></el-input></el-form-item>
        <el-form-item label="状态"><el-input v-model="pojo.state"></el-input></el-form-item>

        <el-button type="primary" @click="handleSave()">保存</el-button>
        <el-button @click="dialogFormVisible = false" >关闭</el-button>
    </el-form>
  </el-dialog>
</div>
</template>
<script>
import columnApi from '@/api/column'
export default {
  data() {
    return {
      list: [],
      total: 0, // 总记录数
      currentPage: 1, // 当前页
      pageSize: 10, // 每页大小
      searchMap: {state:'0'}, // 查询条件
      dialogFormVisible: false, // 编辑窗口是否可见
      pojo: {}, // 编辑表单绑定的实体对象
      cityList: [], // 城市列表
      id: '' // 当前用户修改的ID
    }
  },
  created() {
    this.fetchData()
  },
  methods: {
    fetchData() {
      columnApi.search(this.currentPage, this.pageSize, this.searchMap).then(response => {
        this.list = response.data.rows
        this.total = response.data.total
      })
    },
    handleSave() {
      columnApi.update(this.id, this.pojo).then(response => {
        this.$message({
          message: response.message,
          type: (response.flag ? 'success' : 'error')
        })
        if (response.flag) { // 如果成功
          this.fetchData() // 刷新列表
        }
      })
      this.dialogFormVisible = false // 关闭窗口
    },
    handleEdit(id) {
      this.id = id
      this.dialogFormVisible = true // 打开窗口
      if (id !== '') { // 修改
        columnApi.findById(id).then(response => {
          if (response.flag) {
            this.pojo = response.data
          }
        })
      } else {
        this.pojo = {} // 清空数据
      }
    },
    handleDelete(id) {
      this.$confirm('确定要删除此纪录吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        columnApi.deleteById(id).then(response => {
          this.$message({ message: response.message, type: (response.flag ? 'success' : 'error') })
          if (response.flag) {
            this.fetchData() // 刷新数据
          }
        })
      })
    },
    handleExamine(id){
      this.$confirm('确定要审核此纪录吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        columnApi.examine(id).then(response => {
          this.$message({ message: response.message, type: (response.flag ? 'success' : 'error') })
          if (response.flag) {
            this.fetchData() // 刷新数据
          }
        })
      })      
    }
  }
}
</script>
