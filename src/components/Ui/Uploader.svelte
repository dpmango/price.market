<script lang="ts">
  import cns from 'classnames'
  import { createEventDispatcher } from 'svelte'

  // @ts-ignore
  import FilePond, { registerPlugin, supported } from 'svelte-filepond'
  import FilePondPluginFileValidateType from 'filepond-plugin-file-validate-type'
  import FilePondPluginImagePreview from 'filepond-plugin-image-preview'
  import FilePondPluginFileValidateSize from 'filepond-plugin-file-validate-size'
  import type { IFile } from '@/core/interface/Ui'

  export let initialFiles: IFile[] = []

  const emit = createEventDispatcher()

  let files = initialFiles || []
  let uploades: string[] = []

  registerPlugin(
    FilePondPluginFileValidateType,
    FilePondPluginFileValidateSize,
    FilePondPluginImagePreview
  )

  // a reference to the component, used to call FilePond methods
  let pond

  $: if (files) {
    emit('onChange', files)
  }

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
      uploades = [...uploades, uploadName]
    }
  }

  const handleRemove = (err: Error, file: any) => {
    if (!err) {
      const uploadName = getFileServerName(file)
      uploades = uploades.filter((x) => x !== uploadName)
    }
  }

  const handleReorder = (files: any[]) => {
    const newOrder = [] as string[]

    files.forEach((file) => {
      const uploadName = getFileServerName(file)
      newOrder.push(uploadName)
    })

    uploades = [...newOrder]
  }

  $: if (uploades) {
    console.log('uploades changed', uploades)
    emit('onUploads', uploades)
  }

  $: serverProcessor = {
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
  }
</script>

<div class={cns('fp relative overflow-hidden', files.length && 'has-files')}>
  <FilePond
    server={serverProcessor}
    name={'filepond'}
    ref="pond"
    labelIdle="<strong>Загрузите фото и видео</strong>PNG, JPG, GIF, MP4. Размер до 20 Мб"
    acceptedFileTypes="image/jpeg, image/png, image/gif, video/mp4"
    allowMultiple={true}
    allowReorder={true}
    dropOnPage={true}
    maxFiles={10}
    maxFileSize={'20MB'}
    {files}
    allowImagePreview={true}
    imagePreviewMinHeight={64}
    imagePreviewMaxHeight={64}
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
    labelMaxFileSizeExceeded={'Файл слишком большой'}
    labelMaxFileSize={'Максимальный размер файла {filesize}'}
    labelFileTypeNotAllowed="Некорректный тип файла"
    fileValidateTypeLabelExpectedTypes="jpeg, png, gif или mp4"
    iconRemove={`<svg
      width='20'
      height='20'
      viewBox='0 0 20 20'
      fill='none'>
      <path
        fill='currentColor'
        d='M10.125 2C5.64492 2 2 5.64492 2 10.125C2 14.6051 5.64492 18.25 10.125 18.25C14.6051 18.25 18.25 14.6051 18.25 10.125C18.25 5.64492 14.6051 2 10.125 2ZM13.0668 12.1832C13.1273 12.2407 13.1756 12.3096 13.209 12.3861C13.2424 12.4625 13.2602 12.5449 13.2613 12.6283C13.2623 12.7117 13.2467 12.7945 13.2153 12.8718C13.1838 12.9491 13.1372 13.0193 13.0783 13.0783C13.0193 13.1372 12.9491 13.1838 12.8718 13.2153C12.7945 13.2467 12.7117 13.2623 12.6283 13.2613C12.5449 13.2602 12.4625 13.2424 12.3861 13.209C12.3096 13.1756 12.2407 13.1273 12.1832 13.0668L10.125 11.009L8.0668 13.0668C7.94863 13.1791 7.79129 13.2407 7.62831 13.2386C7.46534 13.2365 7.30962 13.1709 7.19437 13.0556C7.07912 12.9404 7.01345 12.7847 7.01137 12.6217C7.00928 12.4587 7.07094 12.3014 7.1832 12.1832L9.24102 10.125L7.1832 8.0668C7.07094 7.94863 7.00928 7.79129 7.01137 7.62831C7.01345 7.46534 7.07912 7.30962 7.19437 7.19437C7.30962 7.07912 7.46534 7.01345 7.62831 7.01137C7.79129 7.00928 7.94863 7.07094 8.0668 7.1832L10.125 9.24102L12.1832 7.1832C12.3014 7.07094 12.4587 7.00928 12.6217 7.01137C12.7847 7.01345 12.9404 7.07912 13.0556 7.19437C13.1709 7.30962 13.2365 7.46534 13.2386 7.62831C13.2407 7.79129 13.1791 7.94863 13.0668 8.0668L11.009 10.125L13.0668 12.1832Z'
      />
      </svg>`}
    onprocessfile={handleAdd}
    onremovefile={handleRemove}
    onreorderfiles={handleReorder}
    {...$$restProps}
  />
