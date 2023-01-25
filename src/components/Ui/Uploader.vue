<template>
  <div class="relative overflow-hidden" :class="[files.length && 'has-files']">
    <file-pond
      class="-mb-4"
      :server="serverProcessor"
      name="filepond"
      ref="pond"
      label-idle="<strong>Загрузите фото и видео</strong>PNG, JPG, GIF, MP4. Размер до 20 Мб"
      accepted-file-types="image/jpeg, image/png, image/gif, video/mp4"
      :allow-multiple="true"
      :allow-reorder="true"
      :drop-on-page="true"
      max-files="10"
      maxFileSize="20MB"
      :files="files"
      :allowImagePreview="true"
      :imagePreviewMinHeight="64"
      :imagePreviewMaxHeight="64"
      imagePreviewTransparencyIndicator="grid"
      labelFileLoading="Загрузка"
      labelFileLoadError="Ошибка. Попробуйте снова"
      labelFileProcessing="Загружаем"
      labelFileProcessingComplete="Загружено"
      labelFileProcessingAborted="Отменено"
      labelFileProcessingError="Ошибка загрузки"
      labelFileProcessingRevertError="Ошибка отмены"
      labelFileRemoveError="Ошибка удаления"
      labelTapToCancel="нажмите для отмены"
      labelTapToRetry="попробовать снова"
      labelTapToUndo="нажмите для отмены"
      styleButtonRemoveItemPosition="right"
      labelMaxFileSizeExceeded="Файл слишком большой"
      labelMaxFileSize="Максимальный размер файла {filesize}"
      labelFileTypeNotAllowed="Некорректный тип файла"
      fileValidateTypeLabelExpectedTypes="jpeg, png, gif или mp4"
      iconRemove="<svg
        width='20'
        height='20'
        viewBox='0 0 20 20'
        fill='none'>
        <path
          fill='currentColor'
          d='M10.125 2C5.64492 2 2 5.64492 2 10.125C2 14.6051 5.64492 18.25 10.125 18.25C14.6051 18.25 18.25 14.6051 18.25 10.125C18.25 5.64492 14.6051 2 10.125 2ZM13.0668 12.1832C13.1273 12.2407 13.1756 12.3096 13.209 12.3861C13.2424 12.4625 13.2602 12.5449 13.2613 12.6283C13.2623 12.7117 13.2467 12.7945 13.2153 12.8718C13.1838 12.9491 13.1372 13.0193 13.0783 13.0783C13.0193 13.1372 12.9491 13.1838 12.8718 13.2153C12.7945 13.2467 12.7117 13.2623 12.6283 13.2613C12.5449 13.2602 12.4625 13.2424 12.3861 13.209C12.3096 13.1756 12.2407 13.1273 12.1832 13.0668L10.125 11.009L8.0668 13.0668C7.94863 13.1791 7.79129 13.2407 7.62831 13.2386C7.46534 13.2365 7.30962 13.1709 7.19437 13.0556C7.07912 12.9404 7.01345 12.7847 7.01137 12.6217C7.00928 12.4587 7.07094 12.3014 7.1832 12.1832L9.24102 10.125L7.1832 8.0668C7.07094 7.94863 7.00928 7.79129 7.01137 7.62831C7.01345 7.46534 7.07912 7.30962 7.19437 7.19437C7.30962 7.07912 7.46534 7.01345 7.62831 7.01137C7.79129 7.00928 7.94863 7.07094 8.0668 7.1832L10.125 9.24102L12.1832 7.1832C12.3014 7.07094 12.4587 7.00928 12.6217 7.01137C12.7847 7.01345 12.9404 7.07912 13.0556 7.19437C13.1709 7.30962 13.2365 7.46534 13.2386 7.62831C13.2407 7.79129 13.1791 7.94863 13.0668 8.0668L11.009 10.125L13.0668 12.1832Z'
        />
        </svg>"
      @processfile="handleAdd"
      @removefile="handleRemove"
      @reorderfiles="handleReorder"
      v-bind="$attrs"
    />
  </div>
</template>

<script setup lang="ts">
import vueFilePond from 'vue-filepond'
import 'filepond/dist/filepond.min.css'
import 'filepond-plugin-image-preview/dist/filepond-plugin-image-preview.min.css'
import FilePondPluginFileValidateType from 'filepond-plugin-file-validate-type'
import FilePondPluginImagePreview from 'filepond-plugin-image-preview'
import FilePondPluginFileValidateSize from 'filepond-plugin-file-validate-size'
import type { IFile } from '@/core/interface/Ui'

const props = defineProps<{
  initialFiles: IFile[]
}>()
const emit = defineEmits(['onChange', 'onUploads'])

const files = ref(props.initialFiles || [])
const uploades = ref<string[]>([])

const FilePond = vueFilePond(
  FilePondPluginFileValidateType,
  FilePondPluginFileValidateSize,
  FilePondPluginImagePreview
)

watch(
  () => files.value,
  (newVal) => {
    emit('onChange', newVal)
  },
  { deep: true }
)

const getFileServerName = (file: IFile) => {
  try {
    return JSON.parse(file.serverId).files[0].name
  } catch {
    return null
  }
}

