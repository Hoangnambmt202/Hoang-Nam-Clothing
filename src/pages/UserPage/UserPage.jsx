import { Link } from "react-router-dom"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPencil } from "@fortawesome/free-solid-svg-icons"; 
const UserPage = () => {
  return (
    <div className="container flex px-4 mx-auto my-4">
      <aside className="px-4 basis-2/12 h-96 bg-neutral-100 ">
        <div className="flex flex-col items-center justify-center header-account">
          <img
            src="https://t3.ftcdn.net/jpg/06/33/54/78/360_F_633547842_AugYzexTpMJ9z1YcpTKUBoqBF0CUCk10.jpg"
            alt="user avt"
            className="rounded-full w-14 h-14 account-img"
          />
          <div className="account-name">Nam</div>
          <div className="action">
            <Link to="/" className="text-sm">
              <FontAwesomeIcon icon={faPencil} />
              <span>Sửa Hồ Sơ</span>
            </Link>
          </div>
        </div>
      </aside>
      <div className="flex-1 px-4 bg-white shadow-xl basis-10/12 h-96"></div>
    </div>
  );
}

export default UserPage
