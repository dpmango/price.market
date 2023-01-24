import type { FileStatus } from 'filepond'

export interface IFile {
  id: string
  serverId: string
  origin: 'input' | 'limbo' | 'local'
  status: FileStatus
  file: File
  fileExtension: string
  fileSize: string
  filename: string
  filenameWithoutExtension: string
}
