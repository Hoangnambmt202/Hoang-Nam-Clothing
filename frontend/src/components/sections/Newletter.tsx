'use client'

import { useState } from "react";

const NewsletterComponent = () => {
  const [email, setEmail] = useState("");

  const handleSubmit = (e: any) => {
    e.preventDefault();
    // Xử lý logic đăng ký newsletter
    console.log("Email đăng ký:", email);
    setEmail("");
  };

  return (
    <section className="py-20 text-white bg-gray-900">
      <div className="px-4 mx-auto text-center max-w-7xl">
        <h2 className="mb-8 text-3xl font-light">ĐĂNG KÝ NHẬN TIN</h2>
        <p className="mb-8 text-xl">
          Nhận thông tin về bộ sưu tập mới và ưu đãi đặc biệt
        </p>
        <form className="flex max-w-md mx-auto" onSubmit={handleSubmit}>
          <input
            type="email"
            placeholder="Email của bạn"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="flex-1 px-4 py-2 text-lg text-black outline-none"
            required
          />
          <button
            type="submit"
            className="px-6 py-2 text-lg text-black transition-colors bg-white hover:bg-gray-200"
          >
            Đăng ký
          </button>
        </form>
      </div>
    </section>
  );
};
export default NewsletterComponent;