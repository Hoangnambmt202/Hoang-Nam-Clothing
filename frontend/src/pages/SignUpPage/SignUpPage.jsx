import { useState } from "react"
import InputFormComponent from "../../components/InputFormComponent/InputFormComponent"
import { Link } from "react-router-dom";
import * as UserService from "../../services/UserService";
import { useMutation } from "@tanstack/react-query";

// import useMutationHook from "../../hooks/useMutationHook";


export const SignUpPage = () => {

  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleOnChangeEmail = (value) => {
    setEmail(value);
  }
  const handleOnChangePhone = (value) => {
    setPhone(value);
  }
  const handleOnChangePassword = (value) => {
    setPassword(value);
   
  }
  const handleOnChangeConfirmPassword = (value) => {
    setConfirmPassword(value);
   
  }
  const mutation = useMutation({
    mutationFn: UserService.registerUser,
    onSuccess: (data) => {
      alert(data.message || 'Đăng ký thành công!');
    },
    onError: (error) => {
      alert(error.response?.data?.message || 'Đã xảy ra lỗi!');
    },
  });
  
  const handleSignUp = () => {
    if (!email || !phone || !password || !confirmPassword) {
      alert('Vui lòng nhập đầy đủ thông tin.');
      return;
    }
    if (password !== confirmPassword) {
      alert('Mật khẩu và xác nhận mật khẩu không khớp.');
      return;
    }
    mutation.mutate({ email, phone, password, confirmPassword });
  };
  
  
  return (
    <div className="container min-h-screen px-4 mx-auto bg-white " >
      <div className="grid grid-cols-4 py-8">
        <div className=" flex flex-col justify-center items-center col-start-2 col-span-2 px-4" >
          <h2 className="uppercase font-Dosis text-3xl mb-4"> Đăng Ký Thành Viên </h2>
          <p className="italic font-thin mb-4" >Đăng ký để tích điểm và hưởng ưu đãi thành viên khi mua hàng. Nhập số điện thoại để tiếp tục đăng nhập hoặc đăng ký thành viên. </p>
            <div className="form mb-4" >
              {/* <input type="text"  placeholder="Vui lòng nhập số điện thoại của bạn" /> */}
              <InputFormComponent placeholder="Vui lòng nhập email của bạn" value={email} onChange={handleOnChangeEmail}/>
              <InputFormComponent placeholder="Vui lòng nhập số điện thoại của bạn"  value={phone} onChange={handleOnChangePhone}/>
              <InputFormComponent placeholder="Vui lòng nhập mật khẩu của bạn" value={password} onChange={handleOnChangePassword} />
              <InputFormComponent placeholder="Vui lòng nhập lại mật khẩu của bạn" value={confirmPassword} onChange={handleOnChangeConfirmPassword}/>

              <button className="uppercase mb-4 bg-gray-500 py-4 w-full hover:bg-black  text-white font-Dosis " onClick={handleSignUp}>{mutation.isLoading ? 'Đang đăng ký...' : 'Tiếp Tục'}</button>
              
              <p className="mb-4 text-base italic">Bằng việc đăng ký, bạn đã đồng ý với <Link className="hover:underline text-blue-500" >Điều khoản dịch vụ </Link >& <Link className="hover:underline text-blue-500" >Chính sách bảo mật</Link> của Hoàng Nam</p>
            </div>
     
        </div>
      </div>
    </div>



  )
}
