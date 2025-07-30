import { Outlet } from "react-router-dom"
import Header from "../components/home/Header"
import Footer from "../components/home/Footer"
import { Toaster } from "react-hot-toast"

export default function PublicLayout() {
  return (
    <>
      <Header />
      <Toaster position="top-right" toastOptions={{ style: { marginTop: 80 } }} />
      <div className="min-h-screen relative overflow-x-hidden">
        <main>
          <Outlet />
        </main>
        <Footer />
      </div>
    </>
  )
}
