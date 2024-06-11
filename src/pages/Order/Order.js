import { useEffect, useState } from 'react'
import Select from 'react-select'
import './Order.css'
import Icon from '@mdi/react'
import {
  mdiPlus,
  mdiMinus,
  mdiAlertCircleOutline,
  mdiChevronDown,
  mdiCalendarClock,
} from '@mdi/js'
import { toast } from 'react-toastify'

const Order = () => {
  let [numberOfPages, setNumberOfPages] = useState(1)
  let [warning, setWarning] = useState('')
  let [words, setWords] = useState(275)
  let [selectedPaperType, setSelectedPaperType] = useState(null)

  const paperOptions = [
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
      words = numberOfPages * 275
      setWords(words)
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

  const handleSubmit = (event) => {
    event.preventDefault()
    console.log('form submitted')
    console.log('Selected Paper Type:', selectedPaperType)
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
            required
          />
        </div>
        <div className="my-3">
          <label className="pb-2 text-start block text-on-background text-sm font-light">
            Type of paper
          </label>
          <div className="flex justify-start">
            <div className="mb-3 w-full">
              <Select
                options={paperOptions}
                value={selectedPaperType}
                onChange={setSelectedPaperType}
                className="text-secondary"
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
