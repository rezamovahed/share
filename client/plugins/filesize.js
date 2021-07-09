import filesize from 'filesize'

export default (context, inject) => {
  inject('filesize', filesize)
  context.$filesize = filesize
}
