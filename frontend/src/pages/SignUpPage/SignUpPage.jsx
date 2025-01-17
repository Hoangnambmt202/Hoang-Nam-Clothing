import InputFormComponent from "../../components/InputFormComponent/InputFormComponent"
import { Link } from "react-router-dom"
export const SignUpPage = () => {
  return (
    <div className="container min-h-screen px-4 mx-auto bg-white " >
      <div className="grid grid-cols-4 py-8">
        <div className=" flex flex-col justify-center items-center col-start-2 col-span-2 px-4" >
          <h2 className="uppercase font-Dosis text-3xl mb-4"> Đăng Ký Thành Viên </h2>
          <p className="italic font-thin" >Đăng ký để tích điểm và hưởng ưu đãi thành viên khi mua hàng. Nhập số điện thoại để tiếp tục đăng nhập hoặc đăng ký thành viên. </p>
            <div className="form mb-4" >
              {/* <input type="text"  placeholder="Vui lòng nhập số điện thoại của bạn" /> */}
              <InputFormComponent placeholder="Vui lòng nhập số điện thoại của bạn" />

              <button className="uppercase mb-4 bg-gray-500 py-4 w-full hover:bg-black  text-white font-Dosis " >Tiếp Tục</button>
              
              <p className="mb-4 text-base italic">Bằng việc đăng ký, bạn đã đồng ý với <Link className="hover:underline text-blue-500" >Điều khoản dịch vụ </Link >& <Link className="hover:underline text-blue-500" >Chính sách bảo mật</Link> của Hoàng Nam</p>
            </div>
     
        </div>
      </div>
    </div>

  )
}
