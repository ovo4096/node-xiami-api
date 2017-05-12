function editorTextFormatToString (text) {
  return text.replace(/\t/g, '').replace(/\r/g, '')
}

module.exports = {
  editorTextFormatToString
}
