import { Outlet } from "react-router-dom"
import Header from "../components/home/Header"
import Footer from "../components/home/Footer"

export default function PublicLayout() {
  return (
    <>
      <Header />
      <div className="min-h-screen relative overflow-x-hidden">
        <main>
          <Outlet />
        </main>
        <Footer />
      </div>
    </>
  )
}
