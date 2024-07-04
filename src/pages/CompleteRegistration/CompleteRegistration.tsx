import React, { useState, useEffect } from 'react'
import Select, { StylesConfig } from 'react-select'
import './CompleteRegistration.css' // Assuming you have a CSS file for styling
import Icon from '@mdi/react'
import { mdiPlus, mdiMinus } from '@mdi/js'
import axios from 'axios'

interface PaperOption {
  value: string
  label: string
}

// Helper function to get cookie value by name
function getCookie(name: string) {
  const cookieValue = document.cookie.match(
    '(^|;)\\s*' + name + '\\s*=\\s*([^;]+)',
  )
  return cookieValue ? cookieValue.pop() : ''
}

const CompleteRegistration: React.FC = () => {
  const [numberOfPages, setNumberOfPages] = useState(1)
  const [words, setWords] = useState(275)
  const [selectedPaperType, setSelectedPaperType] =
    useState<PaperOption | null>(null)
  const [email, setEmail] = useState('')
  const [dueDate, setDueDate] = useState('')

  const paperOptions: PaperOption[] = [
    { value: 'essay', label: 'Essay (any type)' },
    { value: 'admission_essay', label: 'Admission essay' },
    { value: 'annotated_bibliography', label: 'Annotated bibliography' },
    // Add more options here
  ]

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

  useEffect(() => {
    // Function to fetch data from Redis using the token stored in cookies
    const fetchData = async () => {
      try {
        // Fetch token from cookies (you'll need to implement this part)
        // const setk = localStorage.setItem('token', token);
        const setk = localStorage.getItem('token')
        console.log(setk)
        const token = getCookie('token') // Replace with your actual cookie name

        if (!token) {
          console.error('Token not found')
          return
        }

        // Example API endpoint to fetch data from Redis
        const response = await axios.get(`/api/data?key=${token}`)
        const { email, paperType, pages, dueDate } = response.data

        // Set state with fetched data
        setEmail(email)
        setSelectedPaperType(
          paperOptions.find((option) => option.value === paperType) || null,
        )
        setNumberOfPages(pages)
        setDueDate(dueDate)
        setWords(pages * 275) // Update words based on fetched pages
      } catch (error) {
        console.error('Error fetching data:', error)
      }
    }

    fetchData()
  }, []) // Empty dependency array ensures this effect runs only once on mount

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
    // Handle form submission logic here, e.g., API calls, state updates, etc.
    console.log('Form submitted with:', {
      email,
      paperType: selectedPaperType?.value,
      pages: numberOfPages,
      dueDate,
    })

    try {
      // Example of API call to submit registration data
      const response = await axios.post('/api/register', {
        email,
        paperType: selectedPaperType?.value,
        pages: numberOfPages,
        dueDate,
      })

      console.log('Registration successful:', response.data)
      // Handle successful registration (e.g., show success message)
    } catch (error) {
      console.error('Registration failed:', error)
      // Handle registration failure (e.g., show error message)
    }
  }

  return (
    <div className="registration-container">
      <form onSubmit={handleSubmit} className="registration-form">
        <h2>Complete Registration</h2>
        <div className="form-group">
          <label>Email</label>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label>Type of Paper</label>
          <Select
            options={paperOptions}
            value={selectedPaperType}
            onChange={(option) => setSelectedPaperType(option as PaperOption)}
            styles={customStyles}
            className="react-select-container"
            classNamePrefix="react-select"
            placeholder="Select paper type"
          />
        </div>
        <div className="form-group">
          <label>Number of Pages</label>
          <div className="page-input-group">
            <button type="button" onClick={handleMinus}>
              <Icon path={mdiMinus} title="Minus" size={0.8} />
            </button>
            <input type="number" value={numberOfPages} readOnly />
            <button type="button" onClick={handlePlus}>
              <Icon path={mdiPlus} title="Plus" size={0.8} />
            </button>
          </div>
          <p>Estimated words: {words}</p>
        </div>
        <div className="form-group">
          <label>Deadline</label>
          <input
            type="datetime-local"
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
            required
          />
        </div>
        <button type="submit" className="submit-button">
          Place Order
        </button>
      </form>
    </div>
  )
}

export default CompleteRegistration
