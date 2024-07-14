import React, { useState, useEffect, useRef } from 'react'
import Select, { StylesConfig } from 'react-select'
import ReactQuill from 'react-quill'
import 'react-quill/dist/quill.snow.css'
import Icon from '@mdi/react'
import { FaChevronUp, FaRegCircle } from 'react-icons/fa'
import { mdiPlus, mdiMinus } from '@mdi/js'
import axios from 'axios'
import { getCookie } from 'src/utils/cookie'
import './CompleteRegistration.css'
import { AnimatePresence, motion } from 'framer-motion'
import Quill from 'quill'
import { EmbedBlot } from 'parchment'
// import Parchment from 'parchment';

// const BlockEmbed: typeof BlockEmbed = Quill.import('blots/block/embed') as typeof BlockEmbed;
const BlockEmbed = Quill.import('blots/block/embed') as typeof EmbedBlot

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

interface FileValue {
  url: string
  name: string
}

class FileBlot extends BlockEmbed {
  static blotName = 'file'
  static tagName = 'a'
  // static scope = Parchment.Scope.INLINE;

  static create(value: FileValue) {
    const node = super.create() as HTMLAnchorElement
    node.setAttribute('href', value.url)
    node.setAttribute('download', value.name)
    node.textContent = value.name
    return node
  }

  static value(node: HTMLElement) {
    return {
      url: (node as HTMLAnchorElement).getAttribute('href') || '',
      name: node.textContent || '',
    }
  }
}

Quill.register(FileBlot)

