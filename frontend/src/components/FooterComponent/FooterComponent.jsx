
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFacebookF, faInstagram, faTiktok } from "@fortawesome/free-brands-svg-icons";
const Footer = () => {
  return (
    <footer className="py-12 bg-gray-100 border-t-2 border-gray-500 shadow-xl ">
      <div className="container grid gap-8 px-4 mx-auto text-center md:grid-cols-4">
        <div>
          <h1 className="mb-4 text-3xl font-bold">HOÀNG NAM</h1>
          <p className="text-xl text-gray-600">
            Thương hiệu thời trang cao cấp hàng đầu Việt Nam
          </p>
        </div>

        <div>
          <h3 className="mb-4 text-lg font-bold">LIÊN KẾT</h3>
          <ul className="space-y-2 text-gray-600">
            <li>
              <a href="#" className="text-lg hover:text-gray-900">
                Về chúng tôi
              </a>
            </li>
            <li>
              <a href="#" className="text-lg hover:text-gray-900">
                Blog
              </a>
            </li>
            <li>
              <a href="#" className="text-lg hover:text-gray-900">
                Cửa hàng
              </a>
            </li>
            <li>
              <a href="#" className="text-lg hover:text-gray-900">
                Liên hệ
              </a>
            </li>
          </ul>
        </div>

        <div>
          <h3 className="mb-4 text-lg font-bold">CHÍNH SÁCH</h3>
          <ul className="space-y-2 text-gray-600">
            <li>
              <a href="#" className="text-lg hover:text-gray-900">
                Giao hàng
              </a>
            </li>
            <li>
              <a href="#" className="text-lg hover:text-gray-900">
                Đổi trả
              </a>
            </li>
            <li>
              <a href="#" className="text-lg hover:text-gray-900">
                Bảo hành
              </a>
            </li>
            <li>
              <a href="#" className="text-lg hover:text-gray-900">
                Thanh toán
              </a>
            </li>
          </ul>
        </div>

        <div>
          <h3 className="mb-4 text-lg font-bold">THEO DÕI CHÚNG TÔI </h3>
          <div className="flex justify-center space-x-4">
            <a href="#" className="text-xl text-gray-600 hover:text-gray-900">
              <FontAwesomeIcon
                className="px-2 text-2xl text-gray-500"
                icon={faFacebookF}
              />
            </a>
            <a href="#" className="text-xl text-gray-600 hover:text-gray-900">
              <FontAwesomeIcon
                className="px-2 text-2xl text-gray-500"
                icon={faInstagram}
              />
            </a>
            <a href="#" className="text-xl text-gray-600 hover:text-gray-900">
              <FontAwesomeIcon
                className="px-2 text-2xl text-gray-500"
                icon={faTiktok}
              />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};
    export default Footer;