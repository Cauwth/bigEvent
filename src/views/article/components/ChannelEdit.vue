<!-- 复用对话框，表单搜集并创建相关 -->
<script setup>
import { ref } from 'vue'
import {
  articleEditChannelService,
  articleAddChannelService
} from '@/api/article'

const dialogVisible = ref(false)
const formModel = ref({
  cate_name: '',
  cate_alias: ''
})
const formRef = ref()
const formRules = {
  cate_name: [
    { required: true, message: '请输入分类名称', trigger: 'blur' },
    {
      pattern: /^\S{1,10}$/,
      message: '分类名必须1-10位的非空数字',
      trigger: 'blur'
    }
  ],
  cate_alias: [
    { required: true, message: '请输入别名', trigger: 'blur' },
    {
      pattern: /^[a-zA-Z0-9]{1,15}$/,
      message: '分类必须是1-15位的字母或者数字',
      trigger: 'blur'
    }
  ]
}

// 定义打开弹窗的方法，同时获取值
const open = (row) => {
  console.log(row)
  dialogVisible.value = true
  // 回显 自带数据的展示  包括dialog的title也是用三元运算
  formModel.value = { ...row }
}
// 导出方法
defineExpose({
  open
})

// 弹窗确认：添加和编辑两种情况  子传父
const emit = defineEmits(['success'])
const submmit = async () => {
  //预校验 formRef
  await formRef.value.validate()
  //通过isEdit判断添加or编辑,存在id即编辑
  formModel.value.id
    ? await articleEditChannelService(formModel.value)
    : await articleAddChannelService(formModel.value)

  //请求完成后：dialog不可见，重新获取列表并渲染（在父组件 ArticleChannel中完成 emit监听）
  ElMessage({
    type: 'success',
    message: formModel.value.id ? '编辑成功' : '添加成功'
  })
  dialogVisible.value = false
  emit('success')
}
</script>

<template>
  <el-dialog
    v-model="dialogVisible"
    :title="formModel.id ? '编辑分类' : '添加分类'"
    width="30%"
  >
    <div></div>
    <el-form :model="formModel" :rules="formRules" ref="formRef">
      <el-form-item label="分类名称" prop="cate_name">
        <el-input
          placeholder="请输入分类名称"
          v-model="formModel.cate_name"
        ></el-input>
      </el-form-item>
      <el-form-item label="分类别名" prop="cate_alias">
        <el-input
          placeholder="请输入分类别名"
          v-model="formModel.cate_alias"
        ></el-input>
      </el-form-item>
    </el-form>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="submmit"> 确认 </el-button>
      </span>
    </template>
  </el-dialog>
</template>
