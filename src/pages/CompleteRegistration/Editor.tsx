// import React, { useEffect, useRef } from 'react';
// import Quill, { DeltaStatic } from 'quill';
// import 'quill/dist/quill.snow.css';

// // Example type declaration or assertion
// interface SizeFormat {
//   whitelist: string[];
// }

// const Editor: React.FC = () => {
//   const editorRef = useRef<HTMLDivElement>(null);

//   useEffect(() => {
//     if (editorRef.current) {
//       const quill = new Quill(editorRef.current, {
//         theme: 'snow',
//         modules: {
//           toolbar: [
//             [{ size: ['extra-small', 'small', 'medium', 'large'] }],
//             ['bold', 'italic', 'underline', 'strike'],
//             [{ list: 'ordered' }, { list: 'bullet' }],
//             ['link', 'image'],
//             ['clean'],
//           ],
//         },
//       });

//       // Example custom handler for size
//       quill.getModule('toolbar').addHandler('size', (value: string) => {
//         const sizeFormat = quill.getFormat('size') as SizeFormat | undefined;
//         if (sizeFormat?.whitelist.includes(value)) {
//           quill.format('size', value);
//         } else {
//           quill.format('size', false);
//         }
//       });

//       // Example registration of custom size format
//       const Size = Quill.import('formats/size') as SizeFormat;
//       Size.whitelist = ['extra-small', 'small', 'medium', 'large'];
//       Quill.register(Size, true);
//     }
//   }, []);

//   return <div ref={editorRef} />;
// };

// export default Editor;

export {}
