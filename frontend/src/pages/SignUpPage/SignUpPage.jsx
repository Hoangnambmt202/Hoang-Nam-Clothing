import { useState } from "react"
import InputFormComponent from "../../components/InputFormComponent/InputFormComponent"
import { Link } from "react-router-dom";
import * as UserService from "../../services/UserService";
import { useMutation } from "@tanstack/react-query";
import LoadingComponent from "../../components/LoadingComponent/LoadingComponent";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTriangleExclamation } from"@fortawesome/free-solid-svg-icons";;

export const SignUpPage = () => {

  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState(''); // Thêm trạng thái lưu thông báo
  const [messageType, setMessageType] = useState(''); // Lưu loại thông báo ('success' hoặc 'error')

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
      setMessage(data.message || 'Đăng ký thành công!');
      setMessageType('success'); // Thông báo thành công
    },
    onError: (error) => {
      setMessage(error.response?.data?.message || 'Đã xảy ra lỗi!');
      setMessageType('error'); // Thông báo lỗi
    },
  });
  
  const handleSignUp = () => {
    if (!email || !phone || !password || !confirmPassword) {
      setMessage('Vui lòng nhập đầy đủ thông tin.');
      setMessageType('error');
      return;
    }
    if (password !== confirmPassword) {
      setMessage('Mật khẩu và xác nhận mật khẩu không khớp.');
      setMessageType('error');
      return;
    }
    console.log("Calling mutate...");
    console.log("Mutation object:", mutation);

    mutation.mutate({ email, phone, password, confirmPassword }, {
      onSuccess: (data) => {
        if (data.status === "err") {
          setMessage(data.message); 
          setMessageType('error');
        } else {
          setMessage(data.message || 'Đăng ký thành công!');  
          setMessageType('success');
        }
      },
      onError: (error) => {
        setMessage(error.response?.data?.message || 'Đã xảy ra lỗi!');
        setMessageType('error');
      },
    });
  };
  
  
  
  return (
    <div className="container min-h-screen px-4 mx-auto bg-white">

      <div className="bg-red-500 w-80 h-20 rounded-sm flex justify-center items-center" >
      <FontAwesomeIcon icon={faTriangleExclamation} className="mr-4" />
      <span className="text-white" > {message}</span>
      </div>
      {mutation.isPending && <LoadingComponent />} 
      <div className="grid grid-cols-4 py-8">
        <div className="flex flex-col justify-center items-center col-start-2 col-span-2 px-4">
          <h2 className="uppercase font-Dosis text-3xl mb-4"> Đăng Ký Thành Viên </h2>
          <p className="italic font-thin mb-4">
            Đăng ký để tích điểm và hưởng ưu đãi thành viên khi mua hàng. Nhập số điện thoại để tiếp tục đăng nhập hoặc đăng ký thành viên.
          </p>
          <div className="form mb-4">
            <InputFormComponent placeholder="Vui lòng nhập email của bạn" value={email} onChange={handleOnChangeEmail} />
            <InputFormComponent placeholder="Vui lòng nhập số điện thoại của bạn" value={phone} onChange={handleOnChangePhone} />
            <InputFormComponent placeholder="Vui lòng nhập mật khẩu của bạn" value={password} onChange={handleOnChangePassword} />
            <InputFormComponent placeholder="Vui lòng nhập lại mật khẩu của bạn" value={confirmPassword} onChange={handleOnChangeConfirmPassword} />

            <button
              className="uppercase mb-4 bg-gray-500 py-4 w-full hover:bg-black text-white font-Dosis"
              onClick={handleSignUp}
              disabled={mutation.isLoading} // Vô hiệu hóa khi đang tải
            >
              {mutation.isLoading ? 'Đang đăng ký...' : 'Tiếp Tục'}
            </button>
            {message && (
              <span
                className={`block mb-4 text-sm ${
                  messageType === 'success' ? 'text-green-500' : 'text-red-500'
                }`}
              >
                {message}
              </span>
            )}
            <p className="mb-4 text-base italic">
              Bằng việc đăng ký, bạn đã đồng ý với{' '}
              <Link className="hover:underline text-blue-500">Điều khoản dịch vụ</Link> &{' '}
              <Link className="hover:underline text-blue-500">Chính sách bảo mật</Link> của Hoàng Nam
            </p>
          </div>
        </div>
      </div>
    </div>



  )
}
