<script setup>
import {
  articleGetChannelService,
  articleDelChannelService
} from '@/api/article'
import { ref } from 'vue'
import { Edit, Delete } from '@element-plus/icons-vue'
import ChannelEdit from './components/ChannelEdit.vue'
const channelList = ref([])
const loading = ref(false)
const dialog = ref()

const getChannelList = async () => {
  loading.value = true
  const res = await articleGetChannelService()
  // console.log(res)
  channelList.value = res.data.data
  loading.value = false
}
getChannelList()

const onEditChannel = (row) => {
  //console.log(row)
  dialog.value.open(row)
}
const onDelChannel = async (row) => {
  console.log(row)
  await ElMessageBox.confirm('你确认删除该分类信息吗？', '温馨提示', {
    type: 'warning',
    confirmButtonText: '确认',
    cancelButtonText: '取消'
  })
  await articleDelChannelService(row.id)
  ElMessage({ type: 'success', message: '删除成功' })
  getChannelList()
}

const onAddChannel = () => {
  //console.log(row)
  dialog.value.open({})
}
//监听的添加/编辑成功
const onSuccess = () => {
  getChannelList()
}
</script>
<template>
  <!-- 导入使用组件 -->
  <page-container title="文章分类">
    <!-- 填充具名插槽：给一个按钮 -->
    <template #extra>
      <el-button type="primary" @click="onAddChannel">添加分类</el-button>
    </template>
    <!-- 主体部分:填充到默认插槽 -->
    <el-table :data="channelList" style="width: 100%" v-loading="loading">
      <el-table-column label="序号" width="100" type="index"></el-table-column>
      <el-table-column label="分类名称" prop="cate_name"></el-table-column>
      <el-table-column label="分类别名" prop="cate_alias"></el-table-column>
      <el-table-column label="操作" width="100">
        <template #default="{ row }">
          <el-button
            :icon="Edit"
            circle
            plain
            type="primary"
            @click="onEditChannel(row)"
          ></el-button>
          <el-button
            :icon="Delete"
            circle
            plain
            type="danger"
            @click="onDelChannel(row)"
          ></el-button>
        </template>
      </el-table-column>
      <!-- element内置插槽 ：空时插槽 -->
      <template #empty>
        <el-empty description="没有数据" />
      </template>
    </el-table>
    <ChannelEdit ref="dialog" @success="onSuccess"></ChannelEdit>
  </page-container>
</template>
