import './Navigation.css';
const NavigationBar = () => {
    return (
        <nav className='flex justify-between items-center'>
            <div>
                <a href="/">
                    <img src="/media/new-logo.png" alt="Any Day Logo" className="logo"></img>
                </a>
            </div>
            <div>
                <a href="/" className='text-xs text-black font-bold uppercase'>Home Page</a>
                <a href="/" className='active ml-3 rounded-full text-xs font-semibold text-black uppercase py-2 px-3'>Subscribe For Updates</a>
            </div>
        </nav>
    )
}

export default NavigationBar;