const handleAdd = (err: Error, file: any) => {
  if (!err) {
    const uploadName = getFileServerName(file)
    uploades.value = [...uploades.value, uploadName]
  }
}

const handleRemove = (err: Error, file: any) => {
  if (!err) {
    const uploadName = getFileServerName(file)
    uploades.value = uploades.value.filter((x) => x !== uploadName)
  }
}

const handleReorder = (files: any[]) => {
  const newOrder = [] as string[]

  files.forEach((file) => {
    const uploadName = getFileServerName(file)
    newOrder.push(uploadName)
  })

  uploades.value = [...newOrder]
}

watch(
  () => uploades.value,
  (newVal) => {
    console.log('uploades changed', newVal)
    emit('onUploads', newVal)
  },
  { deep: true }
)

const serverProcessor = computed(() => ({
  // @ts-ignore
  process: (fieldName, file, metadata, load, error, progress, abort, transfer, options) => {
    const formData = new FormData()
    formData.append(fieldName, file, file.name)

    const request = new XMLHttpRequest()
    request.open('POST', `${import.meta.env.VITE_UPLOADER_URL}`)

    request.upload.onprogress = (e) => {
      progress(e.lengthComputable, e.loaded, e.total)
    }
    request.onload = function () {
      if (request.status >= 200 && request.status < 300) {
        load(request.responseText)
      } else {
        error('oh no')
      }
    }

    request.send(formData)

    return {
      abort: () => {
        request.abort()
        abort()
      },
    }
  },
}))
</script>

<style lang="scss">
.filepond {
  &--root {
    @apply flex flex-col;
    font-family: 'Euclid Square', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica,
      Arial, sans-serif, 'Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol';
    .filepond--drop-label {
      @apply min-h-[64px];
    }
  }

  /* bordered drop area */
  &--panel-root {
    @apply rounded-lg border border-dashed border-gray-200 bg-white;
  }

  /* contents */
  &--browser {
    @apply order-1;
  }
  &--credits {
    @apply hidden;
  }

  &--drop-label {
    // todo - absolute position + transform
    @apply relative order-9 flex justify-start rounded-t-lg bg-gray-50 pl-11 text-gray-500;
    > label[for] {
      @apply p-3 text-left text-xs;
      strong {
        @apply mb-0.5 block text-gray-900;
      }
    }
  }

  &--list {
    @apply left-2 right-2;
    &.filepond--list {
      @apply top-2;
    }
  }
  &--list-scroller {
    @apply order-3;
  }

  &--item {
    @apply mx-0 mb-3 h-[64px];
  }

  &--file-wrapper {
    @apply pl-4;
  }

  /* file */
  &--file {
    @apply items-center rounded-none border-0 bg-white p-2 pl-[64px] text-gray-900;
  }

  &--file-action-button {
    @apply text-gray-200 transition;
    @apply hover:text-gray-500;
    @apply focus:text-gray-500;
    &[disabled] {
      @apply pointer-events-none;
    }
  }

  &--action-remove-item {
    @apply z-20;
  }
  &--action-retry-item-processing {
    display: none;
  }

  &--item-panel {
    @apply left-7 rounded-lg bg-gray-50;
  }

  &--file-info {
    @apply mr-2 pl-2;
    .filepond--file-info-main {
      @apply text-sm font-normal;
    }
    .filepond--file-info-sub {
      @apply hidden;
    }
  }

  &--file-status {
    @apply overflow-hidden overflow-ellipsis whitespace-nowrap;
  }

  &--image-clip {
    @apply ml-0;
  }

  &--image-preview-wrapper {
    @apply right-auto left-7 w-[64px];
  }
  &--image-preview-overlay {
    display: none;
  }
  &--image-preview-overlay-failure {
    @apply text-red-900;
  }

  /* drop circle */
  &--drip-blob {
    @apply border-gray-200;
  }
}

/* error state color */
[data-filepond-item-state*='error'],
[data-filepond-item-state*='invalid'] {
  .filepond--item-panel {
    @apply bg-red-500;
  }

  .filepond--file-info {
    @apply mr-3;
  }
  .filepond--file-info-main {
    @apply text-red-500;
  }
}

[data-filepond-item-state='processing-complete'] {
  .filepond {
    &--file-status {
      @apply hidden;
    }
    &--item-panel {
      @apply bg-green-500;
    }
  }
}

.filepond--file-action-button.filepond--file-action-button {
  @apply h-5 w-5;
}

.filepond--item > .filepond--panel .filepond--panel-bottom {
  @apply shadow-none;
}

.filepond--drop-label {
  > label[for] {
    &::before {
      @apply absolute left-3 top-1/2 inline-block -translate-y-1/2;
      @apply h-8 w-8 rounded-full;
      content: '';
      box-shadow: 0px 1px 3px rgba(92, 86, 118, 0.15);
      background: #ffffff url('@/assets/icons/camera.svg') no-repeat center;
      background-size: 20px 20px;
    }
  }
}

.filepond--file-wrapper.filepond--file-wrapper {
  padding-left: 28px;
  &::before {
    @apply absolute left-0 top-1/2 inline-block h-5 w-5 -translate-y-1/2;
    display: inline-block;
    content: '';
    background: url('@/assets/icons/drag-handle.svg') no-repeat center;
    background-size: cover;
  }
}
</style>
