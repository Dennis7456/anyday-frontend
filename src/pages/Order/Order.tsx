import React, { useEffect, useState } from 'react'
import Select, { StylesConfig, SingleValue } from 'react-select'
import { useMutation, gql, ApolloError } from '@apollo/client'
import './Order.css'
import Icon from '@mdi/react'
import { mdiPlus, mdiMinus } from '@mdi/js'
import { toast } from 'react-toastify'

// Define the type for paper options
interface PaperOption {
  value: string
  label: string
}

const REGISTER_AND_CREATE_ORDER_MUTATION = gql`
  mutation registerAndCreateOrder($input: RegisterOrderInput!) {
    registerAndCreateOrder(input: $input) {
      success
      message
      verificationToken
    }
  }
`

// Define the type for the select's value
type PaperType = PaperOption | null

const Order = () => {
  const [numberOfPages, setNumberOfPages] = useState(1)
  const [warning, setWarning] = useState('')
  const [words, setWords] = useState(275)
  const [selectedPaperType, setSelectedPaperType] = useState<PaperType>(null)
  const [email, setEmail] = useState('')
  const [dueDate, setDueDate] = useState('')

  // Use the useMutation hook to handle the registerAndCreateOrder mutation
  const [registerAndCreateOrder, { data, loading, error }] = useMutation(
    REGISTER_AND_CREATE_ORDER_MUTATION,
  )

  const paperOptions: PaperOption[] = [
    { value: 'essay', label: 'Essay (any type)' },
    { value: 'admission_essay', label: 'Admission essay' },
    { value: 'annotated_bibliography', label: 'Annotated bibliography' },
    { value: 'argumentative_essay', label: 'Argumentative essay' },
    { value: 'article_review', label: 'Article review' },
    { value: 'book_movie_review', label: 'Book/movie review' },
    { value: 'business_plan', label: 'Business plan' },
    { value: 'presentation_speech', label: 'Presentation speech' },
    { value: 'research_proposal', label: 'Research proposal' },
    { value: 'case_study', label: 'Case study' },
    { value: 'critical_thinking', label: 'Critical thinking' },
    { value: 'course_work', label: 'Course work' },
    { value: 'term_paper', label: 'Term paper' },
    {
      value: 'thesis_dissertation_chapter',
      label: 'Thesis/Dissertation chapter',
    },
    { value: 'creative_writing', label: 'Creative writing' },
    { value: 'other', label: 'Other' },
  ]

  useEffect(() => {
    if (numberOfPages < 1) {
      const warningMessage = 'Number of pages cannot be less than one :('
      setWarning(warningMessage)
      toast.warning(warningMessage, { position: 'top-right' })
      setTimeout(() => {
        setWarning('')
        setNumberOfPages(1)
      }, 3000)
    } else {
      setWarning('')
      setWords(numberOfPages * 275)
    }
  }, [numberOfPages])

  const handlePlus = () => {
    setNumberOfPages((prevNumberOfPages) => prevNumberOfPages + 1)
  }

  const handleMinus = () => {
    if (numberOfPages > 1) {
      setNumberOfPages((prevNumberOfPages) => prevNumberOfPages - 1)
    }
  }

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault()
    // console.log('form submitted');
    // console.log('Selected Paper Type:', selectedPaperType);

    try {
      const { data } = await registerAndCreateOrder({
        variables: {
          input: {
            email,
            paperType: selectedPaperType ? selectedPaperType.value : '',
            pages: numberOfPages,
            dueDate,
          },
        },
      })
      console.log('Order created successfully', data)
      toast.success(
        'Confirmation Email has been sent successfully! Please check your inbox to continue.',
        { position: 'top-right' },
      )
    } catch (error) {
      const apolloError = error as ApolloError
      console.error('Unexpected error:', apolloError.message)
      toast.error('Failed to create order. Please try again later.', {
        position: 'top-right',
      })
    }
  }

  // Custom styles for react-select
  const customStyles: StylesConfig<PaperOption, false> = {
    control: (provided, state) => ({
      ...provided,
      boxShadow: state.isFocused ? '0 0 0 0px var(--focus-color)' : 'none',
      borderColor: state.isFocused
        ? 'var(--focus-color)'
        : 'var(--border-color)',
      '&:hover': {
        borderColor: state.isFocused
          ? 'var(--focus-color)'
          : 'var(--border-color)',
      },
      backgroundColor: 'var(--input-background)',
      color: 'var(--text-color)',
    }),
    menu: (provided) => ({
      ...provided,
      backgroundColor: 'var(--input-background)',
      color: 'var(--text-color)',
    }),
    option: (provided, state) => ({
      ...provided,
      backgroundColor: state.isSelected
        ? 'var(--selected-background)'
        : state.isFocused
          ? 'var(--focus-background)'
          : 'var(--input-background)',
      color: 'var(--text-color)',
    }),
    singleValue: (provided) => ({
      ...provided,
      color: 'var(--text-color)',
    }),
  }

  return (
    <div className="w-96">
      <form
        onSubmit={handleSubmit}
        className="bg-on-primary shadow-md rounded px-8 pt-6 mb-4 text-1xl font-semibold text-on-background"
      >
        Unlock better papers
        <div>
          <label className="pb-2 text-start block text-on-background text-sm font-light">
            Email
          </label>
          <input
            className="required:border-error invalid:border-error shadow border-0 focus:border-1 rounded w-full py-2 px-3 focus:outline-none focus:shadow-outline text-secondary"
            id="email"
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div className="my-3">
          <label className="pb-2 text-start block text-on-background text-sm font-light">
            Type of paper
          </label>
          <div className="flex justify-start">
            <div className="w-full shadow border-0 focus:border-1 py-2 px-3">
              <Select
                className="z-0"
                options={paperOptions}
                value={selectedPaperType}
                onChange={(option) => setSelectedPaperType(option as PaperType)}
                styles={customStyles}
                classNamePrefix="react-select"
                placeholder="Select paper type"
              />
            </div>
          </div>
        </div>
        <label className="pb-2 text-start block text-on-background text-sm font-light">
          Pages
        </label>
        <div className="flex justify-start items-center">
          <button
            type="button"
            className="rounded shadow border-0 hover:text-on-primary bg-primary-container px-6 py-2"
            onClick={handleMinus}
          >
            <Icon path={mdiMinus} title="" size={1} />
          </button>
          <input
            type="number"
            className="opacity-100 text-secondary w-20 h-10 border-0 hover:border-0 text-center focus:outline-none"
            value={numberOfPages}
            readOnly
          />
          <button
            type="button"
            className="rounded shadow border-0 hover:text-on-primary bg-primary-container px-6 py-2"
            onClick={handlePlus}
          >
            <Icon path={mdiPlus} title="" size={1} />
          </button>
          <div className="ml-5 text-secondary bg-primary-container rounded px-1 py-1 text-sm font-semibold">
            {words} words.
          </div>
        </div>
        <label className="pb-2 pt-3 text-start block text-on-background text-sm font-light">
          Deadline
        </label>
        <div className="flex justify-start items-center text-secondary">
          <input
            className="opacity-100 required:border-error invalid:border-error shadow border-0 focus:border-1 rounded w-30 py-2 px-3 focus:outline-none focus:shadow-outline text-secondary date-pointer"
            type="datetime-local"
            placeholder="Date"
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
            required
          />
        </div>
        <div className="flex justify-center pt-4">
          <div className="bg-warning text-xs font-md text-secondary text-on-primary rounded w-full py-2 border-1 outline-5 border-primary px-3">
            We recommend leaving at least <span className="font-bold">1</span>{' '}
            hour to complete the order.
          </div>
        </div>
        <div className="flex justify-center items-center h-20">
          <button
            type="submit"
            className="border-black border-2 px-11 py-1 rounded-full font-semibold text-black hover:bg-primary hover:text-on-primary active:bg-tertiary-container"
          >
            Place your order
          </button>
        </div>
        <div className="font-light text-on-background text-xs py-3 pb-6">
          This site is protected by reCAPTCHA and the google{' '}
          <a
            className="text-primary hover:text-on-primary-container hover:font-semibold"
            href="#"
          >
            Privacy Policy
          </a>{' '}
          and{' '}
          <a
            href="#"
            className="text-primary hover:text-on-primary-container hover:font-semibold"
          >
            Terms of Service apply
          </a>
        </div>
      </form>
    </div>
  )
}

export default Order
