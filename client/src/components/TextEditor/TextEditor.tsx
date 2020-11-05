import React, { useState } from 'react'
import useStyles from './useStyles'
import config from '../../app/config'
import { Editor } from '@tinymce/tinymce-react'
import { InputChangeEvent } from '../../data/types/Event'

type Props = {
  value: string
  error: boolean
  required: boolean
  disabled?: boolean
  heightMultiplier?: number
  fullScreen: boolean
  onChange: (event: InputChangeEvent) => void
}

const TextEditor: React.FC<Props> = ({ value, error, required, disabled, heightMultiplier, fullScreen, onChange }) => {
  const [hasFocus, setFocus] = useState(false)
  const classes = useStyles({ error, hasFocus, disabled: !!disabled })

  return (
    <div className={classes.container}>
      <Editor
        apiKey={config.tinyMCE.apiKey}
        cloudChannel="5-stable"
        value={value}
        init={{
          height: window.innerHeight * (fullScreen ? 0.65 : heightMultiplier || 0.5),
          menubar: false
        }}
        toolbar={
          'undo redo | formatselect | fontsizeselect | bold italic underline |' +
          'alignleft aligncenter alignright alignjustify | bullist numlist | outdent indent'
        }
        plugins={['lists', 'wordcount']}
        outputFormat="html"
        inline={false}
        disabled={disabled}
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