const CompleteRegistration: React.FC = () => {
  const [userData, setUserData] = useState<UserData | null>(null)
  const [selectedPaperType, setSelectedPaperType] =
    useState<PaperOption | null>(null)
  const [numberOfPages, setNumberOfPages] = useState<number>(1)
  const [dueDate, setDueDate] = useState<string>('')
  const [email, setEmail] = useState<string>('')
  const [firstName, setFirstName] = useState<string>('')
  const [lastName, setLastName] = useState<string>('')
  const [phoneNumber, setPhoneNumber] = useState<string>('')
  const [token, setToken] = useState<string | null>(null)
  const [content, setContent] = useState<string>('')
  const [showInstructions, setShowInstructions] = useState(false)
  const [rotate, setRotate] = useState(false)
  const [showDestinations, setShowDestinations] = useState(false)
  const [instructions, setInstructions] = useState([])
  const [uploadedFiles, setUploadedFiles] = useState<FileValue[]>([])

  const editorRef = useRef<ReactQuill | null>(null)

  const handleFontSizeChange = (value: string | number) => {
    if (editorRef.current) {
      const quill = editorRef.current.getEditor()
      if (value === 'small' || value === 'large' || value === 'huge') {
        quill.format('size', value)
      } else {
        quill.format('size', false)
      }
    }
  }

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

      // Function to insert heart emoji
      const insertHeartEmoji = () => {
        const cursorPosition = quill.getSelection()?.index || 0
        quill.insertText(cursorPosition, '❤️', 'user')

        const newPosition = cursorPosition + 2

        quill.setSelection(newPosition, 0)
      }

      const handleFileInputChange: EventListener = (e) => {
        const file = (e.target as HTMLInputElement).files?.[0]
        if (file && editorRef.current) {
          const quill = editorRef.current.getEditor()

          const cursorPosition = quill.getSelection()?.index || 0
          const fileLink = `<a href="${URL.createObjectURL(file)}" download="${file.name}"> 📁 ${file.name}</a>`
          quill.clipboard.dangerouslyPasteHTML(cursorPosition, fileLink)
        }
      }

      const heartButton = document.createElement('button')
      heartButton.innerHTML = '❤️'
      heartButton.className = 'ql-heart'
      heartButton.addEventListener('click', insertHeartEmoji)

      const fileInput = document.createElement('input')
      fileInput.setAttribute('type', 'file')
      fileInput.setAttribute('accept', '*')
      fileInput.style.display = 'none'
      fileInput.className = 'ql-file-input'
      fileInput.addEventListener('change', handleFileInputChange)

      const fileButton = document.createElement('button')
      fileButton.innerHTML = '📁'
      fileButton.className = 'ql-file'
      fileButton.addEventListener('click', () => fileInput.click())

      const toolbar = quill.getModule('toolbar')
      if (toolbar && quill.root.parentNode) {
        const toolbarContainer = quill.root.parentNode
          .previousSibling as HTMLElement

        if (!toolbarContainer.querySelector('.ql-heart')) {
          toolbarContainer.appendChild(heartButton)
        }

        if (!toolbarContainer.querySelector('.ql-file')) {
          toolbarContainer.appendChild(fileButton)
        }

        if (!toolbarContainer.querySelector('.ql-file-input')) {
          toolbarContainer.appendChild(fileInput)
        }
      }

      if (quill.root.parentNode) {
        const select = quill.root.parentNode.querySelector(
          '.ql-size select',
        ) as HTMLSelectElement
        if (select) {
          select.addEventListener('change', () => {
            const selectedValue = select.value
            handleFontSizeChange(selectedValue)
          })
        }
      }
    }
  }, [])

  const toggleShowInstructions = (): void => {
    if (content.trim() === '') {
      setContent('<p></p>') // Set the initial content here
    }
    setShowInstructions(!showInstructions)
    setRotate(!rotate)
  }

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value)
  }

  const handleDueDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setDueDate(e.target.value)
  }

  const handlePaperTypeChange = (option: PaperOption | null) => {
    setSelectedPaperType(option)
  }

  const handlePageIncrement = () => {
    setNumberOfPages((prev) => prev + 1)
  }

  const handlePageDecrement = () => {
    if (numberOfPages > 1) {
      setNumberOfPages((prev) => prev - 1)
    }
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    try {
      const updatedUserData: UserData = {
        email,
        paperType: selectedPaperType?.value || '',
        pages: numberOfPages,
        dueDate,
      }

      if (!token) {
        console.error('Token is missing')
        return
      }

      const url = 'http://localhost:4000/api/redis/user-data/update'
      await axios.post(url, updatedUserData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      })

      console.log('Data updated successfully')

      // Upload files

      const handleFileUpload = async () => {
        //   const file = fileInputRef.current?.files?.[0];
        //   if(file) {
        //     const formData = new FormData();
        //     formData.append('file', file);
        //     try {
        //   const response = await axios.post('http://localhost:4000/api/upload', formData, {
        //     headers: {
        //       'Content-Type': 'multipart/form-data',
        //     },
        //   });
        //   console.log('File uploaded successfully:', response.data);
        //   // Handle further actions after successful upload
        // } catch (error) {
        //   console.error('Error uploading file:', error);
        //   // Handle error scenarios
        // }
        //   }

        // const newFile: FileValue = {
        //   url: URL.createObjectURL(file),
        //   name: file.name,
        // };

        try {
          // const response = await axios.post('http://localhost:4000/api/upload', formData, {
          //   headers: {
          //     'Content-Type': 'multipart/form-data',
          //   },
          // });
          // console.log('File uploaded successfully:', response.data);
          // Handle further actions after successful upload
        } catch (error) {
          console.error('Error uploading file:', error)
          // Handle error scenarios
        }
        // setUploadedFiles([...uploadedFiles, newFile]);

        if (editorRef.current) {
          const quill = editorRef
        }
      }
    } catch (error) {
      console.error('Error updating data:', error)
    }
  }

  return (
    <div className="registration-container bg-gradient-to-r to-primary from-secondary-container h-full">
      <div className=" flex items-center justify-start px-[50px] py-[35px]">
        <div className="">
          <a href="/">
            <img
              src="/media/logo.png"
              alt="Any Day Logo"
              className="logo"
            ></img>
          </a>
        </div>
      </div>
      <div className="text-2xl mx-[35px] p-[35px] font-light">
        Complete Your Order
      </div>
      <div
        className="flex items-start justify-start gap-[5px]"
        id="text-editor"
      >
        <div className="ml-[35px] px-[35px]">
          <form onSubmit={handleSubmit} className="">
            <div className="bg-on-primary editor-container shadow-2xl">
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
                      ['link', 'image', 'video', 'formula'],
                      ['clean'],
                    ],
                  },
                }}
                placeholder="Add instructions here or leave a ❤️"
              />
            </div>
            <div className="flex flex-col items-start justify-center gap-[15px] mt-[35px]">
              <label
                htmlFor="first-name"
                className="block text-sm font-medium text-gray-700"
              >
                First Name
              </label>
              <input
                type="text"
                id="first-name"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="required:border-error invalid:border-error shadow border-0 focus:border-1 rounded w-[270px] py-2 px-3 focus:outline-none focus:shadow-outline text-secondary"
              />
              <label
                htmlFor="second-name"
                className="block text-sm font-medium text-gray-700"
              >
                Second Name
              </label>
              <input
                type="text"
                id="second-name"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="required:border-error invalid:border-error shadow border-0 focus:border-1 rounded w-[270px] py-2 px-3 focus:outline-none focus:shadow-outline text-secondary"
              />
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
                className="required:border-error invalid:border-error shadow border-0 focus:border-1 rounded w-[270px] py-2 px-3 focus:outline-none focus:shadow-outline text-secondary"
              />
              <label
                htmlFor="phone-number"
                className="block text-sm font-medium text-gray-700"
              >
                Phone number
              </label>
              <input
                type="number"
                id="phone-number"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="required:border-error invalid:border-error shadow border-0 focus:border-1 rounded w-[270px] py-2 px-3 focus:outline-none focus:shadow-outline text-secondary"
              />
              <label
                htmlFor="paperType"
                className="block text-sm font-medium text-gray-700"
              >
                Paper Type
              </label>
              <Select
                className="w-[270px] shadow border-0 focus:border-1 py-2 px-3"
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
                  onClick={handlePageDecrement}
                  className="shadow-md bg-on-primary mr-[15px] p-2 text-gray-500 rounded cursor-pointer hover:text-gray-900 hover:bg-gray-100 dark:text-gray-400 dark:hover:text-white dark:hover:bg-gray-600"
                >
                  <Icon path={mdiMinus} size={1} />
                </button>
                <span className="mx-2">{numberOfPages}</span>
                <button
                  type="button"
                  onClick={handlePageIncrement}
                  className="shadow-md bg-on-primary ml-[15px] p-2 text-gray-500 rounded cursor-pointer hover:text-gray-900 hover:bg-gray-100 dark:text-gray-400 dark:hover:text-white dark:hover:bg-gray-600"
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
                type="datetime-local"
                id="dueDate"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                className="opacity-100 required:border-error invalid:border-error shadow border-0 focus:border-1 rounded w-30 py-2 px-3 focus:outline-none focus:shadow-outline text-secondary date-pointer"
              />
              <button
                type="submit"
                className="mt-4 inline-flex items-end px-7 py-2 border-transparent text-sm rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 mb-[35px] border-2 font-semibold text-black hover:bg-primary hover:text-on-primary active:bg-tertiary-container"
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
            <h3 className="text-xs text-gray-600">Instructions and Files</h3>
            <motion.div animate={{ rotate: rotate ? 180 : 0 }}>
              <span className={`${showInstructions && ''}`}>
                <FaChevronUp className="text-sm" />
              </span>
            </motion.div>
          </div>
          {showInstructions && instructions.length > 0 && (
            <motion.div
              className="p-[20px] text-xs"
              initial="collapsed"
              animate="open"
              exit="collapsed"
              variants={{
                open: { opacity: 1 },
                collapsed: { opacity: 0 },
              }}
              transition={{ duration: 0.5, ease: 'easeIn' }}
            >
              {instructions.map((instruction, index) => (
                <div key={index}>
                  <div className="flex items-start justify-normal gap-[10px]">
                    <span>
                      <FaRegCircle className="text-sm" />
                    </span>
                    <div>{instructions}</div>
                  </div>
                </div>
              ))}
            </motion.div>
          )}

          <div
            className="flex items-center justify-between px-[30px] gap-[20px] py-[15px] border-b-[2px] border-gray-300 hover:cursor-pointer"
            onClick={toggleShowInstructions}
          >
            <h3 className="text-xs text-gray-600">My details</h3>
            <motion.div animate={{ rotate: rotate ? 180 : 0 }}>
              <span className={`${showInstructions && ''}`}>
                <FaChevronUp className="text-sm" />
              </span>
            </motion.div>
          </div>
          {showInstructions && instructions.length > 0 && (
            <motion.div
              className="p-[20px] text-xs"
              initial="collapsed"
              animate="open"
              exit="collapsed"
              variants={{
                open: { opacity: 1 },
                collapsed: { opacity: 0 },
              }}
              transition={{ duration: 0.5, ease: 'easeIn' }}
            >
              {instructions.map((instruction, index) => (
                <div key={index}>
                  <div className="flex items-start justify-normal gap-[10px]">
                    <span>
                      <FaRegCircle className="text-sm" />
                    </span>
                    <div>{instructions}</div>
                  </div>
                </div>
              ))}
            </motion.div>
          )}
        </div>
      </div>
    </div>
  )
}

export default CompleteRegistration
