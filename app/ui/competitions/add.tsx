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
  InputLabel,
  MenuItem,
  Select,
  Tooltip,
  Typography,
  SelectChangeEvent
} from '@mui/material'
import {
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
      <TextField autoFocus margin='dense' id='url' name='url' onChange={() => {/*newCompetitionDialogURLChange*/}} label='Competition URL' type='text' fullWidth/>
      <DialogContentText>Enter the API Key for the competition server</DialogContentText>
      <TextField autoFocus margin='dense' id='apiKey' name='apiKey' onChange={() => {/*newCompetitionDialogKeyChange*/}} label='API Key' type='text' fullWidth/>
    </Box>
  )

  const LocalInfo = (
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

  return (
    <Box className='flex flex-col'>
      <form action={formAction}  aria-describedby='form-error'>
        {/* Type */}
        <DialogContentText>Competition Type</DialogContentText>
        <FormControl>
          <InputLabel className='my-2' id='select-competition-type'>Type</InputLabel>
          <Select labelId='select-competition-type' id='type' name='type' value={competitionType} label='Competition Type' onChange={changeCompetitionType} >
            <MenuItem value='url'>{'URL'}</MenuItem>
            <MenuItem value='local'>{'Local'}</MenuItem>
          </Select>
        </FormControl>
        {/*
          <div id='customer-error' aria-live='polite' aria-atomic='true'>
            {state.errors?.customerId &&
              state.errors.customerId.map((error: string) => (
                <p className='mt-2 text-sm text-red-500' key={error}>
                  {error}
                </p>
              ))}
          </div>
        </div>} */}

        {
          competitionType === 'url'
          ?
          URLInfo
          :
          LocalInfo
        }
        {/* URL */}
        {/* {<div className='mb-4'>
          <label htmlFor='amount' className='mb-2 block text-sm font-medium'>
            Choose an amount
          </label>
          <div className='relative mt-2 rounded-md'>
            <div className='relative'>
              <input
                id='amount'
                name='amount'
                type='number'
                step='0.01'
                placeholder='Enter USD amount'
                className='peer block w-full rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500'
                aria-describedby='amount-error'
              />
              <CurrencyDollarIcon className='pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900' />
            </div>
          </div>
          <div id='amount-error' aria-live='polite' aria-atomic='true'>
            {state.errors?.amount &&
              state.errors.amount.map((error: string) => (
                <p className='mt-2 text-sm text-red-500' key={error}>
                  {error}
                </p>
              ))}
          </div>
        </div>} */}

        {/* API Key*/}
        {/* {<fieldset>
          <legend className='mb-2 block text-sm font-medium'>
            Set the invoice status
          </legend>
          <div className='rounded-md border border-gray-200 bg-white px-[14px] py-3'>
            <div className='flex gap-4' aria-describedby='status-error'>
              <div className='flex items-center'>
                <input
                  id='pending'
                  name='status'
                  type='radio'
                  value='pending'
                  className='h-4 w-4 cursor-pointer border-gray-300 bg-gray-100 text-gray-600 focus:ring-2'
                />
                <label
                  htmlFor='pending'
                  className='ml-2 flex cursor-pointer items-center gap-1.5 rounded-full bg-gray-100 px-3 py-1.5 text-xs font-medium text-gray-600'
                >
                  Pending <ClockIcon className='h-4 w-4' />
                </label>
              </div>
              <div className='flex items-center'>
                <input
                  id='paid'
                  name='status'
                  type='radio'
                  value='paid'
                  className='h-4 w-4 cursor-pointer border-gray-300 bg-gray-100 text-gray-600 focus:ring-2'
                />
                <label
                  htmlFor='paid'
                  className='ml-2 flex cursor-pointer items-center gap-1.5 rounded-full bg-green-500 px-3 py-1.5 text-xs font-medium text-white'
                >
                  Paid <CheckIcon className='h-4 w-4' />
                </label>
              </div>
            </div>
          </div>
          <div id='status-error' aria-live='polite' aria-atomic='true'>
            {state.errors?.status &&
              state.errors.status.map((error: string) => (
                <p className='mt-2 text-sm text-red-500' key={error}>
                  {error}
                </p>
              ))}
          </div>
        </fieldset>} */}

        <div id='form-error' aria-live='polite' aria-atomic='true'>
          {state.message && state.message.length > 0 &&
          <p className='mt-2 text-sm text-red-500' key='form-error'>
            {state.message}
          </p>}
        </div>
        <div className='mt-6 flex justify-end gap-4'>
          <Link href='/c'>
            <Button variant='outlined' color='primary'>Cancel</Button>
          </Link>
          <Tooltip title='Add Competition'><Button type='submit' variant='contained' startIcon={<SaveAsRounded />} color='primary'>Add</Button></Tooltip>
        </div>
      </form>
    </Box>
  )
}
