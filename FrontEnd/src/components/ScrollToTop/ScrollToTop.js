// src/components/ScrollToTop.js
import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'

function ScrollToTop() {
    const { pathname } = useLocation()

    useEffect(() => {
        window.scrollTo({
            top: 0,
            left: 0,
            behavior: 'instant', // dùng 'instant' thay vì 'smooth' nếu bạn muốn cuộn ngay lập tức
        })
    }, [pathname])

    return null
}

export default ScrollToTop
