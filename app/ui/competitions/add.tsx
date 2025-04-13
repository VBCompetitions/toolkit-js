'use client'
import Link from 'next/link'
import {
  useActionState,
  useState
} from 'react'

import {
  Box,
  Button,
  TextField,
  DialogContentText,
  FormControl,
  IconButton,
  InputLabel,
  MenuItem,
  Select,
  Tooltip,
  Typography,
  SelectChangeEvent
} from '@mui/material'
import {
  ArrowBackRounded,
  FileUploadRounded,
  SaveAsRounded
} from '@mui/icons-material'
import { styled } from '@mui/material/styles'

import { addCompetition, AddCompetitionState } from '@/app/lib/actions/competitions'

export default function AddCompetition () {
  const initialState: AddCompetitionState = { message: null, errors: {} }
  const [state, formAction] = useActionState(addCompetition, initialState)

  const [competitionType, setCompetitionType] = useState('url')
  const [filename, setFilename] = useState('\u00A0')

  function changeCompetitionType (e: SelectChangeEvent<string>) {
    setCompetitionType(e.target.value)
  }

  function changeFilename (e: React.ChangeEvent<HTMLInputElement>) {
    if (e.target.files && e.target.files.length > 0) {
      setFilename(e.target.files[0].name)
    }
  }

  const VisuallyHiddenInput = styled('input')({
    clip: 'rect(0 0 0 0)',
    clipPath: 'inset(50%)',
    height: 1,
    overflow: 'hidden',
    position: 'absolute',
    bottom: 0,
    left: 0,
    whiteSpace: 'nowrap',
    width: 1,
  })

  // TODO - the API Key should be a password with a visibility toggle
  const URLInfo = (
    <Box className='my-3 grid grid-col'>
      <DialogContentText>Enter the URL for the competition</DialogContentText>
      <TextField autoFocus margin='dense' id='url' name='url' label='Competition URL' type='text' fullWidth/>
      <DialogContentText>Enter the API Key for the competition server</DialogContentText>
      <TextField autoFocus margin='dense' id='apiKey' name='apiKey' label='API Key' type='text' fullWidth/>
    </Box>
  )

  const FileInfo = (
    <Box className='my-4 grid grid-col'>
      <Box className='text-left'>
        <Button component='label' role={undefined} variant='contained' tabIndex={-1} startIcon={<FileUploadRounded />}>
          Choose file...
          <VisuallyHiddenInput type='file' onChange={changeFilename} />
        </Button>
      </Box>
      <Box className='my-2'>
        <Typography variant='body1'>{filename}</Typography>
      </Box>
    </Box>
  )

  const JSONInfo = (
    <Box className='my-3 grid grid-col'>
      <DialogContentText>Enter the competition JSON below</DialogContentText>
      <TextField autoFocus multiline minRows='10' maxRows='10' margin='dense' id='json' name='json' label='Competition JSON' type='text' fullWidth/>
    </Box>
  )

  return (
    <Box className='flex flex-col w-64 sm:w-96 md:w-3/4 lg:w-1/2'>
      <Box className='m-2'>
        <Link href='/c' className='block'>
          <IconButton size='small' aria-label='competition edit' aria-controls='competition-edit-button' aria-haspopup='true' color='inherit'>
            <ArrowBackRounded color='action' />
          </IconButton>
        </Link>
      </Box>
      <form action={formAction}  aria-describedby='form-error'>
        {/* Type */}
        <DialogContentText>Competition Type</DialogContentText>
        <FormControl>
          <InputLabel className='my-2' id='select-competition-type'>Type</InputLabel>
          <Select labelId='select-competition-type' id='type' name='type' value={competitionType} label='Competition Type' onChange={changeCompetitionType} >
            <MenuItem value='url'>{'URL'}</MenuItem>
            <MenuItem value='file'>{'File'}</MenuItem>
            <MenuItem value='json'>{'JSON'}</MenuItem>
          </Select>
        </FormControl>
        {
          competitionType === 'url'
          ?
          URLInfo
          :
          competitionType === 'file'
          ?
          FileInfo
          :
          JSONInfo
        }
        <Box id='form-error' aria-live='polite' aria-atomic='true'>
          {state.message && state.message.length > 0 &&
          <p className='mt-2 text-sm text-red-500' key='form-error'>
            {state.message}
          </p>}
        </Box>
        <Box className='mt-6 flex justify-end gap-4'>
          <Link href='/c'>
            <Button variant='outlined' color='primary'>Cancel</Button>
          </Link>
          <Tooltip title='Add Competition'><Button type='submit' variant='contained' startIcon={<SaveAsRounded />} color='primary'>Add</Button></Tooltip>
        </Box>
      </form>
      <Box className='grow'></Box>
    </Box>
  )
}
