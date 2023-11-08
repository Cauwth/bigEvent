<script setup>
import { ref } from 'vue'
import ChannelSelect from '@/views/article/components/ChannelSelect.vue'
import { Plus } from '@element-plus/icons-vue'
import { QuillEditor } from '@vueup/vue-quill'
import '@vueup/vue-quill/dist/vue-quill.snow.css'
import { articleAddService } from '@/api/article'
import { ElMessage } from 'element-plus'
import { articleGetDetailService } from '@/api/article'
import { baseURL } from '../../../utils/request'
import axios from 'axios'

const visibleDrawer = ref(false)

// 准备数据
const formModel = ref({
  title: '', // 标题
  cate_id: '', // 分类id
  cover_img: '', // 封面 obj
  content: '', // 内容 str
  state: '' // 状态
})
const imgUrl = ref('')

const onUploadFile = (uploadFile) => {
  //console.log(uploadfile)
  imgUrl.value = URL.createObjectURL(uploadFile.raw) // 利用URL方法创建预览
  formModel.value.cover_img = uploadFile.raw // 文件对象的内容存入请求对象
}

async function imageUrlToFile(url, fileName) {
  try {
    // 第一步：使用axios获取网络图片数据
    const response = await axios.get(url, { responseType: 'arraybuffer' })
    const imageData = response.data

    // 第二步：将图片数据转换为Blob对象
    const blob = new Blob([imageData], {
      type: response.headers['content-type']
    })

    // 第三步：创建一个新的File对象
    const file = new File([blob], fileName, { type: blob.type })

    return file
  } catch (error) {
    console.error('将图片转换为File对象时发生错误:', error)
    throw error
  }
}

const open = async (row) => {
  visibleDrawer.value = true
  // console.log(row)
  if (row.id) {
    // 修改文章 根据id发请求回显
    const res = await articleGetDetailService(row.id)
    //console.log(res.data)
    formModel.value = res.data.data
    // 拼接封面图片地址
    imgUrl.value = baseURL + res.data.data.cover_img
    // 根据地址获取图片对象,再存入请求对象
    const file = await imageUrlToFile(imgUrl.value, formModel.value.cover_img)
    formModel.value.cover_img = file
  } else {
    // 添加文章，提供默认值为空
    formModel.value = {
      title: '', // 标题
      cate_id: '', // 分类id
      cover_img: '', // 封面 obj
      content: '', // 内容 str
      state: '' // 状态
    }
    imgUrl.value = ''
  }
}

const emit = defineEmits(['success'])
// 提交和草稿缓存
const onPublish = async (state) => {
  formModel.value.state = state // 存入状态
  const fd = new FormData() // 创建表单对象formdata格式（接口要求）
  for (const key in formModel.value) {
    fd.append(key, formModel.value[key])
  }
  // 发布文章
  if (formModel.value.id) {
    // 修改
  } else {
    // 添加
    await articleAddService(fd)
    ElMessage.success('添加成功')
    // 刷新列表
    emit('success', 'add')
  }
  // 草稿
  // 关闭抽屉
  visibleDrawer.value = false
}

defineExpose({
  open
})
</script>

<template>
  <el-drawer
    v-model="visibleDrawer"
    :title="formModel.id ? '编辑文章' : '添加文章'"
    direction="rtl"
    size="50%"
  >
    <!-- 发表文章表单 -->
    <el-form :model="formModel" ref="formRef" label-width="100px">
      <el-form-item label="文章标题" prop="title">
        <el-input v-model="formModel.title" placeholder="请输入标题"></el-input>
      </el-form-item>
      <el-form-item label="文章分类" prop="cate_id">
        <channel-select
          v-model="formModel.cate_id"
          width="100%"
        ></channel-select>
      </el-form-item>
      <el-form-item label="文章封面" prop="cover_img">
        <!-- :on-change 钩子函数，状态改变时调用 -->
        <el-upload
          class="avatar-uploader"
          :auto-upload="false"
          :show-file-list="false"
          :on-change="onUploadFile"
        >
          <img v-if="imgUrl" :src="imgUrl" class="avatar" />
          <el-icon v-else class="avatar-uploader-icon"><Plus /></el-icon>
        </el-upload>
      </el-form-item>
      <el-form-item label="文章内容" prop="content">
        <div class="editor">
          <quill-editor
            theme="snow"
            v-model:content="formModel.content"
            contentType="html"
          >
          </quill-editor>
        </div>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="onPublish('已发布')">发布</el-button>
        <el-button type="info" @click="onPublish('草稿')">草稿</el-button>
      </el-form-item>
    </el-form>
  </el-drawer>
</template>

<style lang="scss" scoped>
.avatar-uploader {
  :deep() {
    .avatar {
      width: 178px;
      height: 178px;
      display: block;
    }
    .el-upload {
      border: 1px dashed var(--el-border-color);
      border-radius: 6px;
      cursor: pointer;
      position: relative;
      overflow: hidden;
      transition: var(--el-transition-duration-fast);
    }
    .el-upload:hover {
      border-color: var(--el-color-primary);
    }
    .el-icon.avatar-uploader-icon {
      font-size: 28px;
      color: #8c939d;
      width: 178px;
      height: 178px;
      text-align: center;
    }
  }
}
.editor {
  width: 100%;
  :deep(.ql-editor) {
    min-height: 200px;
  }
}
</style>
