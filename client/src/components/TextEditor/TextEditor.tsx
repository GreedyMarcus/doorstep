import React, { useState } from 'react'
import useStyles from './useStyles'
import config from '../../app/config'
import { Editor } from '@tinymce/tinymce-react'
import { InputChangeEvent } from '../../data/types/Event'
import { useTranslation } from 'react-i18next'

type Props = {
  value: string
  error: boolean
  required: boolean
  fullScreen: boolean
  onChange: (event: InputChangeEvent) => void
}

const TextEditor: React.FC<Props> = ({ value, error, required, fullScreen, onChange }) => {
  const [hasFocus, setFocus] = useState(false)
  const classes = useStyles({ error, hasFocus })
  const [t] = useTranslation()

  return (
    <div className={classes.container}>
      <Editor
        apiKey={config.tinyMCE.apiKey}
        cloudChannel="5-stable"
        value={value}
        init={{
          height: window.innerHeight * (fullScreen ? 0.65 : 0.5),
          menubar: false
        }}
        toolbar={
          'undo redo | formatselect | fontsizeselect | bold italic underline |' +
          'alignleft aligncenter alignright alignjustify | bullist numlist | outdent indent'
        }
        plugins={['lists', 'wordcount']}
        outputFormat="html"
        inline={false}
        onFocus={() => setFocus(true)}
        onBlur={() => setFocus(false)}
        onEditorChange={(content, editor) => {
          editor.save()
          onChange({ target: { value: content } })
        }}
      />
    </div>
  )
}

export default TextEditor
