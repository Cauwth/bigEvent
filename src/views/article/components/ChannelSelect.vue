<script setup>
import { articleGetChannelService } from '@/api/article'
import { ref } from 'vue'

//父子通信
defineProps({
  modelValue: {
    type: [Number, String]
  },
  width: String
})
const emit = defineEmits(['update:modelValue'])
// 数据请求
const channelList = ref([])
const getChannelList = async () => {
  const res = await articleGetChannelService()
  channelList.value = res.data.data
}
getChannelList()
</script>

<template>
  <!-- 用v-for进行循环,key绑定，value为上传值，label为展示值
    value的上传：父子通信 -->
  <el-select
    :modelValue="modelValue"
    @update:modelValue="emit('update:modelValue', $event)"
    :style="{ width }"
  >
    <el-option
      v-for="item in channelList"
      :key="item.id"
      :value="item.id"
      :label="item.cate_name"
    ></el-option>
  </el-select>
</template>
