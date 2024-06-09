import { useEffect, useState } from 'react';
import './Order.css';
import Icon from '@mdi/react';
import { mdiPlus, mdiMinus, mdiAlertCircleOutline, mdiChevronDown, mdiCalendarClock } from '@mdi/js';
// import { InputMoment } from 'moment';
const Order = () => {
    let [number, setNumber] = useState(1);
    let [warning, setWarning] = useState('');
    let [words, setWords] = useState(275);

    
    useEffect(() => {
        if(number < 1){
            setWarning('Number of pages cannot be less than 1');
            setTimeout(function(){
                setWarning('');
                setNumber(1)
            }, 3000);
        } else {
            setWarning('');
            words = number * 275;
            setWords(words);
        }
        console.log(warning);
    });

    const handlePlus = (e) => {
        //e.preventDefailt();
        //alert(e);
        number+=1;
        setNumber(number);
        
    }

    function handleMinus(e){
        //alert(e);
        //e.preventDefailt();
        number-=1;
        setNumber(number);
    }

    const handleSubmit = (event) =>{
        event.preventDefault();
        console.log('form submitted');
    }

    return (

        <div className="w-96 ">
            <form onSubmit={handleSubmit} className="bg-on-primary shadow-md rounded px-8 pt-6 mb-4 text-1xl font-semibold text-on-background">Unlock better papers
            <div><label className="pb-2 text-start block text-on-background text-sm font-light">Email</label>
            <input  className="required:border-error invalid:border-error shadow border-0 focus:border-1 rounded w-full py-2 px-3 focus:outline-none focus:shadow-outline text-secondary" id="email" type="text" placeholder="Email"></input></div>
            <div className="my-3"><label className="pb-2 text-start block text-on-background text-sm font-light">Type of paper</label>
            <div>
            <div class="flex justify-start">
  <div className="mb-3">
    <select className="form-select shadow text-secondary focus:border-1
      w-full
      rounded leading-tight
      py-1.5
      text-base
      py-2 px-3 
      bg-on-primary bg-clip-padding bg-no-repeat
      border-0
      rounded
      focus:outline-none focus:shadow-outline
      transition
      ease-in-out
      m-0
         text-on-background focus:bg-white opacity-100 focus:border-1 focus:outline-none" aria-label="Default select example">
            <Icon path={mdiChevronDown} title="" size={1} />            
        <option className='text-secondary' selected>Essay (any type)</option>
        <option value="1">Admission essay</option>
        <option value="2">Annotated bibliography</option>
        <option value="3">Argumentative essay</option>
        <option value="3">Article review</option>
        <option value="3">Book/movie review</option>
        <option value="3">Business plan</option>
        <option value="3">Presentation speech</option>
        <option value="3">Research proposal</option>
        <option value="3">Case study</option>
        <option value="3">Critical thinking</option>
        <option value="3">Course work</option>
        <option value="3">Term paper</option>
        <option value="3">Thesis/Dissertation chapter</option>
        <option value="3">Creative writing</option>
        <option value="3">Other</option>
        
    </select>
  </div>
</div>
            </div>
            <label className="pb-2 text-start block text-on-background text-sm font-light">Pages</label>
            <div className='flex justify-start items-center'>
            <button className='rounded shadow border-0 hover:text-on-primary bg-primary-container px-6 py-2 ' onClick={handleMinus}>
            <Icon path={mdiMinus} title="" size={1} />
            </button>
            <input type='number' className='opacity-100 text-secondary w-20 h-10 border-0 hover:border-0 text-center focus:outline-none display-none' value={number}></input>
            <button className='rounded shadow border-0 hover:text-on-primary bg-primary-container px-6 py-2' onClick={handlePlus}>
                <Icon path={mdiPlus} title="" size={1} />
            </button>
            <span className='ml-5'></span>
            <div className='text-secondary bg-primary-containerrounded px-1 py-1 text-sm font-semibold'>{words} words.</div>
            </div>
            {warning ? <div className="flex justify-evenly items-center opacity-60 bg-error mt-3 text-on-primary border border-0 text-sm font-md px-4 py-2 rounded relative" role="alert">
                <div>
                {warning}
                </div>
                <div className='ml-1'>
                <Icon path={mdiAlertCircleOutline} title="Error" size={1}></Icon>
                </div>
                </div> : null}
                <label className="pb-2 pt-3 text-start block text-on-background text-sm font-light">Deadline</label>
                
           <div className='flex justify-start items-center text-secondary'>
            <input className='opacity-100 required:border-error invalid:border-error shadow border-0 focus:border-1 rounded w-30 py-2 px-3 focus:outline-none focus:shadow-outline text-secondary date-pointer' type='datetime-local' placeholder='Date'></input>
            </div>
            <div className='flex justify-center pt-4'>
                <div className='bg-warning text-sm font-md text-secondary text-on-primary rounded w-full py-2 border-1 outline-5 border-primary'>
                    We recommend leaving at least <span className='text-bold'>1</span> hour to complete the order.
                </div>
            </div>
            <div className='flex justify-center items-center h-20'>
                <button className="borderborder-black border-2 px-11 py-1 rounded-full font-semibold text-black hover:bg-primary hover:text-on-primary active:bg-tertiary-container" type="button">Place your order</button>
            </div>
            <div className='font-light text-on-background text-xs py-3 pb-6'>This site is protected by reCAPTCHA and the google <a className='text-primary hover:text-on-primary-container hover:font-semibold' href='#'>Privacy Policy</a> and <a href='#' className='text-primary hover:text-on-primary-container hover:font-semibold'>Terms of Service apply</a></div>
            </div>
            </form>
        </div>
    )
}

export default Order;