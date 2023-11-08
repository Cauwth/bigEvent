<script setup>
import { Edit, Delete } from '@element-plus/icons-vue'
import { ref } from 'vue'
import ChannelSelect from '@/views/article/components/ChannelSelect.vue'
import ArticleEdit from './components/ArticleEdit.vue'
import { articleGetListService } from '@/api/article'
import { formatTime } from '@/utils/format'

// 定义请求参数:内容根据接口来
const params = ref({
  pagenum: 1, // 当前页面号码
  pagesize: 5, // 页面行数
  cate_id: '', // 传子 接收子传 并给后台传参（选择分类）
  state: '' // 同上
})
const loading = ref(false)

// 进入页面发请求获取数据
const articleList = ref([]) // 文章列表
const total = ref(11) // 文章条数
const getArticleList = async () => {
  loading.value = true
  const res = await articleGetListService(params.value)
  console.log(res.data)
  articleList.value = res.data.data
  total.value = res.data.total
  loading.value = false
}
getArticleList()

// 分页相关
const onSizeChange = (size) => {
  //每页条数变化,从第一页开始渲染
  params.value.pagenum = 1
  params.value.pagesize = size
  getArticleList()
}
const onCurrentChange = (num) => {
  //页面号码变化
  params.value.pagenum = num
  getArticleList()
}

// 操作相关逻辑
// 搜索
const onSearch = () => {
  params.value.pagenum = 1
  // 用已更新的params进行查询(cate_id和state已通过v-model绑定)
  getArticleList()
}
// 重置
const onReset = () => {
  params.value.pagenum = 1
  params.value.cate_id = ''
  params.value.state = ''
  getArticleList()
}

// 文章抽屉组件
const articleEditRef = ref() // 通过ref= 绑定虚拟dom进行组件方法调用
const onAddArticle = () => {
  //
  articleEditRef.value.open({})
}
const onEditArticle = (row) => {
  // 发请求
  articleEditRef.value.open(row)
}
const onDelArticle = () => {
  //
}

// 监听的添加/编辑成功
const onSuccess = (type) => {
  if (type === 'add') {
    // 添加成功
    params.value.pagenum = 1
    getArticleList()
  } else {
    // 编辑成功
    getArticleList()
  }
}
</script>

<template>
  <!-- 导入使用组件 -->
  <page-container title="文章管理">
    <!-- 填充具名插槽：给一个按钮 -->
    <template #extra>
      <el-button type="primary" @click="onAddArticle">添加文章</el-button>
    </template>
    <!-- 主体部分 ：填充在默认插槽中-->
    <!-- 表单区域 -->
    <el-form inline>
      <el-form-item label="文章分类">
        <ChannelSelect v-model="params.cate_id"></ChannelSelect>
      </el-form-item>
      <el-form-item label="发布状态">
        <!-- 通过v-model绑定params中的state -->
        <el-select v-model="params.state">
          <el-option label="已发布" value="已发布"></el-option>
          <el-option label="草稿" value="草稿"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="onSearch">搜索</el-button>
        <el-button @click="onReset">重置</el-button>
      </el-form-item>
    </el-form>
    <!-- 表格区域 -->
    <el-table :data="articleList" v-loading="loading">
      <!-- 有操作:在template里渲染  加链接 ：默认作用域插槽，对row操作，结构出title-->
      <el-table-column label="文章标题">
        <template #default="{ row }">
          <el-link>{{ row.title }}</el-link>
        </template>
      </el-table-column>
      <!-- 不做操作只渲染 prop -->
      <el-table-column label="分类" prop="cate_name"></el-table-column>
      <!-- 有操作 ：默认作用域插槽，对row操作，结构出pub_date -->
      <el-table-column label="发表时间" prop="pub_date">
        <template #default="{ row }">
          {{ formatTime(row.pub_date) }}
        </template>
      </el-table-column>
      <el-table-column label="状态" prop="state"></el-table-column>
      <el-table-column label="操作">
        <template #default="{ row }">
          <el-button
            :icon="Edit"
            circle
            plain
            type="primary"
            @click="onEditArticle(row)"
          ></el-button>
          <el-button
            :icon="Delete"
            circle
            plain
            type="danger"
            @click="onDelArticle(row)"
          ></el-button>
        </template>
      </el-table-column>
      <!-- element内置插槽 ：空插槽 -->
      <template #empty>
        <el-empty description="没有数据" />
      </template>
    </el-table>
    <!-- 分页区域 
         1.current-page 当前页面号码
         2.v-model:page-size  当前每页条数
         3.:page-sizes 可选每页条数（需要包含 当前）
         4.background 
         5.layout 控制组件
         6.函数：@size-change 每页条数变化
                @current-change 页面号码变化
                不需要传参
    -->
    <el-pagination
      v-model:current-page="params.pagenum"
      v-model:page-size="params.pagesize"
      :page-sizes="[2, 3, 4, 5, 10]"
      layout="jumper, total, sizes, prev, pager, next"
      :background="true"
      :total="total"
      @size-change="onSizeChange"
      @current-change="onCurrentChange"
      style="margin-top: 20px; justify-content: flex-end"
    />
    <!-- 抽屉组件 -->
    <ArticleEdit ref="articleEditRef" @success="onSuccess()"></ArticleEdit>
  </page-container>
</template>
