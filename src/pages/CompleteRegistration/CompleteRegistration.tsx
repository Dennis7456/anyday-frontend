import React, { useState, useEffect, useRef } from 'react'
import { useDispatch, UseDispatch } from 'react-redux'
import { addFile, clearFiles, removeFile } from 'src/slices/uploadSlice'
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
import { EmbedBlot } from 'parchment'
import FileUpload from 'src/components/FileManager/FileUpload'
import FileList from 'src/components/FileManager/FileList'
import FilePreview from 'src/components/FileManager/FilePreview'
import Quill from 'quill'
import '../../components/FileManager/Quill/FileBlot'
import { FileValue } from 'src/types'

const BlockEmbed = Quill.import('blots/block/embed') as typeof EmbedBlot

interface PaperOption {
  value: string
  label: string
}

interface UserData {
  firstName: string
  lastName: string
  email: string
  dateOfBirth: string
  phoneNumber: string
  paperType: string
  pages: number
  dueDate: string
  instructions: string
}

class FileBlot extends BlockEmbed {
  static blotName = 'file'
  static tagName = 'a'

  static create(value: FileValue) {
    const node = super.create() as HTMLAnchorElement
    // node.setAttribute('href', value.url);
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
  const [dateOfBirth, setDateOfBirth] = useState<string>('')
  const [phoneNumber, setPhoneNumber] = useState<string>('')
  const [token, setToken] = useState<string | null>(null)
  const [content, setContent] = useState<string>('')
  const [summary, setSummary] = useState<string>('')
  const [myDetails, setMyDetails] = useState<string[]>([])
  const [showSummary, setShowSummary] = useState(false)
  const [showInstructions, setShowInstructions] = useState(false)
  const [showMyDetails, setShowMyDetails] = useState(false)
  const [rotateSummary, setRotateSummary] = useState(false)
  const [rotateInstructions, setRotateInstructions] = useState(false)
  const [rotateMyDetails, setRotateMyDetails] = useState(false)
  // const [rotate, setRotate] = useState(false)
  const [showDestinations, setShowDestinations] = useState(false)
  const [instructions, setInstructions] = useState([])
  const [uploadedFiles, setUploadedFiles] = useState<FileValue[]>([])

  const editorRef = useRef<ReactQuill | null>(null)
  const fileInputRef = useRef<HTMLInputElement | null>(null)
  const dispatch = useDispatch()

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

  const baseUrl =
    process.env.REACT_APP_BACKEND_URL ||
    'https://anyday-backend-app-hufozn77kq-uc.a.run.app'

  const customStyles: StylesConfig<PaperOption, false> = {
    control: (provided, state) => ({
      ...provided,
      background: 'white',
      display: 'flex',
      flexWrap: 'nowrap',
      // borderColor: 'hsl(0deg 78.56% 55.56%);',
      borderColor: 'transparent',
      '&:hover': { borderColor: state.isFocused ? 'gray' : 'gray' },
      boxShadow: state.isFocused ? '0 0 0 0px var(--focus-color)' : 'none',
      border: '0.5px solid black',
      width: 'full',
    }),
    indicatorSeparator: (provided, state) => ({
      ...provided,
      backgroundColor: 'black', // Change the color of the separator
      width: '0.5px', // Adjust the width of the separator
      margin: '0 8px', // Adjust the margin (spacing) around the separator
    }),
    menu: (provided, state) => ({
      ...provided,
      // backgroundColor: 'var(--input-background)',
      backgroundColor: 'transparent',
      // color: 'var(--text-color)',
      color: 'white',
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

  // Fetch temporary data from redis through backend and update the user data
  useEffect(() => {
    let isMounted = true

    const fetchData = async () => {
      try {
        const tokenFromCookie = getCookie('token')
        if (!tokenFromCookie) {
          console.error('Token not found')
          return
        }

        setToken(tokenFromCookie)

        const url = `${baseUrl}/api/redis/user-data`
        const response = await axios.post<UserData>(url, null, {
          headers: {
            Authorization: `Bearer ${tokenFromCookie}`,
            'Content-Type': 'application/json',
          },
        })

        if (isMounted) {
          setUserData(response.data)
          setEmail(response.data.email)
          setNumberOfPages(response.data.pages)
          setDueDate(response.data.dueDate)
          setSelectedPaperType(
            paperOptions.find(
              (option) =>
                option.value === response.data.paperType.toLowerCase(),
            ) || null,
          )
        }
      } catch (error) {
        console.error('Error fetching data:', error)
      }
    }

    fetchData()

    return () => {
      isMounted = false
    }
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
      // fileInput.setAttribute('accept', '*')
      fileInput.setAttribute('multiple', '')
      fileInput.style.display = 'none'
      fileInput.className = 'ql-file-input'
      // fileInput.addEventListener('change', handleFileInputChange)
      fileInput.addEventListener('change', (event) => {
        const files = (event.target as HTMLInputElement).files

        if (files) {
          const fileArray = Array.from(files)

          fileArray.forEach((file, index) => {
            const fileData = {
              id: Date.now() + index,
              name: file.name,
              size: file.size,
              type: file.type,
              file: file,
              url: URL.createObjectURL(file),
            }

            const quill = editorRef.current?.getEditor()
            const cursorPosition = quill?.getSelection()?.index || 0
            //     const fileLink = `<div id="file-${fileData.id}" style="display: flex; align-items: center;">
            //   <a href="${fileData.url}" download="${fileData.name}"> 📁 ${fileData.name}</a>
            //   <button className="cursor-pointer" type="button" onclick="removeFile(${fileData.id})" style="margin-left: 10px; border: none; background: none; cursor: pointer;">
            //     ❌
            //   </button>
            // </div>`
            const fileLink = `<a href="${fileData.url}" download="${fileData.name}"> 📁 ${fileData.name}</a>`
            if (quill) {
              quill?.clipboard.dangerouslyPasteHTML(cursorPosition, fileLink)
            }
            setUploadedFiles((prevFiles) => [...prevFiles, fileData])
            dispatch(addFile(fileData))
          })
        }
      })

      // Function to remove file by ID
      const removeFileHandler = (fileId: number) => {
        // const quill = editorRef.current?.getEditor();
        // Remove the file link from the Quill editor
        // if (quill) {
        //   const fileElement = document.getElementById(`file-${fileId}`);
        //   if (fileElement) {
        //     fileElement.remove();
        //   }
        // }
        //Remove the file from state
        // setUploadedFiles((prevFiles) => prevFiles.filter(file => file.id !==fileId));
        //Dispatch an action to remove the file from redux store
        // dispatch(removeFile(fileId));
      }

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

  // Function to generate a summary (this is a placeholder function)
  const generateSummary = (text: string): string => {
    const sentences = text.split('. ').slice(0, 3) // Get the first 3 sentences
    return sentences.join('. ') + (sentences.length > 3 ? '...' : '')
  }

  // Function to handle summarizing the editor content
  const handleSummarize = () => {
    if (editorRef.current) {
      const quill = editorRef.current.getEditor() // Access the Quill instance
      const editorText = quill.getText().trim() // Get plain text from the editor

      if (editorText) {
        const summaryText = generateSummary(editorText)
        setSummary(summaryText)
      }
    }
  }

  const toggleShowSummary = (): void => {
    handleSummarize()
    setShowSummary(!showSummary)
    setRotateSummary(!rotateSummary)
  }

  const toggleShowInstructions = (): void => {
    setShowInstructions(!showInstructions)
    setRotateInstructions(!rotateInstructions)
  }

  const toggleShowMyDetails = (): void => {
    setMyDetails((prevDetails) => {
      const upDatedDetails = [...prevDetails]

      if (firstName) {
        if (!upDatedDetails.includes(firstName)) {
          upDatedDetails.push(firstName)
        }
      }

      if (lastName) {
        if (!upDatedDetails.includes(lastName)) {
          upDatedDetails.push(lastName)
        }
      }

      return upDatedDetails
    })

    setShowMyDetails(!showMyDetails)
    setRotateMyDetails(!rotateMyDetails)
  }

  // const handleContentChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  //   setContent(e.target.value)
  // }

  const handleFirstNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newFirstName = e.target.value
    setFirstName(newFirstName)
  }

  const handleLastNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLastName(e.target.value)
  }

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value)
  }

  const handleDateOfBirthChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setDateOfBirth(e.target.value)
  }

  const handlePhoneNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPhoneNumber(e.target.value)
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

  const handleFileUpload = (files: File[]) => {
    const newFiles = files.map((file, index) => ({
      id: Date.now() + index,
      name: file.name,
      size: file.size,
      type: file.type,
      file: file,
      url: URL.createObjectURL(file),
    }))

    setUploadedFiles((prevFiles) => [...prevFiles, ...newFiles])
  }

  const handleRemoveFile = (id: number) => {
    setUploadedFiles((prevFiles) => prevFiles.filter((file) => file.id !== id))
    dispatch(removeFile(id))
  }

  const handleClearFiles = () => {
    console.log('clicked!!')
    setUploadedFiles([])
    dispatch(clearFiles())
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    try {
      const updatedUserData: UserData = {
        firstName,
        lastName,
        email,
        dateOfBirth,
        phoneNumber,
        paperType: selectedPaperType?.value || '',
        pages: numberOfPages,
        dueDate,
        instructions: content,
      }

      if (!token) {
        console.error('Token is missing')
        return
      }

      const url = `${baseUrl}/api/redis/user-data/update`
      await axios.post(url, updatedUserData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      })

      console.log('Data updated successfully')
    } catch (error) {
      console.error('Error updating data:', error)
    }
  }
  //Set summary as it changes
  useEffect(() => {
    content.length < 30 ? setSummary(content) : content
    console.log(content)
  }, [content])

