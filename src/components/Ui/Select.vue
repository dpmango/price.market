<template>
  <div
    class="select"
    :class="[{ 'has-error': error }, theme, opened && 'is-opened', value && 'has-value']"
  >
    <label class="select__label" v-if="label" :for="id">{{ getLabel }}</label>

    <vue-select
      :id="id"
      :options="options"
      :value="value"
      :placeholder="placeholder"
      :searchable="searchable"
      @option:selected="setSelected"
      @open="opened = true"
      @close="opened = false"
      v-bind="$attrs"
    >
      <template #open-indicator="{ attributes }">
        <span v-bind="attributes">
          <SvgIcon name="chevron-down" />
        </span>
      </template>
      <template #no-options="{}">
        <span> Не найдено</span>
      </template>
    </vue-select>
  </div>
</template>

<script setup lang="ts">
import type { ISelect } from '@/core/interface/Ui'
import { nanoid } from 'nanoid'
// @ts-ignore
import VueSelect from 'vue-select'

const id = nanoid()

defineComponent(VueSelect)
const emit = defineEmits(['onSelect'])

const props = defineProps({
  value: {
    type: [String, Array, Object],
    required: false,
  },
  options: {
    type: Array,
    required: true,
    default() {
      return []
    },
  },
  label: {
    type: String,
    required: false,
  },
  placeholder: {
    type: String,
    required: false,
    default: 'Выберите',
  },
  searchable: {
    type: Boolean,
    default: false,
  },
  theme: {
    type: String,
    required: false,
  },
  error: {
    type: [String, Array],
    required: false,
  },
})

const opened = ref(false)

const getLabel = computed(() => {
  return typeof props.error === 'string' ? props.error : props.label
})

const setSelected = (v: ISelect) => {
  emit('onSelect', v)
}
</script>

<style lang="scss" scoped>
.select {
  @apply relative;
  &.has-error {
    .select__label {
      @apply text-red-500;
    }
  }
}
</style>

<style lang="scss">
@import 'vue-select/dist/vue-select.css';

.select {
  .vs__dropdown-toggle {
    @apply min-h-[42px] min-w-[105px] rounded-none rounded-r-lg border border-gray-200 bg-gray-50 p-0 transition;
    @apply hover:border-blue-500 hover:bg-white;
  }
  .vs__selected-options {
    @apply min-w-[1px] flex-nowrap overflow-hidden whitespace-nowrap p-0;
  }

  .vs__selected {
    @apply relative m-0 border-0 bg-transparent p-2 pl-3 pr-1 text-base text-gray-900 transition;
    + .vs__selected {
      @apply ml-0 pl-0;
      // &::before {
      //   display: inline-block;
      //   content: ',';
      //   position: absolute;
      //   left: -13px;
      //   top: 13px;
      // }
    }
    + .vs__search {
      @apply hidden;
      padding-left: 0;
    }
  }
  .vs__search,
  .vs__search:focus {
    @apply m-0 border-0 p-2 pl-3 text-base text-gray-500;
  }

  .vs__actions {
    @apply py-0 pr-2;
  }
  .vs__open-indicator {
    @apply -mt-1 h-5 w-5 text-xl leading-none;
    svg {
      @apply transition;
    }
  }
  .vs__dropdown-menu {
    @apply top-full rounded-t-md border border-gray-200 bg-white p-0 shadow-none;
  }
  .vs__dropdown-option {
    @apply relative overflow-hidden text-ellipsis whitespace-nowrap py-2 px-4 text-base text-gray-800 transition;
  }
  .vs__dropdown-option--highlight {
    @apply bg-yellow-100 text-gray-900;
  }
  .vs__dropdown-option--selected {
    @apply pr-4;
  }
  .vs__no-options {
    @apply p-4 text-center text-base;
  }
  .vs__clear {
    @apply hidden;
    @apply mr-3 text-xl leading-none;
    @apply hover:text-red-500;
  }
  &.has-error {
    .vs__dropdown-toggle {
      @apply text-red-500;
    }
  }
  .vs--open {
    .vs__open-indicator {
      @apply transform-none;
      svg {
        @apply rotate-180;
      }
    }
    .vs__dropdown-toggle {
      @apply border-gray-200;
    }
  }
  .vs--single.vs--open .vs__selected,
  .vs--single.vs--loading .vs__selected {
    @apply static text-gray-500 opacity-100;
  }
}
</style>