</div>

<style lang="scss">
  .fp {
    :global(.filepond--root) {
      @apply mb-0 flex flex-col;
      font-family: 'Euclid Square', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica,
        Arial, sans-serif, 'Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol';
    }
    :global(.filepond--root .filepond--drop-label) {
      @apply min-h-[64px];
    }

    /* bordered drop area */
    :global(.filepond--panel-root) {
      @apply rounded-lg border border-dashed border-gray-200 bg-white;
    }

    /* contents */
    :global(.filepond--browser) {
      @apply order-1;
    }
    :global(.filepond--credits) {
      @apply hidden;
    }

    :global(.filepond--drop-label) {
      // todo - absolute position + transform
      @apply relative order-9 flex justify-start rounded-t-lg bg-gray-50 pl-11 text-gray-500;
    }

    :global(.filepond--drop-label > label[for]) {
      @apply p-3 text-left text-xs;
    }

    :global(.filepond--drop-label > label[for] strong) {
      @apply mb-0.5 block text-gray-900;
    }

    :global(.filepond--list) {
      @apply left-2 right-2;
    }
    :global(.filepond--list.filepond--list) {
      @apply top-2;
    }

    :global(.filepond--list-scroller) {
      @apply order-3;
    }

    :global(.filepond--item) {
      @apply mx-0 mb-3 h-[64px];
    }

    :global(.filepond--file-wrapper) {
      @apply pl-4;
    }

    /* file */
    :global(.filepond--file) {
      @apply items-center rounded-none border-0 bg-white p-2 pl-[64px] text-gray-900;
    }

    :global(.filepond--file-action-button) {
      @apply text-gray-200 transition;
      @apply hover:text-gray-500;
      @apply focus:text-gray-500;
      &[disabled] {
        @apply pointer-events-none;
      }
    }

    :global(.filepond--action-remove-item) {
      @apply z-20;
    }
    :global(.filepond--action-retry-item-processing) {
      display: none;
    }

    :global(.filepond--item-panel) {
      @apply left-7 rounded-lg bg-gray-50;
    }

    :global(.filepond--file-info) {
      @apply mr-2 pl-2;
    }
    :global(.filepond--file-info) {
      @apply text-sm font-normal;
    }
    :global(.filepond--file-info-sub) {
      @apply hidden;
    }

    :global(.filepond--file-status) {
      @apply overflow-hidden overflow-ellipsis whitespace-nowrap;
    }

    :global(.filepond--image-clip) {
      @apply ml-0;
    }

    :global(.filepond--image-preview-wrapper) {
      @apply right-auto left-7 w-[64px];
    }
    :global(.filepond--image-preview-overlay) {
      display: none;
    }
    :global(.filepond--image-preview-overlay-failure) {
      @apply text-red-900;
    }

    /* drop circle */
    :global(.filepond--drip-blob) {
      @apply border-gray-200;
    }

    // /* error state color */

    :global([data-filepond-item-state*='error'] .filepond--item-pane) {
      @apply bg-red-500;
    }
    :global([data-filepond-item-state*='invalid'] .filepond--item-pane) {
      @apply bg-red-500;
    }

    :global([data-filepond-item-state*='error'] .filepond--file-info) {
      @apply mr-3;
    }
    :global([data-filepond-item-state*='invalid'] .filepond--file-info) {
      @apply mr-3;
    }
    :global([data-filepond-item-state*='error'] .filepond--file-info-main) {
      @apply text-red-500;
    }
    :global([data-filepond-item-state*='invalid'] .filepond--file-info-main) {
      @apply text-red-500;
    }

    :global([data-filepond-item-state='processing-complete'] .filepond--file-status) {
      @apply hidden;
    }
    :global([data-filepond-item-state='processing-complete'] .filepond--item-panel) {
      @apply bg-green-500;
    }
    :global(.filepond--file-action-button.filepond--file-action-button) {
      @apply h-5 w-5;
    }

    :global(.filepond--item > .filepond--panel .filepond--panel-bottom) {
      @apply shadow-none;
    }

    :global(.filepond--drop-label > label[for]) {
      &::before {
        @apply absolute left-3 top-1/2 inline-block -translate-y-1/2;
        @apply h-8 w-8 rounded-full;
        content: '';
        box-shadow: 0px 1px 3px rgba(92, 86, 118, 0.15);
        background: #ffffff url('$lib/icons/camera.svg') no-repeat center;
        background-size: 20px 20px;
      }
    }

    :global(.filepond--file-wrapper.filepond--file-wrapper) {
      padding-left: 28px;
      &::before {
        @apply absolute left-0 top-1/2 inline-block h-5 w-5 -translate-y-1/2;
        display: inline-block;
        content: '';
        background: url('$lib/icons/drag-handle.svg') no-repeat center;
        background-size: cover;
      }
    }
  }
</style>