  return (
    <div className="registration-container bg-gradient-to-r to-primary from-secondary-container h-full">
      <div className="flex items-center justify-start px-[75px] pt-[35px]">
        <div className="">
          <a href="/">
            <img src="/media/logo.png" alt="Any Day Logo" className="logo" />
          </a>
        </div>
      </div>
      <div className="text-2xl mx-[75px] py-[15px] font-light">
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
                value={content}
                onChange={setContent}
              />
            </div>
            <div className="flex flex-row justify-between">
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
                  value={firstName}
                  onChange={handleFirstNameChange}
                  className="required:border-error invalid:border-error shadow border-0 focus:border-1 rounded w-[270px] py-2 px-3 focus:outline-none focus:shadow-outline text-secondary"
                />
                <label
                  htmlFor="last-name"
                  className="block text-sm font-medium text-gray-700"
                >
                  Last Name
                </label>
                <input
                  type="text"
                  id="last-name"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  className="required:border-error invalid:border-error shadow border-0 focus:border-1 rounded w-[270px] py-2 px-3 focus:outline-none focus:shadow-outline text-secondary"
                />
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-gray-700"
                >
                  Email Address
                </label>
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="required:border-error invalid:border-error shadow border-0 focus:border-1 rounded w-[270px] py-2 px-3 focus:outline-none focus:shadow-outline text-secondary"
                />
                <label
                  htmlFor="date-of-birth"
                  className="block text-sm font-medium text-gray-700"
                >
                  Date of Birth
                </label>
                <input
                  type="date"
                  id="date-of-birth"
                  value={dateOfBirth}
                  onChange={(e) => setDateOfBirth(e.target.value)}
                  className="required:border-error invalid:border-error shadow border-0 focus:border-1 rounded w-[270px] py-2 px-3 focus:outline-none focus:shadow-outline text-secondary"
                />
                <label
                  htmlFor="phone-number"
                  className="block text-sm font-medium text-gray-700"
                >
                  Phone Number
                </label>
                <input
                  type="tel"
                  id="phone-number"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  className="required:border-error invalid:border-error shadow border-0 focus:border-1 rounded w-[270px] py-2 px-3 focus:outline-none focus:shadow-outline text-secondary"
                />
                <label
                  htmlFor="paper-type"
                  className="block text-sm font-medium text-gray-700"
                >
                  Paper Type
                </label>
                <Select
                  inputId="paper-type"
                  options={paperOptions}
                  value={selectedPaperType}
                  onChange={setSelectedPaperType}
                  styles={customStyles}
                  className="w-[270px]"
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
                  <span className="mx-2" id="pages">
                    {numberOfPages}
                  </span>
                  <button
                    type="button"
                    onClick={handlePageIncrement}
                    className="shadow-md bg-on-primary ml-[15px] p-2 text-gray-500 rounded cursor-pointer hover:text-gray-900 hover:bg-gray-100 dark:text-gray-400 dark:hover:text-white dark:hover:bg-gray-600"
                  >
                    <Icon path={mdiPlus} size={1} />
                  </button>
                </div>
                <label
                  htmlFor="due-date"
                  className="block text-sm font-medium text-gray-700"
                >
                  Due Date
                </label>
                <input
                  type="date"
                  id="due-date"
                  value={dueDate}
                  onChange={(e) => setDueDate(e.target.value)}
                  className="required:border-error invalid:border-error shadow border-0 focus:border-1 rounded w-[270px] py-2 px-3 focus:outline-none focus:shadow-outline text-secondary"
                />
                {/* <label
                htmlFor="file-upload"
                className="block text-sm font-medium text-gray-700"
              >
                Upload Files
              </label>
              <FileUpload onUpload={handleFileUpload} editorRef={editorRef}/>
              <FileList
                propFiles={uploadedFiles}
                onRemove={handleRemoveFile}
                onClearFiles={handleClearFiles}
              />
              {uploadedFiles.length > 0 && (
                <div className="file-previews mt-4">
                  {uploadedFiles.map((fileValue) => (
                    <FilePreview key={fileValue.id} fileValue={fileValue} />
                  ))}
                </div>
              )} */}
                <button
                  type="submit"
                  className="mt-4 inline-flex items-end px-7 py-2 border-transparent text-sm rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 mb-[35px] border-2 font-semibold text-black hover:bg-primary hover:text-on-primary active:bg-tertiary-container"
                >
                  Submit
                </button>
              </div>
              <div className="flex flex-col items-start gap-[15px] mt-[35px]">
                <label
                  htmlFor="file-upload"
                  className="block text-sm font-medium text-gray-700"
                >
                  Upload Files
                </label>
                <FileUpload onUpload={handleFileUpload} editorRef={editorRef} />
                <div className="text-sm flex flex-row">
                  <FileList
                    propFiles={uploadedFiles}
                    onRemove={handleRemoveFile}
                    onClearFiles={handleClearFiles}
                  />
                </div>
                {/* {uploadedFiles.length > 0 && (
                <div className="file-previews mt-4">
                  {uploadedFiles.map((fileValue) => (
                    <FilePreview key={fileValue.id} fileValue={fileValue} />
                  ))}
                </div>
              )} */}
              </div>
            </div>
          </form>
        </div>
        <div className="shadow-xl bg-on-primary flex flex-col w-[350px]">
          <div
            className="flex items-center justify-between px-[30px] gap-[35px] py-[15px] border-b-[2px] border-gray-300 cursor-pointer"
            onClick={toggleShowSummary}
          >
            <h3 className="text-xs">ORDER SUMMARY</h3>
            <motion.div animate={{ rotate: rotateSummary ? 180 : 0 }}>
              <span className={`${showSummary && ''}`}>
                <FaChevronUp className="text-md" />
              </span>
            </motion.div>
          </div>
          {showSummary && summary.length > 0 && (
            <motion.div
              className="p-[20px] text-xs bg-tertiary-container text-on-primary-container"
              initial="collapsed"
              animate="open"
              exit="collapsed"
              variants={{
                open: { opacity: 1 },
                collapsed: { opacity: 0 },
              }}
              transition={{ duration: 0.5, ease: 'easeIn' }}
            >
              <p className="">{summary}</p>
            </motion.div>
          )}
          <div
            className="flex items-center justify-between px-[30px] gap-[20px] py-[15px] border-b-[2px] border-gray-300 hover:cursor-pointer"
            onClick={toggleShowInstructions}
          >
            <h3 className="text-xs text-gray-600">Instructions and Files</h3>
            <motion.div animate={{ rotate: rotateInstructions ? 180 : 0 }}>
              <span className={`${showInstructions && ''}`}>
                <FaChevronUp className="text-sm" />
              </span>
            </motion.div>
          </div>
          {showInstructions && uploadedFiles.length > 0 && (
            <motion.div
              className="p-[20px] text-xs bg-tertiary-container text-on-primary-container"
              initial="collapsed"
              animate="open"
              exit="collapsed"
              variants={{
                open: { opacity: 1 },
                collapsed: { opacity: 0 },
              }}
              transition={{ duration: 0.5, ease: 'easeIn' }}
            >
              {/* {<div className="file-previews mt-4">
                  {uploadedFiles.map((fileValue) => (
                    <FilePreview key={fileValue.id} fileValue={fileValue} />
                  ))}
                </div>} */}
              <FileList
                propFiles={uploadedFiles}
                onRemove={handleRemoveFile}
                onClearFiles={handleClearFiles}
              />
            </motion.div>
          )}

          <div
            className="flex items-center justify-between px-[30px] gap-[20px] py-[15px] border-b-[2px] border-gray-300 hover:cursor-pointer"
            onClick={toggleShowMyDetails}
          >
            <h3 className="text-xs text-gray-600">My details</h3>
            <motion.div animate={{ rotate: rotateMyDetails ? 180 : 0 }}>
              <span className={`${showMyDetails && ''}`}>
                <FaChevronUp className="text-sm" />
              </span>
            </motion.div>
          </div>
          {showMyDetails && myDetails.length > 0 && (
            <motion.div
              className="p-[20px] text-xs bg-tertiary-container text-on-primary-container"
              initial="collapsed"
              animate="open"
              exit="collapsed"
              variants={{
                open: { opacity: 1 },
                collapsed: { opacity: 0 },
              }}
              transition={{ duration: 0.5, ease: 'easeIn' }}
            >
              {myDetails.map((detail, index) => (
                <div key={index}>
                  <div className="flex items-start justify-normal gap-[10px]">
                    <span>
                      <FaRegCircle className="text-sm" />
                    </span>
                    <div>{detail}</div>
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
