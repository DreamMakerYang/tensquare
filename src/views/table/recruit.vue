<template>
<div>
  <br>
  <el-form :inline="true">
          <el-form-item label="职位名称">
<el-input v-model="searchMap.jobname" placeholder="职位名称"></el-input></el-form-item>
          <el-form-item label="薪资范围">
<el-input v-model="searchMap.salary" placeholder="薪资范围"></el-input></el-form-item>
          <el-form-item label="经验要求">
<el-input v-model="searchMap.condition" placeholder="经验要求"></el-input></el-form-item>
          <el-form-item label="学历要求">
<el-input v-model="searchMap.education" placeholder="学历要求"></el-input></el-form-item>
          <el-form-item label="办公地址">
<el-input v-model="searchMap.address" placeholder="办公地址"></el-input></el-form-item>
          <el-form-item label="企业ID">
<el-input v-model="searchMap.eid" placeholder="企业ID"></el-input></el-form-item>
          <el-form-item label="创建日期">
<el-input v-model="searchMap.createtime" placeholder="创建日期"></el-input></el-form-item>
          <el-form-item label="状态">
<el-input v-model="searchMap.state" placeholder="状态"></el-input></el-form-item>
          <el-form-item label="网址">
<el-input v-model="searchMap.url" placeholder="网址"></el-input></el-form-item>
          <el-form-item label="标签">
<el-input v-model="searchMap.label" placeholder="标签"></el-input></el-form-item>
          <el-form-item label="职位描述">
<el-input v-model="searchMap.content1" placeholder="职位描述"></el-input></el-form-item>
          <el-form-item label="职位要求">
<el-input v-model="searchMap.content2" placeholder="职位要求"></el-input></el-form-item>

    <el-button type="primary" @click="fetchData()">查询</el-button>
    <el-button type="primary" @click="handleEdit('')">新增</el-button>
  </el-form>
  <el-table
    :data="list"
    border
    style="width: 100%">
          <el-table-column prop="id" label="ID" width="80"></el-table-column>
          <el-table-column prop="jobname" label="职位名称" width="80"></el-table-column>
          <el-table-column prop="salary" label="薪资范围" width="80"></el-table-column>
          <el-table-column prop="condition" label="经验要求" width="80"></el-table-column>
          <el-table-column prop="education" label="学历要求" width="80"></el-table-column>
          <el-table-column prop="type" label="任职方式" width="80"></el-table-column>
          <el-table-column prop="address" label="办公地址" width="80"></el-table-column>
          <el-table-column prop="eid" label="企业ID" width="80"></el-table-column>
          <el-table-column prop="createtime" label="创建日期" width="80"></el-table-column>
          <el-table-column prop="state" label="状态" width="80"></el-table-column>
          <el-table-column prop="url" label="网址" width="80"></el-table-column>
          <el-table-column prop="label" label="标签" width="80"></el-table-column>
          <el-table-column prop="content1" label="职位描述" width="80"></el-table-column>
          <el-table-column prop="content2" label="职位要求" width="80"></el-table-column>

    <el-table-column
      fixed="right"
      label="操作"
      width="100">
      <template slot-scope="scope">
        <el-button @click="handleEdit(scope.row.id)" type="text" size="small">修改</el-button>
        <el-button @click="handleDelete(scope.row.id)" type="text" size="small">删除</el-button>
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
        <el-form-item label="职位名称"><el-input v-model="pojo.jobname"></el-input></el-form-item>
        <el-form-item label="薪资范围"><el-input v-model="pojo.salary"></el-input></el-form-item>
        <el-form-item label="经验要求"><el-input v-model="pojo.condition"></el-input></el-form-item>
        <el-form-item label="学历要求"><el-input v-model="pojo.education"></el-input></el-form-item>
        <el-form-item label="任职方式">
          <template>
            <el-radio v-model="pojo.type" label="1">全职</el-radio>
            <el-radio v-model="pojo.type" label="2">兼职</el-radio>
          </template>
        </el-form-item>
        <el-form-item label="办公地址"><el-input v-model="pojo.address"></el-input></el-form-item>
        <el-form-item label="企业">         
         
            <el-select v-model="pojo.eid" filterable placeholder="请选择">
              <el-option
                v-for="item in enterpriseList"
                :key="item.id"
                :label="item.name"
                :value="item.id">
              </el-option>
            </el-select>
          
          </el-form-item>
       
        <el-form-item label="状态">
          <el-switch v-model="pojo.state" active-value="1" inactive-value="0"></el-switch>
        </el-form-item>
        <el-form-item label="网址"><el-input v-model="pojo.url"></el-input></el-form-item>
        <el-form-item label="标签"><el-input v-model="pojo.label"></el-input></el-form-item>
        <el-form-item label="职位描述"><el-input v-model="pojo.content1"></el-input></el-form-item>
        <el-form-item label="职位要求"><el-input v-model="pojo.content2"></el-input></el-form-item>

        <el-button type="primary" @click="handleSave()">保存</el-button>
        <el-button @click="dialogFormVisible = false" >关闭</el-button>

    </el-form>
  </el-dialog>
</div>
</template>
<script>
import recruitApi from '@/api/recruit'
import enterpriseApi from '@/api/enterprise'
export default {
  data() {
    return {
      list: [],
      total: 0, // 总记录数
      currentPage: 1, // 当前页
      pageSize: 10, // 每页大小
      searchMap: {}, // 查询条件
      dialogFormVisible: false, // 编辑窗口是否可见
      pojo: {}, // 编辑表单绑定的实体对象
      cityList: [], // 城市列表
      id: '', // 当前用户修改的ID
      enterpriseList: [] //企业列表
    }
  },
  created() {
    this.fetchData()
    //加载企业列表
    enterpriseApi.getList().then( response => {
      if(response.flag){
        this.enterpriseList=response.data
      }
    })

  },
  methods: {
    fetchData() {
      recruitApi.search(this.currentPage, this.pageSize, this.searchMap).then(response => {
        this.list = response.data.rows
        this.total = response.data.total
      })
    },
    handleSave() {
      recruitApi.update(this.id, this.pojo).then(response => {
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
        recruitApi.findById(id).then(response => {
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
        recruitApi.deleteById(id).then(response => {
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
