import Order from '../Order/Order'
const Registration = () => {
  return (
    <div className="flex justify-around items-center">
      <div>
        <h1 className="text-4xl text-start h-16 font-semibold">Registration</h1>
        <p className="text-secondary">
          If you would like to create an{' '}
          <strong className="font-semibold">account</strong> with us kindly
          place an order.
        </p>
      </div>
      <div>
        <Order />
      </div>
    </div>
  )
}

export default Registration
