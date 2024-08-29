import Quill from 'quill'

// Define the type for Block
interface BlockClass {
  new (...args: unknown[]): any
  create(value: FileBlotValue): HTMLElement
  formats(node: HTMLElement): FileBlotValue
  format(name: string, value: FileBlotValue): void
}

// Define a type for the value used in FileBlot
interface FileBlotValue {
  url: string
  name: string
}

// Import Block correctly
const Block = Quill.import('blots/block') as BlockClass

class FileBlot extends Block {
  static blotName = 'file'
  static tagName = 'a'

  static create(value: FileBlotValue) {
    const node = super.create(value)
    node.setAttribute('href', value.url)
    node.setAttribute('download', value.name)
    node.textContent = `📁 ${value.name}`
    return node
  }

  static formats(node: HTMLElement) {
    return {
      url: node.getAttribute('href') ?? '',
      name: node.getAttribute('download') ?? '',
    }
  }

  format(name: string, value: FileBlotValue) {
    if (name !== FileBlot.blotName) {
      super.format(name, value)
    }
  }
}

// Register the custom blot with Quill
Quill.register({
  [FileBlot.blotName]: FileBlot,
})
