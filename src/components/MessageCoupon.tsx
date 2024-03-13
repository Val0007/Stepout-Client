
interface CouponModalProps{
    className:string
    closeModal:()=>void
    message:string
}

function MessageCoupon({className,closeModal,message}:CouponModalProps){

    return <div className={`${className}`}>

            <div className="bg-white text-black p-4 rounded-lg flex flex-col relative">
                <div className="absolute top-2 right-3 text-xl cursor-pointer" 
                onClick={()=>{
                    closeModal()
                }}
                >X</div>
                <div className=" font-extrabold text-red-700 mt-4 text-center tracking-widest ">OOPS!</div>
                <div className="text-xl font-black my-4 ">{message}</div>

            </div>
    
        </div>

}

export default MessageCoupon