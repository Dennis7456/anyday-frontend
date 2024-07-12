import React, { useState, useEffect, useRef } from 'react'
import Select, { StylesConfig } from 'react-select'
import ReactQuill from 'react-quill'
import 'react-quill/dist/quill.snow.css'
import Icon from '@mdi/react'
import { FaChevronUp } from 'react-icons/fa'
import { mdiPlus, mdiMinus } from '@mdi/js'
import axios from 'axios'
import { getCookie } from 'src/utils/cookie'
import './CompleteRegistration.css'
import Delta from 'quill-delta'
import { AnimatePresence, motion } from 'framer-motion'

// Import Quill
import Quill from 'quill'

// Define PaperOption and UserData interfaces
interface PaperOption {
  value: string
  label: string
}

interface UserData {
  email: string
  paperType: string
  pages: number
  dueDate: string
}

const CompleteRegistration: React.FC = () => {
  const [userData, setUserData] = useState<UserData | null>(null)
  const [selectedPaperType, setSelectedPaperType] =
    useState<PaperOption | null>(null)
  const [numberOfPages, setNumberOfPages] = useState<number>(1)
  const [dueDate, setDueDate] = useState<string>('')
  const [email, setEmail] = useState<string>('')
  const [token, setToken] = useState<string | null>(null)
  const [content, setContent] = useState<string>('')
  const [showInstructions, setShowInstructions] = useState(false)
  const [rotate, setRotate] = useState(false)

  const editorRef = useRef<ReactQuill | null>(null)

  const handleFontSizeChange = (value: string | number) => {
    if (editorRef.current) {
      const quill = editorRef.current.getEditor()
      if (value === 'small' || value === 'large' || value === 'huge') {
        quill.format('size', value)
      } else {
        quill.format('size', false) // Remove font size
      }
    }
  }

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
      borderColor: state.isFocused ? 'var(--focus-color)' : 'none',
      '&:hover': {
        borderColor: state.isFocused ? 'var(--focus-color)' : 'none',
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
    const fetchData = async () => {
      try {
        const tokenFromCookie = getCookie('token')
        if (!tokenFromCookie) {
          console.error('Token not found')
          return
        }

        setToken(tokenFromCookie)

        const url = 'http://localhost:4000/api/redis/user-data'
        const response = await axios.post<UserData>(url, null, {
          headers: {
            Authorization: `Bearer ${tokenFromCookie}`,
            'Content-Type': 'application/json',
          },
        })

        setUserData(response.data)
        setEmail(response.data.email)
        setNumberOfPages(response.data.pages)
        setDueDate(response.data.dueDate)
        setSelectedPaperType(
          paperOptions.find(
            (option) => option.value === response.data.paperType,
          ) || null,
        )
      } catch (error) {
        console.error('Error fetching data:', error)
      }
    }

    fetchData()
  }, [])

  useEffect(() => {
    if (editorRef.current) {
      const quill = editorRef.current.getEditor()

      // Custom handler for heart emoji button
      const customButton = document.createElement('button')
      customButton.innerHTML = '❤️'
      customButton.addEventListener('click', () => {
        const cursorPosition = quill.getSelection()?.index || 0
        quill.insertText(cursorPosition, '❤️', 'user')
      })

      const toolbar = quill.getModule('toolbar') as {
        addHandler: (name: string, handler: () => void) => void
      }
      if (toolbar) {
        toolbar.addHandler('emoji', () => {
          // const toolbarContainer = toolbar.container;
          // toolbarContainer.appendChild(customButton);
          // Use Quill's DOM manipulation to find the toolbar container
          const toolbarContainer = quill.container
            .previousSibling as HTMLElement | null
          const toolbarElement = toolbarContainer?.querySelector('./ql-toolbar')

          // Custom handler for file insert button
          toolbar.addHandler('file', () => {
            const input = document.createElement('input')
            input.setAttribute('type', 'file')
            input.setAttribute('accept', '*') // Adjust accept attribute as needed
            input.onchange = () => {
              const file = input.files?.[0]
              if (file) {
                const range = quill.getSelection()
                if (range) {
                  const { index } = range
                  quill.insertEmbed(index, 'file', file.name)
                }
              }
            }
            input.click()
          })

          if (toolbarElement) {
            toolbarElement.appendChild(customButton)
          }
        })
      }

      const select = quill.container.querySelector(
        '.ql-size select',
      ) as HTMLSelectElement
      if (select) {
        select.addEventListener('change', () => {
          const selectedValue = select.value
          handleFontSizeChange(selectedValue)
        })
      }
    }
  }, [])

  const toggleShowInstructions = (): void => {
    if (content.length > 0) {
      setRotate(!rotate)
      setShowInstructions(!showInstructions)
    }
  }

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
    try {
      const response = await axios.post('/api/register', {
        email,
        paperType: selectedPaperType?.value,
        pages: numberOfPages,
        dueDate,
        content, // send the content as well
      })
      console.log('Registration successful:', response.data)
    } catch (error) {
      console.error('Registration failed:', error)
    }
  }

  return (
    <div className="registration-container bg-gradient-to-r to-primary from-secondary-container h-full">
      <div className="text-2xl mx-[35px] p-[35px]">Complete Your Order</div>
      <div
        className="flex items-start justify-start gap-[5px]"
        id="text-editor"
      >
        <div className="ml-[35px] px-[35px]">
          <form onSubmit={handleSubmit} className="">
            <div className="bg-on-primary editor-container">
              <ReactQuill
                ref={(el) => {
                  if (el) editorRef.current = el
                }}
                theme="snow"
                modules={{
                  toolbar: {
                    container: [
                      [{ size: ['small', false, 'large', 'huge'] }],
                      [{ font: [] }],
                      [{ header: [1, 2, 3, 4, 5, 6, false] }],
                      [{ align: [] }],
                      ['bold', 'italic', 'underline', 'strike'],
                      [{ color: [] }, { background: [] }],
                      ['emoji'], // Add emoji button to toolbar
                      ['link', 'image', 'video', 'formula'],
                      [{ insert: 'file' }], // Add file insert option
                      ['clean'],
                    ],
                  },
                }}
              />
            </div>
            <div className="flex flex-col items-start justify-center gap-[35px] mt-[35px]">
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700"
              >
                Email
              </label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              />
              <label
                htmlFor="paperType"
                className="block text-sm font-medium text-gray-700"
              >
                Paper Type
              </label>
              <Select
                value={selectedPaperType}
                onChange={setSelectedPaperType}
                options={paperOptions}
                styles={customStyles}
              />
              <label
                htmlFor="pages"
                className="block text-sm font-medium text-gray-700"
              >
                Number of Pages
              </label>
              <div className="flex items-center">
                <button
                  type="button"
                  onClick={handleMinus}
                  className="p-2 text-gray-500 rounded cursor-pointer hover:text-gray-900 hover:bg-gray-100 dark:text-gray-400 dark:hover:text-white dark:hover:bg-gray-600"
                >
                  <Icon path={mdiMinus} size={1} />
                </button>
                <span className="mx-2">{numberOfPages}</span>
                <button
                  type="button"
                  onClick={handlePlus}
                  className="p-2 text-gray-500 rounded cursor-pointer hover:text-gray-900 hover:bg-gray-100 dark:text-gray-400 dark:hover:text-white dark:hover:bg-gray-600"
                >
                  <Icon path={mdiPlus} size={1} />
                </button>
              </div>
              <label
                htmlFor="dueDate"
                className="block text-sm font-medium text-gray-700"
              >
                Due Date
              </label>
              <input
                type="date"
                id="dueDate"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              />
              <button
                type="submit"
                className="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Submit
              </button>
            </div>
          </form>
        </div>
        <div className="shadow-xl bg-on-primary flex flex-col w-[350px]">
          <div className="flex items-center justify-between px-[30px] gap-[35px] py-[15px] border-b-[2px] border-gray-300">
            <h3 className="text-xs">ORDER SUMMARY</h3>
            <span>
              <FaChevronUp />
            </span>
          </div>
          <div
            className="flex items-center justify-between px-[30px] gap-[20px] py-[15px] border-b-[2px] border-gray-300 hover:cursor-pointer"
            onClick={toggleShowInstructions}
          >
            <h3 className="text-ts text-gray-600">Instructions and hints</h3>
            <motion.div animate={{ rotate: rotate ? 180 : 0 }}>
              <span className=""></span>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default CompleteRegistration
