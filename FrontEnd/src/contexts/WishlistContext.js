import { createContext, useEffect, useState } from 'react'
import { toast, Zoom } from 'react-toastify'

import httpRequest from '~/utils/httpRequest'

export const WishlistContext = createContext()

export const WishlistProvider = ({ children }) => {
    const [wishlists, setWishlists] = useState([])

    const toggleWishlist = async (productId) => {
        try {
            const response = await httpRequest.post(`/user/wishlists/${productId}`)

            if (response.status === 200) {
                if (!response.isLiked) {
                    toast.success('Đã thêm vào danh sách yêu thích!', {
                        position: 'top-right',
                        autoClose: 1250,
                        hideProgressBar: false,
                        closeOnClick: false,
                        pauseOnHover: false,
                        draggable: true,
                        progress: undefined,
                        theme: 'light',
                        transition: Zoom,
                    })
                } else {
                    toast.success('Đã xoá sản phẩm danh sách yêu thích!', {
                        position: 'top-right',
                        autoClose: 1250,
                        hideProgressBar: false,
                        closeOnClick: false,
                        pauseOnHover: false,
                        draggable: true,
                        progress: undefined,
                        theme: 'light',
                        transition: Zoom,
                    })
                }
            }
            getWishlists()
        } catch (error) {
            console.log(error)
        }
    }

    const getWishlists = async () => {
        try {
            const response = await httpRequest.get('/user/wishlists')
            setWishlists(response.wishlists || [])
        } catch (error) {
            console.log(error)
        }
    }

    useEffect(() => {
        getWishlists()
    }, [])

    return (
        <WishlistContext.Provider value={{ wishlists, toggleWishlist, getWishlists }}>
            {children}
        </WishlistContext.Provider>
    )
}
