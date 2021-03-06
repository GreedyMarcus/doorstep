import React from 'react'
import FormControl from '@material-ui/core/FormControl'
import InputLabel from '@material-ui/core/InputLabel'
import Select from '@material-ui/core/Select'
import MenuItem from '@material-ui/core/MenuItem'
import useStyles from './useStyles'

interface MultiSelectProps {
  id: string
  label: string
  items: string[]
  selectedItems: string[]
  onChange: (values: string[]) => void
}

/**
 * Custom container component to encapsulate multi select input behaviour.
 */
const MultiSelect: React.FC<MultiSelectProps> = ({ id, label, items, selectedItems, onChange }) => {
  const classes = useStyles()

  return (
    <FormControl className={classes.formControl}>
      <InputLabel id={id}>{label}</InputLabel>
      <Select labelId={id} multiple value={selectedItems} onChange={e => onChange(e.target.value as string[])}>
        {items.map(value => (
          <MenuItem key={value} value={value} className={selectedItems.includes(value) ? classes.selectedItem : ''}>
            {value}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  )
}

export default MultiSelect
