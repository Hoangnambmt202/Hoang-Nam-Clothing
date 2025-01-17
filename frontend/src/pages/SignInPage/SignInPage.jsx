import { faGoogle, faSquareFacebook } from "@fortawesome/free-brands-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { Link } from "react-router-dom"
import InputFormComponent from "../../components/InputFormComponent/InputFormComponent"

const SignInPage = () => {
  return (
    <div className="container min-h-screen px-4 mx-auto bg-white " >
      <div className="grid grid-cols-4 py-8">
        <div className=" flex flex-col justify-center items-center col-start-2 col-span-2 px-4" >
          <h2 className="uppercase font-Dosis text-3xl mb-4"> Đăng Nhập </h2>
          <p className="italic font-thin	" >Đăng nhập để tích điểm và hưởng ưu đãi thành viên khi mua hàng. Nhập số điện thoại để tiếp tục đăng nhập hoặc đăng ký thành viên. </p>
            <div className="form mb-4" >
              {/* <input type="text"  placeholder="Vui lòng nhập số điện thoại của bạn" /> */}
              <InputFormComponent placeholder="Vui lòng nhập số điện thoại của bạn" />

              <button className="uppercase mb-4 bg-gray-500 py-4 w-full hover:bg-black  text-white font-Dosis " >Tiếp Tục</button>
              <p className="mb-4 text-base text-center">
                  hoặc đăng nhập với
              </p>
              <div className="flex justify-center items-center mb-4" >
                <Link>
                <FontAwesomeIcon className=" text-3xl text-blue-500 " icon={faSquareFacebook} />
                </Link>
                <Link>
                <FontAwesomeIcon className=" text-3xl text-red-500 ml-8" icon={faGoogle} />
                </Link>

              </div>
              <p className="mb-4 text-base italic">Bằng việc đăng nhập, bạn đã đồng ý với <Link className="hover:underline text-blue-500" >Điều khoản dịch vụ </Link >& <Link className="hover:underline text-blue-500" >Chính sách bảo mật</Link> của Hoàng Nam</p>
            </div>
            <p className="mb-4 text-base" >Hoặc bạn có thể Đăng Ký <span><Link to="/sign-up" className="underline text-blue-500" >Tại Đây</Link></span></p>

        </div>
      </div>
    </div>
  )
}

export default SignInPage