import {  useEffect } from "react";
import Cookies from "js-cookie";
import {  } from "react-router-dom"; // Để điều hướng
import { useSelector, useDispatch } from "react-redux";
import { setUser } from "../../redux/slides/userSlice";
function ProfilePage() {
  const user = useSelector((state) => state.user.user);
  const dispatch = useDispatch();

  useEffect(() => {
    const storedUser = Cookies.get("user");
    if (storedUser) {
      try {
        dispatch(setUser(JSON.parse(storedUser)));
      } catch (error) {
        console.error("Lỗi khi phân tích JSON:", error);
        dispatch(setUser(null));
      }
    }
  }, [dispatch]);

  if (!user) {
    return (
      <>
      <div className="py-4">
        <h2 className="text-xl font-thin text-gray-700">Hồ sơ của tôi</h2>
        <h3 className="text-sm text-gray-700">Quản lý thông tin hồ sơ để bảo mật tài khoản</h3>
      </div>
      <div className="flex h-full w-full py-4">
        <div className="basis-8/12">
          <form>
            <table className="w-full">
              <tbody>
                <tr>
                  <td className="w-[30%] text-right">Tên Đăng nhập</td>
                  <td className="px-4">Chưa có thông tin</td>
                </tr>
                <tr>
                  <td className="w-[30%] text-right">Tên</td>
                  <td className="px-4">
                    <input className="border-slate-600 outline-none" type="text" value={user?.name || "Chưa có thông tin"}  />
                  </td>
                </tr>
                <tr>
                  <td className="w-[30%] text-right">Số đt</td>
                  <td className="px-4">
                    <input type="text" value={user?.phone || "Chưa có thông tin"}  />
                  </td>
                </tr>
                <tr>
                  <td className="w-[30%] text-right">Email</td>
                  <td className="px-4">
                    {user?.email || "Chưa có email"} <button className="underline">Thay đổi</button>
                  </td>
                </tr>
                <tr>
                  <td className="w-[30%] text-right">Địa chỉ</td>
                  <td className="px-4">Nam</td>
                </tr>
              </tbody>
            </table>
          </form>
        </div>
        <div className="flex-1"></div>
      </div>
      </>
    )
  }

  return (
    
    <>
      <div className="py-4">
        <h2 className="text-xl font-thin text-gray-700">Hồ sơ của tôi</h2>
        <h3 className="text-sm text-gray-700">Quản lý thông tin hồ sơ để bảo mật tài khoản</h3>
      </div>
      <div className="flex h-full w-full py-4">
        <div className="basis-8/12">
          <form>
            <table className="w-full">
              <tbody>
                <tr>
                  <td className="w-[30%] text-right">Tên Đăng nhập</td>
                  <td className="px-4">{user?.name || "Chưa có thông tin"}</td>
                </tr>
                <tr>
                  <td className="w-[30%] text-right">Tên</td>
                  <td className="px-4">
                    <input type="text" value={user?.name || ""} readOnly />
                  </td>
                </tr>
                <tr>
                  <td className="w-[30%] text-right">Số đt</td>
                  <td className="px-4">
                    <input type="text" value={user?.phone || ""} readOnly />
                  </td>
                </tr>
                <tr>
                  <td className="w-[30%] text-right">Email</td>
                  <td className="px-4">
                    {user?.email || "Chưa có email"} <button className="underline">Thay đổi</button>
                  </td>
                </tr>
                <tr>
                  <td className="w-[30%] text-right">Địa chỉ</td>
                  <td className="px-4">Nam</td>
                </tr>
              </tbody>
            </table>
          </form>
        </div>
        <div className="flex-1"></div>
      </div>
    </>
  );
}

export default ProfilePage;
