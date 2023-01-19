<template>
  <div :class="['category', !isNavCategory && 'ml-4']" :data-id="category.id">
    <div class="group mt-3 flex cursor-pointer items-center" @click="handleCategoryClick">
      <div
        :class="[
          'flex h-11 w-11 shrink-0 items-center justify-center rounded-full  transition group-hover:bg-yellow-400',
          isActiveCategory ? 'bg-yellow-400' : 'bg-gray-50',
        ]"
      >
        <span class="text-2xl">{{ category.emoji }}</span>
      </div>
      <div class="px-2.5 text-base">{{ category.name }}</div>
      <span v-if="isNavCategory" class="ml-auto text-xl leading-none">
        <SvgIcon name="chevron-down" />
      </span>
    </div>

    <Transition name="slide">
      <div v-show="isActiveCategory">
        <PostCategory
          class=""
          v-for="childCategory in category.childs"
          :key="childCategory.id"
          :category="childCategory"
        />
      </div>
    </Transition>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import type { ICategoryChilds } from '@/core/interface/Category'
import { SvgIcon } from '@c/Ui'
import { PostCategory } from '@c/Post'
import { usePostStore } from '@/core'

const props = defineProps<{ category: ICategoryChilds; activeCategoryId?: number | null }>()
const emit = defineEmits(['onToggle'])
const router = useRouter()

const postStore = usePostStore()

const isNavCategory = computed(() => {
  return props.category.childs?.length
})

const isActiveCategory = computed(() => {
  return props.activeCategoryId === props.category.id
})

const handleCategoryClick = () => {
  const id = props.category.id

  if (isNavCategory.value) {
    emit('onToggle', id)
  } else {
    postStore.updateOrder({ categoryId: id })
    router.push(`/${id}`)
  }
}
</script>
